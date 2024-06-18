import { openDB } from 'idb';

const dbPromise = openDB('memory-project', 1, {
  upgrade(db) {
    // Create 'categories' object store if it doesn't exist
    if (!db.objectStoreNames.contains('categories')) {
      db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
    }
    // Create 'themes' object store if it doesn't exist
    if (!db.objectStoreNames.contains('themes')) {
      const themeStore = db.createObjectStore('themes', { keyPath: 'id', autoIncrement: true });
      themeStore.createIndex('categoryId', 'categoryId', { unique: false });
    }
  },
});

// CRUD FUNCTIONS


// Permet de récupérer toutes les catégories
export async function getCategories() {
  try {
    const db = await dbPromise;
    const tx = db.transaction('categories', 'readonly');
    const store = tx.objectStore('categories');
    return await store.getAll();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

// permet de récupérer tout les thèmes
export async function getThemes() {
  try {
    const db = await dbPromise;
    const tx = db.transaction('themes', 'readonly');
    const store = tx.objectStore('themes');
    return await store.getAll();
  } catch (error) {
    console.error('Failed to fetch themes:', error);
    return [];
  }
}


// Permet d'ajouter une catégorie
export async function addCategory(category) {
  return (await dbPromise).add('categories', category);
}

// Permet de supprimer une catégorie
export async function deleteCategory(id) {
  const db = await dbPromise;
  const tx = db.transaction('categories', 'readwrite'); 
  tx.objectStore('categories').delete(id);
  return tx.done;
}

export async function getThemesForCategory(categoryId) {
  const db = await dbPromise;
  const tx = db.transaction('themes', 'readonly');
  const store = tx.objectStore('themes');
  const index = store.index('categoryId');
  // Convert categoryId to a number if it is not already
  const numericCategoryId = Number(categoryId);
  return await index.getAll(numericCategoryId);
}

export async function addTheme(theme) {
  const db = await dbPromise;
  const tx = db.transaction('themes', 'readwrite');
  const store = tx.objectStore('themes');
  await store.add(theme);
  return tx.done;
}
// Permet de supprimer un thème
export async function deleteTheme(id) {
  return (await dbPromise).delete('themes', id);
}
