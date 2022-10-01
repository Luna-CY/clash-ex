import {contextBridge, ipcRenderer} from "electron"

contextBridge.exposeInMainWorld("capi", {
  queryClashServiceState: async () => {
    return await ipcRenderer.invoke("query-clash-service-state")
  },
  queryClashProxyMode: async () => {
    return await ipcRenderer.invoke("query-clash-proxy-mode")
  },
  querySystemNetworks: async () => {
    return await ipcRenderer.invoke("query-system-networks")
  },
  querySystemHttpProxy: async () => {
    return await ipcRenderer.invoke("query-system-http-proxy")
  },
  querySystemHttpsProxy: async () => {
    return await ipcRenderer.invoke("query-system-https-proxy")
  },
  querySystemSocksProxy: async () => {
    return await ipcRenderer.invoke("query-system-socks-proxy")
  },
  actionStartClashService: async () => {
    return await ipcRenderer.invoke("action-start-clash-service")
  },
  actionStopClashService: async () => {
    return await ipcRenderer.invoke("action-stop-clash-service")
  },
  actionRestartClashService: async () => {
    return await ipcRenderer.invoke("action-restart-clash-service")
  },
  actionSetClashProxyMode: async (mode: string) => {
    return await ipcRenderer.invoke("action-set-clash-proxy-mode", mode)
  },
  actionSetClashPort: async (mixed: number, http: number, socks: number) => {
    return await ipcRenderer.invoke("action-set-clash-port", mixed, http, socks)
  },
  actionAddClashRule: async (mode: string, value: string, proxy: string) => {
    return await ipcRenderer.invoke("action-add-clash-rule", mode, value, proxy)
  },
  actionRemoveClashRule: async (index: number) => {
    return await ipcRenderer.invoke("action-remove-clash-rule", index)
  },
  actionSetSystemProxy: async (network: string, type: string, checked: boolean) => {
    return await ipcRenderer.invoke("action-system-proxy", network, type, checked)
  },
})