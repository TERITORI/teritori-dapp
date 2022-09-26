import React from "react";
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInputKeyPressEventData,
  View,
  ViewStyle,
} from "react-native";
import styled from "styled-components/native";

import {
  numberWithThousandsSeparator,
  thousandSeparatedToNumber,
} from "../../utils/numbers";
import { neutral22 } from "../../utils/style/colors";
import { fontMedium10, fontSemibold14 } from "../../utils/style/fonts";
import { genericStyles } from "../../utils/style/genericStyles";
import { BrandText } from "../BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { DivColumn } from "../div";
import { SpacerColumn } from "../spacer";

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
  width?: number;
  variant?: "regular" | "labelOutside";
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
  width,
  variant,
}) => {
  // Handling key pressing
  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    const {
      nativeEvent: { key: keyValue },
    } = event;
    switch (keyValue) {
      case "Enter":
        if (onPressEnter) onPressEnter();
    }
  };

  // Replace the comma if number and controls
  const handleChangeText = (value: string) => {
    if (!onChangeText) {
      return;
    }
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
    <>
      {variant === "labelOutside" && (
        <DivColumn>
          <LabelText style={fontSemibold14}>{label}</LabelText>
          <SpacerColumn numberOfSpaces={0.25} />
        </DivColumn>
      )}

      <TertiaryBox
        squaresBackgroundColor={squaresBackgroundColor}
        style={style}
        mainContainerStyle={styles.mainContainer}
        fullWidth
        width={width}
      >
        <View style={[genericStyles.rowWithCenter, genericStyles.w100]}>
          <View style={{ flex: 1, marginRight: children ? 12 : undefined }}>
            {variant !== "labelOutside" && (
              <DivColumn>
                <LabelText style={fontMedium10}>{label}</LabelText>
                <SpacerColumn numberOfSpaces={0.125} />
              </DivColumn>
            )}
            <TextInput
              editable={!disabled}
              placeholder={placeHolder}
              value={value}
              onChangeText={handleChangeText}
              onKeyPress={handleKeyPress}
              placeholderTextColor="#999999"
            />
          </View>

          <>{children}</>
        </View>
      </TertiaryBox>
    </>
  );
};

const LabelText = styled(BrandText)(({ theme: { layout, colors } }) => ({
  color: colors.neutral77,
}));

const TextInput = styled.TextInput(({ theme: { layout, colors } }) => ({
  fontSize: 14,
  color: colors.secondary,
  fontFamily: "Exo_600SemiBold",
  outlineStyle: "none",
}));

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: neutral22,
  },
});
