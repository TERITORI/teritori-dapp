import React, { FC, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  TouchableOpacity,
  View,
  StyleSheet,
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
      styles.slider,
      { width: sliderWidth },
      { transform: [{ translateX: animatedValue }] },
      { opacity: 1 },
    ];
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[getSliderStyle()]} />
      {items.map((item: string) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={() => onChange(item)}
            key={item}
            onLayout={(e) => {
              const { width, x } = e.nativeEvent.layout;
              setElements((prevElements) => [
                ...prevElements,
                { id: item, value: x - layout.spacing_x0_5 },
              ]);
              setSliderWidth(width);
            }}
          >
            <BrandText
              style={[styles.itemText, value === item && styles.activeText]}
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

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
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
    padding: layout.spacing_x0_5,
  },
  slider: {
    position: "absolute",
    height: 40,
    borderRadius: 7,
    backgroundColor: primaryColor,
  },
  item: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  itemText: StyleSheet.flatten([
    fontSemibold14,
    {
      textAlign: "center",
    },
  ]),

  activeText: StyleSheet.flatten([
    fontSemibold14,
    {
      textAlign: "center",
      color: primaryTextColor,
    },
  ]),
});
