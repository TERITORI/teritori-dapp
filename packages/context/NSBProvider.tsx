import PropTypes from "prop-types";
import React, { createContext, useEffect, useState } from "react";

import { LoaderFullScreen } from "../components/loaders/LoaderFullScreen";
import { useSigningCosmWasmClient } from "../hooks/cosmwasm";
import { useTokenList } from "../hooks/tokens";
import { useHasUserConnectedWallet } from "../hooks/useHasUserConnectedWallet";

interface NSBToastMessage {
  title: string;
  message: string;
}
export const initialNsbError: NSBToastMessage = { title: "", message: "" };
export const initialNsbSuccess: NSBToastMessage = { title: "", message: "" };

interface DefaultValue {
  name: string;
  setName: (name: string) => void;
  nsbError: NSBToastMessage;
  setNsbError: (error: NSBToastMessage) => void;
  nsbSuccess: NSBToastMessage;
  setNsbSuccess: (info: NSBToastMessage) => void;
  nsbLoading: boolean;
  setNsbLoading: (loading: boolean) => void;
}
const defaultValue: DefaultValue = {
  name: "",
  setName: undefined,
  nsbError: initialNsbError,
  setNsbError: undefined,
  nsbSuccess: initialNsbSuccess,
  setNsbSuccess: undefined,
  nsbLoading: false,
  setNsbLoading: undefined,
};

export const NSBContext = createContext(defaultValue);

const NSBContextProvider = ({ children }) => {
  const [nsbLoading, setNsbLoading] = useState(false);
  // The entered name
  const [name, setName] = useState("");
  // Error/success after mint, etc...
  const [nsbError, setNsbError] = useState(initialNsbError);
  const [nsbSuccess, setNsbSuccess] = useState(initialNsbSuccess);
  const { connectWallet } = useSigningCosmWasmClient();

  // ---- Init
  useEffect(() => {
    setNsbLoading(true);
    const init = async () => {
      await connectWallet();
    };
    init()
      .then((r) => {
        setNsbLoading(false);
      })
      .catch((e) => {
        setNsbError({ title: "Something went wrong!", message: e.message });
        setNsbLoading(false);
      });
  }, []);

  return (
    <NSBContext.Provider
      value={{
        name,
        setName,
        nsbError,
        setNsbError,
        nsbSuccess,
        setNsbSuccess,
        nsbLoading,
        setNsbLoading,
      }}
    >
      {nsbLoading ? <LoaderFullScreen /> : null}
      {children}
    </NSBContext.Provider>
  );
};

NSBContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default NSBContextProvider;
