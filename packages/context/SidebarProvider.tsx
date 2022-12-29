import React, { createContext, useContext, useState } from "react";

import { useIsMobile } from "../hooks/useMobile";

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
  const isMobile = useIsMobile();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(
    !isMobile && defaultValue.isSidebarExpanded
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
