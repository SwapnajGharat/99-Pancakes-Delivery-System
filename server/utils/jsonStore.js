import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(__dirname, '../data');
const collectionLocks = new Map();

const ensureDataDirectory = async () => {
  await fs.mkdir(dataDirectory, { recursive: true });
};

const filePathFor = (collection) => path.join(dataDirectory, `${collection}.json`);

export const createId = () => crypto.randomBytes(12).toString('hex');

export const readCollection = async (collection) => {
  await ensureDataDirectory();
  try {
    const contents = await fs.readFile(filePathFor(collection), 'utf8');
    const records = JSON.parse(contents);
    return Array.isArray(records) ? records : [];
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeCollection(collection, []);
    return [];
  }
};

export const writeCollection = async (collection, records) => {
  await ensureDataDirectory();
  await fs.writeFile(filePathFor(collection), `${JSON.stringify(records, null, 2)}\n`, 'utf8');
  return records;
};

export const withCollectionLock = async (collection, operation) => {
  const previous = collectionLocks.get(collection) || Promise.resolve();
  let release;
  const current = new Promise((resolve) => { release = resolve; });
  collectionLocks.set(collection, previous.then(() => current));
  await previous;
  try {
    return await operation();
  } finally {
    release();
  }
};

export const dataPath = dataDirectory;