<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from "@/settings";
import { ref } from "vue";

defineProps({
  wordOfTheDay: {
    type: String,
    // methode sur la props pour vérifier que celle-ci aura bien une longueur de 5
    validator: (wordGiven: string) =>
      wordGiven.length === 5 && wordGiven === wordGiven.toUpperCase(),
  },
});

const guessInProcess = ref("");
const guessSubmited = ref("");
</script>

<template>
  <input
    type="text"
    v-model="guessInProcess"
    @keydown.enter="guessSubmited = guessInProcess"
  />
  <p
    v-if="guessSubmited.length > 0"
    v-text="guessSubmited === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"
  ></p>
</template>
