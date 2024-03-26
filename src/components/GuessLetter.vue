<template>
  <ul class="letters">
    <li
      v-for="numberLetter in 5"
      :key="`${numberLetter}`"
      class="letter"
      :class="{ active: isCurrentWord }"
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

li[data-letter-feedback="almost"] {
  background-color: rgb(255, 221, 0);
}
li[data-letter-feedback="correct"] {
  background-color: green;
}
</style>
