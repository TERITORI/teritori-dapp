import React, { createContext, useContext, useEffect, useState } from "react";

import { prettyPrice } from "../utils/coins";
import { Network } from "../utils/network";
import { getUtoriBalance, toriCurrency } from "../utils/teritori";
import { useWallets } from "./WalletsProvider";

const refreshInterval = 2 * 60 * 1000;

type TeritoriBalanceValue = {
  total: number;
  totalString: string;
};

const initialValue = {
  total: 0,
  totalString: "? TORI",
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
          .map(async (wallet) => {
            try {
              return await getUtoriBalance(wallet.publicKey);
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
      setValue({
        total,
        totalString: prettyPrice(`${total}`, toriCurrency.coinMinimalDenom),
      });
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
