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
  sublabel: React.ReactElement;
  required?: boolean;
}

export const TextInputLaunchpadRequiredSublabel = <T extends FieldValues>({
  control,
  name,
  label,
  placeHolder,
  sublabel,
  required = true,
}: TextInputCustomProps<T>) => {
  return (
    <TextInputLaunchpad<T>
      required={required}
      label={label}
      placeHolder={placeHolder}
      sublabel={sublabel}
      name={name}
      control={control}
    />
  );
};
