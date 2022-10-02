export interface CustomApi {
  actionStartClashService: () => Promise<string>
  actionStopClashService: () => Promise<string>
  actionRestartClashService: () => Promise<string>
  actionSetClashProxyMode: (title: string) => Promise<boolean>
  actionSetClashPort: (mixed: number, http: number, socks: number) => Promise<boolean>
  actionAddClashRule: (index: number, type: string, value: string, proxy: string) => Promise<boolean>
  actionRemoveClashRule: (index: number) => Promise<boolean>
  actionSetSystemProxy: (network: string, type: string, checked: boolean) => Promise<boolean>
  queryClashServiceState: () => Promise<string>
  queryClashProxyMode: () => Promise<string>
  queryClashRules: () => Promise<{ [key: string]: string }[]>
  queryClashPorts: () => Promise<{ [key: string]: string }>
  querySystemNetworks: () => Promise<string[]>
  querySystemHttpProxy: () => Promise<{ [key: string]: boolean }>
  querySystemHttpsProxy: () => Promise<{ [key: string]: boolean }>
  querySystemSocksProxy: () => Promise<{ [key: string]: boolean }>
}

declare global {
  interface Window {
    capi: CustomApi
  }
}