import { Wallet } from "../wallet";

type UseLeapResult = [true, boolean, Wallet[]] | [false, boolean, undefined];

export const useLeap: () => UseLeapResult = () => {
  return [false, false, undefined];
};
