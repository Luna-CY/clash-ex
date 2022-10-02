import "../../static/css/component/Rule.css"
import {Component, ReactNode} from "react";
import {Button, Input, List, Notification, Select, Space, Typography} from "@douyinfe/semi-ui";
import {v4} from "uuid";
import InfiniteScroll from 'react-infinite-scroller';

const PAGE_SIZE = 20

export default class Rule extends Component<any, any> {
  constructor(props: any) {
    super(props);

    let rules: { [key: string]: any } = {}
    let keys: string[] = []
    let data: string[] = []
    this.state = {keys: keys, rules: rules, data: data, scroll: {page: 0, pages: 0, more: false}}

    // 拉取规则列表
    this.refresh()

    this.renderLine = this.renderLine.bind(this)
    this.edit = this.edit.bind(this)
    this.cancel = this.cancel.bind(this)
    this.change = this.change.bind(this)
    this.save = this.save.bind(this)
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
    this.refresh = this.refresh.bind(this)
    this.fetch = this.fetch.bind(this)
  }

  render() {
    return (
      <div className={"Rule-Component"}>
        <div className={"Buttons"}>
          <Button type={"secondary"} onClick={this.refresh}>刷新</Button>
          <Button onClick={this.add}>添加</Button>
        </div>
        <div className={"Rule-List"}>
          <InfiniteScroll useWindow={false} pageStart={0} threshold={20} hasMore={this.state.scroll.more} loadMore={this.fetch}>
            <List dataSource={this.state.data} renderItem={this.renderLine}/>
          </InfiniteScroll>
        </div>
      </div>
    );
  }

  private fetch(page: number) {
    if (!this.state.scroll.more) {
      return
    }

    this.setState((state: any) => {
      if (state.scroll.page + 1 === page) {
        let start = (page - 1) * PAGE_SIZE
        let end = start + PAGE_SIZE > state.keys.length ? state.keys.length : start + PAGE_SIZE

        state.keys.slice(start, end).map((key: string) => {
          state.data.push(key)

          return key
        })

        state.scroll.page = page
        state.scroll.more = state.scroll.pages !== page

        return state
      }
    })
  }

  private renderLine(key: any): ReactNode {
    const {Text} = Typography

    let item = this.state.rules[key]
    if (!item["edit"]) {
      return <List.Item main={<Text>{item["type"]} - {item["value"]} - {item["proxy"]}</Text>} extra={<Space><Button onClick={this.edit(key)}>编辑</Button><Button type={"danger"} onClick={this.remove(key)}>删除</Button></Space>}/>
    }

    return (
      <List.Item main={
        <div className={"Rule-Item-Edit"}>
          <Select value={item["type"]} onChange={this.change(key, "type")}>
            <Select.Option value={"DOMAIN"}>DOMAIN</Select.Option>
            <Select.Option value={"DOMAIN-SUFFIX"}>DOMAIN-SUFFIX</Select.Option>
            <Select.Option value={"DOMAIN-KEYWORD"}>DOMAIN-KEYWORD</Select.Option>
            <Select.Option value={"SRC-IP-CIDR"}>SRC-IP-CIDR</Select.Option>
            <Select.Option value={"IP-CIDR"}>IP-CIDR</Select.Option>
            <Select.Option value={"GEOIP"}>GEOIP</Select.Option>
            <Select.Option value={"DST-PORT"}>DST-PORT</Select.Option>
            <Select.Option value={"SRC-PORT"}>SRC-PORT</Select.Option>
          </Select>
          <Select value={item["proxy"]} onChange={this.change(key, "proxy")}>
            <Select.Option value={"vmesses"}>vmesses</Select.Option>
            <Select.Option value={"DIRECT"}>直接连接</Select.Option>
            <Select.Option value={"REJECT"}>拒绝连接</Select.Option>
          </Select>
          <Input value={item["value"]} className={"Edit-Value"} onChange={this.change(key, "value")}/>
        </div>
      } extra={<Space><Button onClick={this.save(key)}>保存</Button><Button type={"danger"} onClick={this.cancel(key)}>取消</Button></Space>}/>
    )
  }

