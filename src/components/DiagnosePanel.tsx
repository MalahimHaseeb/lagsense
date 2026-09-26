import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, TriangleAlert } from "lucide-react";
import { diagnose, type LagsenseConfig } from "@/lib/ai";

interface DiagnosePanelProps {
  config: LagsenseConfig | null;
}

export function DiagnosePanel({ config }: DiagnosePanelProps) {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDiagnose() {
    if (!config) return;
    setLoading(true);
    setError(null);
    try {
      const snapshot = "CPU: 42% avg. RAM: 6.1/16GB. No thermal throttling. Disk: healthy.";
      const response = await diagnose(config, snapshot);
      setResult(response);
      await window.lagsense.appendLog({ snapshot, result: response });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            System diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!config && (
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground">
              <TriangleAlert className="h-4 w-4 shrink-0" />
              Add an API key in Settings first.
            </div>
          )}
          <Button onClick={handleDiagnose} disabled={!config || loading} className="w-fit">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Analyzing..." : "Run diagnosis"}
          </Button>
          {error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {result && (
            <div className="rounded-md border border-border bg-secondary p-4 text-sm leading-relaxed">
              <Badge variant="secondary" className="mb-2">
                Lagsense
              </Badge>
              <p>{result}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}