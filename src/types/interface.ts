interface keyEvent extends Event {
  key: string;
}

interface levels {
  type: string;
  attempt: number;
}

export type { keyEvent, levels };
