import { openDB } from 'idb';

export interface Release {
  id?: number;
  title: string;
  date: string;
  description: string;
  status: 'Beta';
  documentation: string;
  created_at?: string;
}

const dbName = 'airship-beta';
const storeName = 'releases';

export const db = openDB(dbName, 1, {
  upgrade(db) {
    const store = db.createObjectStore(storeName, {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('date', 'date');
  },
});

export async function getAllReleases(): Promise<Release[]> {
  return (await db).getAllFromIndex(storeName, 'date');
}

export async function getReleaseById(id: number): Promise<Release | undefined> {
  return (await db).get(storeName, id);
}

export async function addRelease(release: Omit<Release, 'id' | 'created_at'>): Promise<number> {
  const newRelease = {
    ...release,
    created_at: new Date().toISOString(),
  };
  return (await db).add(storeName, newRelease);
}

export async function updateRelease(release: Release): Promise<number> {
  await (await db).put(storeName, release);
  return release.id!;
}

export async function deleteRelease(id: number): Promise<void> {
  return (await db).delete(storeName, id);
}