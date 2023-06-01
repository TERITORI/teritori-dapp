import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import {
  neutral00,
  neutral17,
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

type TableSelectProps = {
  width: number;
  height: number;
  data: string[];
  initValue?: string;
  value: string;
  setValue?: any;
  disable?: boolean;
  zIndex?: number;
  style?: StyleProp<ViewStyle>;
};

export const TableSelect: React.FC<TableSelectProps> = ({
  width,
  height,
  data,
  initValue,
  value,
  setValue,
  disable,
  zIndex = 0,
  style,
}) => {
  const unitHorizontalPadding = 10;

  const styles = StyleSheet.create({
    selectInput: {
      backgroundColor: neutral00,
      width,
      height,
      paddingHorizontal: unitHorizontalPadding,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    inputItemText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: value ? secondaryColor : neutral77,
      },
    ]),
    dropdownMenu: {
      backgroundColor: neutral17,
      paddingVertical: unitHorizontalPadding,
      position: "absolute",
      top: 39,
      width: "100%",
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
        padding: layout.padding_x1,
      },
    ]),
  });

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  return (
    <Pressable
      onPress={() => {
        if (!disable) setOpenMenu((value) => !value);
      }}
      style={[style, { position: "relative", zIndex }]}
    >
      <View style={[styles.selectInput, { width }]}>
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
        <View style={styles.dropdownMenu}>
          {data.map((item: string, index: number) => (
            <Pressable
              // @ts-ignore
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
        </View>
      )}
    </Pressable>
  );
};
