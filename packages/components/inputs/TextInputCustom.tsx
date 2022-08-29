import React from "react";
import { StyleProp, TextInput, View, ViewStyle } from "react-native";

import {
  numberWithThousandsSeparator,
  thousandSeparatedToNumber,
} from "../../utils/numbers";
import { neutral22, neutral77 } from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const TextInputCustom: React.FC<{
  label: string;
  value: string;
  placeHolder: string;
  squaresBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  onChangeText?: (text: string) => void;
  onPressEnter?: () => void;
  onlyNumbers?: boolean;
  disabled?: boolean;
  regexp?: RegExp;
}> = ({
  label,
  value,
  placeHolder,
  onPressEnter,
  style,
  regexp,
  children,
  onChangeText,
  onlyNumbers,
  disabled,
  squaresBackgroundColor,
}) => {
  // Handling key pressing
  const handleKeyPress = ({ nativeEvent: { key: keyValue } }) => {
    switch (keyValue) {
      case "Enter":
        if (onPressEnter) onPressEnter();
    }
  };

  // Replace the comma if number and controls
  const handleChangeText = (value) => {
    // ---- If you want only number in the TextInputCustom, we apply comma as a thousand separator
    if (onlyNumbers) {
      const withoutCommaValue = thousandSeparatedToNumber(value);
      // Set value only if fully number
      const reg = new RegExp(/^\d+$/);
      if (reg.test(withoutCommaValue)) {
        onChangeText(numberWithThousandsSeparator(withoutCommaValue));
      }
    }
    // ---- Apply onChange respecting the regexp (Allow empty string)
    if ((regexp && (regexp.test(value) || value === "")) || !regexp) {
      onChangeText(value);
    }
  };

  return (
    <TertiaryBox
      height={48}
      width={332}
      squaresBackgroundColor={squaresBackgroundColor}
      style={style}
      mainContainerStyle={{
        alignItems: "flex-start",
        paddingHorizontal: 12,
        backgroundColor: neutral22,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
      >
        <View style={{ flex: 1, marginRight: children && 12 }}>
          <BrandText
            style={{ color: neutral77, fontSize: 10, fontWeight: "500" }}
          >
            {label}
          </BrandText>
          <TextInput
            editable={!disabled}
            placeholder={placeHolder}
            value={value}
            onChangeText={handleChangeText}
            onKeyPress={handleKeyPress}
            placeholderTextColor="#999999"
            style={[
              {
                fontSize: 14,
                marginTop: 4,
                color: "white",
                fontFamily: "Exo_600SemiBold",
              },
              { outlineStyle: "none" } as any,
            ]}
          />
        </View>

        <>{children}</>
      </View>
    </TertiaryBox>

    // <View
    //   style={[
    //     {
    //       borderColor: neutral33,
    //       borderWidth: 1,
    //       borderRadius: 8,
    //       backgroundColor: neutral22,
    //       flex: 1,
    //       height: 48,
    //       minHeight: 48,
    //       maxHeight: 48,
    //       minWidth: 332,
    //       paddingHorizontal: 12,
    //       justifyContent: "center",
    //     },
    //     style,
    //   ]}
    // >
    //   <View style={{ flexDirection: "row", alignItems: "center" }}>
    //     <View style={{ flex: 1, marginRight: children && 12 }}>
    //       <BrandText
    //         style={{ color: neutral77, fontSize: 10, fontWeight: "500" }}
    //       >
    //         {label}
    //       </BrandText>
    //       <TextInput
    //         editable={!disabled}
    //         placeholder={placeHolder}
    //         value={value}
    //         onChangeText={handleChangeText}
    //         onKeyPress={handleKeyPress}
    //         placeholderTextColor="#999999"
    //         style={[
    //           {
    //             fontSize: 14,
    //             marginTop: 4,
    //             color: "white",
    //             fontFamily: "Exo_600SemiBold",
    //           },
    //           { outlineStyle: "none" } as any,
    //         ]}
    //       />
    //     </View>
    //
    //     <>{children}</>
    //   </View>
    // </View>
  );
};
