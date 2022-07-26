import PropTypes from "prop-types";
import React, { createContext, useEffect, useState } from "react";
import {useTokenList} from "../hooks/tokens"
import {useSigningCosmWasmClient} from "../hooks/cosmwasm"
import {useHasUserConnectedWallet} from "../hooks/useHasUserConnectedWallet"

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
}
const defaultValue: DefaultValue = {
  name: "",
  setName: undefined,
  nsbError: initialNsbError,
  setNsbError: undefined,
  nsbSuccess: initialNsbSuccess,
  setNsbSuccess: undefined,
};

export const NSBContext = createContext(defaultValue);

const NSBContextProvider = ({ children }) => {
  // The entered name
  const [name, setName] = useState("");
  // Error/success after mint, etc...
  const [nsbError, setNsbError] = useState(initialNsbError);
  const [nsbSuccess, setNsbSuccess] = useState(initialNsbSuccess);
  const { tokens } = useTokenList();
  const userHasCoWallet = useHasUserConnectedWallet();
  const { connectWallet } = useSigningCosmWasmClient();

  // ---- Init
  useEffect(() => {
    const init = async () => {
      await connectWallet();
    };
    init();
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
      }}
    >
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
