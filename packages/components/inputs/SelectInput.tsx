import React, { ReactElement, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
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
import { CustomPressable } from "../buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../spacer";

export type SelectInputDataValue = string | number;

export type SelectInputData = {
  label: string;
  value: SelectInputDataValue;
  iconComponent?: ReactElement;
};

type Props = {
  data: SelectInputData[];
  placeHolder?: string;
  selectedData: SelectInputData;
  setData: (data: SelectInputData) => void;
  disable?: boolean;
  style?: StyleProp<ViewStyle>;
  label?: string;
};

export const SelectInput: React.FC<Props> = ({
  data,
  placeHolder,
  selectedData,
  setData,
  disable,
  style,
  label,
}) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  const getScrollViewStyle = () => {
    if (data.length > 5) {
      return [styles.dropdownMenu, { height: 200 }];
    }
    return styles.dropdownMenu;
  };
  return (
    <View style={[style, { position: "relative", zIndex: 999 }]}>
      {label && <BrandText style={styles.selectInputLabel}>{label}</BrandText>}
      <SpacerColumn size={1} />

      <CustomPressable
        onPress={() => {
          if (!disable) setOpenMenu((value) => !value);
        }}
      >
        <View style={[styles.selectInput]}>
          <View style={styles.iconLabel}>
            {selectedData.iconComponent && (
              <>
                {selectedData.iconComponent}
                <SpacerRow size={1.5} />
              </>
            )}

            <BrandText
              style={[
                fontSemibold14,
                { color: selectedData ? secondaryColor : neutral77 },
              ]}
            >
              {selectedData?.label ? selectedData.label : placeHolder}
            </BrandText>
          </View>

          <SVG
            source={openMenu ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </View>

        {openMenu && (
          <ScrollView style={getScrollViewStyle()}>
            {data.map((item, index) => (
              <CustomPressable
                onHoverIn={() => setHoveredIndex(index + 1)}
                onHoverOut={() => setHoveredIndex(0)}
                onPress={() => {
                  setData(item);
                  setOpenMenu(false);
                }}
                key={index}
                style={
                  hoveredIndex === index + 1
                    ? styles.hoveredDropdownMenuRow
                    : styles.normalDropdownMenuRow
                }
              >
                <View style={styles.iconLabel}>
                  {item.iconComponent && (
                    <>
                      {item.iconComponent}
                      <SpacerRow size={1.5} />
                    </>
                  )}

                  <BrandText style={styles.dropdownMenuText}>
                    {item.label}
                  </BrandText>
                </View>
              </CustomPressable>
            ))}
          </ScrollView>
        )}
      </CustomPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  selectInputLabel: StyleSheet.flatten([fontSemibold14, { color: neutralA3 }]),
  selectInput: {
    backgroundColor: neutral00,
    fontSize: 14,
    fontWeight: 600,
    color: secondaryColor,
    borderColor: neutral33,
    borderWidth: 1,
    borderRadius: 12,
    padding: layout.padding_x1_5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputContainer: {
    backgroundColor: neutral00,
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: 12,
    paddingHorizontal: layout.padding_x1_5,
  },
  inputItemStyle: {
    backgroundColor: "#292929",
    color: neutralA3,
    paddingVertical: layout.padding_x1_5,
    paddingHorizontal: layout.padding_x1,
  },
  iconLabel: {
    flexDirection: "row",
  },

  dropdownMenu: {
    backgroundColor: "#292929",
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: 12,
    padding: layout.padding_x1,
    position: "absolute",
    top: 52,
    width: "100%",
    zIndex: 10,
  },
  dropdownMenuText: StyleSheet.flatten([fontMedium13]),
  normalDropdownMenuRow: {
    borderRadius: 6,
    padding: layout.padding_x1,
  },
  hoveredDropdownMenuRow: {
    backgroundColor: neutral00,
    borderRadius: 6,
    padding: layout.padding_x1,
  },
});
