import React, {Component} from 'react';
import '../static/css/App.css';
import {TabPane, Tabs} from "@douyinfe/semi-ui";
import Setting from "./pane/Setting";
import Home from "./pane/Home";
import Connection from "./pane/Connection";
import Group from "./pane/Group";
import Server from "./pane/Server";

export default class App extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {tab: "home"}

    this.changeTab = this.changeTab.bind(this)
  }

  render() {
    return (
      <div className="App">
        <div className="App-Header"></div>
        <div className="App-Content">
          <Tabs className="Tabs" lazyRender={true} tabPaneMotion={false} onChange={this.changeTab}>
            <TabPane itemKey="home" tab="首页"><Home tab={this.state.tab}/></TabPane>
            <TabPane itemKey="group" tab="策略组"><Group tab={this.state.tab}/></TabPane>
            <TabPane itemKey="server" tab="服务器"><Server tab={this.state.tab}/></TabPane>
            <TabPane itemKey="connection" tab="连接"><Connection tab={this.state.tab}/></TabPane>
            <TabPane itemKey="setting" tab="设置"><Setting tab={this.state.tab}/></TabPane>
          </Tabs>
        </div>
      </div>
    )
  }

  private changeTab(tab: string) {
    this.setState((state: any) => {
      state.tab = tab

      return state
    })
  }
}
