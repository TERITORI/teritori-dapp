import React, {
  createContext,
  RefObject,
  useContext,
  useEffect,
  useState,
} from "react";

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

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (
        openedDropdownRef &&
        openedDropdownRef.current &&
        !openedDropdownRef.current.contains(event.target)
      ) {
        closeOpenedDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openedDropdownRef]);

  useEffect(() => {
    console.log("openedDropdownRef", openedDropdownRef);
  }, [openedDropdownRef]);

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
