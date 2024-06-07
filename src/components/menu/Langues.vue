<template>
  <div class="tabs_container my-2">
    <ul
      ref="tabs"
      class="flex justify-around text-sm font-medium text-center text-marine"
    >
      <li
        v-for="(lang, index) in LANGUAGES"
        :key="'index-' + index"
        class="w-1/4 rounded hover:text-gray-600 hover:bg-amber"
        :class="{ active: currentLang === lang }"
      >
        <a
          href="#"
          :id="'lang-' + lang"
          class="inline-block p-4"
          @click="changeLanguage($event, lang)"
          >{{ lang }}</a
        >
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import { LANGUAGES, SET_LANGUAGE, CURRENT_LANGUAGES } from "@/settings";

const tabs = ref<HTMLElement>();

const currentLang = computed(() => {
  return CURRENT_LANGUAGES.value;
});

function changeLanguage(event: Event, lang: string) {
  // remove class active for all
  tabs.value?.querySelectorAll("li").forEach((element) => {
    element.classList.remove("active");
  });
  // add active class
  const button = event.target as HTMLElement;
  button.parentElement?.classList.add("active");
  SET_LANGUAGE(lang);
}
</script>

<style lang="css" scoped>
.active {
  background-color: theme("colors.amber");
}
</style>
