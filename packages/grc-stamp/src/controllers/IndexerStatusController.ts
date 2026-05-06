import HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { Controller } from './BaseController';
import { ErrorModel } from '../models/Error';
import { log } from '../lib/log';
import { redis as redisConn } from '../lib/redis';
import { rpc } from '../lib/gridcoin';
import { config } from '../config';
import { BACKFILL_THRESHOLD_BLOCKS } from '../constants';
import { IndexerStatusEvent } from '../types';
import { EventsService } from '../services/EventsService';
import { IndexerStatusPresenter } from '../presenters/indexerStatus.presenter';

export class IndexerStatusController extends Controller {
  constructor(
    req: Request,
    res: Response,
    private redis = redisConn,
    private grcRpc = rpc,
    private events = EventsService.getInstance(),
    private indexerStatusPresenter = IndexerStatusPresenter,
  ) {
    super(req, res);
    this.init();
  }

  // GET /indexer/status — synchronous mirror of the SSE indexerStatus
  // event. Returns the cached snapshot (populated by the Scraper at
  // every cycle) when present, otherwise computes one fresh from the
  // redis cursor + an RPC chain-tip read so a freshly booted service
  // still has a meaningful first answer for SSR consumers.
  public async getStatus(): Promise<void> {
    try {
      const data = this.events.getLastIndexerStatusData()
        ?? await this.computeFresh();
      this.res
        .status(HttpStatus.OK)
        .send(this.render(data, this.indexerStatusPresenter));
    } catch (e) {
      log.error(e);
      this.res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        errors: [
          new ErrorModel(
            HttpStatus.INTERNAL_SERVER_ERROR,
            HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
          ),
        ],
      });
    }
  }

  private async computeFresh(): Promise<IndexerStatusEvent['data']> {
    const [cursor, info] = await Promise.all([
      this.redis.get(config.REDIS_SCRAPER_KEY),
      this.grcRpc.getStakingInfo(),
    ]);
    const indexerBlock = Number(cursor) || Number(config.START_BLOCK);
    const chainTip = info.blocks;
    const lag = Math.max(0, chainTip - indexerBlock);
    return {
      startBlock: Number(config.START_BLOCK),
      indexerBlock,
      chainTip,
      lag,
      isBackfilling: lag > BACKFILL_THRESHOLD_BLOCKS,
    };
  }
}
