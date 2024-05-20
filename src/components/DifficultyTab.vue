<template>
  <div class="tabs_container">
    <ul
      ref="tabs"
      class="flex flex-wrap text-sm font-medium text-center text-marine"
    >
      <li v-for="(level, index) in LEVELS" :key="'index-' + index">
        <a
          href="#"
          :id="'level-' + level.toLowerCase()"
          class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-amber"
          :class="{ active: index == 0 }"
          @click="changeDifficulty($event, level)"
          >{{ level }}</a
        >
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import { LEVELS, SET_DIFFICULTY} from "@/settings";

const tabs = ref<HTMLElement>();

function changeDifficulty(event: Event, level: string) {
  // remove class active for all
  tabs.value?.querySelectorAll("a").forEach((element) => {
    element.classList.remove("active");
  });
  // add active class
  const button = event.target as HTMLElement;
  button.classList.add("active");
  SET_DIFFICULTY(level);
}
</script>

<style lang="css" scoped>
.active {
  background-color: theme("colors.amber");
}
</style>
