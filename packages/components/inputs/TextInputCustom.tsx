import { Currency } from "@keplr-wallet/types";
import React, { useMemo } from "react";
import {
  RegisterOptions,
  useController,
  Control,
  Path,
  PathValue,
  FieldValues,
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
import { neutral22, neutral77, secondaryColor } from "../../utils/style/colors";
import { fontMedium10, fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { ErrorText } from "../ErrorText";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerColumn } from "../spacer";

export interface TextInputCustomProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  iconSVG?: StyleProp<ViewStyle>;
  placeHolder?: string;
  squaresBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  onPressEnter?: () => void;
  currency?: Currency;
  disabled?: boolean;
  regexp?: RegExp;
  width?: number;
  height?: number;
  variant?: "regular" | "labelOutside";
  control?: Control<T>;
  name: Path<T>;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  defaultValue?: PathValue<T, Path<T>>;
}

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const TextInputCustom = <T extends FieldValues>({
  label,
  placeHolder,
  onPressEnter,
  style,
  regexp,
  children,
  currency,
  disabled,
  squaresBackgroundColor,
  width,
  height,
  variant,
  name,
  control,
  defaultValue,
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

  const { field, fieldState } = useController<T>({
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

  // custom validation
  const handleChangeText = (value: string) => {
    if (currency) {
      const reg = new RegExp(`^\\d+\\.?\\d{0,${currency.coinDecimals}}$`);

      if (rules?.max && parseFloat(value) > rules.max) {
        return;
      }

      if (reg.test(value) || !value) {
        field.onChange(value);
        if (restProps?.onChangeText) {
          restProps.onChangeText(value);
          return;
        }
      }
      return;
    }

    if ((regexp && (regexp.test(value) || value === "")) || !regexp) {
      field.onChange(value);
      if (restProps?.onChangeText) {
        restProps.onChangeText(value);
      }
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
        squaresBackgroundColor={squaresBackgroundColor}
        style={style}
        mainContainerStyle={styles.mainContainer}
        fullWidth
        width={width}
        height={height}
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
              style={styles.textInput}
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
    backgroundColor: neutral22,
  },
  labelText: {
    color: neutral77,
  },
  textInput: {
    fontSize: 14,
    color: secondaryColor,
    fontFamily: "Exo_600SemiBold",
    outlineStyle: "none",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});
