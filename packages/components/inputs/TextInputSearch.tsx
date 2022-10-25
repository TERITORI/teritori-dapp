import React, { useMemo, useState } from "react";
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

import searchIcon from "../../../assets/icons/findAJob/search.svg";
import { SVG } from "../../components/SVG/svg";
import { DropdownButtonSearch } from "../../components/buttons/DropdownButtonSearch";
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

export interface TextInputSearchProps<T>
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
  variant?: "regular" | "labelOutside";
  control?: Control<T>;
  name: Path<T>;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  defaultValue?: PathValue<T, Path<T>>;
}

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const TextInputSearch = <T,>({
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
  defaultValue,
  rules,
  ...restProps
}: TextInputSearchProps<T>) => {
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
    rules,
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

  const [isMoreDisplayed, setIsMoreDisplayed] = useState(false);

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
      >
        <View style={styles.innerContainer}>
          <View
            style={{
              flex: 1,
              marginRight: children ? 12 : undefined,
              flexDirection: "row",
            }}
          >
            {variant !== "labelOutside" && (
              <View>
                <View style={{ top: 5 }}>
                  <SVG source={searchIcon} />
                </View>
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
            <DropdownButtonSearch
              size="XS"
              textCompressed="    Category"
              textExpanded="    Category"
              width={95}
              color="white"
              style={{ left: 17 }}
              onPress={() => {
                setIsMoreDisplayed(!isMoreDisplayed);
              }}
              isExpanded={isMoreDisplayed}
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
    height: 40,
    backgroundColor: neutral22,
  },
  labelText: {
    color: neutral77,
  },
  textInput: {
    fontSemibold14,
    color: secondaryColor,
    fontFamily: "Exo_600SemiBold",
    outlineStyle: "none",
    width: 90,
    marginLeft: 10,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});
