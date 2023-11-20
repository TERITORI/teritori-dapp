import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";

import { Wallet } from "./wallet";
import { NetworkKind } from "../../networks";
import { WalletProvider } from "../../utils/walletProvider";

// import { addWallet } from "../../store/slices/wallets";
// import { useAppDispatch } from "../../store/store";
// import { Network } from "../../networks";

type UsePhantomResult = [true, boolean, Wallet] | [false, true, undefined];

// ts-unused-exports:disable-next-line
export const usePhantom: () => UsePhantomResult = () => {
  const [publicKey, setPublicKey] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const phantom = getPhantom();
    const hasPhantom = checkHasPhantom();

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
      const phantom = getPhantom();
      const hasPhantom = checkHasPhantom();
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
      address: publicKey,
      provider: WalletProvider.Phantom,
      networkKind: NetworkKind.Solana,
      networkId: "",
      userId: "",
      connected: !!publicKey,
      id: "phantom",
    };
    console.log("phantom", wallet);
    return wallet;
  }, [publicKey]);

  /*
  useEffect(() => {
    if (!wallet.address) {
      return;
    }
    dispatch(
      addWallet({
        publicKey: wallet.address,
        network: wallet.network,
      })
    );
  }, [wallet]);
  */

  return checkHasPhantom() ? [true, ready, wallet] : [false, true, undefined];
};

const getPhantom = () => {
  return (window as any)?.solana;
};

const checkHasPhantom = () => {
  return !!getPhantom()?.isPhantom;
};
