$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
node build.mjs
if (-not (Test-Path ../public/orbital)) { New-Item -ItemType Directory -Force ../public/orbital | Out-Null }
Copy-Item dist/index.html ../public/orbital/index.html
Write-Host "Done - public/orbital/index.html updated."
