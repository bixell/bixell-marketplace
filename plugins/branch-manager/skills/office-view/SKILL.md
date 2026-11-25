---
name: office-view
description: Start the Office View — a live, read-only pixel-art office (phone/TV friendly) showing Michael and every agent he started at work, walking to deliver messages, shipping at the copier, napping in the lounge, plus the owner's sign-off pile and break-room gossip from real activity. Use when the owner wants to watch the office, runs /office-view, or asks for a live visual of the agents. Claude desktop app on macOS only.
---

# Office View

A zero-dependency Node server (`scripts/server.js`) plus one page (`scripts/index.html`).

The server only **reads**:
- the desktop app's session metadata in `~/Library/Application Support/Claude/claude-code-sessions`;
- each session's transcript tail in `~/.claude/projects`.

It never writes anything, and it never messages anyone.

## Start it

1. Work out the settings:
   | Variable | What it is | Default |
   |---|---|---|
   | `OFFICE_OWNER` | The owner's first name, shown as "needs Sam" and "SAM ▼" on the door | `Owner` |
   | `OFFICE_NAME` | The reception sign, e.g. `Acme Paper Co` | `The Office View` |
   | `OFFICE_BOSS_ID` | Michael's session id | the newest live session titled `Michael · …` |
   | `OFFICE_HIDE` | Comma-separated session ids to never show (e.g. the owner's private session) | none |
   | `OFFICE_DATA_DIR` | Folder holding `needs-owner.json` and `gossip.json` | the office notes folder |
   | `PORT` | Server port | `4747` |
   | `OFFICE_VIEW_LAN` | `1` opens it to the Wi-Fi (phone or TV). Off by default. | unset (this Mac only) |
2. Run it in the background (never in the foreground):
   ```bash
   OFFICE_OWNER=Sam OFFICE_NAME="Acme Paper Co" OFFICE_DATA_DIR="<notes folder>" node "${CLAUDE_PLUGIN_ROOT}/skills/office-view/scripts/server.js"
   ```
3. Links to give the owner:
   - on the Mac: `http://localhost:4747`. By default the server listens on this Mac only.
   - on a phone or TV: only if the owner says yes, after you tell them it shows names, tasks and message snippets from their sessions to anyone on the same Wi-Fi. Restart it with `OFFICE_VIEW_LAN=1`, then give them `http://<Mac's LAN IP>:4747` (`ipconfig getifaddr en0`). Also tell them that Wi-Fi mode has no password and shows up to 160 characters of each command, and commands can contain secrets. Never do this on shared or public Wi-Fi.
   - Privacy note: the page loads its two fonts from Google Fonts, so every device that opens it contacts Google.
4. Optional URL parameters:
   - `?hour=18` previews golden hour; `?hour=23` previews night;
   - `?tv=1` forces the TV layout.

## Who appears

Michael, and every session started from Michael's session, whether directly or down the chain. Archived sessions and `OFFICE_HIDE` ids never appear.

## Feeding it

- **Sign-off pile on Michael's desk.** Whoever keeps the owner's list (Pam, or the dashboard keeper) writes `needs-owner.json` in `OFFICE_DATA_DIR`:
  ```json
  {"updated": "<ISO time>", "items": [{"title": "Approve the prod deploy", "detail": "…"}], "waitingOn": "…"}
  ```
  The pile shows one sheet per item, and tapping it lists them.
- **Gossip.** Meredith, if hired, may write `gossip.json`:
  ```json
  {"updated": "<ISO time>", "lines": [{"speaker": "Meredith", "with": "Jim", "text": "…"}]}
  ```
  The file is optional. Without it, Meredith gossips only from real activity: reports, ships, who messaged whom, and the pile.

## What the scene means (keep it truthful)

| On screen | Means |
|---|---|
| Seated or standing at a work spot | active recently |
| Break room | away (quiet 15 min – 3 h) |
| Lounge couch | asleep (quiet over 3 h) |
| Queue at the front door with 📞 | waiting on the owner |
| Walking with ✉️ | a real SendMessage, delivered |
| Copier, 🔔 and confetti | a real ship: merge, push, deploy or release |

Ambient motion (coffee runs, turning heads) is decoration and never claims anything about the work.
