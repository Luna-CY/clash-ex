import "../../static/css/pane/Setting.css"
import {Button, InputNumber, Space, Switch, Typography} from "@douyinfe/semi-ui";
import {Component} from "react";

export default class Setting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      switch: {mixed: false},
      modified: {port: false},
      port: {mixed: 1080, http: 1081, socks: 1082},
    }

    this.mixed = this.mixed.bind(this)
  }

  mixed(checked: boolean) {
    this.setState({switch: {mixed: checked}, modified: {port: true}})
  }

  render() {
    const {Text} = Typography

    let ports = []
    if (this.state.switch.mixed) {
      ports.push(
        <div className="Header-Item" key="mixed-port">
          <Space><Text>组合端口</Text><InputNumber min={1} max={65535} defaultValue={this.state.port.mixed}/></Space>
        </div>
      )
    } else {
      ports.push(
        <div className="Header-Item" key="http-port">
          <Space><Text>HTTP端口</Text><InputNumber min={1} max={65535} defaultValue={this.state.port.http}/></Space>
        </div>
      )
      ports.push(
        <div className="Header-Item" key="socks-port">
          <Space><Text>SOCKS5端口</Text><InputNumber min={1} max={65535} defaultValue={this.state.port.socks}/></Space>
        </div>
      )
    }

    return (
      <div className="App-Pane-Setting">
        <div className="Setting-Header">
          <div className="Header-Content">
            <Space>
              <div className="Header-Item">
                <Space><Text>开启组合端口</Text><Switch checked={this.state.switch.mixed} onChange={this.mixed}></Switch></Space>
              </div>
              {ports}
            </Space>
            <Button>保存</Button>
          </div>
        </div>
      </div>
    )
  }
}