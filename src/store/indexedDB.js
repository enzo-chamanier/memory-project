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


// CRUD FUNCTIONS


// Permet de récupérer toutes les catégories
export async function getCategories() {
  return (await dbPromise).getAll('categories');
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

// Permet d'ajouter un thème
export async function addTheme(theme) {
  return (await dbPromise).add('themes', theme);
}

// Permet de recupérer les thèmes pour une catégorie
export async function getThemesForCategory(categoryId) {
  const db = await dbPromise;
  const index = db.transaction('themes').objectStore('themes').index('categoryId');
  return index.getAll(categoryId);
}

// Permet de supprimer un thème
export async function deleteTheme(id) {
  return (await dbPromise).delete('themes', id);
}
