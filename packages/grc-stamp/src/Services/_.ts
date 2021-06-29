import crypto from 'crypto';
import { rpc } from '../lib/gridcoin';
import { StampType } from '../Models/StampModel';

// function hex2a(hexx) {
//   const hex = hexx.toString();// force conversion
//   let str = '';
//   for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) { str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)); }
//   return str;
// }

export class StampService {
  public static PREFIX = 'f055aa';

  public static MINIMUM = 0.00000001;

  public async createStamp(type: StampType = StampType.sha256, hash = ''): Promise<void> {
    if (!hash) {
      hash = `${Math.random() * 100000000000000}`;
    }
    const sha = crypto.createHash('sha256');
    sha.update(hash);
    const shaman = sha.digest('hex');

    console.log((`${StampService.PREFIX}${shaman}`));
    // console.log(hex2a(0x984410104d8e47fa2910173f94cc9a5feb6a900684b6ac7177ff555f0c65d07f65a51b));
    // const result = await rpc.burn(
    //   StampService.MINIMUM,
    //   `${StampService.PREFIX}${shaman}`,
    // );
    // console.log(result);
  }
}
