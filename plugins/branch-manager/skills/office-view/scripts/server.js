// Office View (office plugin) — local, read-only live feed of an Office of Claude Code sessions.
// Config (env): OFFICE_BOSS_ID (Michael's session id; default: newest session titled 'Michael · …'),
//   OFFICE_HIDE (comma-separated session ids to never show), OFFICE_OWNER (owner's first name),
//   OFFICE_NAME (sign in reception, e.g. 'Acme Corp'), OFFICE_DATA_DIR (where needs-owner.json / gossip.json live), PORT.
// Reads the desktop app's session metadata + each session's CLI transcript tail.
// Never writes anywhere, never messages anyone. Run: node server.js  → http://localhost:4747
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = +process.env.PORT || 4747;
const DATA_DIR = process.env.OFFICE_DATA_DIR || process.cwd();
const OWNER = process.env.OFFICE_OWNER || 'Owner';
const OFFICE_NAME = (process.env.OFFICE_NAME || 'The Office View').toUpperCase();
const HOME = os.homedir();
const META_ROOT = path.join(HOME, 'Library/Application Support/Claude/claude-code-sessions');
const PROJECTS = path.join(HOME, '.claude/projects');
let MICHAEL = process.env.OFFICE_BOSS_ID || null; // resolved in state() when not set
// Sessions that must never appear (the owner's private session).
const HIDDEN = new Set((process.env.OFFICE_HIDE || '').split(',').map(x => x.trim()).filter(Boolean));
const TAIL_BYTES = 600 * 1024;

function safeDir(d) { try { return fs.readdirSync(d); } catch { return []; } }
function walkMeta() {
  const out = [];
  for (const a of safeDir(META_ROOT)) for (const b of safeDir(path.join(META_ROOT, a))) {
    const dir = path.join(META_ROOT, a, b);
    for (const f of safeDir(dir)) if (/^local_.*\.json$/.test(f)) out.push(path.join(dir, f));
  }
  return out;
}

const transcriptCache = new Map();
function findTranscript(cliId) {
  if (!cliId) return null;
  const hit = transcriptCache.get(cliId);
  if (hit && fs.existsSync(hit)) return hit;
  for (const p of safeDir(PROJECTS)) {
    const f = path.join(PROJECTS, p, cliId + '.jsonl');
    if (fs.existsSync(f)) { transcriptCache.set(cliId, f); return f; }
  }
  return null;
}

// Parsed-tail cache keyed by file+size so unchanged transcripts aren't re-parsed every poll.
const parseCache = new Map();
function readTail(file) {
  const st = fs.statSync(file);
  const key = file + ':' + st.size;
  const c = parseCache.get(file);
  if (c && c.key === key) return c.val;
  const len = Math.min(st.size, TAIL_BYTES);
  const fd = fs.openSync(file, 'r');
  const buf = Buffer.alloc(len);
  fs.readSync(fd, buf, 0, len, st.size - len);
  fs.closeSync(fd);
  const lines = buf.toString('utf8').split('\n');
  if (st.size > len) lines.shift();
  const objs = [];
  for (const l of lines) { if (!l) continue; try { objs.push(JSON.parse(l)); } catch {} }
  const val = { objs, mtime: st.mtimeMs };
  parseCache.set(file, { key, val });
  return val;
}


