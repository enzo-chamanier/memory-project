

<template>
  <link rel="manifest" href="/manifest.json">
  <div class="header">

        <h2>MEMO FLASHCARDS</h2>

  </div>
  <div class="content">
    <router-view></router-view>
  </div>

</template>

<script>
export default {
  name: 'App',
  mounted() {
    document.title = "MEMO FLASHCARDS";
  }
}
</script>




