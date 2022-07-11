import { createContext, useContext } from "react";

export type SolanaBalanceValue = {
  total: number;
  totalString: string;
};

export const solanaBalanceIntitialValue = {
  total: 0,
  totalString: "? SOL",
};

export const solanaBalanceContext = createContext<SolanaBalanceValue>(
  solanaBalanceIntitialValue
);

export const useSolanaBalance = () => useContext(solanaBalanceContext);
