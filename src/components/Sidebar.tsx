import { useEffect, useState } from "react";
import {
  Activity,
  Settings,
  Terminal,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type View = "diagnose" | "logs" | "settings";

interface SidebarProps {
  active: View;
  onNavigate: (view: View) => void;
}

const items: {
  id: View;
  label: string;
  icon: typeof Activity;
}[] = [
  {
    id: "diagnose",
    label: "Diagnose",
    icon: Activity,
  },
  {
    id: "logs",
    label: "Logs",
    icon: Terminal,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

export function Sidebar({
  active,
  onNavigate,
}: SidebarProps) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("lagsense-theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);

    localStorage.setItem(
      "lagsense-theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  return (
    <aside className="flex w-56 flex-col border-r border-sidebar-border bg-sidebar p-3">
      <div className="mb-4 px-2 pt-1">
        <span className="text-sm font-semibold text-sidebar-foreground">
          Lagsense
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors",
              "hover:bg-sidebar-accent",
              active === id &&
                "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-auto border-t border-sidebar-border pt-3">
        <button
          onClick={() => setDark((value) => !value)}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
        >
          <span className="flex items-center gap-2">
            {dark ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}

            {dark ? "Dark mode" : "Light mode"}
          </span>

          <span
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              dark
                ? "bg-primary"
                : "bg-secondary"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                dark
                  ? "translate-x-4"
                  : "translate-x-0.5"
              )}
            />
          </span>
        </button>
      </div>
    </aside>
  );
}