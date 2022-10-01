import * as path from "path";
import * as fs from "fs";

export default class Config {
  // 单例
  private static single = new Config()

  // 私有构造函数
  private constructor() {
  }

  // 默认值将在应用main方法调用时替换为用户主目录
  private _name: string = ""

  // @ts-ignore
  get name(): string {
    return this._name;
  }

  // @ts-ignore
  set name(value: string) {
    this._name = value;
  }

  // 用户主目录
  // 默认值将在应用main方法调用时替换为用户主目录
  private _home: string = process.env.HOME || process.env.USERPROFILE

  // @ts-ignore
  get home(): string {
    return this._home;
  }

  // @ts-ignore
  set home(value: string) {
    fs.mkdirSync(value, {recursive: true})

    this._home = value;

    // 修改配置目录
    this.config = value
  }

  // 应用根目录，用于存放应用必须的一些文件，不可被用户替换
  // 默认值将在应用main方法调用时替换为应用数据目录
  private _root: string = path.join(this._home, "." + this.name)

  // @ts-ignore
  get root(): string {
    return this._root;
  }

  // @ts-ignore
  set root(value: string) {
    fs.mkdirSync(value, {recursive: true})

    this._root = value;
  }

  // 配置加载目录，加载clash配置的目录，可以被用户替换
  private _config: string = this.home

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