import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(__dirname, '../data');
const runtimeDataDirectory = process.env.VERCEL
  ? path.resolve('/tmp/99pancakes-data')
  : dataDirectory;
const collectionLocks = new Map();

const ensureDataDirectory = async () => {
  await fs.mkdir(runtimeDataDirectory, { recursive: true });
};

const filePathFor = (collection) => path.join(runtimeDataDirectory, `${collection}.json`);
const sourceFilePathFor = (collection) => path.join(dataDirectory, `${collection}.json`);

export const createId = () => crypto.randomBytes(12).toString('hex');

export const readCollection = async (collection) => {
  await ensureDataDirectory();
  try {
    const contents = await fs.readFile(filePathFor(collection), 'utf8');
    const records = JSON.parse(contents);
    return Array.isArray(records) ? records : [];
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    let initialRecords = [];
    if (runtimeDataDirectory !== dataDirectory) {
      try {
        initialRecords = JSON.parse(await fs.readFile(sourceFilePathFor(collection), 'utf8'));
      } catch (sourceError) {
        if (sourceError.code !== 'ENOENT') throw sourceError;
      }
    }
    await writeCollection(collection, initialRecords);
    return initialRecords;
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

export const dataPath = runtimeDataDirectory;