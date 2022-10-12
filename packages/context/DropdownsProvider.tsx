import React, { createContext, RefObject, useContext, useState } from "react";
import {
  NativeSyntheticEvent,
  NativeTouchEvent,
  Pressable,
} from "react-native";

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

  const closeOpenedDropdown = () => {
    setOpenedDropdownRef(undefined);
  };

  const onPressDropdownButton = (dropdownRef: RefObject<any>) => {
    if (dropdownRef === openedDropdownRef) {
      closeOpenedDropdown();
    } else {
      setOpenedDropdownRef(dropdownRef);
    }
  };

  const isDropdownOpen = (dropdownRef: RefObject<any>) => {
    return dropdownRef === openedDropdownRef;
  };

  const onPressOutside = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    if (
      openedDropdownRef &&
      openedDropdownRef.current &&
      !openedDropdownRef.current.contains(e.target)
    ) {
      closeOpenedDropdown();
    }
  };

  return (
    <DropdownsContext.Provider
      value={{
        onPressDropdownButton,
        isDropdownOpen,
        closeOpenedDropdown
      }}
    >
      {/* Used to close the opened dropdown by clicking outside it */}
      {openedDropdownRef &&
        <Pressable
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 99999,
            // FIXME: We don't want cursor pointer. But "cursor property is not allowed on View"
            cursor: "unset",

          }}
          onPress={onPressOutside}
        />}

      {children}
    </DropdownsContext.Provider>
  )
};

export const useDropdowns = () => useContext(DropdownsContext);
