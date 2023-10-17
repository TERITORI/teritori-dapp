import { Currency } from "@keplr-wallet/types";
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  RegisterOptions,
  useController,
  Control,
  Path,
  PathValue,
  FieldValues,
} from "react-hook-form";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";

import { DEFAULT_FORM_ERRORS } from "../../utils/errors";
import { handleKeyPress } from "../../utils/keyboard";
import {
  additionalRed,
  neutral00,
  neutral22,
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../utils/style/colors";
import { fontMedium10, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { ErrorText } from "../ErrorText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { CustomPressable } from "../buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../spacer";

export interface TextInputCustomProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  variant?: "regular" | "labelOutside" | "noStyle";
  iconSVG?: React.FC<SvgProps>;
  placeHolder?: string;
  squaresBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
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
  subtitle?: React.ReactElement;
  hideLabel?: boolean;
  errorStyle?: ViewStyle;
  valueModifier?: (value: string) => string;
  isLoading?: boolean;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  boxMainContainerStyle?: ViewStyle;
  noBrokenCorners?: boolean;
  error?: string;
  fullWidth?: boolean;
  setRef?: Dispatch<SetStateAction<RefObject<any> | null>>;
}

export const Label: React.FC<{
  children: string;
  style?: StyleProp<TextStyle>;
  isRequired?: boolean;
  hovered?: boolean;
}> = ({ children, style, isRequired, hovered }) => (
  <View
    style={{
      flexDirection: "row",
    }}
  >
    <BrandText
      style={[
        styles.labelText,
        fontSemibold14,
        style,
        hovered && { color: secondaryColor },
      ]}
    >
      {children}
    </BrandText>
    {!!isRequired && children && (
      <BrandText
        style={[
          styles.labelText,
          fontSemibold14,
          { color: additionalRed, marginLeft: layout.spacing_x0_5 },
        ]}
      >
        *
      </BrandText>
    )}
  </View>
);

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const TextInputCustom = <T extends FieldValues>({
  label,
  placeHolder,
  onPressEnter,
  style,
  textInputStyle,
  regexp,
  children,
  currency,
  disabled,
  squaresBackgroundColor,
  width,
  height,
  variant = "regular",
  noBrokenCorners,
  name,
  control,
  defaultValue,
  rules,
  subtitle,
  labelStyle,
  iconSVG,
  hideLabel,
  valueModifier,
  errorStyle,
  isLoading,
  containerStyle,
  boxMainContainerStyle,
  error,
  fullWidth,
  setRef,
  ...restProps
}: TextInputCustomProps<T>) => {
  const { field, fieldState } = useController<T>({
    name,
    control,
    rules,
  });
  const inputRef = useRef<TextInput>(null);
  const [hovered, setHovered] = useState(false);
  // Passing ref to parent since I didn't find a pattern to handle generic argument <T extends FieldValues> AND forwardRef
  useEffect(() => {
    if (inputRef.current && setRef) {
      setRef(inputRef);
    }
  }, [setRef]);

  useEffect(() => {
    if (defaultValue) {
      handleChangeText(defaultValue || "");
    }
    // handleChangeText changes on every render and we want to call handleChangeText only when default value changes so we disable exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const fieldError = useMemo(() => {
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

  if (variant === "noStyle")
    return (
      <TextInput
        ref={inputRef}
        editable={!disabled}
        placeholder={placeHolder}
        onChangeText={handleChangeText}
        onKeyPress={(event) => handleKeyPress({ event, onPressEnter })}
        placeholderTextColor={neutralA3}
        value={field.value}
        style={[styles.textInput, textInputStyle]}
        {...restProps}
      />
    );

  return (
    <CustomPressable
      style={containerStyle}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => inputRef?.current?.focus()}
      disabled={disabled}
    >
      {variant === "labelOutside" && !hideLabel && (
        <>
          <View style={styles.rowEnd}>
            <Label
              hovered={hovered}
              style={labelStyle}
              isRequired={!!rules?.required}
            >
              {label}
            </Label>
            {subtitle}
          </View>
          <SpacerColumn size={1.5} />
        </>
      )}
      <TertiaryBox
        squaresBackgroundColor={squaresBackgroundColor}
        style={style}
        mainContainerStyle={[
          styles.mainContainer,
          noBrokenCorners && styles.noCropBorderBg,
          hovered && { borderColor: secondaryColor },
        ]}
        width={width}
        fullWidth={!width}
        height={height}
        noBrokenCorners={noBrokenCorners}
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
              (variant !== "labelOutside" && !hideLabel && (
                <>
                  <BrandText
                    style={[styles.labelText, fontMedium10, labelStyle]}
                  >
                    {label}
                  </BrandText>
                  <SpacerColumn size={0.5} />
                </>
              ))}
            <TextInput
              ref={inputRef}
              editable={!disabled}
              placeholder={placeHolder}
              onChangeText={handleChangeText}
              onKeyPress={(event) => handleKeyPress({ event, onPressEnter })}
              placeholderTextColor={neutral77}
              value={field.value}
              style={[styles.textInput, textInputStyle]}
              {...restProps}
            />
          </View>

          {isLoading ? (
            <ActivityIndicator color={secondaryColor} />
          ) : (
            <>{children}</>
          )}
        </View>
      </TertiaryBox>
      <ErrorText>{error || fieldError}</ErrorText>
    </CustomPressable>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
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
    paddingVertical: layout.spacing_x1_5,
  },
  labelText: {
    color: neutralA3,
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
  rowEnd: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});
