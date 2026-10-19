# Browser QA

Build the web app and serve its production output locally:

```powershell
corepack pnpm --filter @office/web build
corepack pnpm --filter @office/web exec vite preview --host 127.0.0.1
npm.cmd install --prefix apps/web/qa --cache apps/web/qa/.npm-cache --no-save --package-lock=false playwright
node apps/web/qa/smoke.mjs
```

Chrome must be installed at `C:\Program Files\Google\Chrome\Application\chrome.exe`. Set `OFFICE_QA_URL` to point the script at a different local web server, including `pnpm dev:web`. The script mocks every `/api/*` request and the team WebSocket in the browser. It reads the three checked-in team rosters and does not connect to the owner's backend. Screenshots go to ignored `qa/out/`.

`fixtures.mjs` uses protocol JSDoc types for the Office and Calendar payloads. The local SVG and one-second MP4 are placeholders for QA only.
