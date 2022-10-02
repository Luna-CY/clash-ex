import "../../static/css/pane/Connection.css";
import {Component, ReactNode} from "react";
import {Button, Input, List, Modal, Notification, Select, Space, Typography} from "@douyinfe/semi-ui";

export default class Connection extends Component<any, any> {
  private ticker: any

  constructor(props: any) {
    super(props)

    this.state = {data: [], connections: {}, modal: {show: false, type: "DOMAIN", value: "", proxy: "DIRECT"}}

    this.refresh = this.refresh.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.change = this.change.bind(this)
    this.create = this.create.bind(this)
    this.renderSize = this.renderSize.bind(this)
  }

  componentDidMount() {
    this.refresh()
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
    if ("connection" === this.props.tab && "connection" !== prevProps.tab) {
      this.ticker = setInterval(this.refresh, 1000)

      return
    }

    clearInterval(this.ticker)
  }

  private refresh() {
    window.capi.queryClashConnections().then(value => {
      value["connections"].map((item: any) => {
        let connection: { [key: string]: string } = {"type": item["metadata"]["type"], "host": item["metadata"]["host"]};
        connection["rule"] = "Match" === item["rule"] ? "默认规则" : item["rule"] + ":" + item["rulePayload"]
        connection["chains"] = "DIRECT" === item["chains"].join(",") ? "直接连接" : item["chains"].join(",")

        let key = connection["type"] + connection["host"] + connection["rule"] + connection["chains"]

        if (this.state.connections[key]) {
          return
        }

        this.setState((state: any) => {
          if (this.state.connections[key]) {
            return
          }

          state.data.push(connection)
          state.data.sort((a: any, b: any) => a["host"] <= b["host"])
          state.connections[key] = item

          return state
        })

        return item
      })
    })
  }

  render() {
    const {Text} = Typography

    return (
      <div className={"App-Pane-Connection"}>
        <div className={"Connection-Header"}></div>
        <div className={"Connection-List"}>
          <List dataSource={this.state.data} renderItem={(item: any): ReactNode => <List.Item main={
            <Text>{item["type"]}: {item["host"]} - {item["rule"]}({item["chains"]})</Text>
          } extra={
            <Space>
              <Button onClick={this.openModal(item["host"])}>创建规则</Button>
            </Space>
          }/>}/>
        </div>

        <Modal className={"Connection-Add-Rule-Modal"} closable={false} maskClosable={false} visible={this.state.modal.show} onCancel={this.closeModal} onOk={this.create}>
          <div className={"Rows"}>
            <div className={"Row"}>
              <Text>规则类型</Text>
              <Select value={this.state.modal.type} onChange={this.change("type")}>
                <Select.Option value={"DOMAIN"}>DOMAIN</Select.Option>
                <Select.Option value={"DOMAIN-SUFFIX"}>DOMAIN-SUFFIX</Select.Option>
                <Select.Option value={"DOMAIN-KEYWORD"}>DOMAIN-KEYWORD</Select.Option>
                <Select.Option value={"SRC-IP-CIDR"}>SRC-IP-CIDR</Select.Option>
                <Select.Option value={"IP-CIDR"}>IP-CIDR</Select.Option>
                <Select.Option value={"GEOIP"}>GEOIP</Select.Option>
                <Select.Option value={"DST-PORT"}>DST-PORT</Select.Option>
                <Select.Option value={"SRC-PORT"}>SRC-PORT</Select.Option>
              </Select>
            </div>
            <div className={"Row"}>
              <Text>使用策略</Text>
              <Select value={this.state.modal.proxy} onChange={this.change("proxy")}>
                <Select.Option value={"vmesses"}>vmesses</Select.Option>
                <Select.Option value={"DIRECT"}>直接连接</Select.Option>
                <Select.Option value={"REJECT"}>拒绝连接</Select.Option>
              </Select>
            </div>
            <div className={"Row"}>
              <Text>匹配模式</Text>
              <Input value={this.state.modal.value} onChange={this.change("value")}/>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  private openModal(host: string) {
    return () => {
      this.setState((state: any) => {
        state.modal.value = host
        state.modal.show = true

        return state
      })
    }
  }

  private change(field: string) {
    return (value: any) => {
      this.setState((state: any) => {
        state.modal[field] = value

        return state
      })
    }
  }

  private create() {
    if ("" === this.state.modal.type || "" === this.state.modal.proxy || "" === this.state.modal.value) {
      Notification.error({content: "缺少必填字段，请修改后重新保存", showClose: false, duration: 2, position: "top"})

      return
    }

    window.capi.actionAddClashRule(0, this.state.modal.type, this.state.modal.value, this.state.modal.proxy).then(ok => {
      if (!ok) {
        Notification.error({content: "创建失败，请重试", showClose: false, duration: 2, position: "top"})

        return
      }

      this.setState((state: any) => {
        state.modal.show = false
        state.modal.type = "DOMAIN"
        state.modal.proxy = "DIRECT"
        state.modal.value = ""

        return state
      })
    })
  }

  private closeModal() {
    this.setState((state: any) => {
      state.modal.value = ""
      state.modal.show = false

      return state
    })
  }

  private renderSize(size: number): string {
    if (size < 1024) {
      return size + 'B';
    } else if (size < (1024 * 1024)) {
      return `${(size / 1024).toFixed(2)}KB`;
    } else if (size < (1024 * 1024 * 1024)) {
      return `${(size / 1024 / 1024).toFixed(2)}MB`;
    } else {
      return `${(size / 1024 / 1024 / 1024).toFixed(2)}GB`;
    }
  }
}