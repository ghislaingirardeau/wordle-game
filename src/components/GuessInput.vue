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
    <!-- input to contain user type -->
    <input
      ref="input"
      id="input-user"
      type="text"
      autofocus
      :readonly="isLargeScreen()"
      autocomplete="off"
      v-model="formattedGuessInProcess"
      :maxlength="WORD_SIZE"
      @keydown.enter="onSubmit"
      :disabled="props.disabledInput"
      @focusout="reFocusOnBlur"
      @input="fromVirtualKeyboard"
    />
    <!-- Modal to display info -->
    <dialog-info ref="dialogComponent" idName="error">
      <template v-slot:title> {{ modalInfo.title }} </template>
      <template v-slot:message>
        <p>{{ modalInfo.message }}</p>
      </template>
    </dialog-info>
  </div>
</template>

<script setup lang="ts">
import { WORD_SIZE, END_GAME_ATTEMPT } from "@/settings";
import { computed, onMounted, reactive, ref, type Ref } from "vue";

import GuessLetter from "@/components/GuessLetter.vue";
import DialogInfo from "./DialogInfo.vue";

import { isLargeScreen } from "@/mixins/useScreen.js";

const props = defineProps({
  wordsListLang: {
    type: Array,
    required: true,
  },
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

const input = ref<HTMLInputElement>();

// le mot que va taper au fur et à mesure le joueur
const guessInProcess = ref<string | null>(null);

// message for information inside modal
const modalInfo = reactive({
  title: "",
  message: "",
});

// defini une ref sur un component
const dialogComponent = ref<InstanceType<typeof DialogInfo>>();

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
    // FERME LA MODALE SI CELLE-CI EST OUVERTE LORSQUE USER TAPE UNE NOUVELLE LETTRE
    closeModalOnTypeIfOpen();
    //------------------------------

    // SI USER TAPE UNE LETTRE, TOUT EST CORRECTE
    const regex = /\d+/;
    guessInProcess.value = null;

    /* guessInProcess.value?.replace(regex, "") */
    // recupere ce que tape l'utilisateur et format le
    // format la valeur pour qu'elle soit de longueur 5, en maj et sans digit
    guessInProcess.value = rawValue.slice(0, WORD_SIZE).toUpperCase();
    /* .replace(/[^A-Z]+/gi, ""); */
    // ------------------------------------

    // SI USER TAPE UN NOMBRE, ENVOIE LA MODALE ERROR
    if (regex.test(rawValue)) {
      wordIncorrectShowModalAndShake("Number is not permited");
      // retire le nombre du v-model
      guessInProcess.value = rawValue.slice(0, -1);
      // met à jour la valeur de l'input
      input.value ? (input.value.value = guessInProcess.value) : "";
    }
    //-------------------------------------------
  },
});

// quand le joueur appuie sur enter
function onSubmit(event: Event) {
  // Si le mot n'est pas anglais, tu return, affiche la modal avec l'erreur et execute l'animation
  if (
    props.wordsListLang &&
    !props.wordsListLang.includes(formattedGuessInProcess.value)
  ) {
    wordIncorrectShowModalAndShake(null);
    return;
  }
  // si le mot est correcte, ne fait pas l'animation shake
  classesStyling.value = {
    shake: false,
  };
  // ET je passe la valeur au component parent, qui va la stocker dans le tableau de guesses submited
  emit("guess-submitted", formattedGuessInProcess.value);
  guessInProcess.value = null;
  window.scrollTo({
    top: 100,
    behavior: "smooth",
  });
}

function wordIncorrectShowModalAndShake(errorNumberType: string | null) {
  // ajoute le style shake
  classesStyling.value = {
    shake: true,
  };
  // affiche la modale signalant l'erreur
  let messageToDisplay = "";
  formattedGuessInProcess.value.length !== Number(`${WORD_SIZE}`)
    ? (messageToDisplay = `This word must contain ${WORD_SIZE} letters`)
    : (messageToDisplay = "This word does not exist in the list");

  errorNumberType ? (messageToDisplay = errorNumberType) : null;
  showModalInfo("Error", messageToDisplay);

  // le shake a false à la fin de l'animation
  setTimeout(() => {
    classesStyling.value = {
      shake: false,
    };
  }, 500);
}

function closeModalOnTypeIfOpen() {
  let isModalOpenOnType =
    !dialogComponent?.value?.dialogElement?.classList.contains("hidden");
  if (isModalOpenOnType) {
    !dialogComponent?.value?.dialogElement?.classList.add("hidden");
  }
}

function reFocusOnBlur(event: Event) {
  // pour ne pas perdre le focus sur le bouton
  // le joueur peut cliquer n'importe le focus sera toujours sur le input
  const input = event.target as HTMLInputElement;
  // je dois mettre un léger délai sinon ne s'éxécute pas
  setTimeout(() => input.focus());
}

function fromVirtualKeyboard(e: Event) {
  // nothing to do because input value is already updated inside lettersHelper function
  return;
}

// C'est ici qu'est choisi le mot à dispatcher en lettre
function wordToDisplayInLetter(guessAttempt: number): string {
  // si tu as un mot dans le tatbleau qui correspond à la tentative précédente, tu renvoie ce mot
  if (props.guessSubmited[guessAttempt - 1]) {
    return props.guessSubmited[guessAttempt - 1] as string;
  }
  // si tu as 2 mots dans le tableau (donc 2 tentatives), donc que le prochain est égale à la tentative en cours
  // tu renvoie le mot en cours de formatage
  if (props.guessSubmited.length + 1 === guessAttempt) {
    return formattedGuessInProcess.value;
  }
  // pour les autres prochains mots +2, +3..., tu les laisse vide
  return "";
}

function showModalInfo(title: string, message: string) {
  // affiche la modal avec l'erreur info
  modalInfo.message = message;
  modalInfo.title = title;
  // execute la fonction dans le component child qui ouvre la modale
  // la fonction est accessible ici grace au defineExpose() dans le component child
  dialogComponent?.value?.toggleModal();
}

// pour refaire le focus sur l'input,
// sinon lors du click sur le restart de game, je perds le focus
onMounted(() => {
  input.value?.focus();
});
</script>

<style scoped lang="css">
#input-user {
  position: fixed;
  top: 50%;
  opacity: 0;
  cursor: default;
}
#input-user:focus-visible {
  outline: none;
  border: none;
  color: white;
}
#input-user:disabled {
  outline: none;
  border: none;
  color: white;
  background-color: white;
}
</style>
@/mixins/useScreen.js
