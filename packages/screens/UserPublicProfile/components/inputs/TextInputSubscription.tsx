import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { layout } from "../../../../utils/style/layout";

import { neutral00 } from "@/utils/style/colors";

interface TextInputCustomProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<T>;
  name: Path<T>;
}

export const TextInputSubscription = <T extends FieldValues>({
  control,
  name,
  label,
  placeHolder,
}: TextInputCustomProps<T>) => {
  return (
    <TextInputCustom<T>
      noBrokenCorners
      rules={{ required: true }}
      height={48}
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
