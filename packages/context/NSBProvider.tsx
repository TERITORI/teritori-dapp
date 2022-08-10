import PropTypes from "prop-types";
import React, {createContext, useContext, useEffect, useState} from "react"

import { LoaderFullScreen } from "../components/loaders/LoaderFullScreen";
import { useSigningCosmWasmClient } from "../hooks/cosmwasm";
import {FeedbacksContext} from "./FeedbacksProvider"

interface DefaultValue {
  name: string;
  setName: (name: string) => void;
}
const defaultValue: DefaultValue = {
  name: "",
  setName: undefined,
};

export const NSBContext = createContext(defaultValue);

const NSBContextProvider = ({ children }) => {
  // The entered name
  const [name, setName] = useState("");
  const { connectWallet } = useSigningCosmWasmClient();
  const { setLoadingFullScreen, setToastError } = useContext(FeedbacksContext);

  // ---- Init
  useEffect(() => {
    setLoadingFullScreen(true);
    const init = async () => {
      await connectWallet();
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

  return (
    <NSBContext.Provider
      value={{
        name,
        setName
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
