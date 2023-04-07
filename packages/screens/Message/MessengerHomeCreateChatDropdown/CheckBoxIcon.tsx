import React, { useRef } from "react";
import { View, TouchableWithoutFeedback, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";

interface CustomIconProps {
  size?: number;
  color?: string;
  isChecked?: boolean;
  onPress?: () => void;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  size = 24,
  color = "#fff",
  isChecked = false,
  onPress = () => {},
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.9,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  return (
    <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }],
          width: size,
          height: size,
          borderWidth: 1,
          borderColor: color,
          backgroundColor: isChecked ? color : "transparent",
          borderRadius: 6,
        }}
      >
        {isChecked && (
          <Svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <Path
              d="M1 5.5L5.5 10L15 1"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default CustomIcon;
