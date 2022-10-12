import React from "react";
import { TextInput } from "react-native";
import CurrencyInput, { CurrencyInputProps } from "react-native-currency-input";
import MaskInput, { Mask } from "react-native-mask-input";

import { neutral77 } from "../../utils/style/colors";
import { TertiaryBox } from "../boxes/TertiaryBox";

interface FormInputProps {
  focused: boolean;
  placeholder?: string;
  value?: any;
  rightComponent?: React.ReactNode;
  mask?: Mask;
  currencyInputProps?: Omit<CurrencyInputProps, "value">;
  onChange: (value: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  rightComponent,
  mask,
  currencyInputProps,
}) => {
  const inputProps = {
    value,
    placeholder,
    onFocus,
    onBlur,
    placeholderTextColor: neutral77,
    style: [
      {
        height: 60,
        width: "100%",
        paddingHorizontal: 24,
        fontSize: 20,
        color: "white",
      },
      { outlineStyle: "none" } as any,
    ],
  };
  return (
    <TertiaryBox fullWidth>
      {!!mask && (
        <MaskInput
          {...inputProps}
          onChangeText={(value) => {
            onChange(value);
          }}
          mask={mask}
        />
      )}
      {!!currencyInputProps && (
        <CurrencyInput
          {...inputProps}
          {...currencyInputProps}
          onChangeValue={(val) => onChange(val)}
          keyboardType="numeric"
        />
      )}

      {!mask && !currencyInputProps && (
        <TextInput {...inputProps} onChangeText={onChange} />
      )}

      {!!rightComponent && rightComponent}
    </TertiaryBox>
  );
};
