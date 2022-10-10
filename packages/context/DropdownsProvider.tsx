import React, { createContext, RefObject, useContext, useState } from "react";

interface DefaultValue {
  onPressDropdownButton: (dropdownRef: RefObject<any>) => void;
  closeOpenedDropdown: () => void;
  isDropdownOpen: (dropdownRef: RefObject<any>) => boolean;
}
const defaultValue: DefaultValue = {
  onPressDropdownButton: () => {},
  closeOpenedDropdown: () => {},
  isDropdownOpen: () => false,
};

export const DropdownsContext = createContext(defaultValue);

export const DropdownsContextProvider: React.FC = ({ children }) => {
  const [openedDropdownRef, setOpenedDropdownRef] = useState<RefObject<any>>();

  const onPressDropdownButton = (dropdownRef: React.RefObject<any>) => {
    if (dropdownRef === openedDropdownRef) {
      setOpenedDropdownRef(undefined);
    } else {
      setOpenedDropdownRef(dropdownRef);
    }
  };

  const closeOpenedDropdown = () => {
    setOpenedDropdownRef(undefined);
  };

  const isDropdownOpen = (dropdownRef: React.RefObject<any>) => {
    return dropdownRef === openedDropdownRef;
  };

  return (
    <DropdownsContext.Provider
      value={{
        onPressDropdownButton,
        isDropdownOpen,
        closeOpenedDropdown,
      }}
    >
      {children}
    </DropdownsContext.Provider>
  );
};

export const useDropdowns = () => useContext(DropdownsContext);
