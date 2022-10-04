import {Component} from "react";

export default class Server extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.refresh()
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
    if ("setting" === this.props.tab && "setting" !== prevProps.tab) {
      this.refresh()
    }
  }

  private refresh() {
    window.capi.queryClashPorts().then(value => {
      this.setState({port: value})
    })
  }

  render() {
    return (
      <div></div>
    );
  }
}