import "../../static/css/pane/Connection.css";
import {Component, ReactNode} from "react";
import {Button, List, Space, Typography} from "@douyinfe/semi-ui";

export default class Connection extends Component<any, any> {
  private ticker: any

  constructor(props: any) {
    super(props)

    this.state = {data: [], connections: {}}

    this.refresh = this.refresh.bind(this)
    this.renderSize = this.renderSize.bind(this)
  }

  componentDidMount() {
    this.refresh()

    this.ticker = setInterval(this.refresh, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.ticker)
  }

  private refresh() {
    if ("connection" !== this.props.tab) {
      return
    }

    window.capi.queryClashConnections().then(value => {
      value["connections"].map((item: any) => {
        let connection: { [key: string]: string } = {"type": item["metadata"]["type"], "host": item["metadata"]["host"]};
        connection["rule"] = "Match" === item["rule"] ? "默认" : item["rule"] + ":" + item["rulePayload"]
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
              <Button>创建规则</Button>
            </Space>
          }/>}/>
        </div>
      </div>
    );
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