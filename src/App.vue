
<template>
  <div class="content">

    <button type="button" @click="openModalCreate">Créer une catégorie</button>
    <div id="modal" class="modalDialog">
      <div id="divClose">
        <a href="" title="Close" class="close" @click="closeModal">X</a>
      </div>
      <h2>Créer une catégorie</h2>
      <form action="/">
        <input type="text" name="categoryName" v-model="categoryName" placeholder="Nom de la catégorie" required>
        <br>
        <button type="submit" @click="CreateCategory">Créer</button>
      </form>
    </div>

    <button type="button" @click="openModalView">Mes catégories</button>
    <div id="modalCategory" class="modalDialog">
      <div id="divClose">
        <a href="" title="Close" class="close" @click="closeModal">X</a>
      </div>
      <h2>Mes catégories</h2>
      <ul>
        <router-link to="/about" custom v-slot="{ navigate }">
          <li @click="navigate">Category 1</li>
        </router-link>
      </ul>
    </div>
  </div>

</template>


<script>
  export default {
    name: 'App',
    components: {},
    data() {
      return {
        errors: [],
        categoryName: '',
      }
    },
    methods : {
      CreateCategory(){
        console.log(this.categoryName);
      },
      ViewMyCategories(){
        console.log('ViewMyCategories');
      },     
      openModalCreate(){
        if (document.getElementById('modal').style.display === 'none') {
          if (document.getElementById('modalCategory').style.display === 'block') {
            document.getElementById('modalCategory').style.display = 'none';
          }
          document.getElementById('modal').style.display = 'block';
        } else {
          document.getElementById('modal').style.display = 'none';
        }
      },
      openModalView(){
        if (document.getElementById('modalCategory').style.display === 'none') {
          if (document.getElementById('modal').style.display === 'block') {
            document.getElementById('modal').style.display = 'none';
          }
          document.getElementById('modalCategory').style.display = 'block';
        } else {
          document.getElementById('modalCategory').style.display = 'none';
        }
      },
      closeModal(){
        document.getElementById('modal').style.display = 'none';
      }
    },

  }
  
</script>

<style>

  body {
    margin: 0;
    height:100vh;
  }

  h2{
    color:black;
    font-size: calc(0.4em + 1vw);
  }
  button{
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
  }

  ul {
    width: 100%;
    display: grid;
    padding-left: 0;
    justify-content: center;
    grid-template-columns: 1fr 1fr ;
  }

  li{
    list-style-type: none;
    margin: 10px;
    padding: 10px;
    background-color: rgba(141, 141, 141, 0.025);
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    font-size: calc(0.1em + 1vw);
  }


  button:hover{
    background-color: rgba(141, 141, 141, 0.025);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  #modal, #modalCategory{
    display: none;
  }

  .modalDialog{
    border: 1px solid black;
    width: 30%;
    border-radius: 5px;
  }

  #divClose{
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    margin-right: 10px;
  }

  input[type="text"] {
      padding: 10px;
      width: 60%;
      border-radius: 5px;
      border: 1px solid black;
      text-align: center;
  }

  button, input[type="text"],a{
          font-size:calc(0.1em + 1vw);

  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height:100vh;
  }

  .content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 90vh;
  }
</style>
