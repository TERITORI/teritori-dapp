import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { neutral00 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

interface TextInputCustomProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  name: Path<T>;
  control: Control<T>;
}

export const TextInputSubscriptionMultiline = <T extends FieldValues>({
  name,
  label,
  placeHolder,
  control,
}: TextInputCustomProps<T>) => {
  return (
    <TextInputCustom<T>
      noBrokenCorners
      rules={{ required: true }}
      multiline
      label={label}
      placeHolder={placeHolder}
      name={name}
      control={control}
      variant="labelOutside"
      containerStyle={{ marginVertical: layout.spacing_x1 }}
      boxMainContainerStyle={{
        backgroundColor: neutral00,
        borderRadius: 12,
      }}
    />
  );
};
