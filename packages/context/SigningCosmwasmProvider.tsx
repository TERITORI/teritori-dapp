import React, {createContext, useContext, ReactNode, useEffect} from "react"

import {
  useSigningCosmWasmClient,
  ISigningCosmWasmClientContext,
} from "../hooks/useSigningCosmWasmClient";
import {FeedbacksContext} from "./FeedbacksProvider"

let CosmWasmContext: any;
const { Provider } = (CosmWasmContext =
  createContext<ISigningCosmWasmClientContext>({
    walletAddress: "",
    signingClient: null,
    loading: false,
    error: null,
    connectWallet: () => {},
    disconnect: () => {},
  }));

export const useSigningClient = (): ISigningCosmWasmClientContext =>
  useContext(CosmWasmContext);

export const SigningCosmWasmProvider: React.FC = ({children}) => {
  const value = useSigningCosmWasmClient();
  const { setLoadingFullScreen, setToastError } = useContext(FeedbacksContext);

  // ---- Init
  useEffect(() => {
    setLoadingFullScreen(true);
    const init = async () => {
      await value.connectWallet();
    };
    init()
    .then(() => {
      setLoadingFullScreen(false);
    })
    .catch((e) => {
      setToastError({ title: "Something went wrong!", message: e.message });
      setLoadingFullScreen(false);
    });
  }, []);

  return <Provider value={value}>{children}</Provider>;
};
