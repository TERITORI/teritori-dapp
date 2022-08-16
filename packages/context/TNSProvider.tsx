import PropTypes from "prop-types";
import React, {createContext, useEffect, useState} from "react"

import { LoaderFullScreen } from "../components/loaders/LoaderFullScreen";
import {useSigningCosmWasmClient} from "../hooks/cosmwasm"

interface TNSToastMessage {
  title: string;
  message: string;
}
export const initialTnsError: TNSToastMessage = { title: "", message: "" };
export const initialTnsSuccess: TNSToastMessage = { title: "", message: "" };

interface DefaultValue {
  name: string;
  setName: (name: string) => void;
  tnsError: TNSToastMessage;
  setTnsError: (error: TNSToastMessage) => void;
  tnsSuccess: TNSToastMessage;
  setTnsSuccess: (info: TNSToastMessage) => void;
  tnsLoading: boolean;
  setTnsLoading: (loading: boolean) => void;
}
const defaultValue: DefaultValue = {
  name: "",
  setName: undefined,
  tnsError: initialTnsError,
  setTnsError: undefined,
  tnsSuccess: initialTnsSuccess,
  setTnsSuccess: undefined,
  tnsLoading: false,
  setTnsLoading: undefined,
};

export const TNSContext = createContext(defaultValue);

const TNSContextProvider = ({ children }) => {
  const [tnsLoading, setTnsLoading] = useState(false);
  // The entered name
  const [name, setName] = useState("");
  // Error/success after mint, etc...
  const [tnsError, setTnsError] = useState(initialTnsError);
  const [tnsSuccess, setTnsSuccess] = useState(initialTnsSuccess);
  const { connectWallet } = useSigningCosmWasmClient();

  // ---- Init
  useEffect(() => {
    setTnsLoading(true);
    const init = async () => {
      await connectWallet();
    };
    init()
    .then(() => {
      setTnsLoading(false);
    })
    .catch((e) => {
      setTnsError({ title: "Something went wrong!", message: e.message });
      setTnsLoading(false);
    });
  }, []);

  return (
    <TNSContext.Provider
      value={{
        name,
        setName,
        tnsError,
        setTnsError,
        tnsSuccess,
        setTnsSuccess,
        tnsLoading,
        setTnsLoading,
      }}
    >
      {tnsLoading ? <LoaderFullScreen /> : null}
      {children}
    </TNSContext.Provider>
  );
};

TNSContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default TNSContextProvider;
