export const VICTORY_MESSAGE: string = "You won!";
export const DEFEAT_MESSAGE: string = "You lose!";
export const WORD_SIZE: number = 5;
export let END_GAME_ATTEMPT: number = 6;

export function setDifficulty(type: string) {
  switch (type) {
    case "easy":
      END_GAME_ATTEMPT = 10;
      break;
    case "medium":
      END_GAME_ATTEMPT = 8;
      break;
    case "difficult":
      END_GAME_ATTEMPT = 6;
      break;
  }
}
