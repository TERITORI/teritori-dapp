import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";

import { addWallet } from "../../store/slices/wallets";
import { useAppDispatch } from "../../store/store";
import { Network } from "../../utils/network";
import { WalletProvider } from "../../utils/walletProvider";
import { Wallet } from "./wallet";

export type UsePhantomResult =
  | [true, boolean, Wallet]
  | [false, true, undefined];

export const usePhantom: () => UsePhantomResult = () => {
  const phantom = (window as any)?.solana;
  const hasPhantom = !!phantom?.isPhantom;

  const [publicKey, setPublicKey] = useState("");
  const [ready, setReady] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!hasPhantom) {
      return;
    }

    console.log("phantom installed");

    const handleConnect = (pk: PublicKey) => {
      console.log("phantom connected");
      if (!pk) {
        return;
      }
      setPublicKey(pk.toBase58());
    };
    phantom.on("connect", handleConnect);

    const handleDisconnect = (pk: PublicKey) => {
      console.log("phantom disconnected");
      setPublicKey("");
    };
    phantom.on("disconnect", handleDisconnect);

    const handleAccountChanged = async (pk: PublicKey) => {
      console.log("phantom account changed");
      setPublicKey("");
    };
    phantom.on("accountChanged", handleAccountChanged);

    return () => {
      phantom.off("connect", handleConnect);
      phantom.off("disconnect", handleDisconnect);
      phantom.off("accountChanged", handleAccountChanged);
    };
  }, []);

  useEffect(() => {
    const effect = async () => {
      if (!hasPhantom) {
        return;
      }
      try {
        await phantom.connect({ onlyIfTrusted: true });
      } catch (err) {
        console.warn("failed to connect to phantom", err);
      }
      setReady(true);
    };
    effect();
  }, []);

  const wallet = useMemo(() => {
    const wallet: Wallet = {
      publicKey,
      provider: WalletProvider.Phantom,
      network: Network.Solana,
      connected: !!publicKey,
      id: "phantom",
    };
    console.log("phantom", wallet);
    return wallet;
  }, [publicKey]);

  useEffect(() => {
    if (!wallet.publicKey) {
      return;
    }
    dispatch(
      addWallet({
        publicKey: wallet.publicKey,
        network: wallet.network,
      })
    );
  }, [wallet]);

  return hasPhantom ? [true, ready, wallet] : [false, true, undefined];
};
