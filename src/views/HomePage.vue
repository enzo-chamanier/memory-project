<template>
     <button type="button" @click="openModalCreate">Créer une catégorie</button>
     <div id="modal" class="modalDialog" v-show="isModalOpen">
        <div id="divClose">
          <a href="#" title="Close" class="close" @click="closeModal">X</a>
        </div>
        <h2>Créer une catégorie</h2>
        <form @submit.prevent="createCategory">
          <input type="text" v-model="categoryName" placeholder="Nom de la catégorie" required>
          <button type="submit">Créer</button>
        </form>
      </div>
    <button v-if="categories.length > 0" @click="goToDashboard">Mes catégories</button>
</template>

<script>
import { addCategory, getCategories } from '@/store/indexedDB';

export default {
  name: 'HomePage',
  data() {
    return {
      categories: [], // Assurez-vous d'avoir un tableau categories initialisé
      categoryName: '',
      isModalOpen: false,
      isDashboardOpen: false
    }
  },
  mounted() {
    this.loadCategories(); // Chargez les catégories dès le montage du composant
  },
  methods: {
    loadCategories() {
      getCategories().then(categories => {
        this.categories = categories;
      }).catch(error => {
        console.error("Failed to fetch categories", error);
      });
    },
    async createCategory() {
      if (this.categoryName.trim()) {
        const response = await addCategory({ name: this.categoryName });
        this.categories.push(response); // Ajouter la nouvelle catégorie au tableau local
        this.categoryName = '';
        this.$router.push('/dashboard');
      }
    },
    goToDashboard() {
      this.$router.push('/dashboard');
    },
    openModalCreate() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    }
  }
}
</script>



<style>
.modalDialog[style*="display: block"] {
  display: block;
}

.title{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.title svg {
    margin-left:-2vw;
    margin-right: 10px;
    width: 2vw;
    min-width: 30px;
    height: auto;
    filter: invert(0);
}

    .header{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 9%;  
        border-bottom: 1px solid black;
        width: 100%;
    }

    .content{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 90vh;
    }
  body {
    margin: 0;
    min-height: 100vh;
  }

  h2{
    color:black;
    font-size: calc(0.8em + 1vw);
  }

  button, a{
    width:30%;
    margin: 10px;
    padding: 10px;
    background-color: transparent;
    color: rgb(0, 0, 0);
    border: 1px solid rgb(0, 0, 0);
    border-radius: 5px;
    cursor: pointer;
  }

  a {
    text-decoration: none;
    color: black;
  }

  a:hover {
    text-decoration: underline;
  }

  a.close {
    text-decoration: none;
    color: black;
    font-weight: 700;
    display: flex;
    flex-direction: row-reverse;
    border: none;
  }

  a.close:hover {
    text-decoration: overline;
  }

  .categories{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  ul {
width: 270px;
    display: grid;
    padding-left: 0;
    justify-content: center;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
  }

  li{
    list-style-type: none;
    margin: 10px;
    padding: 10px;
    background-color: rgba(141, 141, 141, 0.025);
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    font-size: calc(0.1em + 1vw);
    word-break: break-all;
  }


  button:hover{
    background-color: rgba(141, 141, 141, 0.025);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  .modalAddTheme{
    gap:10px;
  }

  .modalDialog{
    border: 1px solid black;
    width: 30%;
    border-radius: 5px;
    min-width: 120px;
  }

  .modalDialog form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #divClose{
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    margin-right: 10px;
  }

  .content input[type="text"] {
      padding: 10px;
      width: 60%;
      border-radius: 5px;
      border: 1px solid black;
      text-align: center;
  }


  button, input[type="text"],a{
    font-size: calc(0.4em + 0.5vw);
  }

  button{
    min-width:120px;  
  }

  form button {
    min-width: 80px;
}

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height:100vh;
  }


</style>
