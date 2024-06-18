<template>
  <div class="theme-page">
    <aside class="theme-list">
      <h1 class="sticky-header">THEMES</h1>
      <ul>
        <li v-for="theme in themes" :key="theme.id" @click="selectTheme(theme)" 
            :class="{ 'theme-item-selected': selectedTheme && theme.id === selectedTheme.id }" class="theme-item">
          {{ theme.title }}
        </li>
      </ul>
    </aside>
    <section v-if="selectedTheme" class="theme-details">
      <div class="theme-header">
        <h2>Votre thème : {{ selectedTheme.title }}</h2>
        <div class="backgrey">
          <div class="theme-actions">
            <button @click="home">Home</button>
            <button @click="showCreateCardModal = true">Créer une carte</button>

            <!-- Modal Popup for Creating Card -->
            <div v-if="showCreateCardModal" class="modal">
              <div class="modal-content">
                <div class="modal-header">
                  <h3>Créer une nouvelle carte</h3>
                  <span class="close" @click="showCreateCardModal = false">&times;</span>
                </div>

                <form @submit.prevent="createCard">
                  <input type="text" v-model="newCardTitle" placeholder="Titre de la carte">
                  <button type="submit">Ajouter</button>
                </form>
              </div>
            </div>

            <button @click="launchSession">Lancer la session de révision</button>


          </div>
          <div class="level-selector">
            <input type="radio" id="level1" name="level" value="1" v-model="selectedLevel">
            <label for="level1">Niveau 1</label>

            <input type="radio" id="level2" name="level" value="2" v-model="selectedLevel">
            <label for="level2">Niveau 2</label>

            <input type="radio" id="level3" name="level" value="3" v-model="selectedLevel">
            <label for="level3">Niveau 3</label>

            <input type="radio" id="level4" name="level" value="4" v-model="selectedLevel">
            <label for="level4">Niveau 4</label>
          </div>
        </div>
      </div>

    </section>
    <section v-else class="theme-details">
      <p>Veuillez sélectionner un thème pour voir les détails.</p>
    </section>
  </div>
</template>

<script>
import { getThemes } from '@/store/indexedDB';

export default {
  data() {
    return {
      themes: [],
      selectedTheme: null,
      selectedLevel: 1,
      levels: [1, 2, 3, 4],
      showCreateCardModal: false,
      newCardTitle: ''
    };
  },
  created() {
    this.loadThemes();
  },
  methods: {
    async loadThemes() {
      try {
        this.themes = await getThemes();
        this.selectThemeById();
      } catch (error) {
        console.error('Error retrieving themes:', error);
      }
    },
    selectThemeById() {
      const themeId = parseInt(this.$route.params.themeId, 10);
      if (isNaN(themeId)) {
        console.error('Invalid theme ID provided:', this.$route.params.themeId);
        return;
      }
      const foundTheme = this.themes.find(theme => theme.id === themeId);
      if (foundTheme) {
        this.selectedTheme = foundTheme;
      } else {
        console.error('Theme not found with ID:', themeId);
      }
    },
    selectTheme(theme) {
      this.selectedTheme = theme;
      this.$router.push({ name: 'Jouer', params: { themeId: theme.id } });
    },
    home() {
      this.$router.push('/');
    },
    createCard() {
      console.log('Creating card with title:', this.newCardTitle);
      // Add logic to create a card here
      this.showCreateCardModal = false; // close modal after creation
      this.newCardTitle = ''; // reset title
    },
    launchSession() {
      console.log('Launching session for', this.selectedTheme.title);
    },
    addCard() {
      console.log('Adding card...');
    }
  }
}
</script>

<style scoped>


.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
}

.modal-content {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.modal-header {
    display: flex;
    justify-content: center;
    align-items: center;
    /* padding: 10px; */
    gap: 10px;
}

.modal-header h3 {
  font-size: calc(0.5em + 0.5vw);
}

.close {
  float: right;
  cursor: pointer;
  color: #aaa;
  font-size: calc(0.5em + 1vw);
}

.close:hover {
  color: #000;
}

input[type="text"] {
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}


.level-selector {
  display: flex;
}

.level-button {
  margin: 0 10px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}

.level-button input[type="radio"] {
  display: none;
}

.level-button:checked {
  background-color: #007bff;
  color: white;
}

.theme-page {
  display: flex;
  height: 90.5vh;
  width: 100%;
}

.theme-list {
    width: 20%;
    background: #f4f4f4;
    border-right: 2px solid #e1e1e1;
    border-top: 1px solid black;
    overflow-y: auto;
    padding: 0 2vw;
}

.sticky-header {
  position: sticky;
  top: 0;
  background: #f4f4f4;
  padding: 20px 0;
  margin: 0;
  width: 100%;
  z-index: 1000; 
  font-size:calc(1em + 1vw);

}

.theme-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  margin-bottom: 5px;
  width: 15vw;
  font-size: calc(0.5em + 0.5vw);
}

.theme-item:hover {
  background-color: #e9e9e9;
}

.theme-details {
  flex-grow: 1;
  padding: 0 20px;  
  width: 80%;
  border-top: 1px solid black;
}

.theme-details p {
      margin: 0;
    height: 80.5vh;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    font-size: calc(0.7em + 0.5vw);
}

.theme-header h2 {
  margin-bottom: 10px;
}

.theme-actions button, .level-buttons button {
  margin: 5px;
  padding: 0.7vw 0.5vw;
  cursor: pointer;
  border: none;
  background-color: #D9D9D9;
  color:black;
  border-radius: 5px;
  width: 10vw;
  min-width: unset;
}

.theme-actions{
  display: flex;
  justify-content: center;
  gap: 10px;

}
.theme-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.theme-actions button, .level-buttons button {
  margin: 5px;
}


.theme-actions button:hover, .level-buttons button:hover {
  background-color: #858585;
  color:white;
  
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.card {
  height: 100px;
  background-color: #ccc;
}

.add-card {
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

ul {
    width: unset;
    display: grid;
    padding-left: 0;
    justify-content: center;
    grid-template-columns: 1fr;
    justify-items: center;
    padding-bottom: 20px;
}

.level-selector {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 20px;
  width: 70%;
}

.level-selector input[type="radio"] {
  display: none;
}

.level-selector label {
  flex: 1;
  text-align: center;
  padding: 10px;
  background-color: #f6f6f6;
  color: #000000;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: calc(0.2em + 0.8vw);
}

.level-selector input[type="radio"]:checked + label {
  background-color: #686565;
  color: white;
}

.backgrey{
  background-color: #ACACAC;
  padding: 20px;
  border: 1px solid black;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
