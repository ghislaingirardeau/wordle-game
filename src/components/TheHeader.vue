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
        <h2
          @click="toggleContentToShow('hint')"
          class="text-xl underline text-marine inline-block cursor-pointer"
          data-type="Hint"
        >
          Hint
        </h2>
      </div>

      <div class="content_block w-full">
        <Transition mode="out-in">
          <Difficulty v-if="isOptionsShow" />
          <Rules v-else-if="isRulesShow" />
          <Languages v-else-if="isLanguagesShow" />
          <Hint v-else-if="isHintShow" />
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

import { ref } from "vue";
// display / hide options menu
const isOptionsShow = ref(false);
const isRulesShow = ref(false);
const isLanguagesShow = ref(false);
const isHintShow = ref(false);

function toggleContentToShow(content: string) {
  if (content === "rules") {
    isRulesShow.value = !isRulesShow.value;
    isOptionsShow.value = false;
    isLanguagesShow.value = false;
    isHintShow.value = false;
    return;
  }
  if (content === "options") {
    isRulesShow.value = false;
    isOptionsShow.value = !isOptionsShow.value;
    isRulesShow.value = false;
    isHintShow.value = false;
    return;
  }
  if (content === "languages") {
    isRulesShow.value = false;
    isOptionsShow.value = false;
    isLanguagesShow.value = !isLanguagesShow.value;
    isHintShow.value = false;

    return;
  }
  if (content === "hint") {
    isRulesShow.value = false;
    isOptionsShow.value = false;
    isLanguagesShow.value = false;
    isHintShow.value = !isHintShow.value;
    return;
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
