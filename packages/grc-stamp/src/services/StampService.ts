import { PrismaClient, StampsType } from '@prisma/client';
import {
  MINIMUM, PREFIX, PROTOCOL, MIN_FEE,
} from '../constants';
import { rpc } from '../lib/gridcoin';
import { log } from '../lib/log';

export class StampService {
  constructor(private prisma = new PrismaClient()) {}

  public async publishStamp(): Promise<void> {
    const readyStamps = await this.prisma.stamps.findMany({
      where: {
        block: null,
        tx: null,
        raw_transaction: null,
        time: null,
      },
      take: 2,
      orderBy: {
        id: 'asc',
      },
    });
    // generate query
    const hashes = readyStamps.map((stamp) => stamp.hash);

    if (!hashes.length) {
      log.info('Nothing to publish');
      return;
    }

    const string = `${PREFIX}000001${hashes.join('')}`;
    // console.log(string);
    // console.log(string.length);
    // maximum 160 characters (80 bytes)

    await rpc.setTXfee(MIN_FEE);
    const tx = await rpc.burn(MINIMUM, string);
    log.debug({ tx });
    if (tx) {
      await this.prisma.stamps.updateMany({
        where: {
          id: { in: readyStamps.map((stamp) => stamp.id) },
        },
        data: {
          tx,
        },
      });
    }
  }
}

// 7e5d00a0f94b7ee23377877bfd020e58abcf56163f345899caa747071f0acfd3b4ad02784963851ac4d2
// 3fe3b34d393b3920d81560aeb92e01712af1f66e52604849d1ecbd2916c035440e319414c2b7
