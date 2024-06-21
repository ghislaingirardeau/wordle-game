<template>
  <div
    class="flex flex-col justify-start items-center min-h-screen lg:h-screen font-Kalam mx-3"
  >
    <TheHeader :wordOfTheDay="wordOfTheDay" />

    <!-- Modal to display info -->
    <dialog-info ref="dialogComponent" :isGameOver="isGameOver" idName="game">
      <template v-slot:title> Result of the game </template>
      <template v-slot:message>
        <h2 v-if="guessSubmited.includes(wordOfTheDay)" class="mb-2">
          {{ VICTORY_MESSAGE }}
        </h2>
        <h2 v-else class="mb-2">
          {{ DEFEAT_MESSAGE }} The word to find was: {{ wordOfTheDay }}
        </h2>
        <h3 v-if="wordDefinition" class="my-3">
          {{ wordDefinition }}
        </h3>
        <p>{{ scores }}</p>
        <button
          v-if="!wordDefinition && CURRENT_LANGUAGE === 'French'"
          name="definition"
          type="button"
          class="text-marine bg-amber hover:bg-amber focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
          @click.stop="getAndShowDefinition"
        >
          <svg
            v-if="isLoadingDefinition"
            aria-hidden="true"
            role="status"
            class="inline w-4 h-4 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              class="fill-marine"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          <span v-else> Word definition </span>
        </button>
        <button
          name="reset"
          type="button"
          class="text-marine bg-amber hover:bg-amber focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
          @click.stop="startNewGame"
        >
          Play again
        </button>
      </template>
    </dialog-info>

    <!-- input avec l'event attaché, a chaque event, MAJ la constante  guessSubmited-->
    <guess-input
      @guess-submitted="onSubmitGuess"
      :disabledInput="isGameOver"
      :guessSubmited="guessSubmited"
      :wordOfTheDay="wordOfTheDay"
      :wordsListLang="wordsListLang"
      class="guesses_block flex flex-col justify-around mt-2 min-h-[60vh] w-[90%] md:w-[60%] lg:h-[70vh] lg:w-[55%] lg:px-24"
    />
    <Letters-helper
      v-if="isLargeScreen()"
      :guessSubmited="guessSubmited"
      :wordOfTheDay="wordOfTheDay"
      class="keyboard_block w-full flex flex-wrap my-2"
    />
    <footer
      class="footer_block min-h-[5vh] lg:h-[10vh] w-full lg:w-[55%] flex flex-col justify-start items-center border-solid border-amber border-t-2"
    >
      <div>
        <p>Develop by GG web dev</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  VICTORY_MESSAGE,
  DEFEAT_MESSAGE,
  END_GAME_ATTEMPT,
  WORD_SIZE,
  CURRENT_LANGUAGE,
} from "@/settings";
import { computed, ref, reactive, watch } from "vue";

import TheHeader from "@/components/TheHeader.vue";
import GuessInput from "@/components/GuessInput.vue";
import LettersHelper from "@/components/lettersHelper.vue";
import DialogInfo from "@/components/DialogInfo.vue";

import { isLargeScreen } from "@/mixins/useScreen";
import { useFrenchDictionary } from "@/mixins/useDictionary";

const props = defineProps({
  wordsListLang: {
    type: Array,
    required: true,
  },
  wordOfTheDay: {
    type: String,
    required: true,
    // methode sur la props pour vérifier que celle-ci aura bien une longueur de 5
    validator: (wordGiven: string, props) => {
      const words = props.wordsListLang as string[];
      if (
        wordGiven.length === Number(`${WORD_SIZE}`) &&
        wordGiven === wordGiven.toUpperCase() &&
        words.includes(wordGiven)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  scores: {
    type: Array,
  },
});

// recuperation de l'event de guessInput
const emit = defineEmits(["restart-game", "update-score"]);

// le tableau qui va recevoir tous les essais du joueur
const guessSubmited = ref<string[]>([]);

// la définition du mot du jour
const wordDefinition = ref<string | null>(null);
const isLoadingDefinition = ref(false);

const isGameOver = computed<boolean>(() => {
  return (
    guessSubmited.value.length === END_GAME_ATTEMPT.value ||
    guessSubmited.value.includes(props.wordOfTheDay)
  );
});

watch(isGameOver, (a, b) => {
  console.log("game is over");
  emit("update-score", guessSubmited.value.length);
});

function onSubmitGuess(guess: string) {
  guessSubmited.value.push(guess);
}

function startNewGame(event: Event) {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  emit("restart-game");
  guessSubmited.value = [];
}

async function getAndShowDefinition() {
  wordDefinition.value =
    props.wordOfTheDay +
    ": " +
    (await useFrenchDictionary(isLoadingDefinition, props.wordOfTheDay));
}
//----------------------------
</script>

<style scoped lang="css"></style>
