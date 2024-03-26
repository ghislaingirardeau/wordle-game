<template>
  <ul class="letters">
    <li v-for="numberLetter in 5" :key="`${numberLetter}`" class="letter">
      {{ wordToDisplay.charAt(numberLetter - 1) }}
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  wordToDisplay: {
    type: String,
    require: true,
  },
});
</script>

<style lang="css" scoped>
.letters {
  display: flex;
  align-items: center;
  justify-content: center;
  list-style-type: none;
}
.letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 2em;
  margin-inline: 0.4em;
  padding: 0.4em;
  border: 2px solid grey;
  font-size: 2em;
}
</style>
