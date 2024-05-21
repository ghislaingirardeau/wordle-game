<template>
  <ul
    class="flex justify-around items-center list-none py-1"
    :class="isCurrentWord ? props.classesStyling : ''"
  >
    <li
      v-for="numberLetter in Number(`${WORD_SIZE}`)"
      :key="`${numberLetter}`"
      class="flex justify-center items-center w-12 h-20 mx-2 p-2 text-md border-solid border-2 border-amber rounded-lg bg-marine text-marine text-4xl"
      :class="{
        active: isCurrentWord,
        current: isCurrentLetter(numberLetter),
        [`flip-delay-${numberLetter}`]: shouldReveal,
      }"
      :data-letter="wordToDisplay[numberLetter - 1]"
      :data-letter-feedback="
        shouldReveal ? feedbackLetter(numberLetter, shouldReveal) : null
      "
    >
      {{ wordToDisplay[numberLetter - 1] }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { WORD_SIZE } from "@/settings";

const props = defineProps({
  wordToDisplay: {
    // le mot en cours de saisi dans l'input
    type: String,
    required: true,
  },
  guessSubmited: {
    // la liste de mots déjà soumis
    type: Array,
    required: true,
  },
  guessAttempt: {
    // le nombre de tentative en cours
    type: Number,
    required: true,
  },
  wordOfTheDay: {
    // le mot du jour
    type: String,
    required: true,
  },
  classesStyling: {
    // les classes à appliquer, si on est pas sur le mot en cours
    type: Object,
  },
});

const isCurrentWord = computed(() => {
  // Si le mot a été trouvé la prochaine ligne reste comme elle est
  if (props.guessSubmited.find((word) => word === props.wordOfTheDay)) {
    return false;
  }

  // si je suis sur la ligne du mot à taper
  // renverra la classe active
  return props.guessAttempt - 1 === props.guessSubmited.length;
});

const shouldReveal = computed(() => {
  // revele les aides des mots précédents
  if (!(props.guessAttempt - 1 >= props.guessSubmited.length)) {
    return true;
  } else {
    return false;
  }
});

/**
 * Index est le numéro de la lettre de la boucle entre 1 et 5
 * @param {number} index
 */
function isCurrentLetter(index: number) {
  // Si le mot a été trouvé la prochaine ligne reste comme elle est
  if (props.guessSubmited.find((word) => word === props.wordOfTheDay)) {
    return false;
  }
  // Si je suis sur la ligne à taper => props.guessAttempt - 1 === props.guessSubmited.length
  // et que je suis sur la case de la lettre à taper => props.wordToDisplay.length + 1 === index
  if (
    props.wordToDisplay.length + 1 === index &&
    props.guessAttempt - 1 === props.guessSubmited.length
  ) {
    return true;
  } else {
    return false;
  }
}

function feedbackLetter(numberLetter: number, reveal: boolean) {
  // suivant le feedback, tu enregistres comme data de la lettre
  // avec le css, je colore la lettre suivant sa data
  if (
    reveal &&
    props.wordOfTheDay[numberLetter - 1] ===
      props.wordToDisplay[numberLetter - 1]
  ) {
    return "correct";
  }
  if (
    reveal &&
    props.wordOfTheDay.includes(props.wordToDisplay.charAt(numberLetter - 1))
  ) {
    return "almost";
  } else {
    return "incorrect";
  }
}
</script>

<style lang="css" scoped>
.letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.6em;
  height: 2.6em;
  margin-inline: 0.4em;
  padding: 0.4em;
  border: 2px solid grey;
  font-size: 1.5em;
  background-color: grey;
}

.active {
  background-color: theme("colors.white");
}

.current {
  box-shadow: inset 0px 0px 4px 3px theme("colors.amber");
}

.shake {
  animation: horizontal-shaking 0.5s ease;
}

li[data-letter-feedback="almost"] {
  background-color: theme("colors.emerald");
}
li[data-letter-feedback="correct"] {
  background-color: theme("colors.green");
}
li[data-letter-feedback="incorrect"] {
  background-color: theme("colors.amber");
}

li[data-letter].flip-delay-1 {
  transform: rotateY(360deg);
  transition: 0.5s;
  transition-delay: 0s;
}
li[data-letter].flip-delay-2 {
  transform: rotateY(360deg);
  transition: 0.5s;
  transition-delay: 0.2s;
}
li[data-letter].flip-delay-3 {
  transform: rotateY(360deg);
  transition: 0.5s;
  transition-delay: 0.4s;
}
li[data-letter].flip-delay-4 {
  transform: rotateY(360deg);
  transition: 0.5s;
  transition-delay: 0.6s;
}
li[data-letter].flip-delay-5 {
  transform: rotateY(360deg);
  transition: 0.5s;
  transition-delay: 0.8s;
}

li[data-letter] {
  animation: scale 0.4s ease;
}

@keyframes scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes horizontal-shaking {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(5px);
  }
  50% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
