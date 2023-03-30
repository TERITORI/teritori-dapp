import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import {
  neutral00,
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

type GeneralSelectProps = {
  data: string[];
  initValue?: string;
  value: string;
  setValue?: any;
  disable?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const GeneralSelect: React.FC<GeneralSelectProps> = ({
  data,
  initValue,
  value,
  setValue,
  disable,
  style,
}) => {
  const styles = StyleSheet.create({
    selectInput: {
      backgroundColor: neutral00,
      fontSize: 14,
      fontWeight: 600,
      color: secondaryColor,
      borderColor: neutral33,
      borderWidth: 1,
      borderRadius: layout.padding_x1_5,
      padding: layout.padding_x2,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    inputContainer: {
      backgroundColor: neutral00,
      borderWidth: 1,
      borderColor: neutral33,
      borderRadius: layout.padding_x1_5,
      paddingHorizontal: layout.padding_x2,
    },
    inputItemStyle: {
      backgroundColor: "#292929",
      color: neutralA3,
      paddingVertical: layout.padding_x2,
      paddingHorizontal: layout.padding_x1,
    },
    inputItemText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: value ? secondaryColor : neutral77,
      },
    ]),
    dropdownMenu: {
      backgroundColor: "#292929",
      borderWidth: 1,
      borderColor: neutral33,
      borderRadius: layout.padding_x1_5,
      paddingVertical: layout.padding_x2,
      paddingHorizontal: layout.padding_x1,
      position: "absolute",
      top: 52,
      width: "100%",
      zIndex: 10,
    },
    normalDropdownMenuText: StyleSheet.flatten([
      fontMedium13,
      {
        color: neutralA3,
        padding: layout.padding_x1,
      },
    ]),
    hoveredDropdownMenuText: StyleSheet.flatten([
      fontMedium13,
      {
        backgroundColor: neutral33,
        borderRadius: 6,
        padding: layout.padding_x1,
      },
    ]),
  });

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  const getScrollViewStyle = () => {
    if (data.length > 5) {
      return [styles.dropdownMenu, { height: 200 }];
    }
    return styles.dropdownMenu;
  };
  return (
    <Pressable
      onPress={() => {
        if (!disable) setOpenMenu((value) => !value);
      }}
      style={[style, { position: "relative" }]}
    >
      <View style={[styles.selectInput]}>
        <BrandText style={styles.inputItemText}>
          {value ? value : initValue}
        </BrandText>
        {!openMenu && (
          <SVG
            source={chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        )}
        {openMenu && (
          <SVG
            source={chevronUpSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        )}
      </View>
      {openMenu && (
        <ScrollView style={getScrollViewStyle()}>
          {data.map((item: string, index: number) => (
            <Pressable
              onMouseEnter={() => setHoveredIndex(index + 1)}
              onMouseLeave={() => setHoveredIndex(0)}
              onPress={() => {
                setValue(item);
                setOpenMenu(false);
              }}
              key={index}
            >
              <BrandText
                style={
                  hoveredIndex === index + 1
                    ? styles.hoveredDropdownMenuText
                    : styles.normalDropdownMenuText
                }
              >
                {item}
              </BrandText>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </Pressable>
  );
};
