import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleProp, ViewStyle } from "react-native";

import { TextComboBoxDownMenu } from "./TextComboBoxDownMenu";
import { IMenuItem } from "./types";
import chevronUp from "../../../assets/icons/chevron-up.svg";
import chevronDown from "../../../assets/icons/freelance-service/chevron-down.svg";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText/BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const TextComboBox: React.FC<{
  options: IMenuItem[];
  value?: string;
  style?: StyleProp<ViewStyle>;
  onChange: (value: string) => void;
}> = ({ options = [], value = "", style, onChange }) => {
  const [isOptionsDisplayed, setIsOptionsDisplayed] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    // onChange(selectedValue);
    setIsOptionsDisplayed(false);
  }, [selectedValue]);
  return (
    <View style={style}>
      <TertiaryBox
        fullWidth
        height={50}
        mainContainerStyle={{ borderColor: "white" }}
        style={[{ marginRight: 15 }]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsOptionsDisplayed(!isOptionsDisplayed);
            }}
            style={{ width: "100%", flexDirection: "row" }}
          >
            <BrandText
              style={[
                fontSemibold14,
                {
                  flex: 1,
                  marginLeft: 15,
                },
              ]}
            >
              {options.find(({ value }) => value === selectedValue)?.label ??
                ""}
            </BrandText>
            <View style={{ marginRight: 15 }}>
              {isOptionsDisplayed ? (
                <SVG source={chevronDown} width={16} height={16} />
              ) : (
                <SVG source={chevronUp} width={16} height={16} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </TertiaryBox>
      {isOptionsDisplayed && (
        <TextComboBoxDownMenu
          onChange={setSelectedValue}
          value={selectedValue}
          options={options}
          hideMenu={() => {
            setIsOptionsDisplayed(false);
          }}
        />
      )}
    </View>
  );
};
