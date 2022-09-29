import {BrowserWindow, ipcMain} from 'electron';
import * as path from "path";
import electronIsDev = require("electron-is-dev");

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow: any;

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onClose() {
        Main.mainWindow = null;
    }

    private static onReady() {
        Main.mainWindow = new Main.BrowserWindow({webPreferences: {preload: path.join(__dirname, "preload.js")}});
        if (electronIsDev) {
            Main.mainWindow.loadURL("http://localhost:3000").catch()
        } else {
            Main.mainWindow.loadFile(path.join(path.dirname(__dirname), "frontend", 'index.html')).catch()
        }
        Main.mainWindow.on('closed', Main.onClose);

        ipcMain.on("set-title", (event, title) => {
            BrowserWindow.fromWebContents(event.sender).setTitle(title)
        })

        Main.mainWindow.webContents.openDevTools()
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        // we pass the Electron.App object and the
        // Electron.BrowserWindow into this function
        // so this class has no dependencies. This
        // makes the code easier to write tests for
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}