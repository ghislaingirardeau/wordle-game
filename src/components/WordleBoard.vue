<template>
  <div
    class="flex flex-col justify-start items-center min-h-screen lg:h-screen font-Kalam mx-3"
  >
    <header
      class="menu_block flex flex-col justify-start w-full min-h-[15vh] lg:w-[55%] border-solid border-amber"
    >
      <h1 class="text-4xl text-center text-amber font-PermanentMarker my-2">
        Wordle Game
      </h1>

      <div
        class="flex flex-col justify-start lg:h-[100%] items-center border-solid border-amber border-t-2 border-b-2 lg:border-b-0 md:text-center lg:text-left"
      >
        <div class="actions_block w-full flex justify-around my-3">
          <h2
            @click="toggleContentToShow('rules')"
            class="text-xl underline text-marine cursor-pointer"
            data-type="rules"
          >
            Rules
          </h2>
          <h2
            @click="toggleContentToShow('options')"
            class="text-xl underline text-marine inline-block cursor-pointer"
            data-type="options"
          >
            Options
          </h2>
          <h2
            @click="toggleContentToShow('languages')"
            class="text-xl underline text-marine inline-block cursor-pointer"
            data-type="languages"
          >
            Languages
          </h2>
        </div>

        <div class="content_block w-full">
          <Transition mode="out-in">
            <Difficulty v-if="isOptionsShow" />
            <Rules v-else-if="isRulesShow" />
            <Languages v-else-if="isLanguagesShow" />
          </Transition>
        </div>

        <!-- Modal to display info -->
        <dialog-info
          ref="dialogComponent"
          :isGameOver="isGameOver"
          idName="game"
        >
          <template v-slot:title> Result of the game </template>
          <template v-slot:message>
            <h2 v-if="guessSubmited.includes(wordOfTheDay)">
              {{ VICTORY_MESSAGE }}
            </h2>
            <h2 v-else>
              {{ DEFEAT_MESSAGE }} The word to find was: {{ wordOfTheDay }}
            </h2>
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
      </div>
    </header>

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
      class="helper_block w-full flex flex-wrap my-1"
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
} from "@/settings";
import { computed, ref } from "vue";

import GuessInput from "@/components/GuessInput.vue";
import Difficulty from "@/components/menu/Difficulty.vue";
import LettersHelper from "@/components/lettersHelper.vue";
import DialogInfo from "./DialogInfo.vue";
// @ts-ignore: Unreachable code error
import Rules from "@/components/menu/Rules.vue";
import Languages from "@/components/menu/Langues.vue";

import { isLargeScreen } from "@/mixins/useScreen.js";

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
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  guessSubmited.value = [];
  emit("restart-game");
}

// display / hide options menu
const isOptionsShow = ref(false);
const isRulesShow = ref(false);
const isLanguagesShow = ref(false);

function toggleContentToShow(content: string) {
  if (content === "rules") {
    isRulesShow.value = !isRulesShow.value;
    isOptionsShow.value = false;
    isLanguagesShow.value = false;
    return;
  }
  if (content === "options") {
    isRulesShow.value = false;
    isOptionsShow.value = !isOptionsShow.value;
    isLanguagesShow.value = false;
    return;
  }
  if (content === "languages") {
    isRulesShow.value = false;
    isOptionsShow.value = false;
    isLanguagesShow.value = !isLanguagesShow.value;
    return;
  }
}
//----------------------------
</script>

<style scoped lang="css">
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
  max-height: 100px;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(0);
  max-height: 0px;
}
</style>
@/mixins/useScreen.js
