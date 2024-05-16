<script setup lang="ts">
import {
  VICTORY_MESSAGE,
  DEFEAT_MESSAGE,
  END_GAME_ATTEMPT,
  WORD_SIZE,
} from "@/settings";
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
function reFocusInput() {
  console.log(document.querySelector('input'));
  document.querySelector('input').focus()
}

</script>

<template>
  <div
    class="flex flex-col justify-start items-center h-screen font-Kalam mx-3"
    @click="reFocusInput"
  >
    <header class="flex flex-col justify-start w-full">
      <h1
        class="text-4xl text-center text-amber min-h-[15%] font-PermanentMarker mb-4"
      >
        Wordle Game
      </h1>
      <div class="border-solid border-amber border-t-2 border-b-2 py-3">
        <h2 class="text-xl underline text-marine">Rules of the game</h2>
        <p class="text-xs italic text-marine">

            Try to find a {{ WORD_SIZE }} letter word in
            {{ END_GAME_ATTEMPT }} tries and Tap
            <code><small>'Enter'</small></code> to valid the word :
            <ul class="list-disc list-inside">
              <li>Letter in Yellow: the letter is correct but at the wrong
                position
              </li>
              <li>Letter in Green: The letter is correctly placed</li>
            </ul>

        </p>
      </div>
    </header>
    <!-- input avec l'event attaché, a chaque event, MAJ la constante  guessSubmited-->
    <guess-input
      @guess-submitted="onSubmitGuess"
      :disabledInput="isGameOver"
      :guessSubmited="guessSubmited"
      :wordOfTheDay="wordOfTheDay"
      class="h-[80%] flex flex-col justify-around w-full my-3"
    />
    <footer
      class="min-h-[10%] w-full flex flex-col justify-start items-center border-solid border-amber border-t-2"
    >
      <div v-if="isGameOver">
        <h2
          v-text="
            guessSubmited.includes(wordOfTheDay)
              ? VICTORY_MESSAGE
              : `${DEFEAT_MESSAGE} The word to find was: '${wordOfTheDay}'`
          "
        ></h2>
        <button type="reset" @click="startNewGame">Play again</button>
      </div>
      <div v-else>
        <p>Develop by GG web dev</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="css"></style>
