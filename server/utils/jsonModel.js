import { createId, readCollection, writeCollection, withCollectionLock } from './jsonStore.js';

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);
const same = (left, right) => String(left) === String(right);

const matches = (record, query = {}) => Object.entries(query).every(([key, expected]) => {
  if (key === '$or') return expected.some((condition) => matches(record, condition));
  const actual = record[key];
  if (expected instanceof RegExp) return expected.test(String(actual ?? ''));
  if (isObject(expected)) {
    if ('$gte' in expected && !(actual >= expected.$gte)) return false;
    if ('$lte' in expected && !(actual <= expected.$lte)) return false;
    if ('$gt' in expected && !(actual > expected.$gt)) return false;
    if ('$lt' in expected && !(actual < expected.$lt)) return false;
    if ('$ne' in expected && same(actual, expected.$ne)) return false;
    if (Object.keys(expected).some((operator) => operator.startsWith('$'))) return true;
  }
  return same(actual, expected);
});

const compare = (left, right, direction) => {
  if (left === right) return 0;
  if (left === undefined || left === null) return 1;
  if (right === undefined || right === null) return -1;
  return (left > right ? 1 : -1) * direction;
};

const publicFields = (record, projection) => {
  if (!projection) return record;
  const fields = projection.split(/\s+/).filter(Boolean);
  const excluded = fields.filter((field) => field.startsWith('-')).map((field) => field.slice(1));
  if (excluded.length) {
    const result = { ...record };
    excluded.forEach((field) => delete result[field]);
    return result;
  }
  if (fields.some((field) => field.startsWith('+'))) return { ...record };
  const selected = Object.fromEntries(fields.map((field) => field.replace(/^\+/, '')).filter((field) => record[field] !== undefined).map((field) => [field, record[field]]));
  if (record._id !== undefined) selected._id = record._id;
  return selected;
};

const attachDocument = (record, model, includePassword = false) => {
  const document = { ...record };
  Object.defineProperty(document, 'toObject', { enumerable: false, value: () => ({ ...document }) });
  Object.defineProperty(document, 'save', {
    enumerable: false,
    value: async () => model._save({ ...document }),
  });
  if (model.name === 'User') {
    Object.defineProperty(document, 'matchPassword', {
      enumerable: false,
      value: async (password) => model.matchPassword(document, password),
    });
  }
  if (model.name === 'User' && !includePassword) delete document.password;
  return document;
};

class JsonQuery {
  constructor(model, query, many = true) {
    this.model = model;
    this.query = query;
    this.many = many;
    this.operations = [];
  }
  select(projection) { this.operations.push({ type: 'select', projection }); return this; }
  populate(path, projection) { this.operations.push({ type: 'populate', path, projection }); return this; }
  sort(sortSpec) { this.operations.push({ type: 'sort', sortSpec }); return this; }
  skip(value) { this.operations.push({ type: 'skip', value }); return this; }
  limit(value) { this.operations.push({ type: 'limit', value }); return this; }
  then(resolve, reject) { return this.exec().then(resolve, reject); }
  async exec() {
    let records = (await readCollection(this.model.collection)).filter((record) => matches(record, this.query));
    for (const operation of this.operations) {
      if (operation.type === 'sort') {
        const entries = Object.entries(operation.sortSpec);
        records.sort((left, right) => entries.reduce((result, [field, direction]) => result || compare(left[field], right[field], direction), 0));
      } else if (operation.type === 'skip') records = records.slice(operation.value);
      else if (operation.type === 'limit') records = records.slice(0, operation.value);
      else if (operation.type === 'select') records = records.map((record) => publicFields(record, operation.projection));
      else if (operation.type === 'populate') records = await Promise.all(records.map((record) => this.model.populate(record, operation.path, operation.projection)));
    }
    const documents = records.map((record) => attachDocument(record, this.model, this.operations.some((operation) => operation.type === 'select' && operation.projection.includes('+password'))));
    return this.many ? documents : documents[0] || null;
  }
}

export class JsonModel {
  constructor(name, collection, defaults = {}) {
    this.name = name;
    this.collection = collection;
    this.defaults = defaults;
  }
  find(query = {}) { return new JsonQuery(this, query, true); }
  findOne(query = {}) { return new JsonQuery(this, query, false); }
  findById(id) { return this.findOne({ _id: id }); }
  async countDocuments(query = {}) { return (await readCollection(this.collection)).filter((record) => matches(record, query)).length; }
  async exists(query = {}) { return (await this.countDocuments(query)) > 0 ? { _id: true } : null; }
  async create(input) {
    if (Array.isArray(input)) return Promise.all(input.map((item) => this.create(item)));
    return withCollectionLock(this.collection, async () => {
      const now = new Date().toISOString();
      const record = { ...this.defaults, ...input, _id: input._id || createId(), createdAt: input.createdAt || now, updatedAt: now };
      if (this.name === 'User') record.password = await this.hashPassword(record.password);
      const records = await readCollection(this.collection);
      records.push(record);
      await writeCollection(this.collection, records);
      return attachDocument(record, this, true);
    });
  }
  async insertMany(records) { return this.create(records); }
  async deleteMany(query = {}) { return withCollectionLock(this.collection, async () => writeCollection(this.collection, (await readCollection(this.collection)).filter((record) => !matches(record, query)))); }
  async findByIdAndUpdate(id, updates, options = {}) { return this._update({ _id: id }, updates, options); }
  async findOneAndUpdate(query, updates, options = {}) { return this._update(query, updates, options); }
  async _update(query, updates, options = {}) {
    return withCollectionLock(this.collection, async () => {
      const records = await readCollection(this.collection);
      const index = records.findIndex((record) => matches(record, query));
      if (index < 0) return null;
      records[index] = { ...records[index], ...updates, updatedAt: new Date().toISOString() };
      await writeCollection(this.collection, records);
      return attachDocument(records[index], this, true);
    });
  }
  async findByIdAndDelete(id) {
    return withCollectionLock(this.collection, async () => {
      const records = await readCollection(this.collection);
      const found = records.find((record) => same(record._id, id));
      await writeCollection(this.collection, records.filter((record) => !same(record._id, id)));
      return found ? attachDocument(found, this, true) : null;
    });
  }
  async _save(document) { return this._update({ _id: document._id }, document, { new: true }); }
  async populate(record, path, projection) {
    const related = this.relations?.[path];
    if (!related) return record;
    const value = record[path];
    if (path === 'items.product') {
      const items = await Promise.all((value || []).map(async (item) => ({ ...item, product: publicFields(await related.model.findById(item.product), projection) })));
      return { ...record, items };
    }
    const relatedRecord = await related.model.findById(value);
    return { ...record, [path]: relatedRecord ? publicFields(relatedRecord, projection) : null };
  }
}

export { matches, attachDocument };