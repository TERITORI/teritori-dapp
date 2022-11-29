import { Currency } from "@keplr-wallet/types";
import React, { useMemo, useRef } from "react";
import {
  RegisterOptions,
  useController,
  Control,
  Path,
  PathValue,
  FieldValues,
} from "react-hook-form";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../../context/DropdownsProvider";
import { DEFAULT_FORM_ERRORS } from "../../utils/errors";
import {
  neutral00,
  neutral17,
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
import { SpacerColumn } from "../spacer";

export type SelectInputItem = {
  value: string;
  disabled?: boolean;
};

export interface SelectInputCustomProps<T extends FieldValues> {
  label: string;
  items: SelectInputItem[];
  iconSVG?: StyleProp<ViewStyle>;
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
  subtitle?: string;
  labelStyle?: TextStyle;
}

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const SelectInputCustom = <T extends FieldValues>({
  label,
  items,
  style,
  disabled,
  squaresBackgroundColor,
  width,
  height,
  name,
  control,
  defaultValue,
  rules,
  labelStyle,
}: SelectInputCustomProps<T>) => {
  // variables
  const { field, fieldState } = useController<T>({
    name,
    control,
    rules,
    defaultValue,
  });
  const inputRef = useRef<TextInput>(null);

  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);

  const error = useMemo(() => {
    if (fieldState.error) {
      if (fieldState.error?.message) {
        return fieldState.error?.message;
      }
      return DEFAULT_FORM_ERRORS.required;
    }
  }, [fieldState.error]);

  const isItemDisabled = (item: SelectInputItem) =>
    item.disabled || item.value === field.value;
  const onPressInput = () => {
    if (!disabled) {
      onPressDropdownButton(dropdownRef);
      inputRef.current?.focus();
    }
  };

  return (
    <View style={style} ref={dropdownRef}>
      <Pressable onPress={onPressInput}>
        <TertiaryBox
          disabled={disabled}
          squaresBackgroundColor={squaresBackgroundColor}
          style={style}
          mainContainerStyle={styles.mainContainer}
          width={width}
          fullWidth={!width}
          height={height}
        >
          <View style={styles.innerContainer}>
            <View style={{ flex: 1 }}>
              <BrandText style={[styles.labelText, fontMedium10, labelStyle]}>
                {label}
              </BrandText>
              <SpacerColumn size={0.5} />
              <View style={styles.valueTextChevron}>
                <BrandText style={styles.valueText}>{field.value}</BrandText>
                <SVG
                  source={
                    isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG
                  }
                  width={16}
                  height={16}
                  color={secondaryColor}
                />
              </View>
            </View>
          </View>
        </TertiaryBox>
      </Pressable>

      {isDropdownOpen(dropdownRef) && (
        <TertiaryBox
          noBrokenCorners
          style={{ position: "absolute", top: 54 }}
          mainContainerStyle={{
            paddingHorizontal: layout.padding_x1_5,
            paddingVertical: layout.padding_x1,
            backgroundColor: neutral17,
          }}
        >
          {items.map((item, index) => (
            <TouchableOpacity
              disabled={isItemDisabled(item)}
              onPress={() => {
                closeOpenedDropdown();
                field.onChange(item.value);
              }}
              key={index}
              style={{ width: "100%", marginVertical: layout.padding_x1 }}
            >
              <BrandText
                style={[
                  styles.valueText,
                  { opacity: isItemDisabled(item) ? 0.5 : 1 },
                ]}
              >
                {item.value}
              </BrandText>
            </TouchableOpacity>
          ))}
        </TertiaryBox>
      )}
      <ErrorText>{error}</ErrorText>
    </View>
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
  valueText: {
    fontSize: 14,
    color: secondaryColor,
    fontFamily: "Exo_600SemiBold",
    outlineStyle: "none",
  },
  valueTextChevron: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});
