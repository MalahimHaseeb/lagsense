import { useEffect, useState } from "react";
import { Sidebar, type View } from "@/components/Sidebar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { DiagnosePanel } from "@/components/DiagnosePanel";
import { LogsPanel } from "@/components/LogsPanel";
import type { LagsenseConfig } from "@/lib/ai";

export default function App() {
  const [view, setView] = useState<View>("diagnose");
  const [config, setConfig] = useState<LagsenseConfig | null>(null);

  useEffect(() => {
    window.lagsense
      .getCredentials()
      .then((credentials) => {
        if (credentials) {
          setConfig(credentials);
        }
      })
      .catch((error) => {
        console.error(
          "Failed to load credentials:",
          error
        );
      });
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        active={view}
        onNavigate={setView}
      />

      <main className="flex-1 overflow-y-auto p-6">
        {view === "diagnose" && (
          <DiagnosePanel config={config} />
        )}

        {view === "logs" && <LogsPanel />}

        {view === "settings" && (
          <SettingsPanel onSaved={setConfig} />
        )}
      </main>
    </div>
  );
}