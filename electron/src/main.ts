import {BrowserWindow, ipcMain} from 'electron';
import * as path from "path";
import Listener from "./listener";
import electronIsDev = require("electron-is-dev");
import Clash from "./clash";
import System from "./system";

export default class Main {
  public static mainWindow: Electron.BrowserWindow;
  public static application: Electron.App;
  public static BrowserWindow: any;

  public static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // 系统组件初始化
    !System.instance().initialize() && app.quit()

    // CLASH服务初始化
    !Clash.instance().isInstalled() && !Clash.instance().install() && app.quit()
    !Clash.instance().loadConfig() && app.quit()

    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow
    Main.application = app
    Main.application.on('window-all-closed', Main.onWindowAllClosed)
    Main.application.on('ready', Main.onReady)
    Main.application.on("will-quit", Main.onQuit)

    // 注册IPC事件监听器

    // 注册IPC事件处理器
    ipcMain.handle("action-start-clash-service", Listener.handlerActionStartClashService)
    ipcMain.handle("action-stop-clash-service", Listener.handlerActionStopClashService)
    ipcMain.handle("action-restart-clash-service", Listener.handlerActionRestartClashService)
    ipcMain.handle("action-set-clash-proxy-mode", Listener.handlerActionSetClashProxyMode)
    ipcMain.handle("action-set-clash-port", Listener.handlerActionSetClashPort)
    ipcMain.handle("action-add-clash-rule", Listener.handlerActionAddClashRule)
    ipcMain.handle("action-remove-clash-rule", Listener.handlerActionRemoveClashRule)
    ipcMain.handle("action-system-proxy", Listener.handlerActionSetSystemProxy)
    ipcMain.handle("query-clash-service-state", Listener.handlerQueryClashServiceState)
    ipcMain.handle("query-clash-proxy-mode", Listener.handlerQueryClashProxyMode)
    ipcMain.handle("query-system-networks", Listener.handlerQuerySystemNetworks)
    ipcMain.handle("query-system-http-proxy", Listener.handlerQuerySystemHttpProxy)
    ipcMain.handle("query-system-https-proxy", Listener.handlerQuerySystemHttpsProxy)
    ipcMain.handle("query-system-socks-proxy", Listener.handlerQuerySystemSocksProxy)
  }

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      Main.application.quit()
    }
  }

  private static onClose() {
    Main.mainWindow = null
  }

  private static onQuit() {
    Clash.instance().stop()
  }

  private static onReady() {
    Main.mainWindow = new Main.BrowserWindow({
      backgroundColor: "#F9F9F9",
      width: 900,
      height: 600,
      minimizable: false,
      maximizable: false,
      resizable: false,
      fullscreen: false,
      fullscreenable: false,
      skipTaskbar: true,
      title: "CLASH-EX",
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        disableDialogs: true,
      }
    })

    if (electronIsDev) {
      Main.mainWindow.loadURL("http://localhost:3000").catch()
    } else {
      Main.mainWindow.loadFile(path.join(path.dirname(__dirname), "frontend", 'index.html')).catch()
    }

    Main.mainWindow.on('closed', Main.onClose)
    Main.mainWindow.webContents.openDevTools()
  }
}