<template>
  <div class="theme-page" :class="{ 'fullscreen': isFullscreen }">
    <aside class="theme-list" v-if="!isFullscreen">
      <h1 class="sticky-header">THEMES</h1>
      <ul>
        <li v-for="theme in themes" :key="theme.id" @click="selectTheme(theme)" 
            :class="{ 'theme-item-selected': selectedTheme && theme.id === selectedTheme.id }" class="theme-item">
          {{ theme.title }}
        </li>
      </ul>
    </aside>
    <section v-if="selectedTheme" class="theme-details">
      <div class="timer">{{ timer }}</div>

      <div class="theme-header">
        <h2>Votre thème : {{ selectedTheme.title }}</h2>
        <div class="backgrey" v-if="!isFullscreen">
          <div class="theme-actions" >
            <button @click="home">Accueil</button>
            <button @click="showCreateCardModal = true">Créer une carte</button>
            <!-- Modal Popup for Creating Card -->
            <div v-if="showCreateCardModal" class="modal">
              <div class="modal-content">
                <div class="modal-header">
                  <h3>Créer une nouvelle carte</h3>
                  <span class="close" @click="closeModal">&times;</span>
                </div>
                <form @submit.prevent="createCard">
                  <div>
                    <label for="cardFront">Recto de la carte (Question):</label>
                    <input type="text" id="cardFront" v-model="newCardFront" placeholder="Question" required>
                  </div>
                  <div>
                    <label for="cardBack">Verso de la carte (Réponse):</label>
                    <input type="text" id="cardBack" v-model="newCardBack" placeholder="Réponse" required>
                  </div>
                  <button type="submit">Ajouter</button>
                </form>
              </div>
            </div>
            <button @click="launchSession">Lancer la session de révision</button>
          </div>
      
        </div>
        <!-- Display cards here -->
         <div class="cards-grid" v-if="cards.length > 0">
          <div v-for="card in cards" :key="card.id" class="card"
              :class="{ 'marked-for-deletion': card.markedForDeletion, 'flipped': card.showBack }"
              @contextmenu.prevent="markCardForDeletion(card)"
              @click="toggleCardSide(card)">
            <div class="card-face card-front">
              RECTO <br><br>{{ card.front }}
            </div>
            <div class="card-face card-back">
              VERSO <br><br>{{ card.back }}
              <div class="level-selector">
                <button @click.stop="handleSuccess(card)">J'ai réussi</button>
                <button @click.stop="handleFailure(card)">J'ai eu faux</button>
              </div>
            </div>
          </div>
        </div>



        <!-- Show message if no cards are available -->
        <div v-else class="card-details">
          <p>Aucune carte trouvée pour ce thème.</p>
        </div>

      </div>
    </section>
    <section v-else class="theme-details">
      <p>Veuillez sélectionner un thème pour voir les détails.</p>
    </section>
  </div>
</template>

<script>
import { getThemesForCategory,getThemeById, getCardsForTheme, addCard, deleteCardFromTheme } from '@/store/indexedDB';

