<script setup lang="ts">
import { computed, ref } from "vue";
import WordleBoard from "./components/WordleBoard.vue";

import englishWord from "./utils/englishWordsWith5Letters.json";

// le nombre de jeu fait par le joueur
const numberOfGamePlayed = ref<number>(1);
// comme si le key du component à chaque changement le component fait un nouveau render

const randomIndex = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min);
};

// trouve un mot aléatoire
// pour qu'il se declenche, je dois lui passer une variable qui change, donc le numberOfGamePlayed
const randomWord = computed(() => {
  const random = englishWord[randomIndex(numberOfGamePlayed.value, 2500)];
  console.log(random);
  return random;
});
</script>

<template>
  <wordle-board
    :key="numberOfGamePlayed"
    :wordOfTheDay="randomWord"
    @restart-game="numberOfGamePlayed++"
  />
</template>

<style>
body {
  height: 100vh;
  margin: 0px;
}
</style>
