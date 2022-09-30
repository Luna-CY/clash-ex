export interface CustomApi {
  actionStartClashService: () => Promise<string>
  actionStopClashService: () => Promise<string>
  actionRestartClashService: () => Promise<string>
  actionSetClashProxyMode: (title: string) => Promise<boolean>
  actionSetClashPort: (mixed: boolean, port: number, http: number, socks: number) => Promise<boolean>
  actionAddClashRule: (mode: string, value: string, proxy: string) => Promise<boolean>
  actionRemoveClashRule: (index: number) => Promise<boolean>
  queryClashServiceState: () => Promise<string>
  queryClashProxyMode: () => Promise<string>
}

declare global {
  interface Window {
    capi: CustomApi
  }
}