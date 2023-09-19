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

  const isDropdownOpened = isDropdownOpen(dropdownRef);

  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (isOpened && !isDropdownOpened) {
      onDropdownClosed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDropdownOpened, isOpened]);

  const handleLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setLayout(layout);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOpen = () => {
    setIsOpened(true);
    onPressDropdownButton(dropdownRef);
  };

  useEffect(() => {
    if (!triggerComponent) {
      handleOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerComponent]);

  return (
    <View
      style={[{ position: "relative", zIndex: 99999999 }, style]}
      ref={dropdownRef}
      onLayout={handleLayout}
    >
      {!!triggerComponent && (
        <TouchableOpacity onPress={handleOpen}>
          {triggerComponent}
        </TouchableOpacity>
      )}
      {isDropdownOpened && (
        <View
          style={[
            {
              position: "absolute",
              width: "auto",
              flex: 1,
              zIndex: 9999999999,
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
