import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { Wallet } from "./wallet";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkKind, allNetworks, getUserId } from "../../networks";
import {
  selectIsAdenaConnected,
  setIsAdenaConnected,
  setSelectedWalletId,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { WalletProvider } from "../../utils/walletProvider";

type UseAdenaResult = [true, boolean, Wallet[]] | [false, boolean, undefined];

export const useAdena: () => UseAdenaResult = () => {
  const isAdenaConnected = useSelector(selectIsAdenaConnected);
  const [hasAdena, setHasAdena] = useState(false);
  const dispatch = useAppDispatch();
  const selectedNetworkInfo = useSelectedNetworkInfo();

  const [state, setState] = useState<{ addresses: string[]; chainId?: string }>(
    { addresses: [] },
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasAdena) {
      return;
    }
    (window as any).adena.On("changedAccount", (address: string) => {
      setState((state) => ({ ...state, addresses: [address] }));
    });
    (window as any).adena.On("changedNetwork", (network: string) => {
      setState((state) => ({ ...state, chainId: network }));
    });
  }, [hasAdena]);

  useEffect(() => {
    const handleLoad = () => {
      const adena = (window as any)?.adena;
      const hasAdena = !!adena;
      if (hasAdena) {
        console.log("adena installed");
      }
      setHasAdena(hasAdena);
      if (!hasAdena) {
        setReady(true);
      }
    };
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    const effect = async () => {
      if (!hasAdena || !isAdenaConnected) {
        setReady(true);
        return;
      }
      try {
        const adena = (window as any)?.adena;
        if (!adena) {
          console.error("no adena");
          setReady(true);
          return;
        }
        const account = await adena.GetAccount();
        console.log("adena account", account);
        if (!account.data.address) {
          throw new Error("no address");
        }

        // adena does not return chain id currently
        let chainId = account.data.chainId;
        if (!chainId && selectedNetworkInfo?.kind === NetworkKind.Gno) {
          chainId = selectedNetworkInfo.chainId;
        }
        if (!chainId) {
          chainId = "dev";
        }

        setState({
          addresses: [account.data.address],
          chainId, // chain id is empty for local nodes
        });
      } catch (err) {
        console.warn("failed to connect to adena", err);
        dispatch(setIsAdenaConnected(false));
      }

      setReady(true);
    };
    effect();
  }, [dispatch, hasAdena, isAdenaConnected, selectedNetworkInfo]);

  const wallets = useMemo(() => {
    const network = allNetworks.find(
      (n) => n.kind === NetworkKind.Gno && n.chainId === state.chainId,
    );
    if (!network) {
      return [];
    }
    if (state.addresses.length === 0) {
      const wallet: Wallet = {
        address: "",
        provider: WalletProvider.Adena,
        networkKind: NetworkKind.Gno,
        networkId: network.id,
        userId: "",
        connected: false,
        id: `adena`,
      };
      return [wallet];
    }
    const wallets = state.addresses.map((address, index) => {
      const wallet: Wallet = {
        address,
        provider: WalletProvider.Adena,
        networkKind: NetworkKind.Gno,
        networkId: network.id,
        userId: getUserId(network.id, address),
        connected: true,
        id: `adena-${network.id}-${address}`,
      };
      return wallet;
    });

    return wallets;
  }, [state]);

  useEffect(() => {
    const selectedWallet = wallets.find((w) => w.connected);
    if (selectedWallet && selectedNetworkInfo?.kind === NetworkKind.Gno) {
      dispatch(setSelectedWalletId(selectedWallet.id));
    }
  }, [dispatch, selectedNetworkInfo?.kind, wallets]);

  return hasAdena ? [true, ready, wallets] : [false, ready, undefined];
};
