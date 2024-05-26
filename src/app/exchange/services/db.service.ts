import { Injectable } from '@angular/core';
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { EXCHANGE_SCHEMA } from '../models/exchange.model';

import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBJsonDumpPlugin);

async function createDatabase(): Promise<any> {
  const db = await createRxDatabase<any>({
    name: 'bitTracker-database',
    storage: getRxStorageDexie(),
  });

  await db.addCollections({
    exchange: {
      schema: EXCHANGE_SCHEMA,
    },
  });

  return db;
}

let initState: null | Promise<any>;
let DB_INSTANCE: any;

export async function initDatabase() {
  if (!initState) {
    initState = createDatabase().then((db) => {
      DB_INSTANCE = db;
    });
  }
  await initState;
}

@Injectable({
  providedIn: 'root',
})
export class DbService {
  get db() {
    return DB_INSTANCE;
  }

  saveExchangeRateToday(exchangeRate: number): void {
    this.db.exchange
      .findOne({
        selector: {
          key: 'todayNow',
        },
      })
      .exec()
      .then((docs: any) => {
        if (docs === null) {
          this.db.exchange.insert({
            value: exchangeRate.toString(),
            key: 'todayNow',
          });
          this.db.exchange.insert({
            value: exchangeRate.toString(),
            key: 'todayLast',
          });
        } else {
          if (docs.value !== exchangeRate.toString()) {
            this.db.exchange.upsert({
              value: docs.value,
              key: 'todayLast',
            });
            this.db.exchange.upsert({
              value: exchangeRate.toString(),
              key: 'todayNow',
            });
          }
        }
      });
  }

  saveExchangeRateHistory(exchangeRateH: number): void {
    this.db.exchange
      .findOne({
        selector: {
          key: 'history',
        },
      })
      .exec()
      .then((docs: any) => {
        if (docs === null) {
          this.db.exchange.insert({
            value: exchangeRateH,
            key: 'history',
          });
        } else {
          if (docs.value !== exchangeRateH) {
            this.db.exchange.upsert({
              value: exchangeRateH,
              key: 'history',
            });
          }
        }
      });
  }

  getQuery(query: string): any {
    return this.db.exchange.findOne().where('key').eq(query).$.pipe();
  }
}
