<template>
  <div class="text-xs italic text-marine my-2 rules_container">
    Try to find a {{ WORD_SIZE }} letter word in {{ END_GAME_ATTEMPT }} tries
    and Tap <code><small>'Enter'</small></code> to valid the word :
    <ul class="list-disc list-inside">
      <li>Letter in Yellow: the letter is correct but at the wrong position</li>
      <li>Letter in Green: The letter is correctly placed</li>
    </ul>
  </div>
</template>

<script setup>
import { END_GAME_ATTEMPT, WORD_SIZE } from "@/settings";
</script>

<style lang="css" scoped></style>
