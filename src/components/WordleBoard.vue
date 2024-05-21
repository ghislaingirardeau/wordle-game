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
import DifficultyTab from "@/components/DifficultyTab.vue";

const props = defineProps({
  wordOfTheDay: {
    type: String,
    required: true,
    // methode sur la props pour vérifier que celle-ci aura bien une longueur de 5
    validator: (wordGiven: string) =>
      wordGiven.length === Number(`${WORD_SIZE}`) &&
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
    guessSubmited.value.length === END_GAME_ATTEMPT.value ||
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

// display / hide options menu
const isOptionsMenu = ref(false);
function showOptionsMenu() {
  isOptionsMenu.value = !isOptionsMenu.value;
}
//----------------------------
</script>

<template>
  <div
    class="flex flex-col lg:flex-wrap justify-start items-center min-h-screen lg:h-screen font-Kalam mx-3"
  >
    <header
      class="flex flex-col justify-start w-full min-h-[15vh] lg:h-[90vh] lg:w-[30%] border-solid border-amber lg:border-r-2"
    >
      <h1 class="text-4xl text-center text-amber font-PermanentMarker my-2">
        Wordle Game
      </h1>

      <div
        class="flex flex-col justify-start lg:h-[100%] items-center border-solid border-amber border-t-2 border-b-2 lg:border-b-0 py-3 md:text-center lg:text-left"
      >
        <div class="rules_block">
          <h2 class="text-xl underline text-marine">Rules of the game</h2>
          <div class="text-xs italic text-marine">
            Try to find a {{ WORD_SIZE }} letter word in
            {{ END_GAME_ATTEMPT }} tries and Tap
            <code><small>'Enter'</small></code> to valid the word :
            <ul class="list-disc list-inside">
              <li>
                Letter in Yellow: the letter is correct but at the wrong
                position
              </li>
              <li>Letter in Green: The letter is correctly placed</li>
            </ul>
          </div>
        </div>
        <div class="actions_block w-full my-3">
          <h2 class="text-xl underline text-marine inline-block mr-3">
            Options
          </h2>
          <svg
            @click="showOptionsMenu"
            class="h-8 w-8 text-marine inline-block mb-1 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <DifficultyTab :isOptionsMenu="isOptionsMenu" />
        </div>
        <div v-if="isGameOver" class="result_block w-full">
          <h2
            v-text="
              guessSubmited.includes(wordOfTheDay)
                ? VICTORY_MESSAGE
                : `${DEFEAT_MESSAGE} The word to find was: '${wordOfTheDay}'`
            "
            class="text-xl underline text-marine"
          ></h2>
          <button
            name="reset"
            type="button"
            class="text-marine bg-amber hover:bg-amber focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
            @click="startNewGame"
          >
            Play again
          </button>
        </div>
      </div>
    </header>

    <!-- input avec l'event attaché, a chaque event, MAJ la constante  guessSubmited-->
    <guess-input
      @guess-submitted="onSubmitGuess"
      :disabledInput="isGameOver"
      :guessSubmited="guessSubmited"
      :wordOfTheDay="wordOfTheDay"
      class="min-h-[75vh] md:w-[70%] lg:h-[100vh] flex flex-col lg:order-last justify-around w-full lg:w-[70%] my-3"
    />
    <footer
      class="min-h-[5vh] lg:h-[10vh] w-full lg:w-[30%] flex flex-col justify-start items-center border-solid border-amber border-t-2 lg:border-r-2"
    >
      <div>
        <p>Develop by GG web dev</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="css"></style>
