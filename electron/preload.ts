import { contextBridge, ipcRenderer } from "electron";

export interface LagsenseCredentials {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface LagsenseLogEntry {
  id: string;
  timestamp: string;
  snapshot: string;
  result: string;
}

contextBridge.exposeInMainWorld("lagsense", {
  getCredentials: (): Promise<LagsenseCredentials | null> =>
    ipcRenderer.invoke("lagsense:get-credentials"),

  setCredentials: (data: LagsenseCredentials): Promise<boolean> =>
    ipcRenderer.invoke("lagsense:set-credentials", data),

  getLogs: (): Promise<LagsenseLogEntry[]> =>
    ipcRenderer.invoke("lagsense:get-logs"),

  appendLog: (
    entry: Omit<LagsenseLogEntry, "id" | "timestamp">
  ): Promise<LagsenseLogEntry> =>
    ipcRenderer.invoke("lagsense:append-log", entry),

  clearLogs: (): Promise<boolean> =>
    ipcRenderer.invoke("lagsense:clear-logs"),
});