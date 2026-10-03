import fs from 'fs/promises';
import path from 'path';

const DB_FILE = path.resolve('travels.json');

const defaultData = [
  {
    id: 'sample-1',
    country: 'Japan',
    capital: 'Tokyo',
    notes: 'Visit Kyoto, eat ramen, and watch cherry blossoms.'
  },
  {
    id: 'sample-2',
    country: 'France',
    capital: 'Paris',
    notes: 'See the Eiffel Tower and enjoy a café morning.'
  },
  {
    id: 'sample-3',
    country: 'Italy',
    capital: 'Rome',
    notes: 'Try pizza, explore history, and walk the Colosseum area.'
  }
];

export async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (error) {
    // File does not exist or is invalid; fall through to creating default examples.
  }

  await writeDB(defaultData);
  return defaultData;
}

export async function writeDB(data) {
  const safeData = Array.isArray(data) ? data : [];
  await fs.writeFile(DB_FILE, JSON.stringify(safeData, null, 2), 'utf-8');
}