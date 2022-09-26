import React, { useEffect, useMemo } from "react";
import {
  RegisterOptions,
  useController,
  Control,
  Path,
  PathValue,
} from "react-hook-form";
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInputKeyPressEventData,
  TextInputProps,
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
import { DEFAULT_ERRORS } from "../../utils/variables";
import { BrandText } from "../BrandText";
import { ErrorText } from "../ErrorText";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { DivColumn } from "../div";
import { SpacerColumn } from "../spacer";

export interface TextInputCustomProps<T> extends TextInputProps {
  label: string;
  placeHolder?: string;
  squaresBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  onPressEnter?: () => void;
  onlyNumbers?: boolean;
  disabled?: boolean;
  regexp?: RegExp;
  width?: number;
  variant?: "regular" | "labelOutside";
  control?: Control<T>;
  name: Path<T>;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  defaultValue?: any;
}

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const TextInputCustom = <T,>({
  label,
  placeHolder,
  onPressEnter,
  style,
  regexp,
  children,
  onlyNumbers,
  disabled,
  squaresBackgroundColor,
  width,
  variant,
  name,
  control,
  defaultValue = "",
  rules,
}: TextInputCustomProps<T>) => {
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

  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  const error = useMemo(() => {
    if (fieldState.error) {
      if (fieldState.error?.message) {
        return fieldState.error?.message;
      }
      return DEFAULT_ERRORS.required;
    }
  }, [fieldState.error]);

  // Replace the comma if number and controls
  const handleChangeText = (value: string) => {
    // ---- If you want only number in the TextInputCustom, we apply comma as a thousand separator
    if (onlyNumbers) {
      const withoutCommaValue = thousandSeparatedToNumber(value);
      // Set value only if fully number
      const reg = new RegExp(/^\d+$/);

      if (
        rules?.max &&
        parseInt(withoutCommaValue, 10) >= (rules.max as number) + 1
      ) {
        return;
      }

      if (reg.test(withoutCommaValue) || !value) {
        field.onChange(numberWithThousandsSeparator(withoutCommaValue));
      }
      return;
    }
    // ---- Apply onChange respecting the regexp (Allow empty string)
    if ((regexp && (regexp.test(value) || value === "")) || !regexp) {
      field.onChange(value);
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
              onChangeText={handleChangeText}
              onKeyPress={handleKeyPress}
              placeholderTextColor="#999999"
              value={field.value as any}
            />
          </View>

          <>{children}</>
        </View>
      </TertiaryBox>
      <ErrorText>{error}</ErrorText>
    </>
  );
};

const LabelText = styled(BrandText)(({ theme: { colors } }) => ({
  color: colors.neutral77,
}));

const TextInput = styled.TextInput(({ theme: { colors } }) => ({
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
