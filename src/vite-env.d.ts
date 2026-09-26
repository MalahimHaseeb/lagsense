/// <reference types="vite/client" />

interface LagsenseCredentials {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface LagsenseLogEntry {
  id: string;
  timestamp: string;
  snapshot: string;
  result: string;
}

interface LagsenseAPI {
  getCredentials(): Promise<LagsenseCredentials | null>;

  setCredentials(
    data: LagsenseCredentials
  ): Promise<boolean>;

  getLogs(): Promise<LagsenseLogEntry[]>;

  appendLog(
    entry: Omit<LagsenseLogEntry, "id" | "timestamp">
  ): Promise<LagsenseLogEntry>;

  clearLogs(): Promise<boolean>;
}

interface Window {
  lagsense: LagsenseAPI;
}