  private edit(key: string) {
    return () => {
      this.setState((state: any) => {
        state.rules[key]["raw"] = {}
        Object.assign(state.rules[key]["raw"], state.rules[key])
        state.rules[key]["edit"] = true

        return state
      })
    }
  }

  private cancel(key: string) {
    return () => {
      if (this.state.rules[key]["new"]) {
        this.setState((state: any) => {
          if (state.rules[key]) {
            delete state.rules[key]
            state.rules.splice(0, 1)
          }

          return state
        })

        return
      }

      this.setState((state: any) => {
        state.rules[key] = state.rules[key]["raw"]
        state.rules[key]["edit"] = false

        return state
      })
    }
  }

  private change(key: string, field: string) {
    return (value: any) => {
      this.setState((state: any) => {
        state.rules[key][field] = value

        return state
      })
    }
  }

  private save(key: string) {
    return () => {
      let rule = this.state.rules[key];
      if ("" === rule["type"] || "" === rule["value"] || "" === rule["proxy"]) {
        Notification.error({content: "缺少必填字段，请修改后重新保存", showClose: false, duration: 2, position: "top"})

        return
      }

      // 添加
      if (rule["new"]) {
        window.capi.actionAddClashRule(0, rule["type"], rule["value"], rule["proxy"]).then(ok => {
          if (!ok) {
            Notification.error({content: "保存失败，请重试", showClose: false, duration: 1, position: "top"})
          }

          this.setState((state: any) => {
            state.rules[key]["raw"] = {}
            state.rules[key]["edit"] = false
            state.rules[key]["new"] = false
            state.keys[key] = rule

            return state
          })
        })

        return
      }

      // 取索引位置
      let ind = this.state.keys.indexOf(key)

      // 短路操作: 添加
      if (rule["fail"]) {
        window.capi.actionAddClashRule(ind, rule["type"], rule["value"], rule["proxy"]).then(ok => {
          if (!ok) {
            Notification.error({content: "保存失败，请重试", showClose: false, duration: 1, position: "top"})

            return
          }

          this.setState((state: any) => {
            state.rules[key]["fail"] = false
            state.rules[key]["raw"] = {}
            state.rules[key]["edit"] = false

            return state
          })
        })

        return
      }

      // 删除 -> 添加
      window.capi.actionRemoveClashRule(ind).then(ok => {
        if (!ok) {
          Notification.error({content: "保存失败，请重试", showClose: false, duration: 1, position: "top"})

          return
        }

        window.capi.actionAddClashRule(ind, rule["type"], rule["value"], rule["proxy"]).then(ok => {
          if (!ok) {
            Notification.error({content: "保存失败，请重试", showClose: false, duration: 1, position: "top"})

            this.setState((state: any) => {
              state.rules[key]["fail"] = true
            })

            return
          }

          this.setState((state: any) => {
            state.rules[key]["raw"] = {}
            state.rules[key]["edit"] = false

            return state
          })
        })
      })
    }
  }

  private add() {
    let key = v4()
    this.setState((state: any) => {
      if (this.state.rules[key]) {
        return
      }

      state.rules[key] = {"type": "", "value": "", "proxy": "", "key": key, "new": true, "edit": true}
      state.keys.unshift(key)
      state.data.unshift(key)

      return state
    })
  }

  private remove(key: string) {
    return () => {
      let ind = this.state.keys.indexOf(key)
      window.capi.actionRemoveClashRule(ind).then(ok => {
        if (!ok) {
          Notification.error({content: "删除失败，请重试", showClose: false, duration: 1, position: "top"})
        }

        this.setState((state: any) => {
          if (!state.rules[key]) {
            return state
          }

          delete state.rules[key]
          state.keys.splice(ind, 1)
          state.data.splice(ind, 1)

          return state
        })
      })
    }
  }

  private refresh() {
    window.capi.queryClashRules().then(value => {
      let rules: { [key: string]: any } = {}
      let keys: string[] = []

      value.map(item => {
        let row: { [key: string]: any } = {}
        Object.assign(row, item)

        row["key"] = v4()
        row["edit"] = false

        keys.push(row["key"])
        rules[row["key"]] = row

        return item
      })

      this.setState({rules: rules, keys: keys, data: [], scroll: {page: 0, pages: Math.ceil(keys.length / PAGE_SIZE), more: 0 < value.length}})
    })
  }
}