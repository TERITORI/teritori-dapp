import React, { useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useClickOutside } from "../hooks/useClickOutside";

interface DropdownProps {
  children:
    | React.ReactNode
    | (({
        isDropdownOpen,
        setDropdownState,
      }: {
        isDropdownOpen: boolean;
        setDropdownState: (val?: boolean) => void;
      }) => React.ReactNode);
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

  const [isDropdownOpen, setDropdownState, dropdownRef] = useClickOutside({
    callback: (val) => {
      if (!val) {
        onDropdownClosed?.();
      }
    },
  });

  const handleLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setLayout(layout);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOpen = () => {
    setDropdownState(true);
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
      collapsable={false}
    >
      {!!triggerComponent && (
        <TouchableOpacity onPress={handleOpen}>
          {triggerComponent}
        </TouchableOpacity>
      )}
      {isDropdownOpen && (
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
            ? children({ isDropdownOpen, setDropdownState })
            : children}
        </View>
      )}
    </View>
  );
};
