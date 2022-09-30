import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

export default class Listener {
  public static handlerActionStartClashService(event: IpcMainInvokeEvent) {
    console.log(event)
    return "running"
  }

  public static handlerActionStopClashService(event: IpcMainInvokeEvent) {
    console.log(event)
    return "not-running"
  }

  public static handlerActionRestartClashService(event: IpcMainInvokeEvent) {
    console.log(event)
    return "running"
  }

  public static handlerActionSetClashProxyMode(event: IpcMainInvokeEvent, mode: string) {
    console.log(event)
    return true
  }

  public static handlerActionSetClashPort(event: IpcMainInvokeEvent, mixed: boolean, port: number, http: number, socks: number) {
    console.log(event)
    return true
  }

  public static handlerActionAddClashRule(event: IpcMainInvokeEvent, mode: string, value: string, proxy: string) {
    console.log(event)
    return true
  }

  public static handlerActionRemoveClashRule(event: IpcMainInvokeEvent, index: number) {
    console.log(event)
    return true
  }

  public static handlerQueryClashServiceState(event: IpcMainInvokeEvent) {
    console.log(event)
    return "not-running"
  }

  public static handlerQueryClashProxyMode(event: IpcMainInvokeEvent) {
    return "rule-mode"
  }
}