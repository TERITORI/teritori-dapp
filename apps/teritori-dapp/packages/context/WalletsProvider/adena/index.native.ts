import { Wallet } from "../wallet";

type UseAdenaResult = [true, boolean, Wallet[]] | [false, boolean, undefined];

export const useAdena: () => UseAdenaResult = () => {
  return [false, false, undefined];
};
