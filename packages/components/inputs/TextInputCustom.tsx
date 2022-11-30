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
import { SvgProps } from "react-native-svg";

import { DEFAULT_FORM_ERRORS } from "../../utils/errors";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import { fontMedium10 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { ErrorText } from "../ErrorText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerColumn, SpacerRow } from "../spacer";
import {
  TextInputOutsideLabel,
  TextInputLabelProps,
} from "./TextInputOutsideLabel";

export interface TextInputCustomProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue">,
    TextInputLabelProps {
  variant?: "regular" | "labelOutside" | "noCropBorder";
  iconSVG?: React.FC<SvgProps>;
  placeHolder?: string;
  squaresBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  onPressEnter?: () => void;
  currency?: Currency;
  disabled?: boolean;
  regexp?: RegExp;
  width?: number;
  height?: number;
  control?: Control<T>;
  name: Path<T>;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  defaultValue?: PathValue<T, Path<T>>;
  mainContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  hideLabel?: boolean;
  errorStyle?: ViewStyle;
  valueModifier?: (value: string) => string;
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
  variant = "regular",
  name,
  control,
  defaultValue,
  rules,
  subtitle,
  labelStyle,
  isAsterickSign,
  iconSVG,
  mainContainerStyle,
  inputStyle,
  hideLabel,
  valueModifier,
  errorStyle,
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
        field.onChange(valueModifier ? valueModifier(value) : value);
        if (restProps?.onChangeText) {
          restProps.onChangeText(value);
          return;
        }
      }
      return;
    }

    if ((regexp && (regexp.test(value) || value === "")) || !regexp) {
      field.onChange(valueModifier ? valueModifier(value) : value);
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
      {variant &&
        ["labelOutside", "noCropBorder"].includes(variant) &&
        !hideLabel && (
          <TextInputOutsideLabel
            labelStyle={labelStyle}
            isAsterickSign={isAsterickSign}
            subtitle={subtitle}
            label={label}
          />
        )}
      <TertiaryBox
        squaresBackgroundColor={squaresBackgroundColor}
        style={style}
        mainContainerStyle={[
          styles.mainContainer,
          variant === "noCropBorder" && styles.noCropBorderBg,
          mainContainerStyle,
        ]}
        width={width}
        fullWidth={!width}
        height={height}
        noBrokenCorners={variant === "noCropBorder"}
      >
        <View style={styles.innerContainer}>
          {iconSVG && (
            <>
              <SVG source={iconSVG} width={16} height={16} />
              <SpacerRow size={1.5} />
            </>
          )}
          <View style={{ flex: 1, marginRight: children ? 12 : undefined }}>
            {!variant ||
              (!["labelOutside", "noCropBorder"].includes(variant) &&
                !hideLabel && (
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
              style={[styles.textInput, inputStyle]}
              {...restProps}
            />
          </View>

          <>{children}</>
        </View>
      </TertiaryBox>
      <ErrorText style={errorStyle}>{error}</ErrorText>
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
  noCropBorderBg: {
    backgroundColor: neutral00,
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: 12,
    paddingVertical: layout.padding_x1_5,
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
