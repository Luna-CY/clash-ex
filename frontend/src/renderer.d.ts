export interface CustomApi {
    setTitle: (title: string) => void
}

declare global {
    interface Window {
        capi: CustomApi
    }
}