# Copilot Instructions

## Project Overview

This repository is a small local-only DSA roadmap tracker.

- `server.js` runs a tiny Express server on port `4321` by default.
- `public/index.html` contains the entire frontend in one HTML file with inline CSS and React/Babel in the browser.
- `data/data.json` is the source of truth for user progress and is written directly to disk.

## Working Rules

- Keep changes minimal and focused on the existing architecture.
- Preserve the no-build setup unless the user explicitly asks for a framework or bundler change.
- Prefer plain CommonJS on the server side to match the current codebase.
- Treat `data/data.json` as user data; avoid rewriting it unless the task explicitly involves data changes.
- If you need to hand-edit `data/data.json`, stop the server first, then restart it after saving.

## Frontend Guidance

- Keep the single-file HTML structure intact unless there is a strong reason to split it.
- Use the current visual style and palette already defined in `public/index.html`.
- Avoid introducing extra dependencies for UI changes when native HTML, CSS, or the existing React setup is enough.
- Maintain the current local, offline-first behavior.

## Backend Guidance

- Preserve the full-replacement `PUT /api/data` flow unless the task requires a different persistence model.
- Validate incoming data defensively and keep the on-disk JSON pretty-printed.
- Do not introduce cloud sync, auth, or login flows unless explicitly requested.

## Data Shape

- Data lives under a top-level `phases` object.
- Phase keys are fixed by the app and should remain stable unless the roadmap itself changes.
- Keep status and difficulty values consistent with the existing UI labels.
