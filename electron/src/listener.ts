import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
import Clash from "./clash";
import State from "./state";

export default class Listener {
  public static handlerActionStartClashService(event: IpcMainInvokeEvent) {
    console.log("前端启动CLASH服务...")
    Clash.instance().start()

    return State.instance().clashState
  }

  public static handlerActionStopClashService(event: IpcMainInvokeEvent) {
    console.log("前端停止CLASH服务...")
    Clash.instance().stop()

    return State.instance().clashState
  }

  public static handlerActionRestartClashService(event: IpcMainInvokeEvent) {
    console.log("前端重启CLASH服务...")
    Clash.instance().restart()

    return State.instance().clashState
  }

  public static handlerActionSetClashProxyMode(event: IpcMainInvokeEvent, mode: string) {
    return true
  }

  public static handlerActionSetClashPort(event: IpcMainInvokeEvent, mixed: boolean, port: number, http: number, socks: number) {
    return true
  }

  public static handlerActionAddClashRule(event: IpcMainInvokeEvent, mode: string, value: string, proxy: string) {
    return true
  }

  public static handlerActionRemoveClashRule(event: IpcMainInvokeEvent, index: number) {
    return true
  }

  public static handlerQueryClashServiceState(event: IpcMainInvokeEvent) {
    return State.instance().clashState
  }

  public static handlerQueryClashProxyMode(event: IpcMainInvokeEvent) {
    return "rule-mode"
  }
}