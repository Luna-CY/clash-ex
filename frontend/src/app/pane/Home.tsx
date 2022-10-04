import "../../static/css/pane/Home.css"
import {Component} from "react";
import {Button, Checkbox, Divider, Notification, Select, Space, Typography} from "@douyinfe/semi-ui";
import Rule from "../component/Rule";

const CLASH_STATE_NOT_RUNNING = "not-running"
const CLASH_STATE_RUNNING = "running"
const CLASH_STATE_ERROR = "error"

const CLASH_MODE_NO_PROXY = "direct"
const CLASH_MODE_GLOBAL = "global"
const CLASH_MODE_RULE = "rule"

export default class Home extends Component<any, any> {

  constructor(props: any) {
    super(props);

    this.state = {
      clash: {state: CLASH_STATE_NOT_RUNNING, mode: CLASH_MODE_NO_PROXY, detail: ""},
      system: {networks: [], network: "", http: {}, https: {}, socks: {}},
      style: {mode: "warning"},
      loading: {service: false},
    }

    this.startClashService = this.startClashService.bind(this)
    this.stopClashService = this.stopClashService.bind(this)
    this.restartClashService = this.restartClashService.bind(this)
    this.changeProxyMode = this.changeProxyMode.bind(this)
    this.selectNetwork = this.selectNetwork.bind(this)
  }

  componentDidMount() {
    window.capi.queryClashServiceState().then(value => {
      this.setState((state: any) => {
        state.clash.state = value

        return state
      })
    })

    window.capi.queryClashProxyMode().then(value => {
      this.setState((state: any) => {
        state.clash.mode = value
        state.style.mode = {CLASH_MODE_GLOBAL: "error", CLASH_MODE_RULE: "warning", CLASH_MODE_NO_PROXY: "default"}[value]

        return state
      })
    })

    window.capi.querySystemNetworks().then(value => {
      this.setState((state: any) => {
        state.system.networks = value
        state.system.network = value[0]

        return state
      })
    })

    window.capi.querySystemHttpProxy().then(value => {
      this.setState((state: any) => {
        state.system.http = value

        return state
      })
    })

    window.capi.querySystemHttpsProxy().then(value => {
      this.setState((state: any) => {
        state.system.https = value

        return state
      })
    })

    window.capi.querySystemSocksProxy().then(value => {
      this.setState((state: any) => {
        state.system.socks = value

        return state
      })
    })
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
    if ("home" === this.props.tab && "home" !== prevProps.tab) {
    }
  }

  render() {
    const {Text} = Typography

    let start = <Button key="start-service-button" loading={this.state.loading.service} onClick={this.startClashService}>启动服务</Button>
    let stop = <Button key="stop-service-button" type={"danger"} loading={this.state.loading.service} onClick={this.stopClashService}>停止服务</Button>
    let restart = <Button key="restart-service-button" type={"warning"} loading={this.state.loading.service} onClick={this.restartClashService}>重启服务</Button>

    let buttons = []
    switch (this.state.clash.state) {
      case CLASH_STATE_NOT_RUNNING:
        buttons.push(start)
        break
      case CLASH_STATE_RUNNING:
        buttons.push(restart, stop)
        break
      case CLASH_STATE_ERROR:
        buttons.push(restart)
        break
    }

    return (
      <div className="App-Pane-Home">
        <div className="Home-Header">
          <div className="Home-Header-Group">
            <div className="Home-Header-Line">
              <div className="Header-Service">
                <div><Space><Text>代理服务状态</Text></Space></div>
              </div>
              <div className="Header-Buttons">
                {CLASH_STATE_RUNNING === this.state.clash.state && <Text type="success">已启动</Text>}
                {CLASH_STATE_NOT_RUNNING === this.state.clash.state && <Text type="quaternary">未启动</Text>}
                {CLASH_STATE_ERROR === this.state.clash.state && <Text type="danger">启动失败</Text>}
                <Space>
                  {buttons}
                </Space>
              </div>
            </div>
            <div className="Home-Header-Line">
              <div className="Header-Service">
                <div><Space><Text>代理服务模式</Text></Space></div>
              </div>
              <div className="Header-Buttons">
                <Select defaultValue={CLASH_MODE_RULE} value={this.state.clash.mode} validateStatus={this.state.style.mode} className="Proxy-Mode-Selector" onChange={this.changeProxyMode}>
                  <Select.Option value={CLASH_MODE_GLOBAL}>全局模式</Select.Option>
                  <Select.Option value={CLASH_MODE_RULE}>规则模式</Select.Option>
                  <Select.Option value={CLASH_MODE_NO_PROXY}>直连模式</Select.Option>
                </Select>
              </div>
            </div>
          </div>
          <div className="Home-Header-Group">
            <div className="Home-Header-Line">
              <div className="Header-Service">
                <div><Space><Text>系统代理状态</Text></Space></div>
              </div>
              <div className="Header-Buttons">
                <Space>
                  <Select value={this.state.system.network} onChange={this.selectNetwork}>
                    {this.state.system.networks.map((network: string) => <Select.Option key={network} value={network}>{network}</Select.Option>)}
                  </Select>
                  <Checkbox checked={this.state.system.http[this.state.system.network]} onChange={this.setSystemProxy(this.state.system.network, "http")}>HTTP代理</Checkbox>
                  <Checkbox checked={this.state.system.https[this.state.system.network]} onChange={this.setSystemProxy(this.state.system.network, "https")}>HTTPS代理</Checkbox>
                  <Checkbox checked={this.state.system.socks[this.state.system.network]} onChange={this.setSystemProxy(this.state.system.network, "socks")}>SOCKS5代理</Checkbox>
                </Space>
              </div>
            </div>
          </div>
        </div>
        <div className={"Home-Content"}>
          <Divider align={"center"}>规则列表</Divider>
          <Rule/>
        </div>
      </div>
    )
  }

