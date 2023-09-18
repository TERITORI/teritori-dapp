import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { DefaultValue, useDropdowns } from "../context/DropdownsProvider";

interface DropdownProps {
  children:
    | React.ReactNode
    | (({ closeOpenedDropdown }: Partial<DefaultValue>) => React.ReactNode);
  triggerComponent?: React.ReactNode;
  style?: ViewStyle;
  onDropdownClosed?: () => void;
  positionStyle?: ViewStyle;
}

export const Dropdown = ({
  style,
  children,
  triggerComponent,
  onDropdownClosed,
  positionStyle = {},
}: DropdownProps) => {
  const [, setLayout] = useState({
    height: 0,
    width: 0,
  });
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);

  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (isOpened && !isDropdownOpen(dropdownRef)) {
      onDropdownClosed?.();
    }
  }, [isDropdownOpen, isOpened, onDropdownClosed]);

  const handleLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setLayout(layout);
  };

  const handleOpen = useCallback(() => {
    setIsOpened(true);
    onPressDropdownButton(dropdownRef);
  }, [onPressDropdownButton]);

  useEffect(() => {
    if (!triggerComponent) {
      handleOpen();
    }
  }, [handleOpen, triggerComponent]);

  return (
    <View
      style={[{ position: "relative" }, style]}
      ref={dropdownRef}
      onLayout={handleLayout}
    >
      {!!triggerComponent && (
        <TouchableOpacity onPress={handleOpen}>
          {triggerComponent}
        </TouchableOpacity>
      )}
      {isDropdownOpen(dropdownRef) && (
        <View
          style={[
            {
              position: "absolute",
              width: "auto",
              flex: 1,
              zIndex: 999,
            },
            positionStyle,
          ]}
        >
          {typeof children === "function"
            ? children({ isDropdownOpen, closeOpenedDropdown })
            : children}
        </View>
      )}
    </View>
  );
};
