import { MINIMUM, PREFIX, PROTOCOL } from '../constants';
import { StampModel, StampType } from '../Models/StampModel';
import { rpc } from '../lib/gridcoin';

export class StampService {
  /**
   * Creates empty stamp in the database
   * @param type
   * @param hash
   */
  public async createStamp(hash: string, type: StampType = StampType.sha256): Promise<void> {
    if (!type || !hash) {
      throw new Error('Not enough data');
    }
    await StampModel.create({
      protocol: PROTOCOL,
      type,
      hash,
    });
  }

  public async publishStamp(): Promise<void> {
    const readyStamps = await StampModel.findAll<StampModel>({
      where: {
        block: null,
        tx: null,
        rawTransaction: null,
        time: null,
      },
      limit: 2,
      order: [['id', 'asc']],
    });
    // generate query
    const hashes = readyStamps.map((stamp: StampModel) => stamp.hash);
    const string = `${PREFIX}000001${hashes.join('')}`;
    console.log(string);
    console.log(string.length);
    // maximum 160 characters (80 bytes)

    const tx = await rpc.burn(MINIMUM, string);
    console.log({ tx });
    if (tx) {
      await StampModel.update({
        tx,
      }, {
        where: {
          id: readyStamps.map((stamp: StampModel) => stamp.id),
        },
      });
    }
  }
}

// 7e5d00a0f94b7ee23377877bfd020e58abcf56163f345899caa747071f0acfd3b4ad02784963851ac4d23fe3b34d393b3920d81560aeb92e01712af1f66e52604849d1ecbd2916c035440e319414c2b7
