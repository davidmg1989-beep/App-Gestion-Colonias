const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../data/colonias.db');

// Ensure directory exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(dbPath);

// Create tables if they don't exist
db.prepare(`
CREATE TABLE IF NOT EXISTS colonies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  lat REAL,
  lng REAL,
  feederName TEXT,
  feederPhone TEXT,
  createdAt TEXT,
  updatedAt TEXT
);
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS cats (
  id TEXT PRIMARY KEY,
  colonyId TEXT,
  name TEXT,
  gender TEXT,
  age TEXT,
  isSterilized INTEGER DEFAULT 0,
  isChipped INTEGER DEFAULT 0,
  chipNumber TEXT,
  description TEXT,
  diseases TEXT,
  createdAt TEXT,
  updatedAt TEXT,
  FOREIGN KEY(colonyId) REFERENCES colonies(id)
);
`).run();

db.pragma('journal_mode = WAL');

module.exports = db;
