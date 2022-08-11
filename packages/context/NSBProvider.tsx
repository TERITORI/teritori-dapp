import React, {createContext, useContext, useEffect, useState} from "react"
import { useSigningCosmWasmClient } from "../hooks/useSigningCosmWasmClient";
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

const NSBContextProvider: React.FC = ({ children }) => {
  // The entered name
  const [name, setName] = useState("");

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

export default NSBContextProvider;
