<template>
  <div class="categories-page">
    <div class="back-button">
      <router-link to="/">← Retour au menu principal</router-link>
    </div>
    <h2>Mes catégories</h2>
    <ul>
      <li v-for="category in categories" :key="category.id">{{ category.name }}</li>
    </ul>
  </div>
</template>

<script>
import { getCategories } from '@/store/indexedDB';

export default {
  name: 'CategoriesPage',
  data() {
    return {
      categories: []
    }
  },
  async mounted() {
    this.categories = await getCategories();
  }
}
</script>

<style>
/* Styles for your categories page */
.back-button {
  margin-top: 20px;
}
</style>
