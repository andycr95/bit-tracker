const electron = require("electron");
const { addRxPlugin, createRxDatabase } = require("rxdb");
const { getRxStorageIpcRenderer } = require("rxdb/plugins/electron");
const { getRxStorageMemory } = require("rxdb/plugins/storage-memory");
const { RxDBJsonDumpPlugin } = require("rxdb/plugins/json-dump");
const { RxDBQueryBuilderPlugin } = require("rxdb/plugins/query-builder");

addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBJsonDumpPlugin);
async function createDatabase(storage) {
  const db = await createRxDatabase({
    name: "bitTracker-database",
    storage: getRxStorageIpcRenderer({
      key: "main-storage",
      ipcRenderer: electron.ipcRenderer,
    }),
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

let URL_API = `https://api.coindesk.com/v2`;
let initState;
let DB_INSTANCE;
let exchange;

async function initDatabase() {
  if (!initState) {
    initState = createDatabase().then((db) => {
      DB_INSTANCE = db;
    });
  }
  await initState;
}

initDatabase().then(async () => {
  exchange = DB_INSTANCE.collections["exchange"];
  window.dbInstance = DB_INSTANCE;
  await getExchangeRate();
  await getHistoricalValue();

  //Trigger event to main process
  window.dispatchEvent(new Event("dbInstanceReady"));
  setInterval(async () => {
    await getExchangeRate();
  });
});

const getExchangeRate = async () => {
  const data = await fetch(`${URL_API}/tb/price/ticker?assets=BTC`).then(
    (res) => res.json()
  );
  const exchangeRate = data.data.BTC.ohlc.c;
  const res = await saveExchangeRateToday(exchangeRate);
  const newEvent = new CustomEvent("rateTodayUpdated", {
    detail: res,
  });
  window.dispatchEvent(newEvent);
};

const saveExchangeRateToday = async (exchangeRate) => {
  return await exchange
    .findOne({
      selector: {
        key: "todayNow",
      },
    })
    .exec()
    .then(async (docs) => {
      let todayNow;
      let todayLast;
      if (docs === null) {
        todayNow = await exchange.insert({
          value: exchangeRate.toString(),
          key: "todayNow",
        });
        todayLast = await exchange.insert({
          value: exchangeRate.toString(),
          key: "todayLast",
        });
      } else {
        if (docs.value == exchangeRate.toString()) return;
        todayNow = await exchange.upsert({
          value: docs.value,
          key: "todayNow",
        });
        todayLast = await exchange.upsert({
          value: exchangeRate.toString(),
          key: "todayLast",
        });
      }
      return { todayNow: todayNow?.value, todayLast: todayLast?.value };
    });
};

const getHistoricalValue = async () => {
  let date = new Date();
  let start = new Date(date.getTime() - 86400000 * 15);
  let end = `${date.getFullYear()}-${
    date.getMonth() + 1 <= 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${
    date.getDate() + 1 <= 9 ? "0" + (date.getDate() + 1) : date.getDate() + 1
  }T01:00`;
  start = `${start.getFullYear()}-${
    start.getMonth() + 1 <= 9
      ? "0" + (start.getMonth() + 1)
      : start.getMonth() + 1
  }-${
    start.getDate() + 1 <= 9 ? "0" + (start.getDate() + 1) : start.getDate() + 1
  }T01:00`;
  const data = await fetch(
    `${URL_API}/tb/price/values/BTC?start_date=${start}&end_date=${end}&interval=1d`
  ).then((res) => res.json());
  const exchangeRateH = data.data.entries;
  await saveExchangeRateHistory(exchangeRateH);
  await getChangeCurrencies(exchangeRateH);
};

const saveExchangeRateHistory = async (exchangeRateH) => {
  await exchange
    .findOne({
      selector: {
        key: "history",
      },
    })
    .exec()
    .then((docs) => {
      if (docs === null) {
        // console.log("exchangeRateH", exchangeRateH);
        // console.log("docssaveExchangeRateHistory", docs);
        exchange.insert({
          value: exchangeRateH,
          key: "history",
        });
      } else {
        if (docs.value !== exchangeRateH) {
          exchange.upsert({
            value: exchangeRateH,
            key: "history",
          });
        }
      }
    })
    .catch((err) => console.log(err));
};

const getChangeCurrencies = async (exchangeRateH) => {
  const data = await fetch(`https://api.currencyapi.com/v3/latest`, {
    headers: {
      apikey: "cur_live_7rofLFDIDyeh3bY5Dd2U3sp7P1CAxtOpJaot8wME",
    },
  }).then((res) => res.json());
  await saveChangeCurrencies(data.data);
  for (let i = 0; i < exchangeRateH.length; i++) {
    const eRH = exchangeRateH[i];
    await saveSingleExchangeRateHistory(eRH);
  }
};

const saveChangeCurrencies = async (currencies) => {
  await exchange
    .findOne({
      selector: {
        key: "changeCurrencies",
      },
    })
    .exec()
    .then((docs) => {
      if (docs === null) {
        exchange.insert({
          value: currencies,
          key: "changeCurrencies",
        });
      } else {
        if (docs.value !== currencies) {
          exchange.upsert({
            value: currencies,
            key: "changeCurrencies",
          });
        }
      }
    });
};

const saveSingleExchangeRateHistory = async (exchangeH) => {
  await exchange
    .findOne({
      selector: {
        key: `history-${exchange[0]}`,
      },
    })
    .exec()
    .then((docs) => {
      if (docs === null) {
        exchange.insert({
          value: exchangeH[1],
          key: `history-${exchangeH[0]}`,
        });
      }
    });
};
