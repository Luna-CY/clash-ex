import * as child_process from "child_process"

export default class System {
  private static single = new System()

  private constructor() {
  }

  private _networks: string[] = []

  // @ts-ignore
  get networks(): string[] {
    return this._networks;
  }

  private _http: { [key: string]: boolean } = {}

  // @ts-ignore
  get http(): { [p: string]: boolean } {
    return this._http;
  }

  // @ts-ignore
  set http(value: { [p: string]: boolean }) {
    this._http = value;
  }

  private _https: { [key: string]: boolean } = {}

  // @ts-ignore
  get https(): { [p: string]: boolean } {
    return this._https;
  }

  // @ts-ignore
  set https(value: { [p: string]: boolean }) {
    this._https = value;
  }

  private _socks: { [key: string]: boolean } = {}

  // @ts-ignore
  get socks(): { [p: string]: boolean } {
    return this._socks;
  }

  // @ts-ignore
  set socks(value: { [p: string]: boolean }) {
    this._socks = value;
  }

  public static instance(): System {
    return this.single
  }

  public initialize(): boolean {
    // 取到所有的网卡
    if ("darwin" === process.platform) {
      let p = child_process.execFileSync("/usr/sbin/networksetup", ["-listnetworkserviceorder"])
      let networks = p.toString().split("\n\n")
      for (let index in networks) {
        let value = networks[index].match(/\(\d\) (.+)/g)
        if (null !== value) {
          this._networks.push(value[0].split(") ")[1])
        }
      }
    }

    // 取到每个网卡的代理配置
    for (let index in this._networks) {
      this._http[this._networks[index]] = this.isEnabledSystemHttpProxy(this._networks[index])
      this._https[this._networks[index]] = this.isEnabledSystemHttpsProxy(this._networks[index])
      this._socks[this._networks[index]] = this.isEnabledSystemSocksProxy(this._networks[index])
    }

    return true
  }

  public isEnabledSystemHttpProxy(network: string): boolean {
    if ("darwin" === process.platform) {
      let p = child_process.execFileSync("/usr/sbin/networksetup", ["-getwebproxy", network])

      return -1 !== p.toString().indexOf("Enabled: Yes")
    }

    return false
  }

  public isEnabledSystemHttpsProxy(network: string): boolean {
    if ("darwin" === process.platform) {
      let p = child_process.execFileSync("/usr/sbin/networksetup", ["-getsecurewebproxy", network])

      return -1 !== p.toString().indexOf("Enabled: Yes")
    }

    return false
  }

  public isEnabledSystemSocksProxy(network: string): boolean {
    if ("darwin" === process.platform) {
      let p = child_process.execFileSync("/usr/sbin/networksetup", ["-getsocksfirewallproxy", network])

      return -1 !== p.toString().indexOf("Enabled: Yes")
    }

    return false
  }

  public setSystemProxy(network: string, type: string, domain: string, port: number): boolean {
    if ("darwin" === process.platform) {
      let mapping: { [key: string]: string } = {"http": "-setwebproxy", "https": "-setsecurewebproxy", "socks": "-setsocksfirewallproxy"}
      let p1 = child_process.execFileSync("/usr/sbin/networksetup", [mapping[type], network, domain, port.toString()])
      if (null != p1 && "" != p1.toString()) {
        return false
      }

      let p2 = child_process.execFileSync("/usr/sbin/networksetup", [mapping[type] + "state", network, "on"])
      if (null != p2 && "" != p2.toString()) {
        return false
      }
    }

    switch (type) {
      case "http":
        this._http[network] = true
        break
      case "https":
        this._https[network] = true
        break
      case "socks":
        this._socks[network] = true
        break
    }

    return true
  }

  public unsetSystemProxy(network: string, type: string) {
    if ("darwin" === process.platform) {
      let mapping: { [key: string]: string } = {"http": "-setwebproxy", "https": "-setsecurewebproxy", "socks": "-setsocksfirewallproxy"}
      let p2 = child_process.execFileSync("/usr/sbin/networksetup", [mapping[type] + "state", network, "off"])
      if (null != p2 && "" != p2.toString()) {
        return false
      }
    }

    switch (type) {
      case "http":
        this._http[network] = false
        break
      case "https":
        this._https[network] = false
        break
      case "socks":
        this._socks[network] = false
        break
    }

    return true
  }
}