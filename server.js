import express from 'express';
import path from 'path';
import { readDB, writeDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const rootDir = path.resolve();

app.use(express.json());
app.use(express.static(rootDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('/api/travels', async (req, res) => {
  const items = await readDB();
  res.json(items);
});

app.get('/api/travels/:id', async (req, res) => {
  const items = await readDB();
  const item = items.find((i) => i.id === req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Record not found' });
  }

  res.json(item);
});

app.post('/api/travels', async (req, res) => {
  const { country, capital, notes } = req.body;

  if (!country || !capital) {
    return res.status(400).json({ message: 'Country and capital are required.' });
  }

  const items = await readDB();
  const newItem = {
    id: Date.now().toString(),
    country: country.trim(),
    capital: capital.trim(),
    notes: notes ? notes.trim() : ''
  };

  items.push(newItem);
  await writeDB(items);
  res.status(201).json(newItem);
});

app.put('/api/travels/:id', async (req, res) => {
  const { country, capital, notes } = req.body;
  const items = await readDB();
  const index = items.findIndex((i) => i.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Record not found' });
  }

  const updatedItem = {
    ...items[index],
    country: country.trim(),
    capital: capital.trim(),
    notes: notes ? notes.trim() : ''
  };

  items[index] = updatedItem;
  await writeDB(items);
  res.json(updatedItem);
});

app.delete('/api/travels/:id', async (req, res) => {
  let items = await readDB();
  items = items.filter((i) => i.id !== req.params.id);
  await writeDB(items);
  res.json({ message: 'Record deleted' });
});

app.get('/api/export', async (req, res) => {
  const items = await readDB();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="travel-bucket-list-backup.txt"');
  res.send(JSON.stringify(items, null, 2));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));