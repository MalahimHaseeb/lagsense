#!/usr/bin/env bash

set -e

npm run build

echo "Fixing Electron sandbox permissions..."

chmod 4755 node_modules/electron/dist/chrome-sandbox

rm -rf release/linux-unpacked

npx electron-builder --linux --publish never

echo "Checking packaged sandbox..."

ls -l release/linux-unpacked/chrome-sandbox

dpkg-deb -c release/*.deb | grep chrome-sandbox