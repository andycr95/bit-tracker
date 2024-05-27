const { app, BrowserWindow, screen, ipcMain } = require("electron");
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
      enableRemoteModule: true,
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

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
