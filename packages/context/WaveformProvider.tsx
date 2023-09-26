import React, { createContext, useContext, useState } from "react";

interface DefaultValue {
  name: string;
  setName: (name: string) => void;
}
const defaultValue: DefaultValue = {
  name: "",
  setName: () => {},
};

const WaveFromContext = createContext(defaultValue);

export const WaveFromContextProvider: React.FC = ({ children }) => {
  const [wavefrom, setWavefrom] = useState("");

  const generateWaveFrom = ({ url }) => {};

  return (
    <WaveFromContext.Provider
      value={{
        name,
        setName,
      }}
    >
      {children}
    </WaveFromContext.Provider>
  );
};

export const useWavefrom = () => useContext(WaveFromContext);
