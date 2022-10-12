import React, { useState } from "react";
import { Controller, FieldErrors } from "react-hook-form";
import { View, ViewStyle } from "react-native";
import { CurrencyInputProps } from "react-native-currency-input";
import { Mask } from "react-native-mask-input";

import { ErrorText } from "./ErrorText";
import { FormButtonGroup, FormButtonGroupProps } from "./FormButtonGroup";
import { FormInput } from "./FormInput";
import { HelperText } from "./HelperText";
import { Label } from "./Label";

interface FormFieldProps {
  formType: "input" | "button-group";
  control: any;
  errors: FieldErrors;
  name: string;
  rules?: object;
  label?: {
    text: string;
    isRequired?: boolean;
  };
  helperText?: string;
  placeholder?: string;
  buttons?: FormButtonGroupProps["buttons"];
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
  mask?: Mask;
  currencyInputProps?: Omit<CurrencyInputProps, "value">;
}

export const FormField: React.FC<FormFieldProps> = ({
  control,
  rules = {},
  formType,
  name,
  label,
  helperText,
  placeholder,
  buttons,
  errors,
  rightComponent,
  style,
  mask,
  currencyInputProps,
}) => {
  const [isFocused, setFocused] = useState(false);
  return (
    <View
      style={[
        {
          marginBottom: 32,
        },
        style,
      ]}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            {!!label && <Label {...label} />}
            {formType === "button-group" && !!buttons && (
              <FormButtonGroup
                buttons={buttons}
                onChange={onChange}
                value={value}
              />
            )}
            {formType === "input" && (
              <FormInput
                focused={isFocused}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                onFocus={() => {
                  setFocused(true);
                }}
                onBlur={() => {
                  setFocused(false);
                  onBlur();
                }}
                rightComponent={rightComponent}
                mask={mask}
                currencyInputProps={currencyInputProps}
              />
            )}
            {!!errors[name] && <ErrorText>{errors[name]?.message}</ErrorText>}
            {!!helperText && <HelperText text={helperText} />}
          </>
        )}
      />
    </View>
  );
};
