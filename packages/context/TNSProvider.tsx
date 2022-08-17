import React, { createContext, useState } from "react";

interface DefaultValue {
  name: string;
  setName: (name: string) => void;
}
const defaultValue: DefaultValue = {
  name: "",
  setName: undefined,
};

export const TNSContext = createContext(defaultValue);

const TNSContextProvider: React.FC = ({ children }) => {
  // The entered name
  const [name, setName] = useState("");

  return (
    <TNSContext.Provider
      value={{
        name,
        setName,
      }}
    >
      {children}
    </TNSContext.Provider>
  );
};

export default TNSContextProvider;