// Full-day message index: scans each transcript incrementally (only new bytes), keeping SendMessage events.
const msgIndex = new Map(); // file -> {offset, msgs:[{ts,to}]}
function dayMessages(file) {
  let ix = msgIndex.get(file); if (!ix) { ix = { offset: 0, msgs: [] }; msgIndex.set(file, ix); }
  const size = fs.statSync(file).size;
  if (size < ix.offset) { ix.offset = 0; ix.msgs = []; }
  if (size > ix.offset) {
    const fd = fs.openSync(file, 'r'); const CH = 4 * 1024 * 1024; let carry = '';
    while (ix.offset < size) {
      const n = Math.min(CH, size - ix.offset), buf = Buffer.alloc(n);
      fs.readSync(fd, buf, 0, n, ix.offset);
      const text = carry + buf.toString('utf8'); const lines = text.split('\n'); carry = lines.pop();
      for (const l of lines) {
        if (!l.includes('"type":"assistant"') || !(l.includes('SendMessage') || l.includes('send_message'))) continue;
        try { const o = JSON.parse(l); const ts = Date.parse(o.timestamp) || 0;
          for (const c of o.message?.content || []) if (c.type === 'tool_use' && (c.name === 'SendMessage' || /send_message$/.test(c.name || '')) && (c.input?.to || c.input?.session_id)) ix.msgs.push({ ts, to: c.input.to || c.input.session_id });
        } catch {}
      }
      ix.offset += n - Buffer.byteLength(carry, 'utf8'); carry = '';
      if (n < CH) break;
    }
    fs.closeSync(fd);
  }
  return ix.msgs;
}

