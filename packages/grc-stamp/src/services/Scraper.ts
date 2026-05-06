import type { BlockWithTX } from 'gridcoin-rpc/dist/contracts/block';
import { config } from '../config';
import {
  BACKFILL_THRESHOLD_BLOCKS,
  OP_RETURN,
  PREFIX,
  PROTOCOL,
} from '../constants';
import { rpc } from '../lib/gridcoin';
import { log } from '../lib/log';
import { redis as redisConn } from '../lib/redis';
import { Stamp } from '../models/Stamp';
import { emitIndexerStatus, emitPendingCount, getEmitter } from '../lib/emitter';
import { ProcessBlockEvent, TransactionFoundEvent } from '../types';

// OP_RETURN + push-data length byte. The spec at /about#protocol-overview
// allows two layouts: 0x26 (38 bytes — single hash) and 0x46 (70 bytes — two
// hashes). Anything else (push-data-1 wrappers, foreign lengths) doesn't
// match the published protocol and is skipped.
const PUSH_SINGLE = '6a26';
const PUSH_DOUBLE = '6a46';
// On-chain encoding of supported protocol versions. `PROTOCOL = '0.0.1'` →
// `000001` here. New entries are added when this indexer learns to decode a
// new layout; until then unknown versions are skipped rather than mis-sliced.
const KNOWN_PROTOCOL_VERSIONS = new Set(['000001']);
const HEX64 = /^[0-9a-f]{64}$/;

export class Scraper {
  private currentBlock = 0;

  public constructor(
    private redis = redisConn,
    private grcRpc = rpc,
    private blockPrefix = PREFIX,
  ) {}

  private async readBlockInfo() {
    this.currentBlock = Number(await this.redis.get(config.REDIS_SCRAPER_KEY))
      || Number(config.START_BLOCK);
  }

  // Returns true if the scraper has more work to do immediately
  // (caller can re-invoke without waiting). Used by the scheduler in
  // index.ts to decide between setImmediate (more backfill) and the
  // polite SCRAPER_TIMEOUT poll (caught up).
  public async scrape(): Promise<boolean> {
    await this.readBlockInfo();

    log.info('[Scraper] Starting the scraper');

    const info = await this.grcRpc.getStakingInfo();
    const chainTip = info.blocks;
    emitIndexerStatus(this.currentBlock, chainTip);

    const lag = chainTip - this.currentBlock;
    if (lag <= 0) {
      // Already at the tip — nothing to do this tick.
      return false;
    }

    // Mode switch shares the `BACKFILL_THRESHOLD_BLOCKS` constant
    // with `emitIndexerStatus`'s isBackfilling flag, so the UI banner
    // and the scraper agree on the boundary by construction.
    if (lag > BACKFILL_THRESHOLD_BLOCKS) {
      await this.scrapeBatch(chainTip);
    } else {
      await this.scrapeTip(chainTip);
    }

    // Re-emit at the end so clients see the updated cursor without
    // waiting for the next tick.
    emitIndexerStatus(this.currentBlock, chainTip);

    // Tell the caller whether to schedule the next tick immediately.
    return chainTip - this.currentBlock > BACKFILL_THRESHOLD_BLOCKS;
  }

  // Backfill path: one RPC call pulls up to BACKFILL_BATCH_SIZE blocks
  // (capped at gridcoin-rpc's 1000-block limit, capped further by the
  // distance to chain tip). Walk the returned blocks in memory,
  // persist the cursor once at the end. On crash mid-batch the
  // (protocol, hash, tx)-idempotent saveOrUpdate keeps re-runs safe.
  private async scrapeBatch(chainTip: number): Promise<void> {
    const remaining = chainTip - this.currentBlock;
    const batchSize = Math.min(config.BACKFILL_BATCH_SIZE, remaining);
    const start = this.currentBlock + 1;
    log.info(`[Scraper] backfill batch: ${batchSize} blocks from ${start}`);

    try {
      const result = await this.grcRpc.getBlocksBatch(start, batchSize, true);
      let foundAny = false;
      for (let i = 0; i < result.blocks.length; i++) {
        const block = result.blocks[i];
        // Trust block.height — gridcoin-rpc returns blocks in order
        // but defensive use of the daemon's reported height keeps the
        // cursor honest if the RPC contract ever shifts.
        const found = await this.processBlock(block, block.height);
        if (found) foundAny = true;
        this.currentBlock = block.height;
      }
      await this.redis.set(config.REDIS_SCRAPER_KEY, this.currentBlock);
      if (foundAny) emitPendingCount();
    } catch (e) {
      log.error(e);
    }
  }

