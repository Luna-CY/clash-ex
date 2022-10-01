import * as fs from "fs";
import State, {CLASH_STATE_ERROR, CLASH_STATE_NOT_RUNNING, CLASH_STATE_RUNNING} from "./state";
import * as path from "path";
import * as child_process from "child_process"
import * as yaml from "yaml"
import Config from "./config";

export const CLASH_MODE_GLOBAL = "global"
export const CLASH_MODE_RULE = "rule"
export const CLASH_MODE_NO_PROXY = "direct"

export default class Clash {

  private static single = new Clash()

  // 可执行文件路径
  private bin = path.join(Config.instance().root, "clash", "darwin" === process.platform || "linux" === process.platform ? "clash" : "clash.exe")

  // 配置路径
  private configPath = path.join(Config.instance().config, "clash.yaml")

  // 配置字典
  private config: { [key: string]: any } = {}

  // 子进程
  private process: child_process.ChildProcess = null

  public static instance(): Clash {
    return Clash.single
  }

  // 判断是否已安装
  public isInstalled(): boolean {
    return fs.existsSync(this.bin)
  }

  // 安装
  public install(): boolean {
    if (this.isInstalled()) {
      return true
    }

    return true
  }

  // 加载配置文件
  public loadConfig(): boolean {
    if (!fs.existsSync(this.configPath)) {
      this.initConfigContent()

      return true
    }

    this.config = yaml.parse(fs.readFileSync(this.configPath, "utf-8").toString())
    if (null == this.config) {
      this.initConfigContent()

      return true
    }

    return true
  }

  public syncConfig(): boolean {
    let content = yaml.stringify(this.config)
    fs.writeFileSync(this.configPath, content)

    return true
  }

  // 获取代理模式
  public getMode(): string {
    return this.get("mode", CLASH_MODE_RULE)
  }

  // 设置代理模式
  public setMode(mode: string) {
    this.config["mode"] = mode
  }

  // 获取代理地址
  public getProxyAddress(): string {
    return this.get("address", "127.0.0.1")
  }

  // 设置代理地址
  public setProxyAddress(address: string) {
    this.config["address"] = address
  }

  // 获取组合端口
  public getMixedPort(): number {
    return this.get("mixed-port", 0)
  }

  // 设置组合端口
  public setMixedPort(port: number) {
    if (0 === port) {
      delete this.config["mixed-port"]

      return
    }

    this.config["mixed-port"] = port
  }

  // 获取HTTP端口
  public getHttpPort(): number {
    return this.get("port", 0)
  }

  // 获取一个有效的用于代理HTTP请求的端口
  // 优先获取组合端口
  public getHttpProxyPort(): number {
    if (0 !== this.getMixedPort()) {
      return this.getMixedPort()
    }

    return this.getHttpPort()
  }

  // 设置HTTP端口
  public setHttpPort(port: number) {
    if (0 === port) {
      delete this.config["port"]

      return
    }

    this.config["port"] = port
  }

  // 获取SOCKS端口
  public getSocksPort(): number {
    return this.get("socks-port", 0)
  }

  // 获取一个有效的用于代理SOCKS请求的端口
  // 优先获取组合端口
  public getSocksProxyPort(): number {
    if (0 !== this.getMixedPort()) {
      return this.getMixedPort()
    }

    return this.getSocksPort()
  }

  // 设置SOCKS端口
  public setSocksPort(port: number) {
    if (0 === port) {
      delete this.config["socks-port"]

      return
    }

    this.config["socks-port"] = port
  }

  // 启动
  public start(): boolean {
    if (CLASH_STATE_RUNNING === State.instance().clashState) {
      return true
    }

    if (null !== this.process) {
      State.instance().clashState = CLASH_STATE_RUNNING

      return true
    }

    this.process = child_process.execFile(this.bin, ["-f", this.configPath])
    State.instance().clashState = CLASH_STATE_RUNNING
    this.process.on("exit", (code, signal) => {
      if (null !== code && 0 !== code) {
        console.log(`CLASH服务异常退出，退出状态码: ${code}`)
        State.instance().clashState = CLASH_STATE_ERROR

        return
      }

      if (null != signal && "SIGTERM" != signal) {
        console.log(`CLASH服务收到异常退出信号，信号值: ${signal}`)
        State.instance().clashState = CLASH_STATE_ERROR

        return
      }

      State.instance().clashState = CLASH_STATE_NOT_RUNNING
    }).on("error", (error) => {
      console.log(`CLASH服务异常退出，错误信息: ${error}`)
      State.instance().clashState = CLASH_STATE_ERROR
    })

    return true
  }

  // 停止
  public stop(): boolean {
    if (CLASH_STATE_RUNNING !== State.instance().clashState) {
      return true
    }

    if (null === this.process) {
      State.instance().clashState = CLASH_STATE_NOT_RUNNING

      return true
    }

    if (!this.process.kill()) {
      return false
    }

    State.instance().clashState = CLASH_STATE_NOT_RUNNING
    this.process = null

    return true
  }

  // 重启
  public restart(): boolean {
    if (CLASH_STATE_RUNNING !== State.instance().clashState) {
      return false
    }

    if (null === this.process) {
      State.instance().clashState = CLASH_STATE_NOT_RUNNING

      return false
    }

    if (!this.stop()) {
      return false
    }

    return this.start()
  }

  // 获取配置属性
  private get(key: string, def: any): any {
    return null !== this.config[key] && undefined !== this.config[key] ? this.config[key] : def
  }

  // 初始化配置文件内容
  private initConfigContent() {
    this.config = {
      "mixed-port": 1080,
      "port": 1081,
      "socks-port": 1082,
      "bind-address": "127.0.0.1",
      "mode": CLASH_MODE_RULE,
      "log-level": "error",
      "external-controller": "127.0.0.1:33355",
    }
  }
}
