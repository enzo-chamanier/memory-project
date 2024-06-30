import { openDB } from 'idb';
const defaultData = {
  categories: [
    { id: 1, name: 'Français' },
    { id: 2, name: 'Mathématiques' },
  ],
  themes: [
    { id: 1, categoryId: 1, title: 'Littérature' },
    { id: 2, categoryId: 1, title: 'Grammaire' },
    { id: 3, categoryId: 2, title: 'Algèbre' },
    { id: 4, categoryId: 2, title: 'Géométrie' },
  ],
  cards: [
    { id: 1, themeId: 1, front: 'Qui est l\'auteur de "Les Misérables"?', back: 'Victor Hugo' },
    { id: 2, themeId: 2, front: 'Quelle est la nature du complément circonstanciel?', back: 'Il indique les circonstances de l\'action.' },
    { id: 3, themeId: 3, front: 'Résolvez l\'équation x^2 - 5x + 6 = 0', back: 'x = 2 ou x = 3' },
    { id: 4, themeId: 4, front: 'Quelle est la somme des angles dans un triangle?', back: '180 degrés' },
  ],
};
const dbPromise = openDB('memory-project', 2, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      if (!db.objectStoreNames.contains('categories')) {
        const categoryStore = db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
        defaultData.categories.forEach(category => categoryStore.put(category));
      }
      if (!db.objectStoreNames.contains('themes')) {
        const themeStore = db.createObjectStore('themes', { keyPath: 'id', autoIncrement: true });
        themeStore.createIndex('categoryId', 'categoryId', { unique: false });
        defaultData.themes.forEach(theme => themeStore.put(theme));
      }
    }
    if (oldVersion < 2) {
      if (!db.objectStoreNames.contains('cards')) {
        const cardStore = db.createObjectStore('cards', { keyPath: 'id', autoIncrement: true });
        cardStore.createIndex('themeId', 'themeId', { unique: false });
        defaultData.cards.forEach(card => cardStore.put(card));
      }
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
  const db = await dbPromise;
  const tx = db.transaction('categories', 'readwrite');
  const store = tx.objectStore('categories');
  const result = await store.add(category);
  await tx.done;
  return result; // This should be the ID of the new category
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
  const result = await store.add(theme);
  await tx.done;
  return result; // This should be the ID of the new theme
}
// Permet de supprimer un thème
export async function deleteTheme(id) {
  return (await dbPromise).delete('themes', id);
}


// Permet de créer une nouvelle carte
export async function addCard(card) {
  const db = await dbPromise;
  const tx = db.transaction('cards', 'readwrite');
  const store = tx.objectStore('cards');
  await store.add(card);
  return tx.done;
}

// Permet de récupérer toutes les cartes d'un thème
export async function getCardsForTheme(themeId) {
  const db = await dbPromise;
  const tx = db.transaction('cards', 'readonly');
  const store = tx.objectStore('cards');
  const index = store.index('themeId');
  // Convert themeId to a number if it is not already
  const numericThemeId = Number(themeId);
  return await index.getAll(numericThemeId);
}

// permet de supprimer une carte d'un thème
export async function deleteCardFromTheme(id) {
  return (await dbPromise).delete('cards', id);
}

export async function getThemeById(themeId) {
  const db = await dbPromise;
  const tx = db.transaction('themes', 'readonly');
  const store = tx.objectStore('themes');
  const theme = await store.get(themeId);
  return theme;
}