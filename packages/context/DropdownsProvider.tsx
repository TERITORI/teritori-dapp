import React, { createContext, RefObject, useContext, useState } from "react";
import {
  NativeSyntheticEvent,
  NativeTouchEvent,
  Pressable,
  StyleSheet,
} from "react-native";

export type DropdownRef = RefObject<any> | null;

interface DefaultValue {
  onPressDropdownButton: (dropdownRef: DropdownRef) => void;
  closeOpenedDropdown: () => void;
  isDropdownOpen: (dropdownRef: DropdownRef) => boolean;
}

const defaultValue: DefaultValue = {
  onPressDropdownButton: () => {},
  closeOpenedDropdown: () => {},
  isDropdownOpen: () => false,
};

export const DropdownsContext = createContext(defaultValue);

export const DropdownsContextProvider: React.FC = ({ children }) => {
  const [openedDropdownRef, setOpenedDropdownRef] = useState<DropdownRef>();

  const closeOpenedDropdown = () => {
    setOpenedDropdownRef(undefined);
  };

  const onPressDropdownButton = (dropdownRef: DropdownRef) => {
    if (dropdownRef === openedDropdownRef) {
      closeOpenedDropdown();
    } else {
      setOpenedDropdownRef(dropdownRef);
    }
  };

  const isDropdownOpen = (dropdownRef: DropdownRef) => {
    return dropdownRef === openedDropdownRef;
  };

  const onPressOut = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
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
        closeOpenedDropdown,
      }}
    >
      <Pressable onPressOut={(e) => onPressOut(e)} style={styles.pressable}>
        {children}
      </Pressable>
    </DropdownsContext.Provider>
  );
};

const styles = StyleSheet.create({
  pressable: { height: "100%", width: "100%", cursor: "unset" },
});

export const useDropdowns = () => useContext(DropdownsContext);
