import { openDB } from 'idb';

export interface Screenshot {
  url: string;
  caption: string;
  file?: File;
  blob?: Blob;
}

export interface Release {
  id?: number;
  title: string;
  date: string;
  description: string;
  status: 'Beta';
  documentation: string;
  screenshots?: Screenshot[];
  created_at?: string;
}

const dbName = 'airship-beta';
const storeName = 'releases';
const fileStoreName = 'files';

export const db = openDB(dbName, 2, {
  upgrade(db, oldVersion, newVersion) {
    // If releases store doesn't exist, create it
    if (!db.objectStoreNames.contains(storeName)) {
      const store = db.createObjectStore(storeName, {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('date', 'date');
      store.createIndex('title', 'title', { unique: true });
    }

    // If files store doesn't exist, create it
    if (!db.objectStoreNames.contains(fileStoreName)) {
      db.createObjectStore(fileStoreName);
    }
  },
});

export async function getAllReleases(): Promise<Release[]> {
  const db = await openDB(dbName, 2);
  const tx = db.transaction([storeName, fileStoreName], 'readonly');
  const store = tx.objectStore(storeName);
  const fileStore = tx.objectStore(fileStoreName);
  const releases = await store.getAll();

  // Load file blobs for each screenshot
  for (const release of releases) {
    if (release.screenshots) {
      for (const screenshot of release.screenshots) {
        if (screenshot.url.startsWith('blob:')) {
          const fileKey = screenshot.url.split('/').pop();
          if (fileKey) {
            screenshot.blob = await fileStore.get(fileKey);
            screenshot.url = URL.createObjectURL(screenshot.blob);
          }
        }
      }
    }
  }
  
  await tx.done;
  
  // Sort releases by date in descending order
  return releases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getReleaseById(id: number): Promise<Release | undefined> {
  const db = await openDB(dbName, 2);
  const tx = db.transaction([storeName, fileStoreName], 'readonly');
  const store = tx.objectStore(storeName);
  const fileStore = tx.objectStore(fileStoreName);
  const release = await store.get(id);

  if (release?.screenshots) {
    for (const screenshot of release.screenshots) {
      if (screenshot.url.startsWith('blob:')) {
        const fileKey = screenshot.url.split('/').pop();
        if (fileKey) {
          screenshot.blob = await fileStore.get(fileKey);
          screenshot.url = URL.createObjectURL(screenshot.blob);
        }
      }
    }
  }

  await tx.done;
  return release;
}

export async function addRelease(release: Omit<Release, 'id' | 'created_at'>): Promise<number> {
  const db = await openDB(dbName, 2);
  const tx = db.transaction([storeName, fileStoreName], 'readwrite');
  const store = tx.objectStore(storeName);
  const fileStore = tx.objectStore(fileStoreName);
  
  // Check if a release with the same title already exists
  const titleIndex = store.index('title');
  const existingRelease = await titleIndex.get(release.title);
  
  if (existingRelease) {
    throw new Error('A release with this title already exists');
  }

  // Store files and update URLs
  if (release.screenshots) {
    for (const screenshot of release.screenshots) {
      if (screenshot.file) {
        const fileKey = crypto.randomUUID();
        await fileStore.put(screenshot.file, fileKey);
        screenshot.url = `blob:/${fileKey}`;
        delete screenshot.file;
      }
    }
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
  const db = await openDB(dbName, 2);
  const tx = db.transaction([storeName, fileStoreName], 'readwrite');
  const store = tx.objectStore(storeName);
  const fileStore = tx.objectStore(fileStoreName);

  // Store new files and update URLs
  if (release.screenshots) {
    for (const screenshot of release.screenshots) {
      if (screenshot.file) {
        const fileKey = crypto.randomUUID();
        await fileStore.put(screenshot.file, fileKey);
        screenshot.url = `blob:/${fileKey}`;
        delete screenshot.file;
      }
    }
  }

  await store.put({
    ...release,
    updated_at: new Date().toISOString(),
  });

  await tx.done;
  return release.id!;
}

export async function deleteRelease(id: number): Promise<void> {
  const db = await openDB(dbName, 2);
  const tx = db.transaction([storeName, fileStoreName], 'readwrite');
  const store = tx.objectStore(storeName);
  const fileStore = tx.objectStore(fileStoreName);

  // Get the release to find associated files
  const release = await store.get(id);
  if (release?.screenshots) {
    for (const screenshot of release.screenshots) {
      if (screenshot.url.startsWith('blob:')) {
        const fileKey = screenshot.url.split('/').pop();
        if (fileKey) {
          await fileStore.delete(fileKey);
        }
      }
    }
  }

  await store.delete(id);
  await tx.done;
}