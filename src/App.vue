<template>
  <Transition name="fade" mode="out-in">
    <wordle-board
      :key="numberOfGamePlayed + CURRENT_LANGUAGE"
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
import {
  CURRENT_LANGUAGE,
  END_GAME_ATTEMPT,
  CURRENT_WORDOFDAY_RAW,
} from "@/settings";

import englishWords from "./utils/englishWordsWith5Letters.json";
import frenchWords from "@/utils/wordsFr5.json";

import { type Score } from "@/types/interface";

// le nombre de jeu fait par le joueur
const numberOfGamePlayed = ref<number>(1);
// comme si le key du component à chaque changement le component fait un nouveau render

const randomIndex = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min);
};

// trouve un mot aléatoire
// pour qu'il se declenche, je dois lui passer une variable qui change, donc le numberOfGamePlayed
const randomWord = computed<string>(() => {
  console.log(CURRENT_LANGUAGE.value);
  let random = "TESTS";
  if (CURRENT_LANGUAGE.value === "English") {
    random =
      englishWords[randomIndex(numberOfGamePlayed.value, englishWords.length)];
  }
  if (CURRENT_LANGUAGE.value === "French") {
    CURRENT_WORDOFDAY_RAW.value =
      frenchWords[randomIndex(numberOfGamePlayed.value, frenchWords.length)];
    random = CURRENT_WORDOFDAY_RAW.value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
  }
  console.log(random, CURRENT_WORDOFDAY_RAW.value);
  return random;
});

const wordsListLang = computed(() => {
  if (CURRENT_LANGUAGE.value === "English") {
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

const scores: Score[] = reactive([]);

function updateScores(payload: number) {
  scores.push({
    score: payload == END_GAME_ATTEMPT.value ? "Lost" : payload,
    game: numberOfGamePlayed.value,
  });
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
