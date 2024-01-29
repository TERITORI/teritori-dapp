import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputLaunchpad } from "./TextInputLaunchpad";

interface TextInputCustomProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<T>;
  name: Path<T>;
  sublabel?: React.ReactElement;
  multiline?: boolean;
  required?: boolean;
}

export const TextInputLaunchpadRequired = <T extends FieldValues>({
  control,
  name,
  label,
  placeHolder,
  required = true,
}: TextInputCustomProps<T>) => {
  return (
    <TextInputLaunchpad<T>
      required={required}
      label={label}
      placeHolder={placeHolder}
      name={name}
      control={control}
    />
  );
};
