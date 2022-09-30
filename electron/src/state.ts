export const CLASH_STATE_NOT_RUNNING = "not-running"
export const CLASH_STATE_RUNNING = "running"
export const CLASH_STATE_ERROR = "error"

export default class State {
  // 单例
  private static single: State = new State()


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

  public static instance(): State {
    return State.single
  }
}