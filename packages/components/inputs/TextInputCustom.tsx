import { Currency } from "@keplr-wallet/types";
import React, { useEffect, useMemo, useRef } from "react";
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
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { DEFAULT_FORM_ERRORS } from "../../utils/errors";
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
  subtitle?: React.ReactElement;
  labelStyle?: TextStyle;
  noBrokenCorners?: boolean;
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
  subtitle,
  labelStyle,
  noBrokenCorners,
  ...restProps
}: TextInputCustomProps<T>) => {
  // variables
  const { field, fieldState } = useController<T>({
    name,
    control,
    rules,
    defaultValue,
  });
  const inputRef = useRef<TextInput>(null);

  // hooks
  useEffect(() => {
    if (defaultValue) {
      handleChangeText(defaultValue);
    }
    // handleChangeText changes on every render and we want to call handleChangeText only when default value changes so we disable exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const error = useMemo(() => {
    if (fieldState.error) {
      if (fieldState.error.message) {
        return fieldState.error.message;
      }
      return DEFAULT_FORM_ERRORS.required;
    }
  }, [fieldState.error]);

  // FIXME: the first input does not trigger the custom validation

  // custom validation
  const handleChangeText = (value: string) => {
    if (currency) {
      const reg = new RegExp(`^\\d+\\.?\\d{0,${currency.coinDecimals}}$`);

      if (rules?.max && parseFloat(value) > rules.max) {
        return;
      }

      if (reg.test(value) || !value) {
        field.onChange(value);
        if (restProps.onChangeText) {
          restProps.onChangeText(value);
          return;
        }
      }
      return;
    }

    if ((regexp && (regexp.test(value) || value === "")) || !regexp) {
      field.onChange(value);
      if (restProps.onChangeText) {
        restProps.onChangeText(value);
      }
    }
  };

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

  return (
    <>
      {variant === "labelOutside" && (
        <>
          <View style={styles.rowEnd}>
            <BrandText style={[styles.labelText, fontSemibold14, labelStyle]}>
              {label}
            </BrandText>
            {subtitle}
          </View>
          <SpacerColumn size={1} />
        </>
      )}

      <TertiaryBox
        squaresBackgroundColor={squaresBackgroundColor}
        style={style}
        mainContainerStyle={styles.mainContainer}
        width={width}
        fullWidth={!width}
        height={height}
        noBrokenCorners={noBrokenCorners}
      >
        <View style={styles.innerContainer}>
          <View style={{ flex: 1, marginRight: children ? 12 : undefined }}>
            {variant !== "labelOutside" && (
              <Pressable onPress={() => inputRef.current?.focus()}>
                <BrandText style={[styles.labelText, fontMedium10, labelStyle]}>
                  {label}
                </BrandText>
                <SpacerColumn size={0.5} />
              </Pressable>
            )}
            <TextInput
              ref={inputRef}
              editable={!disabled}
              placeholder={placeHolder}
              onKeyPress={handleKeyPress}
              placeholderTextColor="#999999"
              value={field.value}
              style={styles.textInput}
              {...restProps}
              onChangeText={handleChangeText}
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
  rowEnd: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
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
