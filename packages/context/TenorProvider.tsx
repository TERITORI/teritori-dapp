import React, { createContext, useContext, useState } from "react";

interface DefaultValue {}

const defaultValue: DefaultValue = {};

const TenorContext = createContext(defaultValue);

export const TenorContextProvider: React.FC = ({ children }) => {
  return (
    <TenorContext.Provider
      value={{
        isTenorExpanded,
        toggleTenor,
      }}
    >
      {children}
    </TenorContext.Provider>
  );
};

export const useTenor = () => useContext(TenorContext);
