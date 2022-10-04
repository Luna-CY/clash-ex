import "../../static/css/pane/Group.css";
import {Component, ReactNode} from "react";
import {List, Typography} from "@douyinfe/semi-ui";

const types: {[key:string]:string} = {"select": "选择模式", "load-balance": "负载均衡", "relay": "中继模式", "url-test": "url-test", "fallback": "fallback"}

export default class Group extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {groups: []}
  }

  componentDidMount() {
    window.capi.queryClashProxyGroups().then(value => {
      this.setState({groups: value})
    })
  }

  render() {
    const {Text} = Typography

    return (
      <div className={"App-Pane-Group"}>
        <List className={"Group-List"} dataSource={this.state.groups} renderItem={(item: any): ReactNode => <List.Item main={
          <Text>{item["name"]} - {types[item["type"]]} - [{item["proxies"].join(",")}]</Text>
        }/>}/>
      </div>
    );
  }
}