export default {
  data() {
    return {
      themes: [],
      selectedTheme: null,
      isFullscreen: false,
      cards: [],  
      selectedLevel: 1,
      levels: [1, 2, 3, 4],
      showCreateCardModal: false,
      newCardFront: '',
      newCardBack: ''
    };
  },
  created() {
    this.loadThemes();
  },
  methods: {
  async loadThemes() {
    try {
      const themeId = parseInt(this.$route.params.themeId, 10);
      if (isNaN(themeId)) {
        console.error('Invalid theme ID:', this.$route.params.themeId);
        throw new Error('Invalid theme ID');
      }
      const theme = await getThemeById(themeId);
      if (!theme) {
        console.error('Theme not found:', themeId);
        throw new Error('Theme not found');
      }
      this.themes = await getThemesForCategory(theme.categoryId);
      this.selectThemeById(themeId);
    } catch (error) {
      console.error('Error retrieving themes:', error);
    }
  },
  toggleCardSide(card) {
    card.showBack = !card.showBack;
  },
    async selectThemeById() {
      const themeId = parseInt(this.$route.params.themeId, 10);
      if (!isNaN(themeId)) {
        const foundTheme = this.themes.find(theme => theme.id === themeId);
        if (foundTheme) {
          this.selectedTheme = foundTheme;
          try {
            let fetchedCards = await getCardsForTheme(themeId);
            this.cards = fetchedCards.map(card => ({ ...card, markedForDeletion: false }));
          } catch (error) {
            console.error('Error retrieving cards for theme:', error);
            this.cards = [];
          }
        } else {
          console.error('Theme not found with ID:', themeId);
          this.cards = [];
        }
      } else {
        console.error('Invalid theme ID provided:', this.$route.params.themeId);
        this.cards = [];
      }
    },
    async selectTheme(theme) {
      this.selectedTheme = theme;
      try {
        this.cards = await getCardsForTheme(theme.id);
      } catch (error) {
        console.error('Error retrieving cards for theme:', error);
        this.cards = [];
      }
      this.$router.push({ name: 'Jouer', params: { themeId: theme.id } });
    },
    home() {
      this.$router.push('/');
    },
    async createCard() {
      const card = {
        front: this.newCardFront,
        back: this.newCardBack,
        themeId: this.selectedTheme.id,
        level: 0 // Default level set to 0 for new cards
      };
      try {
        await addCard(card);
        this.cards.push(card); // Add the new card to the cards array immediately after creation
        console.log('Card successfully created:', card);
        this.showCreateCardModal = false;
        this.newCardFront = '';
        this.newCardBack = '';

        window.location.reload();
      } catch (error) {
        console.error('Failed to create card:', error);
      }
    },
    async deleteCardFromTheme(card) {
      try {
        await deleteCardFromTheme(card.id);
        this.cards = this.cards.filter(c => c.id !== card.id); // Filter out the card to delete
        console.log('Card successfully deleted:', card);
      } catch (error) {
        console.error('Failed to delete card:', error);
      }
    },
     async markCardForDeletion(card) {
      if (card.markedForDeletion) {
        await this.deleteCardFromTheme(card);
      } else {
        card.markedForDeletion = true;
        console.log(`Card ID: ${card.id}`); // Log the card ID
      }
    },
    closeModal() {
      this.showCreateCardModal = false;
      this.newCardFront = '';
      this.newCardBack = '';
    },
     launchSession() {
      this.isFullscreen = true;
      this.startTimer();
    },
    startTimer() {
      setInterval(() => {
        this.timer++;
      }, 1000);
    },
    closeSession() {
      this.isFullscreen = false;
    },

    handleSuccess(card) {
      if (card.level < this.levels.length) {
        card.level += 1;
      }
      console.log(`Succès ! Le niveau pour la carte ${card.id} est maintenant ${card.level}`);
    },

    handleFailure(card) {
      if (card.level > 0) {
        card.level -= 1;
      }
      console.log(`Échec. Le niveau pour la carte ${card.id} est maintenant ${card.level}`);
    }

  }
}

</script>

<style scoped>

button{
  min-width: 90px;
  width: 12vw;
}


.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: white;
}

.card {
  transition: transform 0.3s;
  transform-style: preserve-3d;
}

.card.flipped .card-front {
  transform: rotateY(180deg);
}

.card.flipped .card-back {
  transform: rotateY(0deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-front {
  background-color: #D9D9D9;
}

.card-back {
  background-color: #ACACAC;
  color: white;
  transform: rotateY(180deg);
}

.marked-for-deletion {
  background-color: red !important;}

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
  border: 1px solid #ccc;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 20px;
  width: 70%;
  background-color: white;
  flex-direction: column;
  align-items: center;
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

.card-details p{
      display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    font-size: calc(0.7em + 0.5vw);
}

.theme-details p {
    margin: 0;
    height: 40.5vh;
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
  gap: 20px;
  padding: 20px;
}

.card {
    background-color: rgba(23, 23, 23, 0.462);
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    min-height: 250PX;
    perspective: 1000px;
    width: 20vw;
    min-width: 160px;
}

.card > div {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  backface-visibility: hidden;
  transition: transform 1s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.card > div:first-child {
  background-color: #D9D9D9; 
  transform: rotateY(0deg);
}

.card > div:last-child {
  background-color: #ACACAC;
  color: white; 
}

.card.showBack > div:first-child {
  transform: rotateY(180deg); 
}

.card.showBack > div:last-child {
  transform: rotateY(0deg); 
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
    border-radius: 5px;
    overflow: hidden;
    margin-top: 20px;
    width: 70%;
    background-color: white;
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
    border-radius: 20px;
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
