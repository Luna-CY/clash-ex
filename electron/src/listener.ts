import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
import Clash, {CLASH_MODE_GLOBAL, CLASH_MODE_NO_PROXY, CLASH_MODE_RULE} from "./clash";
import State from "./state";
import System from "./system";

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

  public static handlerActionSetClashPort(event: IpcMainInvokeEvent, mixed: number, http: number, socks: number) {
    Clash.instance().setMixedPort(mixed)
    Clash.instance().setHttpPort(http)
    Clash.instance().setSocksPort(socks)

    return Clash.instance().syncConfig()
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

  public static handlerQuerySystemNetworks() {
    return System.instance().networks
  }

  public static handlerQuerySystemHttpProxy() {
    return System.instance().http
  }

  public static handlerQuerySystemHttpsProxy() {
    return System.instance().https
  }

  public static handlerQuerySystemSocksProxy() {
    return System.instance().socks
  }

  public static handlerActionSetSystemProxy(event: IpcMainInvokeEvent, network: string, type: string, checked: boolean) {
    if (checked) {
      let mapping: { [key: string]: number } = {"http": Clash.instance().getHttpProxyPort(), "https": Clash.instance().getHttpProxyPort(), "socks": Clash.instance().getSocksProxyPort()}

      return System.instance().setSystemProxy(network, type, Clash.instance().getProxyAddress(), mapping[type])
    }

    return System.instance().unsetSystemProxy(network, type)
  }
}