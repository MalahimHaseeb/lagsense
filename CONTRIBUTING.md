# Contributing

## Branches

- `main` — production. Protected, no direct commits. Only `developer` merges in here.
- `developer` — integration branch, default target for PRs.
- `feature/<short-name>` — cut from `developer` for any new feature or fix.

## Workflow

```bash
git checkout developer
git pull
git checkout -b feature/system-metrics-collector

# ...work...

git push origin feature/system-metrics-collector
# open PR into developer
```

Once `developer` is stable and ready to ship:

```bash
git checkout main
git merge developer
git push origin main
git tag v0.2.0
git push origin v0.2.0
```

The tag push triggers `.github/workflows/release.yml`, which builds installers for all three platforms and attaches them to a new GitHub Release automatically.

## Code style

- No comments in code (project preference, keep names and structure self-explanatory instead).
- UI components live in `src/components/ui`, follow the existing pattern (forwardRef, `cn()` for class merging, variant maps instead of pulling in `class-variance-authority`).
- Anything touching the filesystem, OS metrics, or credentials belongs in `electron/main.ts` behind an `ipcMain` handler, never accessed directly from the renderer.
