import * as path from "path";

export default class Config {
  // 单例
  private static single = new Config()

  // 用户主目录
  private home: string = process.env.HOME || process.env.USERPROFILE

  // 应用根目录，用于存放应用必须的一些文件，不可被用户替换
  private _root: string = path.join(this.home, ".clash-ex")

  // 私有构造函数
  private constructor() {}

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

  public static instance(): Config {
    return Config.single
  }
}