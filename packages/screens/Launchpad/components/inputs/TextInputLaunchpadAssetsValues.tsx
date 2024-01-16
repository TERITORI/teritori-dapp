import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { neutral00 } from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";

interface TextInputCustomProps<ExistingBaseUrlFormValues extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<ExistingBaseUrlFormValues>;
  name: Path<ExistingBaseUrlFormValues>;
}

export const TextInputLaunchpadAssetsValues = <
  ExistingBaseUrlFormValues extends FieldValues,
>({
  control,
  name,
  label,
  placeHolder,
}: TextInputCustomProps<ExistingBaseUrlFormValues>) => {
  return (
    <TextInputCustom<ExistingBaseUrlFormValues>
      rules={{ required: true }}
      label={label}
      placeHolder={placeHolder}
      name={name}
      control={control}
      variant="labelOutside"
      containerStyle={{ marginBottom: layout.spacing_x3 }}
      boxMainContainerStyle={{
        backgroundColor: neutral00,
        borderRadius: 12,
      }}
    />
  );
};
