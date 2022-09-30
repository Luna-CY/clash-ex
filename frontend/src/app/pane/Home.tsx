import "../../static/css/pane/Home.css"
import {Component} from "react";
import {Button, Notification, Select, Space, Typography} from "@douyinfe/semi-ui";

const CLASH_STATE_NOT_RUNNING = "not-running"
const CLASH_STATE_RUNNING = "running"
const CLASH_STATE_ERROR = "error"

const CLASH_MODE_NO_PROXY = "no-proxy-mode"
const CLASH_MODE_GLOBAL = "global-mode"
const CLASH_MODE_RULE = "rule-mode"

export default class Home extends Component<any, any> {

  constructor(props: any) {
    super(props);

    this.state = {clash: {state: CLASH_STATE_NOT_RUNNING, mode: CLASH_MODE_NO_PROXY, detail: ""}, loading: {service: false}}

    window.capi.queryClashServiceState().then(value => {
      this.setState((state: any) => {
        state.clash.state = value

        return state
      })
    })

    window.capi.queryClashProxyMode().then(value => {
      this.setState((state: any) => {
        state.clash.mode = value

        return state
      })
    })

    this.startClashService = this.startClashService.bind(this)
    this.stopClashService = this.stopClashService.bind(this)
    this.restartClashService = this.restartClashService.bind(this)
    this.changeProxyMode = this.changeProxyMode.bind(this)
  }

  render() {
    const {Text} = Typography

    let start = <Button key="start-service-button" loading={this.state.loading.service} onClick={this.startClashService}>启动服务</Button>
    let stop = <Button key="stop-service-button" loading={this.state.loading.service} onClick={this.stopClashService}>停止服务</Button>
    let restart = <Button key="restart-service-button" loading={this.state.loading.service} onClick={this.restartClashService}>重启服务</Button>

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
                <div><Space><Text>CLASH服务状态</Text></Space></div>
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
                <div><Space><Text>CLASH代理模式</Text></Space></div>
              </div>
              <div className="Header-Buttons">
                <Select defaultValue={this.state.clash.mode} className="Proxy-Mode-Selector" onChange={this.changeProxyMode}>
                  <Select.Option value={CLASH_MODE_GLOBAL}>全局模式</Select.Option>
                  <Select.Option value={CLASH_MODE_RULE}>规则模式</Select.Option>
                  <Select.Option value={CLASH_MODE_NO_PROXY}>直连模式</Select.Option>
                </Select>
              </div>
            </div>
          </div>
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
}