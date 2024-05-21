<template>
  <Transition>
    <div class="tabs_container">
      <ul
        ref="tabs"
        class="flex justify-between text-sm font-medium text-center text-marine"
      >
        <li
          v-for="(level, index) in LEVELS"
          :key="'index-' + index"
          class="w-1/4 rounded hover:text-gray-600 hover:bg-amber"
          :class="{ active: currentLevel === level.type }"
        >
          <a
            href="#"
            :id="'level-' + level.type.toLowerCase()"
            class="inline-block p-4"
            @click="changeDifficulty($event, level.type)"
            >{{ level.type }}</a
          >
        </li>
      </ul>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import { LEVELS, SET_DIFFICULTY, END_GAME_ATTEMPT } from "@/settings";

const tabs = ref<HTMLElement>();

const currentLevel = computed(() => {
  const level = LEVELS.find(
    (element) => element.attempt === END_GAME_ATTEMPT.value
  );
  return level ? level.type : "Medium";
});

function changeDifficulty(event: Event, level: string) {
  // remove class active for all
  tabs.value?.querySelectorAll("li").forEach((element) => {
    element.classList.remove("active");
  });
  // add active class
  const button = event.target as HTMLElement;
  button.parentElement?.classList.add("active");
  SET_DIFFICULTY(level);
}
</script>

<style lang="css" scoped>
.active {
  background-color: theme("colors.amber");
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
  height: 52px;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(0);
  height: 0px;
}
</style>
