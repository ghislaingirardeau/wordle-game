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
          v-if="CURRENT_LANGUAGE === 'French'"
        >
          Hint
        </h2>
      </div>

      <div class="content_block w-full">
        <Transition mode="out-in">
          <KeepAlive>
            <component :is="component" />
          </KeepAlive>
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

import { CURRENT_LANGUAGE } from "@/settings";

import { ref, reactive, shallowRef } from "vue";

const component = shallowRef(null);

function contentToShow(content: string) {
  if (content === "rules") {
    component.value === Rules
      ? (component.value = null)
      : (component.value = Rules);
    return;
  }
  if (content === "difficulty") {
    component.value === Difficulty
      ? (component.value = null)
      : (component.value = Difficulty);
    return;
  }
  if (content === "languages") {
    component.value === Languages
      ? (component.value = null)
      : (component.value = Languages);
    return;
  }
  if (content === "hint") {
    component.value === Hint
      ? (component.value = null)
      : (component.value = Hint);
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
