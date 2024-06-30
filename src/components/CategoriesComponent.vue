<template>
  <div class="categories">
    <div class="header">
      <h2>Catégories</h2>
      <button @click="openModalCreate" class="plusCreate">+</button>
    </div>
    <!-- Modal pour créer une nouvelle catégorie -->
    <div id="modal" class="modalDialog" v-show="isModalOpen">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Créer une catégorie</h3>
          <span class="close" @click="closeModal">&times;</span>
        </div>
        <form @submit.prevent="addCategory">
          <input type="text" v-model="newCategoryName" placeholder="Nom de la catégorie" required>
          <button type="submit">Créer</button>
        </form>
      </div>
    </div>
    <ul class="category-list">
      <li class="licat"
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category)"
          @contextmenu.prevent="markForDeletion(category)"
          :class="{'active-category': selectedCategory && category.id === selectedCategory.id,
                  'marked-for-deletion': category.markedForDeletion}">
        {{ category.markedForDeletion ? 'Supprimer' : '' }} {{ category.name }}
      </li>
    </ul>



    <!-- Affichage des thèmes pour la catégorie sélectionnée -->
    <div v-if="selectedCategory">
      <div class="modalAddTheme">
        <h2>LES THEMES DE {{ selectedCategory.name }}</h2>
        <button @click="showAddThemeModal" class="plusCreate">+</button>
      </div>
      <!-- Modal pour ajouter un thème -->
      <div id="themeModal" class="modalDialog" v-show="isThemeModalOpen">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Créer un thème</h3>
            <span class="close" @click="closeThemeModal">&times;</span>
          </div>
          <form @submit.prevent="addTheme">
            <input type="text" v-model="newThemeTitle" placeholder="Titre du thème" required>
            <button type="submit">Créer</button>
          </form>
        </div>
      </div>
      <ul class="category-list">
        <li class="licat"
            v-for="theme in themes" :key="theme.id" @click="selectTheme(theme)">
          {{ theme.title }}
        </li>
      </ul>

      
    </div>
  </div>
</template>


<script>
import { addCategory, getCategories, getThemesForCategory, deleteCategory, addTheme } from '@/store/indexedDB';

export default {
  name: 'CategoriesComponent',
  data() {
    return {
      categories: [],
      themes: [],
      selectedCategory: null,
      isModalOpen: false,
      isThemeModalOpen: false,
      newCategoryName: '',
      newThemeTitle: ''
    };
  },
  methods: {
    openModalCreate() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    showAddThemeModal() {
      this.isThemeModalOpen = true;
      console.log('Theme modal is now open:', this.isThemeModalOpen);
    },
    closeThemeModal() {
      this.isThemeModalOpen = false;
    },
    addCategory() {
      const newCategory = { name: this.newCategoryName };
      addCategory(newCategory).then(() => {
        this.loadCategories();
        this.newCategoryName = '';
        this.closeModal();
      }).catch(error => {
        console.error("Failed to save the category", error);
      });
    },
    async addTheme() {
      const newTheme = {
        title: this.newThemeTitle,
        categoryId: this.selectedCategory.id,
      };
      try {
        const themeId = await addTheme(newTheme);
        this.themes.push({ ...newTheme, id: themeId });
        this.newThemeTitle = '';
        this.isThemeModalOpen = false;
        this.$router.push({ name: 'Jouer', params: { themeId } });
      } catch (error) {
        console.error("Failed to add theme", error);
      }
    },
    selectCategory(category) {
      if (category.markedForDeletion) {
        deleteCategory(category.id).then(() => {
          this.categories = this.categories.filter(cat => cat.id !== category.id);
          if (this.categories.length === 0) {
            this.$router.push('/');
          }
        }).catch(error => {
          console.error("Failed to delete category", error);
        });
      } else {
        this.selectedCategory = category;
        this.loadThemes(category.id);
      }
    },
    selectTheme(theme) {
      console.log('Selected theme:', theme)
      this.$router.push({ name: 'Jouer', params: { themeId: theme.id } });
    },
    markForDeletion(category) {
      this.categories = this.categories.map(cat => {
        if (cat.id === category.id) {
          return { ...cat, markedForDeletion: !cat.markedForDeletion };
        }
        return cat;
      });
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
    }
  },
  mounted() {
    this.loadCategories();
  }
}
</script>




<style scoped>


.modal-header{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

}
h3{
  color: #000;
  font-size: calc(0.5em + 0.5vw);

}

.close {
    color: #aaa;
    /* float: right; */
    display: flex;
    font-size: 28px;
    font-weight: bold;
    flex-direction: row-reverse;
    margin-right: 10px;
}

.close:hover {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
.modalDialog {
  border: 1px solid black;
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.marked-for-deletion {
  background-color: rgb(181, 30, 30);
  color: white;
  text-transform: uppercase;
}

.marked-for-deletion:hover {
  background-color: rgb(181, 30, 30) !important;
  color: white !important;
  border: 2px solid black;
}

.category-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 0;
    margin: 0;
}

/* Étendre le dernier élément sur toute la ligne si seul */
.category-list li:last-child:only-child,
.category-list li:nth-last-child(1):nth-child(odd) {
  grid-column: 1 / -1;
}


.licat {
  cursor: pointer;
  padding: 10px;
  margin: 5px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow-y: auto;
  width: 15vw;
  font-size: calc(0.8em + 0.2vw);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.licat:hover {
  background-color: #D9D9D9;
}

.active-category {
  background-color: #9E9E9E;
  color: #333;
  border-radius: 8px;
  border: 1px solid #ddd;
}



h2 {
  text-transform: uppercase;
}

ul {
    width: unset !important;
}

.header button, .modalAddTheme button {
  width: unset;
  min-width: unset;
  border-radius: 50%;
  height: 5vw;
  width: 5vw;
  max-height: 50px;
  max-width: 50px;
  font-size: calc(1.1em + 1vw);
  display: flex;
  align-items: center;
  justify-content: center;
}

.categories .header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  border-bottom:none;
}

.plusCreate {
  margin: 0;
}

.modalAddTheme {
    display: flex;
    align-items: center;
    justify-content: center;

}

</style>
