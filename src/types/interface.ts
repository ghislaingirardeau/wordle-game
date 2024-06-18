interface keyEvent extends Event {
  key: string;
}

interface levels {
  type: string;
  attempt: number;
}

interface Score {
  score: number | string;
  game: number;
}

export type { keyEvent, levels, Score };
