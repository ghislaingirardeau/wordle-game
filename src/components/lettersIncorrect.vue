<template>
  <div class="helper_block">
    missing letters:
    <span v-for="letter in incorrectLetters" :key="letter"> {{ letter }} </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  guessSubmited: Array,
  wordOfTheDay: String,
});

const incorrectLetters = computed(() => {
  let arrayOfUniqueLettersTyped = [
    ...new Set(props.guessSubmited?.join("").split("")),
  ];

  let arrayOfWordDayLetter = props.wordOfTheDay?.split("");

  let arrayOfIncorrectLetter: string[] = [];

  arrayOfUniqueLettersTyped?.forEach((letter) => {
    if (!arrayOfWordDayLetter?.includes(letter)) {
      arrayOfIncorrectLetter.push(letter);
    }
  });
  return arrayOfIncorrectLetter;
});

// function incorrectLetters() {
//   const incorrectLettersElements = document.querySelectorAll(
//     'li[data-letter-feedback="incorrect"]'
//   ) as NodeListOf<HTMLElement>;

//   let arrayOfResult: string[] = [];

//   incorrectLettersElements.forEach((element: HTMLElement) => {
//     let dataLetter = element.dataset.letter as string;
//     if (!arrayOfResult.includes(dataLetter)) {
//       arrayOfResult.push(dataLetter);
//     }
//   });
//   console.log(arrayOfResult);
//   return arrayOfResult;
// }
</script>

<style scoped></style>
