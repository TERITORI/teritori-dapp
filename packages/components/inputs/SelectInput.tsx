import React, { ReactElement, useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from "react-native";

import { Label, TextInputCustom } from "./TextInputCustom";
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
  selectData: (data: SelectInputData) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  label?: string;
  isRequired?: boolean;
  allowSearchValue?: boolean;
  name?: string;
  isLoading?: boolean;
};

export const SelectInput: React.FC<Props> = ({
  data,
  placeHolder,
  selectedData,
  selectData,
  disabled,
  style,
  boxStyle,
  label,
  isRequired,
  allowSearchValue,
  name,
  isLoading,
}) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [hovered, setHovered] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const selectableData = useMemo(
    () =>
      allowSearchValue && searchValue
        ? // selectableData depends on searchValue
          data.filter((d) =>
            d.label.toLowerCase().includes(searchValue.toLowerCase())
          )
        : // Or selectableData is just the given data
          data,
    [allowSearchValue, data, searchValue]
  );

  // It obliges the user to select a value from the list to trigger a valid selectData. The searchValue will not be used as selectedData.
  // Also, after the user selected a value, if he modifies the searchValue, he will have to re-select a value from the list.
  useEffect(() => {
    if (
      allowSearchValue &&
      selectedData.label &&
      searchValue !== selectedData.label
    ) {
      selectData({ label: "", value: "" });
    }
  }, [allowSearchValue, searchValue, selectData, selectedData]);

  useEffect(() => {
    if (!selectableData.length) {
      setOpenMenu(false);
    }
  }, [selectableData]);

  const getScrollViewStyle = () => {
    if (selectableData.length > 5) {
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
        if (!disabled || selectableData.length) setOpenMenu((value) => !value);
      }}
      disabled={disabled || !selectableData.length}
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

            {allowSearchValue ? (
              <TextInputCustom
                placeHolder={placeHolder}
                name={name || ""}
                hideLabel
                label=""
                variant="noStyle"
                value={searchValue}
                onChangeText={(text) => {
                  setSearchValue(text);
                  setOpenMenu(!!selectableData.length);
                }}
                rules={{ required: isRequired }}
                style={{ flex: 1 }}
                containerStyle={{ flex: 1 }}
                boxMainContainerStyle={{ flex: 1 }}
                textInputStyle={{ width: "100%" }}
                disabled={disabled || isLoading}
              />
            ) : (
              <BrandText
                style={[
                  fontSemibold14,
                  { color: selectedData ? secondaryColor : neutral77 },
                ]}
              >
                {selectedData?.label ? selectedData.label : placeHolder}
              </BrandText>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator
              color={secondaryColor}
              style={{ marginLeft: layout.padding_x1_5 }}
            />
          ) : (
            <SVG
              source={
                !selectableData.length || disabled
                  ? lockSVG
                  : openMenu
                  ? chevronUpSVG
                  : chevronDownSVG
              }
              width={16}
              height={16}
              color={secondaryColor}
              style={{ marginLeft: layout.padding_x1_5 }}
            />
          )}
        </View>

        {/*TODO: If the opened menu appears under other elements, you'll may need to set zIndex:-1 or something to these elements*/}
        {openMenu && (
          <ScrollView style={getScrollViewStyle()}>
            {selectableData.map((item, index) => (
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
                  selectData(item);
                  setSearchValue(item.label);
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
    flex: 1,
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
  inputIconContainer: {
    marginLeft: layout.padding_x1_5,
  },
});
