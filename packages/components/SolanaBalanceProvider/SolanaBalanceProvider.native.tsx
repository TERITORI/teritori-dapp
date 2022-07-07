import { createContext, useContext } from "react";

type SolanaBalanceValue = {
  total: number;
  totalString: string;
};

const initialValue = {
  total: 0,
  totalString: "? SOL",
};

const solanaBalanceContext = createContext<SolanaBalanceValue>(initialValue);

export const SolanaBalanceProvider: React.FC = ({ children }) => {
  return (
    <solanaBalanceContext.Provider value={initialValue}>
      {children}
    </solanaBalanceContext.Provider>
  );
};

export const useSolanaBalance = () => useContext(solanaBalanceContext);
