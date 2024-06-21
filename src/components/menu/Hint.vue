<template>
  <div class="hint_container my-2">
    <p v-if="isLoadingDefinition">Loading hint...</p>
    <p v-else>Voici la définition du mot: {{ hintDefinition }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from "vue";
import { useFrenchDictionary } from "@/mixins/useDictionary";

import { CURRENT_WORDOFDAY_RAW } from "@/settings";

const isLoadingDefinition = ref(false);
const hintDefinition = ref("");

async function getDefintionWithoutWord() {
  const definition = await useFrenchDictionary(
    isLoadingDefinition,
    CURRENT_WORDOFDAY_RAW.value
  );
  hintDefinition.value = definition.replaceAll(
    CURRENT_WORDOFDAY_RAW.value,
    "..."
  );
}
onMounted(() => {
  if (hintDefinition.value.length === 0) {
    getDefintionWithoutWord();
  } else {
    console.log(hintDefinition.value);
  }
  console.log("built hint");
});
</script>

<style lang="css" scoped></style>
