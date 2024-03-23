<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from "@/settings";
import { computed, ref } from "vue";

import englishWord from "../utils/englishWordsWith5Letters.json";

defineProps({
  wordOfTheDay: {
    type: String,
    // methode sur la props pour vérifier que celle-ci aura bien une longueur de 5
    validator: (wordGiven: string) =>
      wordGiven.length === 5 &&
      wordGiven === wordGiven.toUpperCase() &&
      englishWord.includes(wordGiven),
  },
});

const guessInProcess = ref("");
const guessSubmited = ref("");

const formattedGuessInProcess = computed({
  get() {
    return guessInProcess.value;
  },
  set(rawValue: string) {
    guessInProcess.value = rawValue.slice(0, WORD_SIZE);
  },
});

function onSubmit() {
  console.log(guessInProcess.value);
  if (!englishWord.includes(guessInProcess.value)) {
    return;
  }

  guessSubmited.value = guessInProcess.value;
}
</script>

<template>
  <input
    type="text"
    v-model="formattedGuessInProcess"
    :maxlength="WORD_SIZE"
    @keydown.enter="onSubmit"
  />
  <p
    v-if="guessSubmited.length > 0"
    v-text="guessSubmited === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"
  ></p>
</template>
