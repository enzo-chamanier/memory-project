<template>
  <div class="dashboard">
    <categories-component 
      :categories="categories" 
      @showModal="handleShowModal"
      @deleteCategory="handleDeleteCategory" />
    <!-- <themes-component 
      :themes="selectedCategoryThemes" 
      @showModal="handleShowModal"
      @deleteTheme="handleDeleteTheme" /> -->
  </div>
</template>

<script>
import CategoriesComponent from '@/components/CategoriesComponent.vue';
// import ThemesComponent from '@/components/ThemesComponent.vue';

export default {
  components: {
    CategoriesComponent
    // ,ThemesComponent
  },
  data() {
    return {
      categories: [],
      selectedCategoryThemes: [],
      // Supposons que vous chargiez ces données à partir d'une API ou d'une IndexedDB
    };
  },
  methods: {
    handleShowModal(type) {
        if (type === 'addCategory') {
            this.isAddCategoryModalOpen = true; // Supposons que vous ayez un data property pour contrôler ce modal
        } else if (type === 'addTheme') {
            this.isAddThemeModalOpen = true; // De même, un data property pour ce modal
        }
    },
    handleDeleteCategory(id) {
       this.categories = this.categories.filter(category => category.id !== id);
    },
    handleDeleteTheme(id) {
        this.selectedCategoryThemes = this.selectedCategoryThemes.filter(theme => theme.id !== id);
    }
  }
}
</script>
