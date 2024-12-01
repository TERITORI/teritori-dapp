import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { useAdenaStore } from "./useAdenaStore";
import { useAppDispatch } from "../../../store/store";
import { Wallet } from "../wallet";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import {
  GnoNetworkInfo,
  NetworkKind,
  allNetworks,
  getUserId,
} from "@/networks";
import {
  selectIsAdenaConnected,
  setIsAdenaConnected,
  setSelectedNetworkId,
  setSelectedWalletId,
} from "@/store/slices/settings";
import { WalletProvider } from "@/utils/walletProvider";

type UseAdenaResult = [true, boolean, Wallet[]] | [false, boolean, undefined];

export const useAdena: () => UseAdenaResult = () => {
  const isAdenaConnected = useSelector(selectIsAdenaConnected);
  const [hasAdena, setHasAdena] = useState(false);
  const dispatch = useAppDispatch();
  const selectedNetworkInfo = useSelectedNetworkInfo();

  const { setToast } = useFeedbacks();

  const adena = hasAdena ? (window as any).adena : null;

  const { state, setState } = useAdenaStore();
  const [ready, setReady] = useState(false);

  const fetchAccount = useCallback(
    async (
      dispatch: any,
      adena: any,
      isAdenaConnected: boolean,
      targetChainId: string | undefined,
    ) => {
      if (!adena || !isAdenaConnected || !selectedNetworkInfo) {
        console.log(
          `adena: ${!adena} connected: ${isAdenaConnected} chainId: ${selectedNetworkInfo?.chainId}`,
        );
        setReady(true);
        return;
      }

      try {
        const account = await adena.GetAccount();
        console.log("adena account", account);
        if (!account.data.address) {
          throw new Error("no address");
        }

        if (selectedNetworkInfo.chainId !== account.data.chainId) {
          setReady(true);
          return;
        }

        // adena does not return chain id currently
        const chainId = targetChainId || account.data.chainId || "dev";

        setState({
          addresses: [account.data.address],
          chainId, // chain id is empty for local nodes
        });
        dispatch(setSelectedNetworkId(selectedNetworkInfo.id));
      } catch (err) {
        console.warn("failed to connect to adena", err);
        dispatch(setIsAdenaConnected(false));
      }

      setReady(true);
    },
    [selectedNetworkInfo, setState],
  );

  const addNetwork = useCallback(
    async (selectedNetworkInfo: GnoNetworkInfo) => {
      const res = await adena.AddNetwork({
        chainId: selectedNetworkInfo.chainId,
        rpcUrl: selectedNetworkInfo.endpoint,
        chainName: selectedNetworkInfo.displayName,
      });

      if (res.status === "failure") {
        throw Error(res.message);
      }
    },
    [adena],
  );

  const switchNetwork = useCallback(
    async (selectedNetworkInfo: GnoNetworkInfo) => {
      try {
        const network = await adena.GetNetwork();
        if (network.status === "failure") {
          if (network.type === "NOT_CONNECTED") return;
          throw Error(network.message);
        }

        const currentChainId = network.data.chainId;

        if (currentChainId === selectedNetworkInfo?.chainId) {
          return;
        }

        const res = await adena.SwitchNetwork(selectedNetworkInfo?.chainId);

        if (res.status === "success") {
          setState({ ...state, chainId: res.data.chainId });
          return;
        }

        console.warn(res);

        if (res.type === "UNADDED_NETWORK") {
          await addNetwork(selectedNetworkInfo);
          switchNetwork(selectedNetworkInfo);
          return;
        }

        throw Error(res.message);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setToast({
            type: "error",
            message: err.message,
            mode: "normal",
            title: "Failed to connect to Adena (2)",
          });
        }
      }
    },
    [adena, setToast, addNetwork, setState, state],
  );

  useEffect(() => {
    if (!adena) return;

    if (selectedNetworkInfo?.kind !== NetworkKind.Gno) return;

    switchNetwork(selectedNetworkInfo);
  }, [adena, selectedNetworkInfo, setToast, addNetwork, switchNetwork]);

  useEffect(() => {
    if (!adena) return;

    adena.On("changedAccount", (address: string) => {
      setState({ ...state, addresses: [address] });
    });
    adena.On("changedNetwork", (network: string) => {
      setState({ ...state, chainId: network });
    });
  }, [adena, state, setState]);

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
    fetchAccount(dispatch, adena, isAdenaConnected, state.chainId);
  }, [dispatch, adena, isAdenaConnected, state.chainId, fetchAccount]);

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

  return adena ? [true, ready, wallets] : [false, ready, undefined];
};
