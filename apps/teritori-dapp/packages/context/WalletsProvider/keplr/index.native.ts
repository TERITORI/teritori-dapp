import { Wallet } from "../wallet";

type UseKeplrResult = [true, boolean, Wallet[]] | [false, boolean, undefined];

export const useKeplr: () => UseKeplrResult = () => {
  return [false, false, undefined];
};
