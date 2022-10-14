import React, { createContext, RefObject, useContext, useState } from "react";
import {
  NativeSyntheticEvent,
  NativeTouchEvent,
  Pressable,
  StyleSheet,
} from "react-native";

interface DefaultValue {
  onPressDropdownButton: (dropdownRef: RefObject<any>) => void;
  closeOpenedDropdown: () => void;
  isDropdownOpen: (dropdownRef: RefObject<any>) => boolean;
  onPressOutside: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
}

const defaultValue: DefaultValue = {
  onPressDropdownButton: () => {},
  closeOpenedDropdown: () => {},
  isDropdownOpen: () => false,
  onPressOutside: () => {},
};

export const DropdownsContext = createContext(defaultValue);

// Used to close the opened dropdown by clicking outside it.
// You will need to set zIndex > 99998 to the dropdown you want to use (If not, you will can't click on the dropdown stuff, it will close !)
export const DropdownClickOutside: React.FC = () => {
  const { onPressOutside } = useDropdowns();
  return <Pressable style={styles.pressable} onPress={onPressOutside} />;
};

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
        closeOpenedDropdown,
        onPressOutside,
      }}
    >
      {children}
    </DropdownsContext.Provider>
  );
};

export const useDropdowns = () => useContext(DropdownsContext);

const styles = StyleSheet.create({
  pressable: {
    width: "100vw",
    height: "100vh",
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 99998,
    cursor: "unset",
  },
});
