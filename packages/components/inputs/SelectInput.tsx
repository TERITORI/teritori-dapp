import React, { ReactElement, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

import { Label } from "./TextInputCustom";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import lockSVG from "../../../assets/icons/lock.svg";
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
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  label?: string;
  isRequired?: boolean;
};

export const SelectInput: React.FC<Props> = ({
  data,
  placeHolder,
  selectedData,
  setData,
  disabled,
  style,
  boxStyle,
  label,
  isRequired,
}) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [hovered, setHovered] = useState(false);

  const getScrollViewStyle = () => {
    if (data.length > 5) {
      return [styles.dropdownMenu, { height: 200 }];
    }
    return styles.dropdownMenu;
  };

  return (
    <CustomPressable
      style={[style, { position: "relative", zIndex: 999 }]}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => {
        if (!disabled || data.length) setOpenMenu((value) => !value);
      }}
      disabled={disabled || !data.length}
    >
      {label && (
        <>
          <Label
            hovered={hovered}
            style={{ color: neutralA3 }}
            isRequired={isRequired}
          >
            {label}
          </Label>
          <SpacerColumn size={1.5} />
        </>
      )}
      <View>
        <View
          style={[
            styles.selectInput,
            hovered && { borderColor: secondaryColor },
            boxStyle,
          ]}
        >
          <View style={styles.iconLabel}>
            {selectedData.iconComponent && (
              <>
                {selectedData.iconComponent}
                <SpacerRow size={1} />
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
            source={
              !data.length || disabled
                ? lockSVG
                : openMenu
                ? chevronUpSVG
                : chevronDownSVG
            }
            width={16}
            height={16}
            color={secondaryColor}
          />
        </View>

        {/*TODO: If the opened menu appears under other elements, you'll may need to set zIndex:-1 or something to these elements*/}
        {openMenu && (
          <ScrollView style={getScrollViewStyle()}>
            {data.map((item, index) => (
              <CustomPressable
                onHoverIn={() => {
                  setHoveredIndex(index + 1);
                  setHovered(true);
                }}
                onHoverOut={() => {
                  setHoveredIndex(0);
                  setHovered(false);
                }}
                onPress={() => {
                  setData(item);
                  setOpenMenu(false);
                }}
                key={index}
                style={styles.dropdownMenuRow}
              >
                <View
                  style={[
                    styles.iconLabel,
                    hoveredIndex === index + 1 && { opacity: 0.5 },
                  ]}
                >
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
      </View>
    </CustomPressable>
  );
};

const styles = StyleSheet.create({
  selectInputLabel: StyleSheet.flatten([fontSemibold14, { color: neutralA3 }]),
  selectInput: {
    backgroundColor: neutral00,
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
    alignItems: "center",
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
  dropdownMenuRow: {
    borderRadius: 6,
    padding: layout.padding_x1,
  },
});
