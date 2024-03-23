<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from "@/settings";
import { ref } from "vue";

defineProps<{
  wordOfTheDay: string;
}>();

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
