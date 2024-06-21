import { ref } from "vue";
import { type levels } from "@/types/interface";

export const VICTORY_MESSAGE: string = "You won!";
export const DEFEAT_MESSAGE: string = "You lose!";
export const WORD_SIZE: number = 5;
// PARTAGE DE REF ENTRE COMPONENTS + UTILISABLE DANS LES TESTS !
// je peux exporter des refs de vue, qui seront utilisable dans tous les components dés que je l'importe
// On pourra alors changer sa valeur, mais aussi "watch" les changements dans un autre component
export const END_GAME_ATTEMPT = ref<number>(6);
//--------------------------------
export const LEVELS: levels[] = [
  { type: "Easy", attempt: 8 },
  { type: "Medium", attempt: 6 },
  { type: "Difficult", attempt: 4 },
];

// Pour le component difficulty
export function SET_DIFFICULTY(level: string) {
  switch (level) {
    case "Easy":
      END_GAME_ATTEMPT.value = 8;
      break;
    case "Medium":
      END_GAME_ATTEMPT.value = 6;
      break;
    case "Difficult":
      END_GAME_ATTEMPT.value = 4;
      break;
  }
}

// Pour le component Langues
export function SET_LANGUAGE(lang: string) {
  switch (lang) {
    case "French":
      CURRENT_LANGUAGE.value = "French";
      break;
    case "English":
      CURRENT_LANGUAGE.value = "English";
      break;
  }
}

export const LANGUAGES = ["English", "French"];

export const CURRENT_LANGUAGE = ref("French");

// Virtual keyboard
export const allLetters = ref([
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["W", "X", "C", "V", "B", "N"],
]);

export const CURRENT_WORDOFDAY_RAW = ref("");
