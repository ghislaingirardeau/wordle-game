export const VICTORY_MESSAGE: string = "You won!";
export const DEFEAT_MESSAGE: string = "You lose!";
export const WORD_SIZE: number = 5;
export let END_GAME_ATTEMPT: number = 10;
export const LEVELS: string[] = ["Easy", "Medium", "Difficult"];

export function SET_DIFFICULTY(type: string) {
  switch (type) {
    case "Easy":
      END_GAME_ATTEMPT = 10;
      break;
    case "Medium":
      END_GAME_ATTEMPT = 8;
      break;
    case "Difficult":
      END_GAME_ATTEMPT = 6;
      break;
  }
}
