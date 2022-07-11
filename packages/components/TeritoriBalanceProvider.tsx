import { createContext, useContext, useEffect, useState } from "react";

import { Network } from "../utils/network";
import { getTeriBalance } from "../utils/teritori";
import { useWallets } from "./WalletsProvider/WalletsProvider";

const STAKE_PER_TERI = 10000;

const refreshInterval = 2 * 60 * 1000;

type TeritoriBalanceValue = {
  total: number;
  totalString: string;
};

const initialValue = {
  total: 0,
  totalString: "? SOL",
};

const teritoriBalanceContext =
  createContext<TeritoriBalanceValue>(initialValue);

export const TeritoriBalanceProvider: React.FC = ({ children }) => {
  const [value, setValue] = useState<TeritoriBalanceValue>(initialValue);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const { wallets } = useWallets();

  useEffect(() => {
    console.log("refreshing teritori balances");
    let cancelled = false;
    const effect = async () => {
      const balances = await Promise.all(
        wallets
          .filter(
            (wallet) => wallet.network === Network.Teritori && wallet.publicKey
          )
          .map((wallet) => {
            try {
              return getTeriBalance(wallet.publicKey);
            } catch (err) {
              console.warn(
                "failed to get teritori balance for",
                wallet.publicKey,
                err
              );
              return 0;
            }
          })
      );
      const total = balances.reduce((total, balance) => total + balance, 0);
      if (cancelled) {
        return;
      }
      setValue({ total, totalString: `${total / STAKE_PER_TERI} TERI` });
      setTimeout(() => setRefreshIndex((index) => index + 1), refreshInterval);
    };
    effect();
    return () => {
      cancelled = true;
    };
  }, [refreshIndex]);

  return (
    <teritoriBalanceContext.Provider value={value}>
      {children}
    </teritoriBalanceContext.Provider>
  );
};

export const useTeritoriBalance = () => useContext(teritoriBalanceContext);
