import React from "react";
import { TextInput, View, ViewStyle, Platform } from "react-native";

import searchSVG from "../../../assets/icons/search.svg";
import { handleKeyPress } from "../../utils/keyboard";
import {
  numberWithThousandsSeparator,
  thousandSeparatedToNumber,
} from "../../utils/numbers";
import { neutral22, neutral33 } from "../../utils/style/colors";
import { SVG } from "../SVG";

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const TextInputCustomBorder: React.FC<{
  value: string;
  placeHolder: string;
  style?: ViewStyle | ViewStyle[];
  onChangeText?: (text: string) => void;
  onPressEnter?: () => void;
  onlyNumbers?: boolean;
  disabled?: boolean;
  regexp?: RegExp;
}> = ({
  value,
  placeHolder,
  onPressEnter,
  style,
  regexp,
  children,
  onChangeText,
  onlyNumbers,
  disabled,
}) => {
  // Replace the comma if number and controls
  const handleChangeText = (value: string) => {
    // ---- If you want only number in the TextInputCustomBorder, we apply comma as a thousand separator
    if (onChangeText) {
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
    }
  };

  return (
    <View
      style={[
        {
          borderColor: neutral33,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: neutral22,
          flex: 1,
          height: 48,
          minHeight: 48,
          maxHeight: 48,
          minWidth: ["android", "ios"].includes(Platform.OS) ? 250 : 332,
          paddingHorizontal: 12,
          justifyContent: "center",
        },
        style,
      ]}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
      >
        <View
          style={{ flex: 1, marginRight: children ? 12 : 0, width: "100%" }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <SVG source={searchSVG} width={16} height={16} />
            <TextInput
              editable={!disabled}
              placeholder={placeHolder}
              value={value}
              onChangeText={handleChangeText}
              onKeyPress={(event) => handleKeyPress({ event, onPressEnter })}
              placeholderTextColor="#999999"
              style={[
                {
                  fontSize: 14,
                  color: "white",
                  fontFamily: "Exo_600SemiBold",
                  marginLeft: 11,
                  width: "90%",
                },
                { outlineStyle: "none" } as any,
              ]}
            />
          </View>
        </View>

        <>{children}</>
      </View>

      {/* Left top broken corner */}
      <View
        style={{
          width: 8,
          height: 22,
          left: 0,
          top: -6,
          backgroundColor: "#000000",
          transform: [{ rotate: "45deg" }],
          position: "absolute",
          zIndex: 2,
          borderWidth: 1,
          borderRightColor: neutral33,
        }}
      />

      {/* Right bottom broken corner */}
      <View
        style={{
          width: 8,
          height: 22,
          right: 0,
          bottom: -6,
          transform: [{ rotate: "225deg" }],
          backgroundColor: "#000000",
          position: "absolute",
          zIndex: 2,
          borderWidth: 1,
          borderRightColor: neutral33,
        }}
      />
    </View>
  );
};
