<template>
  <div class="helper_block w-full flex flex-wrap my-1">
    <div
      v-for="(rowOfLetter, i) in allLetters"
      :key="'row-' + i"
      class="w-full flex justify-center"
    >
      <span
        v-for="letter in rowOfLetter"
        :key="letter"
        :data-letter="letter"
        class="flex justify-center text-sm w-6 p-1 m-1 border-solid border-2 border-marine rounded-sm text-marine"
        :class="dynamicStyles(letter)"
        @click="triggerKeyPress"
      >
        {{ letter }}
      </span>
    </div>
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

/* ARRAY CONTAINING THE LISTS OF INCORRECT LETTERS */
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

/* SET DYNAMIC STYLE DEPEND ON INCORRECT LETTER AND SPECIAL VIRTUAL KEYS */
function dynamicStyles(letter: string) {
  let classesToAdd = {
    "bg-amber": false,
    transition: false,
    "bg-[blue]": false,
    "px-4": false,
  };
  // pour les lettres incorrects
  if (incorrectLetters.value.includes(letter)) {
    classesToAdd["bg-amber"] = true;
    classesToAdd.transition = true;
  }
  // pour la touche "enter" du clavier virtuelle
  if (letter === "ENT" || letter === "EFF") {
    classesToAdd["bg-[blue]"] = true;
    classesToAdd["px-4"] = true;
  }
  return classesToAdd;
}

/* HANDLE CLICK ON THE VIRTUALS KEYS */
function triggerKeyPress(event: Event) {
  // verifie que c'est la touch enter
  const keyboardElement = event.target as HTMLElement;
  const GuessInputElement = document.querySelector("input") as HTMLInputElement;
  if (keyboardElement.textContent === "ENT") {
    createAndDispatchEvents("keydown", true, GuessInputElement);
    return;
  }
  if (keyboardElement.textContent === "EFF") {
    GuessInputElement.value = GuessInputElement.value.slice(0, -1);
    createAndDispatchEvents("input", false, GuessInputElement);
    return;
  }
  // vérifie que l'input n'a pas déja 5 lettres
  if (GuessInputElement.value.length < 5) {
    GuessInputElement.value += keyboardElement.dataset.letter;
    createAndDispatchEvents("input", false, GuessInputElement);
  }
}

/**
 * créer l'event keydown ou input, qui sont déjà sur l'input dans GuessInput
 * ajoute la propriété "key" à event, sinon elle n'existe pas, car l'event actuel est un click
 * récupére l'input "guess" qui a été crée dans "GuessInput",
 * éxécute l'event "keydown" qui est mis grace à @keydown.enter
 * comme la propriété key:"Enter" est présente dans l'event, @keydown.enter ne pose pas de probleme
 */
function createAndDispatchEvents(
  eventName: string,
  enter: boolean,
  inputElement: HTMLInputElement
) {
  const event = new Event(eventName) as keyEvent;
  enter ? (event.key = "Enter") : null;
  inputElement.dispatchEvent(event);
}
</script>

<style scoped></style>
