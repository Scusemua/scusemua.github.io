#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
node build.mjs
mkdir -p ../public/orbital
cp dist/index.html ../public/orbital/index.html
echo "Done — public/orbital/index.html updated."
