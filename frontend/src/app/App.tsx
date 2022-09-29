import React from 'react';
import '../static/css/App.css';
import {Button, Divider} from "@douyinfe/semi-ui";
import {IconGithubLogo} from "@douyinfe/semi-icons";

function App() {
  return (
    <div className="App">
      <div className="App-Header">
          <div className="Logo">Clash Ex</div>
          <IconGithubLogo/>
      </div>
      <Divider ></Divider>
    </div>
  );
}

export default App;
