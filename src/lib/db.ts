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
    store.createIndex('title', 'title', { unique: true });
  },
});

export async function getAllReleases(): Promise<Release[]> {
  const db = await openDB(dbName, 1);
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const releases = await store.getAll();
  await tx.done;
  
  // Sort releases by date in descending order
  return releases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getReleaseById(id: number): Promise<Release | undefined> {
  return (await db).get(storeName, id);
}

export async function addRelease(release: Omit<Release, 'id' | 'created_at'>): Promise<number> {
  const db = await openDB(dbName, 1);
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  
  // Check if a release with the same title already exists
  const titleIndex = store.index('title');
  const existingRelease = await titleIndex.get(release.title);
  
  if (existingRelease) {
    throw new Error('A release with this title already exists');
  }
  
  const newRelease = {
    ...release,
    created_at: new Date().toISOString(),
  };
  
  const id = await store.add(newRelease);
  await tx.done;
  return id;
}

export async function updateRelease(release: Release): Promise<number> {
  await (await db).put(storeName, {
    ...release,
    updated_at: new Date().toISOString(),
  });
  return release.id!;
}

export async function deleteRelease(id: number): Promise<void> {
  return (await db).delete(storeName, id);
}