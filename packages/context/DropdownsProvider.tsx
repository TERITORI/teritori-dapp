import React, {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useState,
} from "react";
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";

export interface DefaultValue {
  onPressDropdownButton: (dropdownRef: RefObject<any>) => void;
  closeOpenedDropdown: () => void;
  isDropdownOpen: (dropdownRef: RefObject<any>) => boolean;
  openDropdown: (dropdownRef: RefObject<any>) => void;
  openedDropdownRef?: RefObject<any>;
}

const defaultValue: DefaultValue = {
  onPressDropdownButton: () => {},
  closeOpenedDropdown: () => {},
  isDropdownOpen: () => false,
  openDropdown: () => {},
  openedDropdownRef: { current: null },
};

export const DropdownsContext = createContext(defaultValue);

export const DropdownsContextProvider: React.FC = ({ children }) => {
  const [openedDropdownRef, setOpenedDropdownRef] = useState<RefObject<any>>();

  const closeOpenedDropdown = useCallback(() => {
    setOpenedDropdownRef(undefined);
  }, []);

  const openDropdown = useCallback((dropdownRef: RefObject<any>) => {
    setOpenedDropdownRef(dropdownRef);
  }, []);

  const onPressDropdownButton = useCallback(
    (dropdownRef: RefObject<any>) => {
      if (dropdownRef === openedDropdownRef) {
        closeOpenedDropdown();
      } else {
        setOpenedDropdownRef(dropdownRef);
      }
    },
    [closeOpenedDropdown, openedDropdownRef]
  );

  const isDropdownOpen = useCallback(
    (dropdownRef: RefObject<any>) => {
      return dropdownRef === openedDropdownRef;
    },
    [openedDropdownRef]
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      if (
        openedDropdownRef &&
        openedDropdownRef.current &&
        !openedDropdownRef.current?.contains?.(e.target)
      ) {
        closeOpenedDropdown();
      }
    },
    [closeOpenedDropdown, openedDropdownRef]
  );

  return (
    <DropdownsContext.Provider
      value={{
        onPressDropdownButton,
        isDropdownOpen,
        closeOpenedDropdown,
        openDropdown,
        openedDropdownRef,
      }}
    >
      <Pressable onPressOut={handlePressOut} style={styles.pressable}>
        {children}
      </Pressable>
    </DropdownsContext.Provider>
  );
};

const styles = StyleSheet.create({
  pressable: { height: "100%", width: "100%", cursor: "unset" },
});

export const useDropdowns = () => useContext(DropdownsContext);
