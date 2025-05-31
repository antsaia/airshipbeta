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
const DB_VERSION = 4; // Increment version to force schema updates

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Initialize database connection
async function initDB() {
  try {
    const db = await openDB(dbName, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Delete existing stores if they exist
        if (oldVersion > 0) {
          const storeNames = [...db.objectStoreNames];
          storeNames.forEach(storeName => {
            db.deleteObjectStore(storeName);
          });
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
      blocked() {
        console.warn('Database upgrade blocked. Please close other tabs using this app.');
      },
      blocking() {
        console.warn('This tab is blocking a database upgrade. Please reload.');
      },
      terminated() {
        console.error('Database connection terminated unexpectedly.');
      },
    });

    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw new Error('Database initialization failed. Please reload the page.');
  }
}

// Singleton database instance
let dbInstance: Promise<IDBDatabase> | null = null;

// Get database instance
async function getDB() {
  if (!dbInstance) {
    dbInstance = initDB();
  }
  return dbInstance;
}

export async function getAllReleases(): Promise<Release[]> {
  try {
    const db = await getDB();
    const tx = (await db).transaction([storeName, fileStoreName], 'readonly');
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
              try {
                screenshot.blob = await fileStore.get(fileKey);
                if (screenshot.blob) {
                  screenshot.url = URL.createObjectURL(screenshot.blob);
                }
              } catch (error) {
                console.warn(`Failed to load screenshot ${fileKey}:`, error);
              }
            }
          }
        }
      }
    }
    
    await tx.done;
    
    // Sort releases by date in descending order
    return releases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Failed to get releases:', error);
    return [];
  }
}

export async function getReleaseBySlug(slug: string): Promise<Release | undefined> {
  try {
    const db = await getDB();
    const tx = (await db).transaction([storeName, fileStoreName], 'readonly');
    const store = tx.objectStore(storeName);
    const slugIndex = store.index('slug');
    const fileStore = tx.objectStore(fileStoreName);
    const release = await slugIndex.get(slug);

    if (release?.screenshots) {
      for (const screenshot of release.screenshots) {
        if (screenshot.url.startsWith('blob:')) {
          const fileKey = screenshot.url.split('/').pop();
          if (fileKey) {
            try {
              screenshot.blob = await fileStore.get(fileKey);
              if (screenshot.blob) {
                screenshot.url = URL.createObjectURL(screenshot.blob);
              }
            } catch (error) {
              console.warn(`Failed to load screenshot ${fileKey}:`, error);
            }
          }
        }
      }
    }

    await tx.done;
    return release;
  } catch (error) {
    console.error('Failed to get release by slug:', error);
    return undefined;
  }
}

export async function getReleaseById(id: number): Promise<Release | undefined> {
  try {
    const db = await getDB();
    const tx = (await db).transaction([storeName, fileStoreName], 'readonly');
    const store = tx.objectStore(storeName);
    const fileStore = tx.objectStore(fileStoreName);
    const release = await store.get(id);

    if (release?.screenshots) {
      for (const screenshot of release.screenshots) {
        if (screenshot.url.startsWith('blob:')) {
          const fileKey = screenshot.url.split('/').pop();
          if (fileKey) {
            try {
              screenshot.blob = await fileStore.get(fileKey);
              if (screenshot.blob) {
                screenshot.url = URL.createObjectURL(screenshot.blob);
              }
            } catch (error) {
              console.warn(`Failed to load screenshot ${fileKey}:`, error);
            }
          }
        }
      }
    }

    await tx.done;
    return release;
  } catch (error) {
    console.error('Failed to get release by ID:', error);
    return undefined;
  }
}

export async function addRelease(release: Omit<Release, 'id' | 'created_at' | 'slug'>): Promise<number> {
  try {
    const db = await getDB();
    const tx = (await db).transaction([storeName, fileStoreName], 'readwrite');
    const store = tx.objectStore(storeName);
    const fileStore = tx.objectStore(fileStoreName);
    
    // Generate slug from title
    const slug = generateSlug(release.title);

    // Check if title or slug already exists
    const titleIndex = store.index('title');
    const slugIndex = store.index('slug');
    const [existingTitle, existingSlug] = await Promise.all([
      titleIndex.get(release.title),
      slugIndex.get(slug)
    ]);
    
    if (existingTitle) {
      throw new Error('A release with this title already exists');
    }

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
  } catch (error) {
    console.error('Failed to add release:', error);
    throw error;
  }
}

export async function updateRelease(release: Release): Promise<number> {
  try {
    const db = await getDB();
    const tx = (await db).transaction([storeName, fileStoreName], 'readwrite');
    const store = tx.objectStore(storeName);
    const fileStore = tx.objectStore(fileStoreName);

    // Get existing release
    const oldRelease = await store.get(release.id!);
    if (!oldRelease) {
      throw new Error('Release not found');
    }

    // Generate new slug if title changed
    if (oldRelease.title !== release.title) {
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
  } catch (error) {
    console.error('Failed to update release:', error);
    throw error;
  }
}

export async function deleteRelease(id: number): Promise<void> {
  try {
    const db = await getDB();
    const tx = (await db).transaction([storeName, fileStoreName], 'readwrite');
    const store = tx.objectStore(storeName);
    const fileStore = tx.objectStore(fileStoreName);

    // Get the release to find associated files
    const release = await store.get(id);
    if (release?.screenshots) {
      for (const screenshot of release.screenshots) {
        if (screenshot.url.startsWith('blob:')) {
          const fileKey = screenshot.url.split('/').pop();
          if (fileKey) {
            try {
              await fileStore.delete(fileKey);
            } catch (error) {
              console.warn(`Failed to delete screenshot ${fileKey}:`, error);
            }
          }
        }
      }
    }

    await store.delete(id);
    await tx.done;
  } catch (error) {
    console.error('Failed to delete release:', error);
    throw error;
  }
}