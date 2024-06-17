<template>
  <div class="categories">
    <div class="header">
      <h2>Catégories</h2>
      <button @click="openModalCreate" class="plusCreate">+</button>
    </div>
    <ul>
      <li class="licat" v-for="category in categories" :key="category.id"
          @click="selectCategory(category)"
          :class="{'active-category': selectedCategory && category.id === selectedCategory.id}">
        {{ category.name }}
      </li>
    </ul>


    <!-- Modal pour créer une nouvelle catégorie -->
    <div id="modal" class="modalDialog" v-if="isModalOpen">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <form @submit.prevent="addCategory">
          <input type="text" v-model="newCategoryName" placeholder="Nom de la catégorie" required>
          <button type="submit">Créer</button>
        </form>
      </div>
    </div>

    <!-- Affichage des thèmes pour la catégorie sélectionnée -->
    <div v-if="selectedCategory" >
      <div class="modalAddTheme">
        <h2>LES THEMES DE {{ selectedCategory.name }}</h2>
        <button @click="showAddThemeModal" class="plusCreate">+</button>
      </div>

      <ul>
        <li v-for="theme in themes" :key="theme.id">
          {{ theme.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { addCategory, getCategories, getThemesForCategory } from '@/store/indexedDB';

export default {
  name: 'CategoriesComponent',
  data() {
    return {
      categories: [],
      themes: [],
      selectedCategory: null,
      isModalOpen: false,
      newCategoryName: ''
    };
  },
  methods: {
      showAddThemeModal() {
      this.$emit('showModal', 'addTheme');
    },
    openModalCreate() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    addCategory() {
      const newCategory = {
        id: Date.now(),
        name: this.newCategoryName
      };
      this.categories.push(newCategory);
      this.saveCategoryToDB(newCategory);
      this.newCategoryName = '';
      this.closeModal();
    },
    selectCategory(category) {
      this.selectedCategory = category;
      this.loadThemes(category.id);
    },
    loadThemes(categoryId) {
      getThemesForCategory(categoryId).then(themes => {
        this.themes = themes;
      }).catch(error => {
        console.error("Failed to fetch themes", error);
      });
    },
    loadCategories() {
      getCategories().then(categories => {
        this.categories = categories;
      }).catch(error => {
        console.error("Failed to fetch categories", error);
      });
    },
    saveCategoryToDB(category) {
      addCategory(category).catch(error => {
        console.error("Failed to save the category to IndexedDB", error);
      });
    }
  },
  mounted() {
    this.loadCategories();
  }
}
</script>


<style scoped>

.licat {
    cursor: pointer;
    padding: 10px;
    margin: 5px;
    border-radius: 8px;
    border: 1px solid #ddd;
    width: 20vw;
    min-width: 100px;
    height: 3vh;
    min-height: 20px;
    overflow-y: auto;
    font-size: calc(0.8em + 0.2vw);

}

.active-category {
  background-color: #f0f0f0; /* Couleur de fond pour la catégorie active */
  color: #333; /* Couleur de texte pour la catégorie active */
  border-radius: 8px; /* Arrondi des coins si nécessaire */
  border: 1px solid #ddd; /* Bordure pour mettre en évidence */
}

h2 {
  text-transform: uppercase;
}

button {
  width: unset;
  min-width: unset;
  border-radius: 50%;
  height: 5vw;
  width: 5vw;
  max-height: 50px;
  max-width: 50px;
  font-size: calc(1.1em + 1vw);
  display: flex;
  /* align-content: center; */
  align-items: center;
  justify-content: center;
}
.categories .header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: 10px;
    border:none;
}

.plusCreate {
    margin:0;
}

.modalDialog {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  display: none;
}

.modalAddTheme {
  display: flex;
  align-items: center;
}

.modalDialog[style*="display: block"] {
  display: block;
}
</style>
