# DSA Tracker App

Local-first DSA roadmap tracker with a no-build React frontend and a tiny Express server.

All progress is saved to disk in `data/data.json`. There is no cloud sync, no login, and no external database.

## What This App Includes

- Roadmap-based problem tracking across fixed phases (setup -> revision).
- Three main sections in UI: Overview, Analysis, Problems.
- Status workflow: not-started, attempted, solved, revisit.
- Difficulty tracking and topic/pattern grouping.
- Problem descriptions and inferred "Problem intent" (from JSON-configured rules).
- Study timer presets: 5, 10, 30, 45, 60 minutes.
- Revision queue and due-review logic.
- Activity history and milestone snapshots in metadata.
- Keyboard-friendly local workflow with instant persistence.

## UX Style and Experience

This app uses a high-contrast, neobrutalist-inspired UX with a productivity-first interaction model.

- Visual style:
  - Punchy color palette with strong contrast and clear section boundaries.
  - Bold typography and explicit labels for fast scanning.
  - Card-driven layout for dashboard blocks, topic groups, and problem rows.
- Interaction style:
  - Summary-first problem cards with details on demand.
  - One-click status flow for quick progress updates.
  - Inline edits for pattern, company, and notes to reduce context switching.
  - Immediate local persistence to avoid lost work.
- Usability goals:
  - Optimize for daily repetition and rapid review cycles.
  - Keep core actions obvious and low-friction.
  - Surface next actions (due reviews, weak patterns, planned session items) instead of passive reporting.

In short, the UX is intentionally opinionated: visually bold, operationally fast, and tuned for focused DSA practice rather than generic task tracking.

## Tech Stack

- Node.js (CommonJS, Node >= 20)
- Express server
- React + ReactDOM (loaded from local `node_modules` via static routes)
- Babel Standalone in browser (`type="text/babel"` frontend)
- Single-page frontend in one file: `public/index.html`

## Quick Start

```bash
npm install
npm start
```

Open `http://localhost:4321`.

## Scripts

- `npm start` - starts the Express server (`server.js`).

## Project Structure

```text
.
|- package.json
|- server.js
|- data/
|  \- data.json
\- public/
   \- index.html
```

## Runtime Architecture

### Backend (`server.js`)

- Serves static frontend from `public/`.
- Serves local vendor assets:
  - `/vendor/react` -> React UMD
  - `/vendor/react-dom` -> ReactDOM UMD
  - `/vendor` -> Babel Standalone
- Provides JSON API:
  - `GET /api/data` -> returns full tracker object
  - `PUT /api/data` -> full replacement write to disk

### Frontend (`public/index.html`)

- Entire app logic, state, and UI in one file.
- Loads/saves full state object from/to `/api/data`.
- Normalizes incoming data for backward compatibility and integrity fixes.

## Data Source of Truth

`data/data.json` is the only persisted user state.

Important behavior:

- Writes are full-object replacement (not per-field patch).
- If `data.json` is unreadable or malformed on server startup, server falls back to an empty dataset shape.
- Keep JSON valid when hand-editing.

## Data Model

Top-level shape:

```json
{
  "phases": {
    "setup": [],
    "arrays": [],
    "twoptr": [],
    "binsearch": [],
    "strings": [],
    "linkedlist": [],
    "stacks": [],
    "recursion": [],
    "trees": [],
    "heaps": [],
    "graphs": [],
    "dp": [],
    "greedy": [],
    "trie-bits": [],
    "revision": []
  },
  "meta": {
    "milestones": [],
    "activityLog": [],
    "problemIntentRules": []
  }
}
```

### Problem Item Fields (current schema)

Common fields you will see on each problem:

- Identity: `id`, `canonicalProblemId`, `name`, `link`
- Taxonomy: `pattern`, `company`, `difficulty`
- Workflow: `status`, `unaided`, `solutionType`
- Learning content: `description`, `notes`, `hints`
- Optional reflection fields: `learningGoal`, `triggerQuestion`, `pitfall`
- Timing/review: `createdAt`, `lastAttemptAt`, `solvedAt`, `revisitAt`, `firstAcceptedAt`, `nextReviewAt`
- Metrics: `attemptsCount`, `reviewIntervalDays`, `easeScore`, `struggledMinutes`
- Audit trail: `history` (array of event entries)

### Metadata Fields (`meta`)

- `milestones`: periodic snapshot objects used by dashboard trend views.
- `activityLog`: recent global actions/events.
- `problemIntentRules`: keyword rules used to infer and display problem intent text in UI.

## Allowed Values and Conventions

- Status values: `not-started`, `attempted`, `solved`, `revisit`
- Difficulty values: `Easy`, `Medium`, `Hard`
- `history` should be an array
- Timestamps are epoch milliseconds (`Date.now()` style)

## Hand-Editing Data Safely

1. Stop the server.
2. Edit `data/data.json`.
3. Ensure valid JSON.
4. Start the server again.

Recommended validation:

```bash
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('data/data.json','utf8')); console.log('data.json ok');"
```

## Port Configuration

Default port is `4321`.

Set a different port:

- PowerShell:

```powershell
$env:PORT=5000
npm start
```

- CMD:

```cmd
set PORT=5000&& npm start
```

## Backup and Restore

- Backup: copy `data/data.json`
- Restore: replace `data/data.json` with your backup (server stopped), then restart.

## Troubleshooting

- App starts but data looks empty:
  - Check JSON validity of `data/data.json`.
  - Confirm file path and restart server.
- Manual edits disappear:
  - You edited while app was running; UI state overwrote disk on next save.
  - Stop server before manual edits.
- Port already in use:
  - Use `PORT` env override and restart.

## Design Intent

This app is intentionally local and simple:

- no build tooling required for frontend
- no auth
- no cloud dependencies
- transparent, editable JSON data
