import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { layout } from "@/utils/style/layout";

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

export const TextInputLaunchpad = <T extends FieldValues>({
  control,
  name,
  label,
  placeHolder,
  sublabel,
  required = false,
}: TextInputCustomProps<T>) => {
  return (
    <TextInputCustom<T>
      rules={{ required }}
      labelStyle={{ maxWidth: 416 }}
      label={label}
      placeHolder={placeHolder}
      sublabel={sublabel}
      name={name}
      control={control}
      variant="labelOutside"
      containerStyle={{ marginBottom: layout.spacing_x2 }}
      boxMainContainerStyle={{ minHeight: 0 }}
      height={40}
    />
  );
};
