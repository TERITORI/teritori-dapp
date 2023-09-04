import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextInput,
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

type InputSelectProps = {
  width: number;
  data: string[];
  initValue: string;
  value: string;
  setValue?: any;
  disable?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const InputSelect: React.FC<InputSelectProps> = ({
  width,
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
      width: width - 2 * layout.spacing_x2,
      borderColor: neutral33,
      borderWidth: 1,
      borderRadius: layout.spacing_x1_5,
      padding: layout.spacing_x2,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    inputContainer: {
      backgroundColor: neutral00,
      borderWidth: 1,
      borderColor: neutral33,
      borderRadius: layout.spacing_x1_5,
      paddingHorizontal: layout.spacing_x2,
    },
    inputItemStyle: {
      backgroundColor: "#292929",
      color: neutralA3,
      paddingVertical: layout.spacing_x2,
      paddingHorizontal: layout.spacing_x1,
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
      borderRadius: layout.spacing_x1_5,
      paddingVertical: layout.spacing_x2,
      paddingHorizontal: layout.spacing_x1,
      position: "absolute",
      top: 52,
      width: "100%",
    },
    normalDropdownMenuText: StyleSheet.flatten([
      fontMedium13,
      {
        color: neutralA3,
        padding: layout.spacing_x1,
      },
    ]),
    hoveredDropdownMenuText: StyleSheet.flatten([
      fontMedium13,
      {
        backgroundColor: neutral33,
        borderRadius: 6,
        padding: layout.spacing_x1,
      },
    ]),
    textInput: StyleSheet.flatten([
      fontSemibold14,
      {
        backgroundColor: neutral00,
        borderColor: neutral33,
        borderRadius: layout.spacing_x1_5,
        padding: layout.spacing_x2,
        borderWidth: 1,
        color: secondaryColor,
        width,
      },
    ]),
  });

  const descriptionData = ["Begin typing to explore skills"];

  const [openDescriptionMenu, setOpenDescriptionMenu] =
    useState<boolean>(false);
  const [openRecommendMenu, setOpenRecommendMenu] = useState<boolean>(true);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [enableInput, setEnableInput] = useState<boolean>(false);

  return (
    <Pressable
      onPress={() => {
        if (!disable && !enableInput) setOpenDescriptionMenu((value) => !value);
      }}
      style={[style, { position: "relative" }]}
    >
      {!enableInput && (
        <View style={[styles.selectInput, { width }]}>
          <BrandText style={styles.inputItemText}>
            {value ? value : initValue}
          </BrandText>
          {!openDescriptionMenu && (
            <SVG
              source={chevronDownSVG}
              width={16}
              height={16}
              color={secondaryColor}
            />
          )}
          {openDescriptionMenu && (
            <SVG
              source={chevronUpSVG}
              width={16}
              height={16}
              color={secondaryColor}
            />
          )}
        </View>
      )}
      {enableInput && (
        <TextInput
          style={[styles.textInput, { outlineStyle: "none" } as any]}
          value={value}
          onChangeText={(value) => setValue(value)}
        />
      )}

      {openRecommendMenu && value !== "" && (
        <View style={styles.dropdownMenu}>
          {data.map((item: string, index: number) => {
            if (item.includes(value))
              return (
                <Pressable
                  //@ts-ignore
                  onMouseEnter={() => setHoveredIndex(index + 1)}
                  onMouseLeave={() => setHoveredIndex(0)}
                  onPress={() => {
                    setOpenRecommendMenu(false);
                    setValue(item);
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
              );
          })}
        </View>
      )}

      {openDescriptionMenu && (
        <View style={styles.dropdownMenu}>
          {descriptionData.map((item: string, index: number) => (
            <Pressable
              // @ts-ignore
              onMouseEnter={() => setHoveredIndex(index + 1)}
              onMouseLeave={() => setHoveredIndex(0)}
              onPress={() => {
                setOpenDescriptionMenu(false);
                setEnableInput(true);
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
