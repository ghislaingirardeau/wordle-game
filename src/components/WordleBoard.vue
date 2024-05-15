<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, END_GAME_ATTEMPT } from "@/settings";
import { computed, onMounted, ref } from "vue";

import englishWord from "../utils/englishWordsWith5Letters.json";

import GuessInput from "@/components/GuessInput.vue";

const props = defineProps({
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

// recuperation de l'event de guessInput
const emit = defineEmits(["restart-game"]);

// le tableau qui va recevoir tous les essais du joueur
const guessSubmited = ref<string[]>([]);

const isGameOver = computed<boolean>(() => {
  return (
    guessSubmited.value.length === END_GAME_ATTEMPT ||
    guessSubmited.value.includes(props.wordOfTheDay)
  );
});

function onSubmitGuess(guess: string) {
  guessSubmited.value.push(guess);
}

function startNewGame(event: Event) {
  guessSubmited.value = [];
  emit("restart-game");
}
</script>

<template>
  <div class="flex flex-col justify-start items-center h-screen">
    <h1 class=" text-4xl text-center text-amber-dark h-1/6 w-full">Wordle Game</h1>
    <!-- input avec l'event attaché, a chaque event, MAJ la constante  guessSubmited-->
    <guess-input
      @guess-submitted="onSubmitGuess"
      :disabledInput="isGameOver"
      :guessSubmited="guessSubmited"
      :wordOfTheDay="wordOfTheDay"
      class="h-4/6 flex flex-col justify-around w-full"
    />
    <div v-if="isGameOver" class="h-1/6 flex flex-col justify-start items-center ">
      <h2
        v-text="
          guessSubmited.includes(wordOfTheDay)
            ? VICTORY_MESSAGE
            : `${DEFEAT_MESSAGE} The word to find was: '${wordOfTheDay}'`
        "
      ></h2>
      <button type="reset" @click="startNewGame">Play again</button>
    </div>
    <div v-else class="h-1/6 flex flex-col justify-start items-center ">
      <p>Develop by GG web dev</p>
    </div>
  </div>
</template>

<style scoped lang="css">
</style>
