<script setup lang="ts">
import { WORD_SIZE, END_GAME_ATTEMPT } from "@/settings";
import { computed, onMounted, ref } from "vue";

import englishWord from "../utils/englishWordsWith5Letters.json";

import GuessLetter from "@/components/GuessLetter.vue";

const props = defineProps({
  disabledInput: {
    type: Boolean,
    required: true,
  },
  guessSubmited: {
    type: Array,
    required: true,
  },
  wordOfTheDay: {
    type: String,
    required: true,
  },
});

// le mot que va taper au fur et à mesure le joueur
const guessInProcess = ref<string | null>(null);

//* Pour passer une donnée à notre parent, lui dire que le joueur à valider son mot avec ENTER
// define the event
const emit = defineEmits<{
  // name of the event et je lui passe le string
  "guess-submitted": [guess: string];
}>();

// contiendra la liste des class que je voudrais ajouter à "letters", du composant guessLetter
//* par exemple si le mot n'est pas anglais envoie un shake
const classesStyling = ref({
  shake: false,
});

// pour formater ce que tape le joueur dans l'input, avant de l'enregistrer dans le guessInProcess
const formattedGuessInProcess = computed<string>({
  get() {
    return guessInProcess.value ?? "";
  },
  set(rawValue: string) {
    const regex = /\d+/;
    guessInProcess.value = null;
    /* guessInProcess.value?.replace(regex, "") */
    // recupere ce que tape l'utilisateur et format le
    // format la valeur pour qu'elle soit de longueur 5, en maj et sans digit
    guessInProcess.value = rawValue
      .slice(0, WORD_SIZE)
      .toUpperCase()
      .replace(/[^A-Z]+/gi, "");
  },
});

// quand le joueur appuie sur enter
function onSubmit(event: Event) {
  // Si le mot n'est pas anglais, tu return, donc cele ne fait rien
  if (!englishWord.includes(formattedGuessInProcess.value)) {
    classesStyling.value = {
      shake: true,
    };
    // ne fera rien quand je tape enter
    return;
  }
  classesStyling.value = {
    shake: false,
  };
  // SINON je passe la valeur au component parent, qui va la stocker dans le tableau de guesses submited
  emit("guess-submitted", formattedGuessInProcess.value);
  guessInProcess.value = null;
}

function reFocusOnBlur(event: Event) {
  // pour ne pas perdre le focus sur le bouton
  // le joueur peut cliquer n'importe le focus sera toujours sur le input
  const input = event.target as HTMLInputElement;
  input.focus();
}

// C'est ici qu'est choisi le mot à dispatcher en lettre
function wordToDisplayInLetter(guessAttempt: number) {
  // si tu as un mot dans le tatbleau qui correspond à la tentative précédente, tu renvoie ce mot
  if (props.guessSubmited[guessAttempt - 1]) {
    return props.guessSubmited[guessAttempt - 1];
  }
  // si tu as 2 mots dans le tableau (donc 2 tentatives), donc que le prochain est égale à la tentative en cours
  // tu renvoie le mot en cours de formatage
  if (props.guessSubmited.length + 1 === guessAttempt) {
    return formattedGuessInProcess.value;
  }
  // pour les autres prochains mots +2, +3..., tu les laisse vide
  return "";
}

// pour refaire le focus sur l'input,
// sinon lors du click sur le restart de game, je perds le focus
const input = ref<HTMLInputElement | null>(null);
onMounted(() => {
  input.value?.focus();
});
</script>

<template>
  <div>
    <GuessLetter
      v-for="guessAttempt in END_GAME_ATTEMPT"
      :key="`${guessAttempt}`"
      :wordToDisplay="wordToDisplayInLetter(guessAttempt)"
      :guessSubmited="props.guessSubmited"
      :guessAttempt="guessAttempt"
      :wordOfTheDay="wordOfTheDay"
      :classesStyling="classesStyling"
    />

    <input
      ref="input"
      type="text"
      v-model="formattedGuessInProcess"
      :maxlength="WORD_SIZE"
      @keydown.enter="onSubmit"
      autofocus
      :disabled="props.disabledInput"
      @blur="reFocusOnBlur"
    />
  </div>
</template>

<style scoped lang="css">
input {
  position: fixed;
  top: 0px;
  opacity: 0;
  right: 0;
}
input:focus-visible {
  outline: none;
  border: none;
  color: white;
}
input:disabled {
  outline: none;
  border: none;
  color: white;
  background-color: white;
}
</style>
