import {config} from "./clash";
import * as path from "path";

export const CLASH_STATE_NOT_RUNNING = "not-running"
export const CLASH_STATE_RUNNING = "running"
export const CLASH_STATE_ERROR = "error"

export default class State {
  // 单例
  private static single: State = new State()

  // 用户主目录
  private home: string = process.env.HOME || process.env.USERPROFILE

  // 私有构造函数
  private constructor() {
  }

  // clash服务状态
  private _clashState: string = CLASH_STATE_NOT_RUNNING

  // @ts-ignore
  get clashState(): string {
    return this._clashState;
  }

  // @ts-ignore
  set clashState(value: string) {
    this._clashState = value;
  }

  // 应用根目录，用于存放应用必须的一些文件，不可被用户替换
  private _root: string = path.join(this.home, ".clash-ex")

  // @ts-ignore
  get root(): string {
    return this._root;
  }

  // 配置加载目录，加载clash配置的目录，可以被用户替换
  private _config: string = this.root

  // @ts-ignore
  get config(): string {
    return this._config;
  }

  // @ts-ignore
  set config(value: string) {
    this._config = value;
  }

  // clash配置对象
  private _clash: object = config

  // @ts-ignore
  get clash(): object {
    return this._clash;
  }

  public static instance(): State {
    return State.single
  }
}