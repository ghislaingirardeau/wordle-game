<template>
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
          @click="contentToShow('rules')"
          class="text-xl underline text-marine cursor-pointer"
          data-type="rules"
        >
          Rules
        </h2>
        <h2
          @click="contentToShow('difficulty')"
          class="text-xl underline text-marine inline-block cursor-pointer"
          data-type="difficulty"
        >
          Difficulty
        </h2>
        <h2
          @click="contentToShow('languages')"
          class="text-xl underline text-marine inline-block cursor-pointer"
          data-type="languages"
        >
          Languages
        </h2>
        <h2
          @click="contentToShow('hint')"
          class="text-xl underline text-marine inline-block cursor-pointer"
          data-type="Hint"
        >
          Hint
        </h2>
      </div>

      <div class="content_block w-full">
        <Transition mode="out-in">
          <Difficulty v-if="isShow.difficulty" />
          <Rules v-else-if="isShow.rules" />
          <Languages v-else-if="isShow.languages" />
          <Hint v-else-if="isShow.hint" />
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Difficulty from "@/components/menu/Difficulty.vue";
// @ts-ignore: Unreachable code error
import Rules from "@/components/menu/Rules.vue";
import Languages from "@/components/menu/Langues.vue";
import Hint from "@/components/menu/Hint.vue";

import { ref, reactive } from "vue";

interface Show {
  difficulty: boolean;
  rules: boolean;
  languages: boolean;
  hint: boolean;
}
// display / hide option menu
const isShow = reactive({
  difficulty: false,
  rules: false,
  languages: false,
  hint: false,
});

function contentToShow(content: string) {
  if (content === "rules") {
    toggleCurrentAndHideOthers("rules");
    return;
  }
  if (content === "difficulty") {
    toggleCurrentAndHideOthers("difficulty");
    return;
  }
  if (content === "languages") {
    toggleCurrentAndHideOthers("languages");
    return;
  }
  if (content === "hint") {
    toggleCurrentAndHideOthers("hint");
    return;
  }
}

// toggle la div concerné et ferme toutes les autres
function toggleCurrentAndHideOthers(current: string) {
  isShow[current as keyof Show] = !isShow[current as keyof Show];
  for (let key in isShow) {
    key != current ? (isShow[key as keyof Show] = false) : null;
  }
}
</script>

<style scoped>
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
