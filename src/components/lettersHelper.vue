<template>
  <div class="helper_block w-full flex justify-center flex-wrap my-1">
    <span
      v-for="letter in allLetters"
      :key="letter"
      :data-letter="letter"
      class="flex justify-center text-sm w-4 m-1 border-solid border-2 border-marine rounded-sm text-marine"
      :class="dynamicStyles(letter)"
      @click="triggerKeyPress"
    >
      {{ letter }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

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
  "Ent",
]);

function dynamicStyles(letter: string) {
  let classesToAdd = {
    "bg-amber": false,
    transition: false,
    "bg-[blue]": false,
    "px-4": false,
  };
  // pour les lettres incorrects
  if (incorrectLetters.value.includes(letter.toUpperCase())) {
    classesToAdd["bg-amber"] = true;
    classesToAdd.transition = true;
  }
  // pour la touche "enter" du clavier virtuelle
  if (letter === "Ent") {
    classesToAdd["bg-[blue]"] = true;
    classesToAdd["px-4"] = true;
  }
  return classesToAdd;
}

function triggerKeyPress(e: Event) {
  // verifie que c'est la touch enter
  if (e.target.textContent === "Ent") {
    console.dir(document.querySelector("input"));
    // créer l'event keydown, qui est déjà sur l'input dans GuessInput
    const event = new Event("keydown");
    // ajoute la propriété key à event, sinon elle n'existe pas, car c'est un click
    event.key = "Enter";
    // récupére l'input "guess", éxécute l'event "keydown" qui est mis grace à @keydown.enter
    // comme la propriété key:"Enter" est présente dans l'event, @keydown.enter ne pose pas de probleme
    document.querySelector("input")?.dispatchEvent(event);
  }
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
</script>

<style scoped></style>
