import {ipcRenderer} from "electron"
import {contextBridge} from "electron"

contextBridge.exposeInMainWorld("capi", {
    setTitle: (title: string) => {
        ipcRenderer.send("set-title", title)
    },
})