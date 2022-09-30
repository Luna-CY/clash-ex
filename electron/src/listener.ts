import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
import Clash, {CLASH_MODE_GLOBAL, CLASH_MODE_NO_PROXY, CLASH_MODE_RULE} from "./clash";
import State from "./state";

export default class Listener {
  public static handlerActionStartClashService() {
    console.log("前端启动CLASH服务...")
    Clash.instance().start()

    return State.instance().clashState
  }

  public static handlerActionStopClashService() {
    console.log("前端停止CLASH服务...")
    Clash.instance().stop()

    return State.instance().clashState
  }

  public static handlerActionRestartClashService() {
    console.log("前端重启CLASH服务...")
    Clash.instance().restart()

    return State.instance().clashState
  }

  public static handlerActionSetClashProxyMode(event: IpcMainInvokeEvent, mode: string) {
    console.log(`前端设置CLASH路由规则为: ${mode}`)

    if (mode === CLASH_MODE_GLOBAL || mode === CLASH_MODE_RULE || mode === CLASH_MODE_NO_PROXY) {
      Clash.instance().setMode(mode)
      Clash.instance().syncConfig()
    }

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

  public static handlerQueryClashServiceState() {
    return State.instance().clashState
  }

  public static handlerQueryClashProxyMode() {
    return Clash.instance().getMode()
  }
}