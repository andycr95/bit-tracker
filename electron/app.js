const { app, BrowserWindow, screen, ipcMain } = require("electron");
const initDatabase = require("./database/config.js");
const { getRxStorageMemory } = require("rxdb/plugins/storage-memory");
const { exposeIpcMainRxStorage } = require("rxdb/plugins/electron");

let appWin;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  appWin = new BrowserWindow({
    width: width * 0.3,
    height: height,
    title: "BitTracker",
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  appWin.webContents.openDevTools();

  appWin.loadURL(`file://${__dirname}/../dist/index.html`);

  appWin.setMenu(null);

  appWin.on("closed", () => {
    appWin = null;
  });
}

app.on("ready", async () => {
  const storage = getRxStorageMemory();
  exposeIpcMainRxStorage({
    key: "main-storage",
    storage,
    ipcMain: ipcMain,
  });

  await initDatabase(storage);
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("ping", () => {
  console.log("pong");
});
