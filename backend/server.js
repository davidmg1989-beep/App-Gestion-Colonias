const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

// Helpers
function now() {
  return new Date().toISOString();
}

// CRUD Colonies
app.get('/api/colonies', (req, res) => {
  const rows = db.prepare('SELECT * FROM colonies ORDER BY name').all();
  res.json(rows);
});

app.get('/api/colonies/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM colonies WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

app.post('/api/colonies', (req, res) => {
  const id = `colony-${uuidv4()}`;
  const { name, description, lat, lng, feederName, feederPhone } = req.body;
  const nowTs = now();
  db.prepare('INSERT INTO colonies (id,name,description,lat,lng,feederName,feederPhone,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, name, description, lat, lng, feederName, feederPhone, nowTs, nowTs);
  const colony = db.prepare('SELECT * FROM colonies WHERE id = ?').get(id);
  res.status(201).json(colony);
});

app.put('/api/colonies/:id', (req, res) => {
  const id = req.params.id;
  const { name, description, lat, lng, feederName, feederPhone } = req.body;
  const nowTs = now();
  db.prepare('UPDATE colonies SET name=?,description=?,lat=?,lng=?,feederName=?,feederPhone=?,updatedAt=? WHERE id=?')
    .run(name, description, lat, lng, feederName, feederPhone, nowTs, id);
  const colony = db.prepare('SELECT * FROM colonies WHERE id = ?').get(id);
  res.json(colony);
});

// Cats
app.get('/api/cats', (req, res) => {
  const { colonyId } = req.query;
  if (colonyId) {
    const rows = db.prepare('SELECT * FROM cats WHERE colonyId = ?').all(colonyId);
    return res.json(rows);
  }
  const rows = db.prepare('SELECT * FROM cats').all();
  res.json(rows);
});

app.post('/api/cats', (req, res) => {
  const id = `cat-${uuidv4()}`;
  const { colonyId, name, gender, age, isSterilized, isChipped, chipNumber, description, diseases } = req.body;
  const nowTs = now();
  db.prepare('INSERT INTO cats (id,colonyId,name,gender,age,isSterilized,isChipped,chipNumber,description,diseases,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(id, colonyId, name, gender, age, isSterilized ? 1 : 0, isChipped ? 1 : 0, chipNumber, description, Array.isArray(diseases) ? diseases.join('|') : '', nowTs, nowTs);
  const cat = db.prepare('SELECT * FROM cats WHERE id = ?').get(id);
  res.status(201).json(cat);
});

app.put('/api/cats/:id', (req, res) => {
  const id = req.params.id;
  const { colonyId, name, gender, age, isSterilized, isChipped, chipNumber, description, diseases } = req.body;
  const nowTs = now();
  db.prepare('UPDATE cats SET colonyId=?,name=?,gender=?,age=?,isSterilized=?,isChipped=?,chipNumber=?,description=?,diseases=?,updatedAt=? WHERE id=?')
    .run(colonyId, name, gender, age, isSterilized ? 1 : 0, isChipped ? 1 : 0, chipNumber, description, Array.isArray(diseases) ? diseases.join('|') : '', nowTs, id);
  const cat = db.prepare('SELECT * FROM cats WHERE id = ?').get(id);
  res.json(cat);
});

// Seed endpoint (for dev) - inserts a few sample entries if DB empty
app.post('/api/seed', (req, res) => {
  // Only run if DB has no colonies
  const count = db.prepare('SELECT COUNT(*) as c FROM colonies').get().c;
  if (count > 0) return res.status(400).json({ error: 'DB not empty' });

  const nowTs = now();
  const c1 = `colony-${uuidv4()}`;
  db.prepare('INSERT INTO colonies (id,name,description,lat,lng,feederName,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?)')
    .run(c1, 'Colonia Ejemplo', 'Colonia de prueba', 37.49, -2.77, 'Ana', nowTs, nowTs);

  const cat1 = `cat-${uuidv4()}`;
  db.prepare('INSERT INTO cats (id,colonyId,name,gender,age,isSterilized,isChipped,description,diseases,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
    .run(cat1, c1, 'Michi', 'Hembra', 'Adulto', 0, 0, 'Gata de prueba', '', nowTs, nowTs);

  res.json({ coloniesInserted: 1, catsInserted: 1 });
});

// Simple health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on ${port}`));
