const sqlite3 = require("sqlite3").verbose()
const path = require('path')

const db = new sqlite3.Database(path.resolve(__dirname, './callyn.db'));

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    password TEXT
  )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS phones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    phone_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS assistants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    assistant_id TEXT,
    name TEXT,
    voice TEXT,
    model TEXT,
    instructions TEXT,
    industry TEXT,
    business_name TEXT,
    target_audience TEXT,
    main_goal TEXT,
    custom_script TEXT,
    speaking_speed REAL,
    enthusiasm INTEGER,
    use_small_talk INTEGER,
    handle_objections INTEGER,
    tone TEXT,
    formality TEXT,
    scriptMethod TEXT,
    websiteUrl TEXT,
    uploadedFile TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP  -- When the call was initiated
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    assistant_id TEXT NOT NULL,
    campaign_id TEXT NOT NULL,
    lead_name, TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    number TEXT NOT NULL,
    status TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    assistant_id TEXT NOT NULL,
    call_id TEXT NOT NULL
  )
`)

module.exports = db