  private startClashService() {
    this.setState((state: any) => {
      state.loading.service = true

      return state
    })

    window.capi.actionStartClashService().then(value => {
      this.setState((state: any) => {
        state.clash.state = value

        return state
      })
    })

    this.setState((state: any) => {
      state.loading.service = false

      return state
    })
  }

  private stopClashService() {
    this.setState((state: any) => {
      state.loading.service = true

      return state
    })

    window.capi.actionStopClashService().then(value => {
      this.setState((state: any) => {
        state.clash.state = value

        return state
      })
    })

    this.setState((state: any) => {
      state.loading.service = false

      return state
    })
  }

  private restartClashService() {
    this.setState((state: any) => {
      state.loading.service = true

      return state
    })

    window.capi.actionRestartClashService().then(value => {
      this.setState((state: any) => {
        state.clash.state = value

        return state
      })
    })

    this.setState((state: any) => {
      state.loading.service = false

      return state
    })
  }

  private changeProxyMode(mode: any) {
    window.capi.actionSetClashProxyMode(mode).then((ok: boolean) => {
      if (ok) {
        this.setState(((state: any) => {
          state.clash.mode = mode

          return state
        }))

        Notification.success({content: "修改成功，重启服务后生效", showClose: false, duration: 1, position: "top"})
      } else {
        this.setState(((state: any) => {
          state.clash.mode = this.state.clash.mode

          return state
        }))

        Notification.error({content: "修改失败，请重试", showClose: false, duration: 1, position: "top"})
      }
    })
  }

  private selectNetwork(network: any) {
    this.setState((state: any) => {
      state.system.network = network

      return state
    })
  }

  private setSystemProxy(network: string, type: string) {
    let ths = this
    return function (event: any) {
      if (event.target.checked) {
        ths.setState((state: any) => {
          state.system[type][network] = event.target.checked


          return state
        })

        window.capi.actionSetSystemProxy(network, type, true).then(ok => {
          if (!ok) {
            Notification.error({content: "设置失败，请重试", showClose: false, duration: 1, position: "top"})

            ths.setState((state: any) => {
              state.system[type][network] = false
            })

            return
          }
        })
      } else {
        ths.setState((state: any) => {
          state.system[type][network] = event.target.checked


          return state
        })

        window.capi.actionSetSystemProxy(network, type, false).then(ok => {
          if (!ok) {
            Notification.error({content: "取消失败，请重试", showClose: false, duration: 1, position: "top"})

            ths.setState((state: any) => {
              state.system[type][network] = true
            })

            return
          }
        })
      }
    }
  }
}