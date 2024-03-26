<script setup lang="ts">
import { computed, ref } from "vue";
import WordleBoard from "./components/WordleBoard.vue";

import englishWord from "./utils/englishWordsWith5Letters.json";

const numberOfGamePlayed = ref<number>(1);

const randomIndex = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomWord = computed(() => {
  const random = englishWord[randomIndex(numberOfGamePlayed.value, 2500)];
  console.log(random);
  return random;
});

function restart() {
  numberOfGamePlayed.value++;
}
</script>

<template>
  <wordle-board
    :key="numberOfGamePlayed"
    :wordOfTheDay="randomWord"
    @restart-game="restart"
  />
</template>

<style>
body {
  max-height: 100vh;
  margin: 0px;
}
</style>
