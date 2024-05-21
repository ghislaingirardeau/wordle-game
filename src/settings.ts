import { ref } from "vue";

export const VICTORY_MESSAGE: string = "You won!";
export const DEFEAT_MESSAGE: string = "You lose!";
export const WORD_SIZE: number = 5;
// PARTAGE DE REF ENTRE COMPONENTS + UTILISABLE DANS LES TESTS !
// je peux exporter des refs de vue, qui seront utilisable dans tous les components dés que je l'importe
// On pourra alors changer sa valeur, mais aussi "watch" les changements dans un autre component
export const END_GAME_ATTEMPT = ref<number>(6);
//--------------------------------
export const LEVELS: string[] = ["Easy", "Medium", "Difficult"];

// Pour le component difficultyTabs
export function SET_DIFFICULTY(type: string) {
  switch (type) {
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
