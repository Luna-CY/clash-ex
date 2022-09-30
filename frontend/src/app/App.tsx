import React from 'react';
import '../static/css/App.css';
import {TabPane, Tabs} from "@douyinfe/semi-ui";
import Setting from "./pane/Setting";
import Home from "./pane/Home";

function App() {
  return (
    <div className="App">
      <div className="App-Header"></div>
      <div className="App-Content">
        <Tabs className="Tabs" lazyRender={true} tabPaneMotion={false}>
          <TabPane itemKey="home" tab="首页"><Home/></TabPane>
          <TabPane itemKey="rule" tab="规则">111</TabPane>
          <TabPane itemKey="proxy" tab="代理">123</TabPane>
          <TabPane itemKey="connection" tab="连接">111</TabPane>
          <TabPane itemKey="setting" tab="设置"><Setting/></TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
