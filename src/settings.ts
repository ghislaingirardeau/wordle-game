import { ref } from "vue";

export const VICTORY_MESSAGE: string = "You won!";
export const DEFEAT_MESSAGE: string = "You lose!";
export const WORD_SIZE: number = 5;
export const END_GAME_ATTEMPT = ref<number>(10);
export const LEVELS: string[] = ["Easy", "Medium", "Difficult"];

export function SET_DIFFICULTY(type: string) {
  switch (type) {
    case "Easy":
      END_GAME_ATTEMPT.value = 10;
      break;
    case "Medium":
      END_GAME_ATTEMPT.value = 8;
      break;
    case "Difficult":
      END_GAME_ATTEMPT.value = 6;
      break;
  }
}
