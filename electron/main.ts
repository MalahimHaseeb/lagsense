import { app, BrowserWindow, ipcMain, safeStorage } from "electron";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 780,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#0a0a0f",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

function credentialsPath() {
  return path.join(app.getPath("userData"), "credentials.bin");
}

function logsPath() {
  return path.join(app.getPath("userData"), "logs.json");
}

interface LogEntry {
  id: string;
  timestamp: string;
  snapshot: string;
  result: string;
}

function readLogs(): LogEntry[] {
  try {
    const raw = fs.readFileSync(logsPath(), "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLogs(logs: LogEntry[]) {
  fs.mkdirSync(path.dirname(logsPath()), { recursive: true });
  fs.writeFileSync(logsPath(), JSON.stringify(logs, null, 2));
}

ipcMain.handle("lagsense:get-logs", () => {
  return readLogs();
});

ipcMain.handle("lagsense:append-log", (_event, entry: Omit<LogEntry, "id" | "timestamp">) => {
  const logs = readLogs();
  const newEntry: LogEntry = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  logs.unshift(newEntry);
  const trimmed = logs.slice(0, 200);
  writeLogs(trimmed);
  return newEntry;
});

ipcMain.handle("lagsense:clear-logs", () => {
  writeLogs([]);
  return true;
});

ipcMain.handle("lagsense:get-credentials", () => {
  try {
    const raw = fs.readFileSync(credentialsPath());
    if (!safeStorage.isEncryptionAvailable()) return null;
    const decrypted = safeStorage.decryptString(raw);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
});

ipcMain.handle("lagsense:set-credentials", (_event, data: { apiKey: string; baseUrl: string; model: string }) => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error("OS-level secure storage is not available on this machine.");
  }
  const encrypted = safeStorage.encryptString(JSON.stringify(data));
  fs.mkdirSync(path.dirname(credentialsPath()), { recursive: true });
  fs.writeFileSync(credentialsPath(), encrypted);
  return true;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.whenReady().then(createWindow);