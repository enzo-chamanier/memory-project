import { openDB } from 'idb';

const dbPromise = openDB('memory-project', 1, {
  upgrade(db /*, oldVersion, newVersion, transaction*/) {
    if (!db.objectStoreNames.contains('categories')) {
      db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('themes')) {
      const themeStore = db.createObjectStore('themes', { keyPath: 'id', autoIncrement: true });
      themeStore.createIndex('categoryId', 'categoryId', { unique: false });
    }
  },
});


export async function getCategories() {
  return (await dbPromise).getAll('categories');
}

export async function addCategory(category) {
  return (await dbPromise).add('categories', category);
}

export async function deleteCategory(id) {
  const db = await dbPromise;
  const tx = db.transaction(['categories', 'themes'], 'readwrite');
  tx.objectStore('themes').index('categoryId').openCursor(IDBKeyRange.only(id)).then(cursor => {
    return cursor ? cursor.delete().then(() => cursor.continue().then(cursor => cursor && cursor.delete())) : Promise.resolve();
  });
  await tx.objectStore('categories').delete(id);
  return tx.done;
}

export async function addTheme(theme) {
  return (await dbPromise).add('themes', theme);
}

export async function getThemesForCategory(categoryId) {
  const db = await dbPromise;
  const index = db.transaction('themes').objectStore('themes').index('categoryId');
  return index.getAll(categoryId);
}

export async function deleteTheme(id) {
  return (await dbPromise).delete('themes', id);
}
