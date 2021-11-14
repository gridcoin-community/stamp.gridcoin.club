import { expect } from 'chai';
import {
  readableFileSize,
} from 'routes/notarize/actions';

describe('Notarize actions', () => {
  describe('readableFileSize', () => {
    it('should display bytes', () => {
      const res = readableFileSize(100);
      expect(res).to.be.equal('100 B');
    });
    it('should display kilobytes', () => {
      const res = readableFileSize(10002);
      expect(res).to.be.equal('9.8 KB');
    });
    it('should show megabytes', () => {
      const res = readableFileSize(10002100);
      expect(res).to.be.equal('9.5 MB');
    });
  });
});
