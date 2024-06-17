<template>
  <div>
    <ul>
      <li v-for="theme in themes" :key="theme.id">
        {{ theme.title }}
        <button @click="deleteTheme(theme.id)">Supprimer</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['themes'],
  methods: {

    deleteTheme(id) {
      this.$emit('deleteTheme', id);
    }
  }
}
</script>