const clip = (s, n = 90) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const base = p => p ? path.basename(String(p)).replace(/\.(tsx?|jsx?|swift|md|json|html|css|py)$/, '') : '';
const plain = s => String(s || '').replace(/[*_`#>\[\]]/g, '').replace(/\(#?local_[^)]*\)/g, '').replace(/\s+/g, ' ').trim();
const firstSentence = s => { s = plain(s); const m = s.match(/^(.{8,}?[.!?])(\s|$)/); return m ? m[1] : s; };
const MILESTONE = /gh pr merge|git push|deploy|release|eas (build|submit)|gh workflow run|testflight|publish/i;

// Each event: kind (raw), cat (making|reading|talking|shipping), label (≤40 plain English), raw (verbatim, for the monitor).
function describeTool(name, input = {}, nameById) {
  const n = name || '';
  const L = (cat, kind, label, raw, extra = {}) => ({ cat, kind, label: clip(label, 40), raw: clip(raw, 160), ...extra });
  if (n === 'Edit' || n === 'Write' || n === 'NotebookEdit') return L('making', 'typing', `${n === 'Write' ? 'Writing' : 'Editing'} ${base(input.file_path)}`, `${n.toLowerCase()} ${input.file_path || ''}`);
  if (n === 'Read') return L('reading', 'reading', `Reading ${base(input.file_path)}`, `cat ${input.file_path || ''}`);
  if (n === 'Grep' || n === 'Glob') return L('reading', 'reading', 'Searching the code', `grep ${input.pattern || ''}`);
  if (n === 'Bash') {
    const c = String(input.command || '');
    const desc = input.description ? String(input.description) : (/^\s*(gh|git)\s/.test(c) ? 'Checking GitHub' : 'Running a command');
    const ship = MILESTONE.test(c) || MILESTONE.test(desc);
    return L(ship ? 'shipping' : 'making', /^\s*(gh|git)\s/.test(c) ? 'github' : 'terminal', desc, '$ ' + c, ship && /merge|deploy|release|submit|push/i.test(c) ? { milestone: true } : {});
  }
  if (n === 'SendMessage' || n.endsWith('send_message')) {
    const to = input.to || input.session_id || '';
    const toName = nameById[to] || (String(to).startsWith('local_') ? 'a teammate' : String(to).split(/\s*[·\[]/)[0].trim());
    return L('talking', 'talking', `Messaging ${toName}`, input.message || input.text || '', { to, toName, says: clip(firstSentence(String(input.message || '').replace(/^[\w ]{1,24}?(\s*(→|->)\s*[\w ]{1,24})?:\s*/, '')), 40) });
  }
  if (n === 'Agent') return L('making', 'delegating', 'Briefing a helper', input.description || '');
  if (/start_session/.test(n)) return L('shipping', 'hiring', `Hiring ${String(input.title || 'a teammate').split('·')[0].trim()}`, input.title || '', { milestone: true });
  if (n === 'Artifact') return L('shipping', 'presenting', 'Publishing a page', input.file_path || input.url || '', { milestone: true });
  if (n === 'WebSearch' || n === 'WebFetch') return L('reading', 'browsing', 'Researching online', input.query || input.url || '');
  if (/Browser|chrome|claude-in-chrome/.test(n)) return L('reading', 'browsing', 'Testing in the browser', n.replace(/^mcp__[^_]+__/, '') + ' ' + (input.url || input.action || ''));
  if (/wrap_up/.test(n)) return L('talking', 'wrapup', input.ask ? 'Asking ' + OWNER : 'Wrapping up', input.ask || input.recap || '', input.ask ? { ask: clip(plain(input.ask), 60) } : {});
  if (/list_sessions|get_session|list_events/.test(n)) return L('reading', 'reading', 'Checking on the team', n.replace(/^mcp__[^_]+__/, ''));
  if (/update_plan|ToolSearch|mark_chapter|show_pane|SendUserFile/.test(n)) return null; // noise
  if (/slack/i.test(n)) return L('talking', 'talking', 'On Slack', '');
  if (/gmail|calendar/i.test(n)) return L('reading', 'reading', 'In the inbox', '');
  return L('making', 'working', 'Working', n.replace(/^mcp__[^_]+__/, '').replace(/_/g, ' '));
}

function summarize(meta, nameById, now) {
  const file = findTranscript(meta.cliSessionId || meta.lastAssistantCliSessionId);
  const r = { events: [], all: [], lastText: '', mtime: meta.lastActivityAt || 0, tpm: 0, waiting: null };
  if (!file) return r;
  const { objs, mtime } = readTail(file);
  r.mtime = Math.max(mtime, r.mtime);
  let lastUserTs = 0;
  for (const o of objs) {
    const ts = Date.parse(o.timestamp) || 0;
    if (o.type === 'user' && typeof o.message?.content === 'string') lastUserTs = ts;
    if (o.type !== 'assistant' || !Array.isArray(o.message?.content)) continue;
    for (const c of o.message.content) {
      if (c.type === 'tool_use') {
        const d = describeTool(c.name, c.input, nameById);
        if (!d) continue;
        if (now - ts < 60_000) r.tpm++;
        r.all.push({ ts, ...d });
      } else if (c.type === 'text' && c.text?.trim()) {
        r.lastText = c.text;
        r.all.push({ ts, cat: 'talking', kind: 'saying', label: clip(firstSentence(c.text), 40), raw: clip(plain(c.text), 160) });
      }
    }
  }
  // Waiting on the owner: the last thing they did was ask a question in wrap_up, and nobody has written to them since.
  const last = r.all[r.all.length - 1];
  const lastWrap = [...r.all].reverse().find(e => e.kind === 'wrapup');
  if (lastWrap?.ask && lastWrap.ts >= (last?.ts || 0) - 15_000 && lastUserTs < lastWrap.ts) r.waiting = lastWrap.ask;
  r.events = r.all.slice(-14);
  return r;
}

// The owner's sign-off pile: read (never write) needs-owner.json from DATA_DIR.
// Shape: {"updated": ISO, "items": [{"title": "...", "detail": "..."}], "waitingOn": "..."}
function needsOwner() {
  for (const f of ['needs-owner.json']) {
    try {
      const fp = path.join(DATA_DIR, f), j = JSON.parse(fs.readFileSync(fp, 'utf8'));
      if (Array.isArray(j.items)) return { items: j.items.map(i => typeof i === 'string' ? i : String(i.title || '')).filter(Boolean), waitingOn: j.waitingOn || null, updated: Date.parse(j.updated) || fs.statSync(fp).mtimeMs };
    } catch {}
  }
  return null;
}

// Meredith's break-room gossip feed (she writes it; we only read it).
function gossip() {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'gossip.json'), 'utf8'));
    const lines = (Array.isArray(j.lines) ? j.lines : []).slice(0, 12).map(l => ({
      speaker: String(l.speaker || 'Meredith').slice(0, 40), with: String(l.with || '').slice(0, 40),
      text: String(l.text || '').replace(/\s+/g, ' ').trim().slice(0, 90), about: String(l.about || '').slice(0, 40),
    })).filter(l => l.text);
    return lines.length ? { updated: j.updated || null, lines } : null;
  } catch { return null; }
}

function personName(m) {
  const t = (m.title || '').split('·')[0].trim();
  return t || m.sessionId.slice(6, 12);
}

function state() {
  const metas = [];
  const allNames = {};
  const files = walkMeta();
  if (!process.env.OFFICE_BOSS_ID) { // newest live session titled "Michael · …"
    let best = null;
    for (const f of files) { try { const m = JSON.parse(fs.readFileSync(f, 'utf8')); if (!m.isArchived && /^Michael\s*·/.test(m.title || '') && (!best || (m.lastActivityAt || 0) > (best.lastActivityAt || 0))) best = m; } catch {} }
    MICHAEL = best ? best.sessionId : null;
  }
  for (const f of files) {
    try {
      const m = JSON.parse(fs.readFileSync(f, 'utf8'));
      allNames[m.sessionId] = personName(m);
      if (m.isArchived || HIDDEN.has(m.sessionId)) continue;
      const inOffice = m.sessionId === MICHAEL || m.startChain?.firstSessionId === MICHAEL || m.spawnedFrom?.sessionId === MICHAEL;
      if (inOffice) metas.push(m);
    } catch {}
  }
  const nameById = { ...allNames, [MICHAEL]: 'Michael' };
  const now = Date.now();
  const messages = [];
  const midnight = new Date().setHours(0, 0, 0, 0);
  const people = metas.map(m => {
    const s = summarize(m, nameById, now);
    const quiet = now - s.mtime;
    const status = quiet < 25_000 ? 'working' : quiet < 15 * 60_000 ? 'idle' : quiet < 3 * 3600_000 ? 'away' : 'asleep';
    const tf = findTranscript(m.cliSessionId || m.lastAssistantCliSessionId);
    if (tf) for (const e of dayMessages(tf)) if (e.ts >= midnight) messages.push({ ts: e.ts, from: m.sessionId, to: e.to });
    return {
      id: m.sessionId, name: nameById[m.sessionId], title: m.title || '',
      role: (m.title || '').split('·').slice(1).join('·').trim(),
      status, quietMs: quiet, lastActivity: s.mtime, tpm: s.tpm,
      waiting: status === 'working' ? null : s.waiting,
      current: s.events[s.events.length - 1] || null, events: s.events,
      lastReport: clip(firstSentence(m.lastTurnReport || s.lastText), 120),
      turns: m.completedTurns || 0, isBoss: m.sessionId === MICHAEL,
    };
  }).sort((a, b) => (b.isBoss - a.isBoss) || a.name.localeCompare(b.name));
  messages.sort((a, b) => a.ts - b.ts);
  return { now, people, messages: messages.slice(-1500), needsOwner: needsOwner(), gossip: gossip() };
}

http.createServer((req, res) => {
  // DNS-rebinding guard: on this-Mac-only mode, answer only requests addressed to localhost.
  if (process.env.OFFICE_VIEW_LAN !== '1' && !/^(localhost|127\.0\.0\.1):\d+$/.test(req.headers.host || '')) { res.writeHead(403); res.end('Forbidden'); return; }
  if (req.url.startsWith('/api/state')) {
    try { const body = JSON.stringify(state()); res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(body); }
    catch (e) { res.writeHead(500); res.end(String(e)); }
    return;
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
  const words = OFFICE_NAME.split(/\s+/), half = Math.ceil(words.length / 2);
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')
    .split("__OWNER_UC__").join(OWNER.toUpperCase()).split("__OWNER__").join(OWNER)
    .replace("'__NAME1__'", JSON.stringify(words.slice(0, half).join(' '))).replace("'__NAME2__'", JSON.stringify(words.slice(half).join(' ')));
  res.end(html);
}).listen(PORT, process.env.OFFICE_VIEW_LAN === '1' ? '0.0.0.0' : '127.0.0.1', () => console.log(`Office View on http://localhost:${PORT}`));
