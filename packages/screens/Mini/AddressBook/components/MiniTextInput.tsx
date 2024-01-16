import React, { ReactNode, useRef, useState } from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";

import closeSVG from "../../../../../assets/icons/input-close.svg";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { SpacerRow } from "../../../../components/spacer";
import { neutral22, neutral77 } from "../../../../utils/style/colors";
import { fontMedium16 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

export interface MiniTexInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  icon?: React.FC<SvgProps> | string;
  iconSize?: number;
  enableClearButton?: boolean;
  right?: ReactNode;
  onChangeText?: (text: string) => void;
  value?: string;
  type?: "number" | "string";
}

export default function MiniTextInput({
  style,
  inputStyle,
  enableClearButton,
  icon,
  iconSize,
  value,
  right,
  onChangeText,
  type = "string",
  ...rest
}: MiniTexInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [clearButton, setClearButton] = useState(false);

  function onInputClick() {
    inputRef.current?.focus();
  }

  function onInputClear() {
    inputRef.current?.clear();
    setClearButton(false);
  }

  function onChangeHandler(text: string) {
    if (enableClearButton) {
      setClearButton(true);
    }

    if (!onChangeText) {
      return;
    }

    if (type === "number") {
      if (!isNumber(text)) {
        return onChangeText("");
      }

      onChangeText(text);
    }

    onChangeText(text);
  }

  return (
    <CustomPressable onPress={onInputClick}>
      <View
        style={[
          {
            width: "100%",
            backgroundColor: neutral22,
            borderRadius: layout.borderRadius,
            padding: layout.spacing_x2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
          style,
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          {icon && (
            <>
              <SVG
                source={icon}
                width={iconSize ?? 22}
                height={iconSize ?? 22}
              />
              <SpacerRow size={2} />
            </>
          )}
          <TextInput
            ref={inputRef}
            style={[
              fontMedium16,
              {
                color: "#fff",
                lineHeight: 0,
              },
              inputStyle,
            ]}
            placeholderTextColor={neutral77}
            value={value}
            onChangeText={onChangeHandler}
            {...rest}
          />
        </View>

        {clearButton && (
          <CustomPressable onPress={onInputClear}>
            <SVG source={closeSVG} width={22} height={22} />
          </CustomPressable>
        )}

        {right && (
          <>
            <SpacerRow size={1} />
            {right}
          </>
        )}
      </View>
    </CustomPressable>
  );
}

function isNumber(text: string) {
  const reg = new RegExp("^[0-9]+$");

  return reg.test(text);
}
