import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { layout } from "../../../../utils/style/layout";

interface TextInputCustomProps<
  ExistingWhitelistDetailsFormValues extends FieldValues,
> extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<ExistingWhitelistDetailsFormValues>;
  name: Path<ExistingWhitelistDetailsFormValues>;
}

export const TextInputLaunchpadExistingWhitelistValues = <
  ExistingWhitelistDetailsFormValues extends FieldValues,
>({
  control,
  name,
  label,
  placeHolder,
}: TextInputCustomProps<ExistingWhitelistDetailsFormValues>) => {
  return (
    <TextInputCustom<ExistingWhitelistDetailsFormValues>
      rules={{ required: true }}
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
