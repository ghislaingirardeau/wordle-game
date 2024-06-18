<template>
  <Transition name="fade" mode="out-in">
    <wordle-board
      :key="numberOfGamePlayed + CURRENT_LANGUAGES"
      :wordOfTheDay="randomWord"
      :wordsListLang="wordsListLang"
      :scores="scores"
      @restart-game="restartGame"
      @update-score="updateScores"
    />
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import WordleBoard from "./components/WordleBoard.vue";
import { CURRENT_LANGUAGES, END_GAME_ATTEMPT } from "@/settings";

import englishWords from "./utils/englishWordsWith5Letters.json";
import frenchWords from "@/utils/wordsFr5.json";

// le nombre de jeu fait par le joueur
const numberOfGamePlayed = ref<number>(1);
// comme si le key du component à chaque changement le component fait un nouveau render

const randomIndex = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min);
};

// trouve un mot aléatoire
// pour qu'il se declenche, je dois lui passer une variable qui change, donc le numberOfGamePlayed
const randomWord = computed<string>(() => {
  console.log(CURRENT_LANGUAGES.value);
  let random = "TESTS";
  if (CURRENT_LANGUAGES.value === "English") {
    random =
      englishWords[randomIndex(numberOfGamePlayed.value, englishWords.length)];
  }
  if (CURRENT_LANGUAGES.value === "French") {
    random = frenchWords[
      randomIndex(numberOfGamePlayed.value, frenchWords.length)
    ]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
  }
  console.log(random);
  return random;
});

const wordsListLang = computed(() => {
  if (CURRENT_LANGUAGES.value === "English") {
    return englishWords;
  } else {
    return frenchWords.map((w) =>
      w
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
    );
  }
});

function restartGame(payload: number) {
  numberOfGamePlayed.value++;
}

// REGISTER SCORES
interface Score {
  score: number | string;
  game: number;
}

const scores: Score[] = reactive([]);

function updateScores(payload: number) {
  scores.push({
    score: payload == END_GAME_ATTEMPT.value ? "Lost" : payload,
    game: numberOfGamePlayed.value,
  });
  console.log(scores);
}
//-----------------------
</script>

<style>
body {
  margin: 0px;
  background-color: theme("colors.white");
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
