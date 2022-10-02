import {BrowserWindow, ipcMain} from 'electron';
import * as path from "path";
import Listener from "./listener";
import Clash from "./clash";
import System from "./system";
import Config from "./config";
import electronIsDev = require("electron-is-dev");

export default class Main {
  public static mainWindow: Electron.BrowserWindow;
  public static application: Electron.App;
  public static BrowserWindow: any;

  public static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // 初始化配置组件
    Config.instance().name = app.getName()
    Config.instance().home = path.join(app.getPath("home"), "." + app.getName())
    Config.instance().root = path.join(app.getPath("appData"), app.getName())

    // 系统组件初始化
    !System.instance().initialize() && app.quit()

    // CLASH服务初始化
    !Clash.instance().initialize() && !Clash.instance().isInstalled() && !Clash.instance().install() && app.quit()
    !Clash.instance().loadConfig() && app.quit()

    // 启用沙盒
    app.enableSandbox()

    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow
    Main.application = app
    Main.application.on('window-all-closed', Main.onWindowAllClosed)
    Main.application.on("ready", Main.onReady)
    Main.application.on("will-quit", Main.onQuit)

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
    ipcMain.handle("query-clash-rules", Listener.handlerQueryClashRules)
    ipcMain.handle("query-clash-ports", Listener.handlerQueryClashPorts)
    ipcMain.handle("query-clash-connections", Listener.handlerQueryClashConnections)
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
    console.log("前端退出应用，退出CLASH服务...")
    // 退出CLASH服务进程
    Clash.instance().stop()

    console.log("前端退出应用，清理系统代理...")
    // 清理系统代理状态
    System.instance().networks.map((network) => {
      System.instance().unsetSystemProxy(network, "http")
      System.instance().unsetSystemProxy(network, "https")
      System.instance().unsetSystemProxy(network, "socks")

      return network
    })
  }

  private static onReady() {
    Main.application.once("activate", () => {
      0 === Main.BrowserWindow.getAllWindows().length && Main.onReady()
    })

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
      Main.mainWindow.webContents.openDevTools()
    } else {
      Main.mainWindow.loadFile(path.join(path.dirname(__dirname), "frontend", 'index.html')).catch()
    }

    Main.mainWindow.on('closed', Main.onClose)
  }
}