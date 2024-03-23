<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from "@/settings";
import { computed, ref } from "vue";

import englishWord from "../utils/englishWordsWith5Letters.json";

const guessInProcess = ref<string | null>(null);
//* Pour passer une donnée à notre parent
// define the event
const emit = defineEmits<{
  // name of the event et je lui passe le string
  "guess-submitted": [guess: string];
}>();

const formattedGuessInProcess = computed<string>({
  get() {
    return guessInProcess.value ?? "";
  },
  set(rawValue: string) {
    const regex = /\d+/;
    guessInProcess.value = null;
    /* guessInProcess.value?.replace(regex, "") */
    // recupere ce que tape l'utilisateur et format le
    guessInProcess.value = rawValue
      .slice(0, WORD_SIZE)
      .toUpperCase()
      .replace(/[^A-Z]+/gi, "");
  },
});

function onSubmit() {
  if (!englishWord.includes(formattedGuessInProcess.value)) {
    // ne fera rien quand je tape enter
    return;
  }
  // je passe la valeur au component parent
  emit("guess-submitted", formattedGuessInProcess.value);
}
</script>

<template>
  <input
    type="text"
    v-model="formattedGuessInProcess"
    :maxlength="WORD_SIZE"
    @keydown.enter="onSubmit"
  />
</template>