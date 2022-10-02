import {Component} from "react";
import {Typography} from "@douyinfe/semi-ui";

export default class Proxy extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const {Text} = Typography

    return (
      <div className={"App-Pane-Proxy"}>
        <Text>还未实现该部分，可以先编辑配置文件，路径在$HOME/.Clash-EX/clash.yaml</Text>
      </div>
    );
  }
}