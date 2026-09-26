import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DEFAULT_BASE_URL, DEFAULT_MODEL, type LagsenseConfig } from "@/lib/ai";
import { CheckCircle2 } from "lucide-react";

interface SettingsPanelProps {
  onSaved: (config: LagsenseConfig) => void;
}

export function SettingsPanel({ onSaved }: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.lagsense.getCredentials().then((creds) => {
      if (creds) {
        setApiKey(creds.apiKey);
        setBaseUrl(creds.baseUrl);
        setModel(creds.model);
      }
    });
  }, []);

  async function handleSave() {
    const config = { apiKey, baseUrl, model };
    await window.lagsense.setCredentials(config);
    onSaved(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Model settings</CardTitle>
        <CardDescription>
          Ships pointed at OpenAI by default. Switch the base URL to use other compatible models,key stays local either way.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">API key</label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="gsk_... or sk-..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Base URL</label>
          <Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Model</label>
          <Input value={model} onChange={(e) => setModel(e.target.value)} />
        </div>
        <Button onClick={handleSave} disabled={!apiKey}>
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Saved
            </>
          ) : (
            "Save"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
