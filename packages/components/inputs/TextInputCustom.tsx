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

import asteriskSignSVG from "../../../assets/icons/asterisk-sign.svg";
import { DEFAULT_FORM_ERRORS } from "../../utils/errors";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import {
  fontMedium10,
  fontSemibold13,
  fontSemibold14,
} from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { ErrorText } from "../ErrorText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerColumn, SpacerRow } from "../spacer";

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
  variant?: "regular" | "labelOutside" | "noCropBorder";
  control?: Control<T>;
  name: Path<T>;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  defaultValue?: PathValue<T, Path<T>>;
  subtitle?: string;
  labelStyle?: TextStyle;
  isAsterickSign?: boolean;
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
  isAsterickSign,
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
  }, [defaultValue]);

  const error = useMemo(() => {
    if (fieldState.error) {
      if (fieldState.error?.message) {
        return fieldState.error?.message;
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
      {variant && ["labelOutside", "noCropBorder"].includes(variant) && (
        <>
          <View style={styles.rowEnd}>
            <View style={styles.row}>
              <BrandText style={[styles.labelText, fontSemibold14, labelStyle]}>
                {label}
              </BrandText>
              {isAsterickSign && (
                <>
                  <SpacerRow size={0.5} />
                  <SVG source={asteriskSignSVG} width={6} height={6} />
                </>
              )}
            </View>
            {subtitle && (
              <BrandText style={fontSemibold13}>{subtitle}</BrandText>
            )}
          </View>
          <SpacerColumn size={1} />
        </>
      )}

      <TertiaryBox
        squaresBackgroundColor={squaresBackgroundColor}
        style={style}
        mainContainerStyle={[
          styles.mainContainer,
          variant === "noCropBorder" && styles.noCropBorderBg,
        ]}
        width={width}
        fullWidth={!width}
        height={height}
        noBrokenCorners={variant === "noCropBorder"}
      >
        <View style={styles.innerContainer}>
          <View style={{ flex: 1, marginRight: children ? 12 : undefined }}>
            {!variant ||
              (!["labelOutside", "noCropBorder"].includes(variant) && (
                <Pressable onPress={() => inputRef.current?.focus()}>
                  <BrandText
                    style={[styles.labelText, fontMedium10, labelStyle]}
                  >
                    {label}
                  </BrandText>
                  <SpacerColumn size={0.5} />
                </Pressable>
              ))}
            <TextInput
              ref={inputRef}
              editable={!disabled}
              placeholder={placeHolder}
              onChangeText={handleChangeText}
              onKeyPress={handleKeyPress}
              placeholderTextColor="#999999"
              value={field.value}
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
  rowEnd: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  row: { flexDirection: "row" },
  mainContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: neutral22,
  },
  noCropBorderBg: {
    backgroundColor: neutral00,
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: 12,
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
