const errorNoPunksInWallet =
  "no punks in your wallet or all you punks had already buy a ticket this month";

export const getCodeError = (errorText: string) => {
  if (errorNoPunksInWallet === errorText) return 10;
  return 100;
};
