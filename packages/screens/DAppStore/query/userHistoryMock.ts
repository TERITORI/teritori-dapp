interface HistoryItem {
  round: string;
  tickets: {
    bought: number;
    won: number;
  };
  toriWon: number;
}

export const historyData: HistoryItem[] = [
  {
    round: "loading",
    tickets: {
      bought: 0,
      won: 0,
    },
    toriWon: 0,
  },
];
