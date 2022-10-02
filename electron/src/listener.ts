import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
import Clash, {CLASH_MODE_GLOBAL, CLASH_MODE_NO_PROXY, CLASH_MODE_RULE} from "./clash";
import State from "./state";
import System from "./system";

export default class Listener {
  public static handlerActionStartClashService(): string {
    console.log("前端启动CLASH服务...")
    Clash.instance().start()

    return State.instance().clashState
  }

  public static handlerActionStopClashService(): string {
    console.log("前端停止CLASH服务...")
    Clash.instance().stop()

    return State.instance().clashState
  }

  public static handlerActionRestartClashService(): string {
    console.log("前端重启CLASH服务...")
    Clash.instance().restart()

    return State.instance().clashState
  }

  public static handlerActionSetClashProxyMode(event: IpcMainInvokeEvent, mode: string): boolean {
    console.log(`前端设置CLASH路由规则为: ${mode}`)

    if (mode === CLASH_MODE_GLOBAL || mode === CLASH_MODE_RULE || mode === CLASH_MODE_NO_PROXY) {
      Clash.instance().setMode(mode)
      Clash.instance().syncConfig()
    }

    return true
  }

  public static handlerActionSetClashPort(event: IpcMainInvokeEvent, mixed: number, http: number, socks: number): boolean {
    Clash.instance().setMixedPort(mixed)
    Clash.instance().setHttpPort(http)
    Clash.instance().setSocksPort(socks)

    return Clash.instance().syncConfig()
  }

  public static handlerQueryClashRules(): { [key: string]: string }[] {
    return Clash.instance().getRules()
  }

  public static handlerQueryClashPorts(): { [key: string]: string } {
    return Clash.instance().getPorts()
  }

  public static handlerQueryClashConnections(): { [key: string]: any } {
    return Clash.instance().getConnections()
  }

  public static handlerActionAddClashRule(event: IpcMainInvokeEvent, index: number, type: string, value: string, proxy: string) {
    console.log("前端添加规则:", index, type, value, proxy)

    return Clash.instance().addRule(index, type, value, proxy)
  }

  public static handlerActionRemoveClashRule(event: IpcMainInvokeEvent, index: number) {
    let rule = Clash.instance().getRules()[index];
    console.log("前端移除规则:", index, rule["type"], rule["value"], rule["proxy"])

    return Clash.instance().removeRule(index)
  }

  public static handlerQueryClashServiceState(): string {
    return State.instance().clashState
  }

  public static handlerQueryClashProxyMode(): string {
    return Clash.instance().getMode()
  }

  public static handlerQuerySystemNetworks(): string[] {
    return System.instance().networks
  }

  public static handlerQuerySystemHttpProxy(): { [key: string]: boolean } {
    return System.instance().http
  }

  public static handlerQuerySystemHttpsProxy(): { [key: string]: boolean } {
    return System.instance().https
  }

  public static handlerQuerySystemSocksProxy(): { [key: string]: boolean } {
    return System.instance().socks
  }

  public static handlerActionSetSystemProxy(event: IpcMainInvokeEvent, network: string, type: string, checked: boolean): boolean {
    if (checked) {
      console.log(`前端设置系统代理 [${network}] [${type}]`)
      let mapping: { [key: string]: number } = {"http": Clash.instance().getHttpProxyPort(), "https": Clash.instance().getHttpProxyPort(), "socks": Clash.instance().getSocksProxyPort()}

      return System.instance().setSystemProxy(network, type, Clash.instance().getProxyAddress(), mapping[type])
    }

    console.log(`前端取消系统代理 [${network}] [${type}]`)

    return System.instance().unsetSystemProxy(network, type)
  }
}