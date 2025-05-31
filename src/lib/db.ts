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
  slug: string;
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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const db = openDB(dbName, 3, {
  upgrade(db, oldVersion, newVersion, transaction) {
    // Delete existing stores if they exist
    if (oldVersion > 0) {
      if (db.objectStoreNames.contains(storeName)) {
        db.deleteObjectStore(storeName);
      }
      if (db.objectStoreNames.contains(fileStoreName)) {
        db.deleteObjectStore(fileStoreName);
      }
    }

    // Create releases store with new schema
    const store = db.createObjectStore(storeName, {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('date', 'date');
    store.createIndex('title', 'title', { unique: true });
    store.createIndex('slug', 'slug', { unique: true });

    // Create files store for binary data
    db.createObjectStore(fileStoreName);
  },
});

export async function getAllReleases(): Promise<Release[]> {
  const db = await openDB(dbName, 3);
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

export async function getReleaseBySlug(slug: string): Promise<Release | undefined> {
  const db = await openDB(dbName, 3);
  const tx = db.transaction([storeName, fileStoreName], 'readonly');
  const store = tx.objectStore(storeName);
  const slugIndex = store.index('slug');
  const fileStore = tx.objectStore(fileStoreName);
  const release = await slugIndex.get(slug);

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

export async function getReleaseById(id: number): Promise<Release | undefined> {
  const db = await openDB(dbName, 3);
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

export async function addRelease(release: Omit<Release, 'id' | 'created_at' | 'slug'>): Promise<number> {
  const db = await openDB(dbName, 3);
  const tx = db.transaction([storeName, fileStoreName], 'readwrite');
  const store = tx.objectStore(storeName);
  const fileStore = tx.objectStore(fileStoreName);
  
  // Check if a release with the same title already exists
  const titleIndex = store.index('title');
  const existingRelease = await titleIndex.get(release.title);
  
  if (existingRelease) {
    throw new Error('A release with this title already exists');
  }

  // Generate slug from title
  const slug = generateSlug(release.title);

  // Check if slug already exists
  const slugIndex = store.index('slug');
  const existingSlug = await slugIndex.get(slug);

  if (existingSlug) {
    throw new Error('A release with this slug already exists');
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
    slug,
    created_at: new Date().toISOString(),
  };
  
  const id = await store.add(newRelease);
  await tx.done;
  return id;
}

export async function updateRelease(release: Release): Promise<number> {
  const db = await openDB(dbName, 3);
  const tx = db.transaction([storeName, fileStoreName], 'readwrite');
  const store = tx.objectStore(storeName);
  const fileStore = tx.objectStore(fileStoreName);

  // Generate new slug if title changed
  const oldRelease = await store.get(release.id!);
  if (oldRelease && oldRelease.title !== release.title) {
    release.slug = generateSlug(release.title);
    
    // Check if new slug already exists
    const slugIndex = store.index('slug');
    const existingSlug = await slugIndex.get(release.slug);

    if (existingSlug && existingSlug.id !== release.id) {
      throw new Error('A release with this slug already exists');
    }
  }

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
  const db = await openDB(dbName, 3);
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