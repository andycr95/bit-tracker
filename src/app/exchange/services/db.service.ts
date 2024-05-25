import { Injectable } from '@angular/core';
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { EXCHANGE_SCHEMA } from '../models/exchange.model';
import { RxBitTrackerDatabase } from 'src/RxDB';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
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

  const myCollection = db.exchange;
  myCollection.exportJSON().then((json: any) => console.dir(json));

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
  get db(): RxBitTrackerDatabase {
    return DB_INSTANCE;
  }
}
