<template>
  <div class="helper_block w-full flex justify-center flex-wrap my-1">
    <!-- <span
      v-for="letter in incorrectLetters"
      :key="letter"
      class="flex justify-center text-sm w-4 mx-1 border-solid border-2 border-marine rounded-sm bg-amber text-marine"
    >
      {{ letter }}
    </span> -->
    <span
      v-for="letter in allLetters"
      :key="letter"
      :data-letter="letter"
      class="flex justify-center text-sm w-4 m-1 border-solid border-2 border-marine rounded-sm text-marine"
      :class="{ 'bg-amber': incorrect(letter) }"
    >
      {{ letter }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  guessSubmited: Array,
  wordOfTheDay: String,
});

const allLetters = ref([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
]);

function incorrect(letter: string) {
  return incorrectLetters.value.includes(letter.toUpperCase()) ? true : false;
}

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
