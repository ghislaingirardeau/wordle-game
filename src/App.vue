<script setup lang="ts">
import { computed } from "vue";
import WordleBoard from "./components/WordleBoard.vue";

import englishWord from "./utils/englishWordsWith5Letters.json";

const randomIndex = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomWord = computed(() => {
  return englishWord[randomIndex(0, 2500)];
});
</script>

<template>
  <wordle-board :wordOfTheDay="randomWord" />
</template>
