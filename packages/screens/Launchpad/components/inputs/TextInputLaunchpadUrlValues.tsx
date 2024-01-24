import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { layout } from "../../../../utils/style/layout";

interface TextInputCustomProps<ExistingBaseUrlFormValues extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<ExistingBaseUrlFormValues>;
  name: Path<ExistingBaseUrlFormValues>;
}

export const TextInputLaunchpadUrlValues = <
  ExistingBaseUrlFormValues extends FieldValues,
>({
  control,
  name,
  label,
  placeHolder,
}: TextInputCustomProps<ExistingBaseUrlFormValues>) => {
  return (
    <TextInputCustom<ExistingBaseUrlFormValues>
      rules={{ required: false }}
      label={label}
      placeHolder={placeHolder}
      name={name}
      control={control}
      variant="labelOutside"
      containerStyle={{ marginBottom: layout.spacing_x2 }}
      boxMainContainerStyle={{ minHeight: 0 }}
      height={40}
    />
  );
};
