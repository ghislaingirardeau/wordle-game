<template>
  <ul class="letters">
    <li
      v-for="numberLetter in 5"
      :key="`${numberLetter}`"
      class="letter"
      :class="{ active: isCurrentWord }"
      :data-letter-feedback="feedbackLetter(numberLetter)"
    >
      {{ wordToDisplay.charAt(numberLetter - 1) }}
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

function feedbackLetter(numberLetter) {
  if (
    props.wordToDisplay &&
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
  background-color: green;
}
</style>
