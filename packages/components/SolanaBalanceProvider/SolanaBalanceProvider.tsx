import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

import { Network } from "../../utils/network";
import { getSolanaBalance } from "../../utils/solana";
import { useWallets } from "../WalletsProvider";
import {
  solanaBalanceIntitialValue,
  solanaBalanceContext,
  SolanaBalanceValue,
} from "./solanaBalanceContext";

const refreshInterval = 2 * 60 * 1000;

export const SolanaBalanceProvider: React.FC = ({ children }) => {
  const [value, setValue] = useState<SolanaBalanceValue>(
    solanaBalanceIntitialValue
  );
  const [refreshIndex, setRefreshIndex] = useState(0);

  const { wallets } = useWallets();

  useEffect(() => {
    console.log("refreshing solana balances");
    let cancelled = false;
    const effect = async () => {
      const balances = await Promise.all(
        wallets
          .filter(
            (wallet) => wallet.network === Network.Solana && wallet.publicKey
          )
          .map((wallet) => {
            try {
              return getSolanaBalance(wallet.publicKey);
            } catch (err) {
              console.warn(
                "failed to get solana balance for",
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
      setValue({ total, totalString: `${total / LAMPORTS_PER_SOL} SOL` });
      setTimeout(() => setRefreshIndex((index) => index + 1), refreshInterval);
    };
    effect();
    return () => {
      cancelled = true;
    };
  }, [refreshIndex]);

  return (
    <solanaBalanceContext.Provider value={value}>
      {children}
    </solanaBalanceContext.Provider>
  );
};