  // Tip path: the existing one-block-at-a-time loop. Tiny by definition
  // (lag ≤ BACKFILL_THRESHOLD_BLOCKS), so the per-block redis I/O and
  // RPC overhead don't matter. Kept simple to avoid a second code path
  // owning the steady-state behavior.
  private async scrapeTip(chainTip: number): Promise<void> {
    const steps = chainTip - this.currentBlock;
    for (let i = 0; i < steps; i++) {
      // eslint-disable-next-line no-await-in-loop
      await this.getNextBlock();
    }
  }

  private async getNextBlock(): Promise<void> {
    await this.readBlockInfo();
    log.debug(`[Scraper] Processing block #${this.currentBlock + 1}`);
    try {
      const block = await this.grcRpc.getBlockByNumber(this.currentBlock + 1, true);
      const found = await this.processBlock(block, this.currentBlock + 1);
      if (found) emitPendingCount();
      await this.redis.set(config.REDIS_SCRAPER_KEY, this.currentBlock + 1);
    } catch (e) {
      log.error(e);
    }
  }

  // Per-block work shared by both paths: emit the live processBlock
  // ticker, scan vouts for a protocol-conformant OP_RETURN, validate
  // the layout, persist any matches via Stamp.saveOrUpdate. Returns
  // true if at least one stamp was indexed (caller decides whether to
  // refresh the pending-count broadcast).
  private async processBlock(block: BlockWithTX, height: number): Promise<boolean> {
    const processBlockEvent: ProcessBlockEvent = {
      type: 'processBlock',
      data: { block: height },
    };
    getEmitter().emit('processBlock', processBlockEvent);

    const txs = block.tx ?? [];
    const re = new RegExp(`${OP_RETURN} ${this.blockPrefix}`);
    let foundAny = false;
    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      const TXID = tx.txid;
      for (let j = 0; j < tx.vout.length; j++) {
        const vout = tx.vout[j];
        const { hex: hexString, asm } = vout.scriptPubKey;
        if (!re.test(asm)) continue;

        // Protocol-compliance gate. The asm regex above is a coarse filter
        // (any push of bytes starting with the prefix matches), so verify
        // the full layout against the spec before we slice and index.
        const wrapper = hexString.slice(0, 4);
        if (wrapper !== PUSH_SINGLE && wrapper !== PUSH_DOUBLE) {
          log.info(`[Scraper] Skipping ${TXID}: unsupported OP_RETURN wrapper ${wrapper}`);
          continue;
        }
        const version = hexString.slice(10, 16);
        if (!KNOWN_PROTOCOL_VERSIONS.has(version)) {
          log.info(`[Scraper] Skipping ${TXID}: unknown protocol version ${version}`);
          continue;
        }
        const hashCount = wrapper === PUSH_SINGLE ? 1 : 2;
        const hashSlots = [
          hexString.slice(16, 80),
          hashCount === 2 ? hexString.slice(80, 144) : '',
        ];
        if (!HEX64.test(hashSlots[0])
            || (hashCount === 2 && !HEX64.test(hashSlots[1]))) {
          log.info(`[Scraper] Skipping ${TXID}: hash slot is not 64 hex chars`);
          continue;
        }

        log.info('[Scraper] We have found transaction');
        const hex = Buffer.from(hexString);
        const stamps2save = hashSlots.map((hash: string) => {
          if (!hash || !hash.length) return Promise.resolve();
          const stamp = new Stamp();
          stamp.block = height;
          stamp.hash = hash;
          stamp.protocol = PROTOCOL;
          stamp.rawTransaction = hex.toString('utf8');
          stamp.time = block.time;
          stamp.tx = TXID;
          stamp.type = 'sha256';

          const transactionFoundEvent: TransactionFoundEvent = {
            type: 'transactionFound',
            data: { hash },
          };
          getEmitter().emit('transactionFound', transactionFoundEvent);

          return stamp.saveOrUpdate();
        });

        // eslint-disable-next-line no-await-in-loop
        await Promise.all(stamps2save);
        foundAny = true;
      }
    }
    return foundAny;
  }
}
