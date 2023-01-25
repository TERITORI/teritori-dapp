import React, { createContext, useContext, useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";

import { mobileWidth } from "../utils/style/layout";

interface DefaultValue {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
}

const defaultValue: DefaultValue = {
  isSidebarExpanded: true,
  toggleSidebar: () => {},
};

const SidebarContext = createContext(defaultValue);

export const SidebarContextProvider: React.FC = ({ children }) => {
  // The entered isSidebarExpanded
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(
    defaultValue.isSidebarExpanded
  );

  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    setIsSidebarExpanded(
      windowWidth >= mobileWidth ? defaultValue.isSidebarExpanded : false
    );
  }, [windowWidth]);

  const toggleSidebar = () =>
    setIsSidebarExpanded(
      windowWidth >= mobileWidth ? !isSidebarExpanded : false
    );

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
