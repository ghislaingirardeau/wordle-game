<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, END_GAME_ATTEMPT } from "@/settings";
import { computed, ref } from "vue";

import englishWord from "../utils/englishWordsWith5Letters.json";

import GuessInput from "@/components/GuessInput.vue";

defineProps({
  wordOfTheDay: {
    type: String,
    required: true,
    // methode sur la props pour vérifier que celle-ci aura bien une longueur de 5
    validator: (wordGiven: string) =>
      wordGiven.length === 5 &&
      wordGiven === wordGiven.toUpperCase() &&
      englishWord.includes(wordGiven),
  },
});

const guessSubmited = ref<string[]>([]);
</script>

<template>
  <!-- input avec l'event attaché, a chaque event, MAJ la constante  guessSubmited-->
  <guess-input
    @guess-submitted="(guess:string) => (guessSubmited.push(guess))"
  />
  <p
    v-if="
      guessSubmited.length === END_GAME_ATTEMPT ||
      guessSubmited.includes(wordOfTheDay)
    "
    v-text="
      guessSubmited.includes(wordOfTheDay) ? VICTORY_MESSAGE : DEFEAT_MESSAGE
    "
  ></p>
</template>
