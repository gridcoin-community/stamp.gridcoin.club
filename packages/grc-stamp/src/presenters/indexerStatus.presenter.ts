import yayson from 'yayson';
import { IndexerStatusEvent } from '../types';
import { Attributes, EntityType, PresenterInterface } from './types';

const { Presenter } = yayson();

// Singleton snapshot — there's no addressable record, so the id is a
// constant. Mirrors the SSE indexerStatus payload field-for-field so
// SSR consumers can swap between REST and SSE without remapping.
export class IndexerStatusPresenter extends Presenter implements PresenterInterface {
  public static type = EntityType.INDEXER_STATUS;

  public selfLinks(): string {
    return '/indexer/status';
  }

  public attributes(instance: IndexerStatusEvent['data']): Attributes {
    return {
      startBlock: instance.startBlock,
      indexerBlock: instance.indexerBlock,
      chainTip: instance.chainTip,
      lag: instance.lag,
      isBackfilling: instance.isBackfilling,
    };
  }

  public id(): string {
    return 'current';
  }
}
