import "../../static/css/pane/Setting.css"
import {Button, InputNumber, Notification, Space, Typography} from "@douyinfe/semi-ui";
import {Component} from "react";

export default class Setting extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      switch: {mixed: false},
      modified: {port: false},
      port: {mixed: 1080, http: 1081, socks: 1082},
    }

    this.changePort = this.changePort.bind(this)
    this.savePort = this.savePort.bind(this)
  }

  render() {
    const {Text} = Typography

    return (
      <div className="App-Pane-Setting">
        <div className="Setting-Header">
          <div className="Header-Group">
            <div>
              <Space>
                <div className="Header-Item" key="mixed-port">
                  <Space><Text>组合端口</Text><InputNumber min={0} max={65535} value={this.state.port.mixed} onChange={this.changePort("mixed")}/></Space>
                </div>
                <div className="Header-Item" key="http-port">
                  <Space><Text>HTTP端口</Text><InputNumber min={0} max={65535} value={this.state.port.http} onChange={this.changePort("http")}/></Space>
                </div>
                <div className="Header-Item" key="socks-port">
                  <Space><Text>SOCKS5端口</Text><InputNumber min={0} max={65535} value={this.state.port.socks} onChange={this.changePort("socks")}/></Space>
                </div>
              </Space>
            </div>
            <Button onClick={this.savePort}>保存</Button>
          </div>
          <div className="Header-Group">
            <Text type={"secondary"}>端口的允许范围[1-65535]，设置为0时将不设置该项代理</Text>
          </div>
        </div>
      </div>
    )
  }

  private changePort(type: string) {
    let ths = this
    return function (port: any) {
      switch (type) {
        case "mixed":
          ths.setState((state: any) => {
            state.port.mixed = port

            return state
          })
          break
        case "http":
          ths.setState((state: any) => {
            state.port.http = port

            return state
          })
          break
        case "socks":
          ths.setState((state: any) => {
            state.port.socks = port

            return state
          })
          break
      }
    }
  }

  private savePort() {
    if (0 === this.state.port.mixed && 0 === this.state.port.http && 0 === this.state.port.socks) {
      Notification.error({content: "端口不能全部关闭，请至少开启一个端口", showClose: false, duration: 2, position: "top"})

      return
    }

    window.capi.actionSetClashPort(this.state.port.mixed, this.state.port.http, this.state.port.socks).then(ok => {
      if (ok) {
        Notification.success({content: "保存成功，重启服务后生效", showClose: false, duration: 1, position: "top"})
      } else {
        Notification.error({content: "保存失败，请重试", showClose: false, duration: 1, position: "top"})
      }
    })
  }
}