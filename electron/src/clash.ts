import * as fs from "fs";
import State, {CLASH_STATE_ERROR, CLASH_STATE_NOT_RUNNING, CLASH_STATE_RUNNING} from "./state";
import * as path from "path";
import * as child_process from "child_process"

export let tun = {
  "enable": false,
  "stack": "system",
  "auto-route": true,
  "auto-detect-interface": true,
}

export let proxyWebsocket = {
  "path": "/my-ws-path",
  "headers": {}
}

export let proxy = {
  "name": "example",
  "type": "vmess",
  "server": "example.luna.xin",
  "port": 443,
  "uuid": "uuid",
  "alertId": 0,
  "cipher": "auto",
  "udp": false,
  "tls": true,
  "skip-cert-verify": false,
  "servername": "example.luna.xin",
  "network": "ws",
  "ws-opts": proxyWebsocket,
}

export let group = {
  "name": "vmesses",
  "type": "select",
  "proxies": ["example"]
}

export let config = {
  "mixed-port": 1080,
  "allow-lan": false,
  "external-controller": 1088,
  "secret": "ebf07c1f-23f2-4134-92d0-a9f26dd6f9e6",
  "ipv6": false,
  "mode": "rule",
  "log-level": "info",
  "tun": tun,
  "proxies": [proxy],
  "proxy-groups": [group],
  "rules": ["DOMAIN-SUFFIX,google.com,vmesses"],
}

export default class Clash {

  private static single = new Clash()

  // 可执行文件路径
  private bin = path.join(State.instance().root, "clash", "darwin" === process.platform || "linux" === process.platform ? "clash" : "clash.exe")

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

  // 启动
  public start(): boolean {
    if (CLASH_STATE_RUNNING === State.instance().clashState) {
      return true
    }

    if (null !== this.process) {
      State.instance().clashState = CLASH_STATE_RUNNING

      return true
    }

    this.process = child_process.execFile(this.bin, ["-f", path.join(State.instance().config, "clash.yaml")])
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
}
