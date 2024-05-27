const { addRxPlugin, createRxDatabase } = require("rxdb");
const { getRxStorageMemory } = require("rxdb/plugins/storage-memory");
const { RxDBJsonDumpPlugin } = require("rxdb/plugins/json-dump");
const { RxDBQueryBuilderPlugin } = require("rxdb/plugins/query-builder");

addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBJsonDumpPlugin);

async function createDatabase(storage) {
  const db = await createRxDatabase({
    name: "bitTracker-database",
    storage: storage,
  });

  await db.addCollections({
    exchange: {
      schema: {
        title: "exchange schema",
        version: 0,
        type: "object",
        primaryKey: "key",
        properties: {
          value: {
            type: "string",
          },
          key: {
            type: "string",
          },
        },
        required: ["value", "key"],
      },
    },
  });

  return db;
}

let initState;
let DB_INSTANCE;

async function initDatabase(storage) {
  if (!initState) {
    console.log("initializing database");
    initState = createDatabase(storage).then((db) => {
      DB_INSTANCE = db;
    });
  }
  await initState;
}

module.exports = initDatabase;
