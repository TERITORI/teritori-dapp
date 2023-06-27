import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
}

type Position = "top" | "bottom" | "left" | "right" | "auto";

export const Dropdown = ({
  style,
  children,
  triggerComponent,
  onDropdownClosed,
}: DropdownProps) => {
  const [layout, setLayout] = useState({
    height: 0,
    width: 0,
  });
  const {
    onPressDropdownButton,
    isDropdownOpen,
    closeOpenedDropdown,
    openedDropdownRef,
  } = useDropdowns();
  const dropdownRef = useRef<View>(null);

  const [copyDropdownOpen, setCopyDropdownOpen] = useState(false);

  useEffect(() => {
    if (copyDropdownOpen && !isDropdownOpen(dropdownRef)) {
      onDropdownClosed?.();
    }
    if (!copyDropdownOpen && isDropdownOpen(dropdownRef)) {
      setCopyDropdownOpen(true);
    }
  }, [openedDropdownRef]);

  const handleLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setLayout(layout);
  };

  useEffect(() => {
    !triggerComponent && onPressDropdownButton(dropdownRef);
  }, []);

  return (
    <View
      style={[{ position: "relative" }, style]}
      ref={dropdownRef}
      onLayout={handleLayout}
    >
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        {triggerComponent}
      </TouchableOpacity>
      {isDropdownOpen(dropdownRef) && (
        <View
          style={{
            position: "absolute",
            top: "-100%",
            width: "auto",
            flex: 1,
          }}
        >
          {typeof children === "function"
            ? children({ isDropdownOpen, closeOpenedDropdown })
            : children}
        </View>
      )}
    </View>
  );
};
