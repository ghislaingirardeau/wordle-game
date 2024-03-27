<template>
  <ul class="letters" :class="isCurrentWord ? props.classesStyling : ''">
    <li
      v-for="numberLetter in 5"
      :key="`${numberLetter}`"
      class="letter"
      :class="{ active: isCurrentWord, flip: shouldReveal }"
      :data-letter="wordToDisplay[numberLetter - 1]"
      :data-letter-feedback="
        shouldReveal ? feedbackLetter(numberLetter, shouldReveal) : null
      "
    >
      {{ wordToDisplay[numberLetter - 1] }}
    </li>
  </ul>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  wordToDisplay: {
    type: String,
    required: true,
  },
  guessSubmited: {
    type: Array,
  },
  guessAttempt: {
    type: Number,
    required: true,
  },
  wordOfTheDay: {
    type: String,
    required: true,
  },
  classesStyling: {
    type: Object,
  },
});

const isCurrentWord = computed(() => {
  return props.guessAttempt - 1 === props.guessSubmited.length;
});

const shouldReveal = computed(() => {
  if (!(props.guessAttempt - 1 >= props.guessSubmited.length)) {
    return true;
  } else {
    return false;
  }
});

function feedbackLetter(numberLetter, reveal) {
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
.letters {
  display: flex;
  align-items: center;
  justify-content: center;
  list-style-type: none;
  padding-inline-start: 0px;
}
.letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.6em;
  height: 1.6em;
  margin-inline: 0.4em;
  padding: 0.4em;
  border: 2px solid grey;
  font-size: 1.5em;
  background-color: grey;
}

.active {
  background-color: rgb(255, 255, 255);
}

.shake {
  animation: horizontal-shaking 0.5s ease;
}

li[data-letter-feedback="almost"] {
  background-color: rgb(255, 221, 0);
}
li[data-letter-feedback="correct"] {
  background-color: green;
}

li[data-letter].flip {
  animation: vertical-rotation 0.4s ease;
}
@keyframes vertical-rotation {
  0% {
    opacity: 0;
    transform: rotateY(0deg);
  }
  100% {
    opacity: 1;
    transform: rotateY(360deg);
  }
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
