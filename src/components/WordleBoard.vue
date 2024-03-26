<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, END_GAME_ATTEMPT } from "@/settings";
import { computed, ref } from "vue";

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

function startNewGame() {
  guessSubmited.value = [];
}
</script>

<template>
  <div class="game">
    <h1 class="game_header">Wordle Game</h1>
    <!-- input avec l'event attaché, a chaque event, MAJ la constante  guessSubmited-->
    <guess-input
      @guess-submitted="onSubmitGuess"
      :disabledInput="isGameOver"
      :guessSubmited="guessSubmited"
      class="game_content"
    />
    <div v-if="isGameOver" class="game_footer">
      <h2
        v-text="
          guessSubmited.includes(wordOfTheDay)
            ? VICTORY_MESSAGE
            : DEFEAT_MESSAGE
        "
      ></h2>
      <button type="reset" @click="startNewGame">Play again</button>
    </div>
  </div>
</template>

<style scoped lang="css">
.game {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.game_header {
  font-size: 2.5rem;
  max-height: 7vh;
}
.game_content {
  max-height: 70vh;
}
.game_footer {
  margin-top: 0.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
