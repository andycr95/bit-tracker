import { RxCollection, RxDatabase, RxDocument } from 'rxdb/dist/types/types';
import { RxExchangeDocumentType } from './app/exchange/models/exchange.model';

export type RxExchangeDocument = RxDocument<RxExchangeDocumentType, {}>;
export type RxExchangeCollection = RxCollection<RxExchangeDocumentType, {}>;
export type RxBitTrackerCollections = { exchange: RxExchangeCollection };
export type RxBitTrackerDatabase = RxDatabase<RxBitTrackerCollections>;
