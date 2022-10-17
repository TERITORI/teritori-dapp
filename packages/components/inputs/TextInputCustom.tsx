import React, { useMemo } from "react";
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
  TextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

import { DEFAULT_ERRORS } from "../../utils/errors";
import {
  numberWithThousandsSeparator,
  thousandSeparatedToNumber,
} from "../../utils/numbers";
import { neutral22, neutral77, secondaryColor } from "../../utils/style/colors";
import { fontMedium10, fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { ErrorText } from "../ErrorText";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerColumn } from "../spacer";


export interface TextInputCustomProps<T>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder?: string;
  squaresBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  onPressEnter?: () => void;
  onlyNumbers?: boolean;
  disabled?: boolean;
  regexp?: RegExp;
  width?: number;
  height?: number;
  variant?: "regular" | "labelOutside";
  control?: Control<T>;
  name: Path<T>;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  defaultValue?: PathValue<T, Path<T>>;
  center?: boolean;
  multiLine?: boolean;
  numberLines?: number;
  mainBoxBackgroundColor?: string;
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
  height,
  variant,
  name,
  control,
  defaultValue,
  center = true,
  multiLine = false,
  numberLines = 0,
  mainBoxBackgroundColor = neutral22,
  rules,
  ...restProps
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
    if (restProps?.onChangeText) {
      restProps.onChangeText(value);
      return;
    }
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
        <View>
          <BrandText style={[styles.labelText, fontSemibold14]}>
            {label}
          </BrandText>
          <SpacerColumn size={1} />
        </View>
      )}

      <TertiaryBox
        leftSquaresBackgroundColor={squaresBackgroundColor}
        rightSquaresBackgroundColor={squaresBackgroundColor}
        style={style}
        mainContainerStyle={{alignItems: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: mainBoxBackgroundColor,}}
        fullWidth
        width={width}
        height={height}
        center={center}
      >
        <View style={styles.innerContainer}>
          <View style={{ flex: 1, marginRight: children ? 12 : undefined }}>
            {variant !== "labelOutside" && (
              <View>
                <BrandText style={[styles.labelText, fontMedium10]}>
                  {label}
                </BrandText>
                <SpacerColumn size={0.5} />
              </View>
            )}
            <TextInput
              editable={!disabled}
              placeholder={placeHolder}
              onChangeText={handleChangeText}
              onKeyPress={handleKeyPress}
              placeholderTextColor="#999999"
              value={field.value as string}
              multiline = {multiLine}
              numberOfLines = {numberLines}
              style={{
                fontSize: 14,
                color: secondaryColor,
                fontFamily: "Exo_600SemiBold",
                height: height ? height - 20: undefined,
                textAlign: "top",
                wordWrap: "break-word",
                
                // paddingBottom: 40,
                outlineStyle: "none"
              }}
              {...restProps}
            />
          </View>

          <>{children}</>
        </View>
      </TertiaryBox>
      <ErrorText>{error}</ErrorText>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "red",
  },
  labelText: {
    color: neutral77,
  },
  textInput: {
    backgroundColor: "red",
    fontSize: 14,
    color: secondaryColor,
    fontFamily: "Exo_600SemiBold",
    outlineStyle: "none",
  },
  innerContainer: {
    flexDirection: "row",
    width: "100%",
  },
});