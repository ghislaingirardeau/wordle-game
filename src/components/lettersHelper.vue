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
import { type keyEvent } from "@/types/interface";
import { allLetters } from "@/settings";

const props = defineProps({
  guessSubmited: Array,
  wordOfTheDay: String,
});

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
  if (letter === "Ent" || letter === "Eff") {
    classesToAdd["bg-[blue]"] = true;
    classesToAdd["px-4"] = true;
  }
  return classesToAdd;
}

function triggerKeyPress(event: Event) {
  // verifie que c'est la touch enter
  const keyboardElement = event.target as HTMLElement;
  const GuessInputElement = document.querySelector("input") as HTMLInputElement;
  if (keyboardElement.textContent === "Ent") {
    // créer l'event keydown, qui est déjà sur l'input dans GuessInput
    const eventKeyDown = new Event("keydown") as keyEvent;
    // ajoute la propriété "key" à event, sinon elle n'existe pas, car l'event actuel est un click
    eventKeyDown.key = "Enter";
    // récupére l'input "guess" qui a été crée dans "GuessInput",
    // éxécute l'event "keydown" qui est mis grace à @keydown.enter
    // comme la propriété key:"Enter" est présente dans l'event, @keydown.enter ne pose pas de probleme
    GuessInputElement.dispatchEvent(eventKeyDown);
    return;
  }
  if (keyboardElement.textContent === "Eff") {
    GuessInputElement.value = GuessInputElement.value.slice(0, -1);
    const changeInputValue = new Event("input") as Event;
    GuessInputElement.dispatchEvent(changeInputValue);
    return;
  }
  // vérifie que l'input n'a pas déja 5 lettres
  if (GuessInputElement.value.length < 5) {
    GuessInputElement.value += keyboardElement.dataset.letter?.toUpperCase();
    const changeInputValue = new Event("input") as Event;
    GuessInputElement.dispatchEvent(changeInputValue);
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
