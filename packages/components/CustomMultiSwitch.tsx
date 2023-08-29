import React, { FC, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  TouchableOpacity,
  View,
  TextStyle,
  ViewStyle,
} from "react-native";

import { BrandText } from "./BrandText";
import {
  neutral00,
  neutral33,
  primaryColor,
  primaryTextColor,
} from "../utils/style/colors";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { capitalize } from "../utils/text";

interface Props {
  items: string[];
  value: string;
  onChange: (value: any) => void;
}

export const CustomMultipleSwitch: FC<Props> = ({ items, value, onChange }) => {
  const [elements, setElements] = useState<{ id: string; value: number }[]>([]);
  const [sliderWidth, setSliderWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (elements.length === items.length) {
      const position = elements.find((el) => el.id === value);
      if (!position) {
        return;
      }
      Animated.timing(animatedValue, {
        toValue: position.value,
        duration: 0,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  }, [items, value, elements, animatedValue]);

  useEffect(() => {
    const startAnimation = (newVal: string) => {
      const position = elements.find((el) => el.id === newVal);
      if (!position) {
        return;
      }
      Animated.timing(animatedValue, {
        toValue: position.value,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    };
    startAnimation(value);
  }, [value, animatedValue, elements]);

  const getSliderStyle = () => {
    return [
      sliderStyle,
      { width: sliderWidth },
      { transform: [{ translateX: animatedValue }] },
      { opacity: 1 },
    ];
  };

  return (
    <View style={containerStyle}>
      <Animated.View style={[getSliderStyle()]} />
      {items.map((item: string) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            style={itemStyle}
            onPress={() => onChange(item)}
            key={item}
            onLayout={(e) => {
              const { width, x } = e.nativeEvent.layout;
              setElements((prevElements) => [
                ...prevElements,
                { id: item, value: x - layout.padding_x0_5 },
              ]);
              setSliderWidth(width);
            }}
          >
            <BrandText
              style={[itemTextStyle, value === item && activeTextStyle]}
              numberOfLines={1}
            >
              {capitalize(item)}
            </BrandText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const containerStyle: ViewStyle = {
  width: "100%",
  borderRadius: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: 48,
  backgroundColor: neutral00,
  borderWidth: 1,
  borderColor: neutral33,
  position: "relative",
  padding: layout.padding_x0_5,
};
const sliderStyle: ViewStyle = {
  position: "absolute",
  height: 40,
  borderRadius: 7,
  backgroundColor: primaryColor,
};
const itemStyle: ViewStyle = {
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
};
const itemTextStyle: TextStyle = {
  ...fontSemibold14,
  textAlign: "center",
};

const activeTextStyle: TextStyle = {
  ...fontSemibold14,
  textAlign: "center",
  color: primaryTextColor,
};
