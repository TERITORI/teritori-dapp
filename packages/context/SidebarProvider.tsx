import React, { createContext, useContext, useState } from "react";
import { Platform } from "react-native";

interface DefaultValue {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
}

const defaultValue: DefaultValue = {
  isSidebarExpanded: Platform.OS === "web",
  toggleSidebar: () => {},
};

const SidebarContext = createContext(defaultValue);

export const SidebarContextProvider: React.FC = ({ children }) => {
  // The entered isSidebarExpanded
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(
    defaultValue.isSidebarExpanded
  );

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarExpanded,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
