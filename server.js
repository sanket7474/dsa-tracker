const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4321;
const DATA_PATH = path.join(__dirname, 'data', 'data.json');

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor/react', express.static(path.join(__dirname, 'node_modules', 'react', 'umd')));
app.use('/vendor/react-dom', express.static(path.join(__dirname, 'node_modules', 'react-dom', 'umd')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules', '@babel', 'standalone')));

// Default shape used if data.json is missing or unreadable on first boot.
const EMPTY_PHASES = [
  'setup', 'arrays', 'twoptr', 'binsearch', 'strings', 'linkedlist',
  'stacks', 'recursion', 'trees', 'heaps', 'graphs', 'dp', 'greedy',
  'trie-bits', 'revision'
];

function emptyData() {
  const phases = {};
  EMPTY_PHASES.forEach(id => { phases[id] = []; });
  return { phases };
}

function readData() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.phases) throw new Error('missing phases key');
    return parsed;
  } catch (err) {
    const fresh = emptyData();
    writeData(fresh);
    return fresh;
  }
}

function writeData(data) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

// GET current data
app.get('/api/data', (req, res) => {
  res.json(readData());
});

// PUT full replacement of data (the frontend sends the whole object after each edit —
// simplest way to guarantee the file on disk always matches what you see in the app)
app.put('/api/data', (req, res) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object' || !incoming.phases) {
    return res.status(400).json({ error: 'Expected { phases: {...} }' });
  }
  try {
    writeData(incoming);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`\n  DSA tracker running: http://localhost:${PORT}`);
  console.log(`  Data file: ${DATA_PATH}`);
  console.log(`  (stop the server before hand-editing that file, then restart)\n`);
});
