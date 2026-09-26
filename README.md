# Lagsense

A desktop app that reads your system's health and explains what's wrong in plain English, built with Electron, React, TypeScript, and Tailwind CSS.

Lagsense uses the OpenAI SDK under the hood, defaulting to real OpenAI's endpoint, but it's a stock OpenAI-compatible client, so it works against any OpenAI-compatible provider by changing the base URL in Settings.

## Status

Early scaffold. The diagnosis flow currently sends a placeholder system snapshot to the model, real metric collection (CPU, RAM, disk, `journalctl`/`dmesg` on Linux, equivalents on Windows) isn't wired up yet.

## Features

* API key, base URL, and model configurable from an in-app Settings screen
* Defaults to real OpenAI's endpoint, switchable to any OpenAI-compatible provider
* API key stored via Electron's `safeStorage` (OS-level encryption), never `localStorage`
* One-click system diagnosis with a plain-English explanation
* Persistent local diagnosis history
* Clear logs option
* Light and dark themes via CSS variable tokens (OKLCH)
* Desktop application for Linux, Windows, and macOS
* Typed Electron IPC between the renderer and main process

## Tech Stack

* Electron
* vite-plugin-electron
* React
* TypeScript
* Tailwind CSS
* Vite
* Electron Builder
* OpenAI SDK

## Downloads

Download the latest version from the [GitHub Releases](https://github.com/MalahimHaseeb/lagsense/releases) page.

### Linux

Two Linux packages are provided:

* `.AppImage` for a portable installation
* `.deb` for Debian and Ubuntu based distributions

For Ubuntu or Debian, download the `.deb` package from the latest GitHub Release and install it with:

```bash
sudo apt install ./lagsense-0.1.0.deb
```

The AppImage can be downloaded and launched directly:

```bash
chmod +x lagsense-0.1.0.AppImage
./lagsense-0.1.0.AppImage
```

### Windows

Download the Windows installer from the latest GitHub Release and run it.

### macOS

Download the `.dmg` file from the latest GitHub Release, open it, and move Lagsense to the Applications folder.

## Development

### Requirements

* Node.js 20+
* npm 10+

### Install dependencies

```bash
npm install
```

### Set up environment (optional)

```bash
cp .env.example .env
```

Only affects the default base URL/model shown in Settings on first launch. Not required, the app falls back to real OpenAI's endpoint if this is skipped.

### Start development

```bash
npm run dev
```

### Type check

```bash
npm run lint
```

### Build the application

```bash
npm run build
```

## Production Builds

```bash
npm run dist
```

Builds without publishing. Outputs to `release/`.

```bash
npm run release
```

Builds and publishes to GitHub Releases, requires `GH_TOKEN`, normally run by CI rather than locally.

## Project Structure

```text
electron/
├── main.ts
└── preload.ts
src/
├── components/
│   ├── ui/
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── DiagnosePanel.tsx
│   ├── LogsPanel.tsx
│   ├── SettingsPanel.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── ai.ts
│   └── utils.ts
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

## Branch Strategy

* `main` — always deployable, only receives merges from `developer`, tagging a commit here (`vX.Y.Z`) triggers the release workflow
* `developer` — integration branch, feature branches merge here first
* `feature/<name>` — one branch per feature or fix, branched off `developer`

```
feature/xyz  →  developer  →  main  →  (tag) → GitHub Release
```

See `CONTRIBUTING.md` for the full workflow.

## Release Process

Releases are built automatically through GitHub Actions.

Creating a version tag triggers native builds for:

* Linux
* Windows
* macOS

The resulting installers are automatically attached to the GitHub Release. Build logs are attached as workflow artifacts on every run, pass or fail.

## Repository

GitHub Repository: `github.com/MalahimHaseeb/lagsense`

## License

MIT
