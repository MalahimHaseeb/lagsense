import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Terminal } from "lucide-react";

export function LogsPanel() {
  const [logs, setLogs] = useState<LagsenseLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLogs() {
    setLoading(true);
    const entries = await window.lagsense.getLogs();
    setLogs(entries);
    setLoading(false);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  async function handleClear() {
    await window.lagsense.clearLogs();
    setLogs([]);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          Diagnosis history
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={logs.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          Clear logs
        </Button>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

        {!loading && logs.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No diagnoses run yet. Results show up here after you run one.
          </p>
        )}

        {!loading && logs.length > 0 && (
          <div className="flex flex-col gap-3">
            {logs.map((entry) => (
              <div
                key={entry.id}
                className="rounded-md border border-border bg-secondary p-3 text-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline">
                    {new Date(entry.timestamp).toLocaleString()}
                  </Badge>
                </div>
                <p className="mb-1 text-xs text-muted-foreground">{entry.snapshot}</p>
                <p className="leading-relaxed">{entry.result}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}