<script setup lang="ts">
import { WORD_SIZE, END_GAME_ATTEMPT } from "@/settings";
import { computed, ref } from "vue";

import englishWord from "../utils/englishWordsWith5Letters.json";

import GuessLetter from "@/components/GuessLetter.vue";

const props = defineProps({
  disabledInput: {
    type: Boolean,
    required: true,
  },
  guessSubmited: {
    type: Array,
    required: true,
  },
});

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

function onSubmit(event: Event) {
  if (!englishWord.includes(formattedGuessInProcess.value)) {
    // ne fera rien quand je tape enter
    return;
  }
  // je passe la valeur au component parent
  emit("guess-submitted", formattedGuessInProcess.value);
  guessInProcess.value = null;
}

function reFocusOnBlur(event: Event) {
  // pour ne pas perdre le focus sur le bouton
  const input = event.target as HTMLInputElement;
  input.focus();
}

function wordToDisplayInLetter(guessAttempt) {
  // si tu as un mot dans le tatbleau qui correspond à la tentative précédente, tu renvoie ce mot
  if (props.guessSubmited[guessAttempt - 1]) {
    return props.guessSubmited[guessAttempt - 1];
  }
  // si tu as 2 mots dans le tableau (donc 2 tentatives), et donc que la prochaine est égale à la tentative en cours
  // tu renvoie le mot en cours de formatage
  if (props.guessSubmited.length + 1 === guessAttempt) {
    return formattedGuessInProcess.value;
  }
  // pour les prochains mots, tu les laisse vide
  return "";
}
</script>

<template>
  <div>
    <GuessLetter
      v-for="guessAttempt in END_GAME_ATTEMPT"
      :key="`${guessAttempt}`"
      :wordToDisplay="wordToDisplayInLetter(guessAttempt)"
    />

    <input
      type="text"
      v-model="formattedGuessInProcess"
      :maxlength="WORD_SIZE"
      @keydown.enter="onSubmit"
      autofocus
      :disabled="props.disabledInput"
      @blur="reFocusOnBlur"
    />
  </div>
</template>

<style scoped lang="css">
input {
  position: fixed;
  top: 0px;
  opacity: 0;
  right: 0;
}
input:focus-visible {
  outline: none;
  border: none;
  color: white;
}
input:disabled {
  outline: none;
  border: none;
  color: white;
  background-color: white;
}
</style>
