import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { layout } from "../../../../utils/style/layout";

interface TextInputCustomProps<NewMetadataDetailsFormValues extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<NewMetadataDetailsFormValues>;
  name: Path<NewMetadataDetailsFormValues>;
}

export const TextInputLaunchpadMetadataValues = <
  NewMetadataDetailsFormValues extends FieldValues,
>({
  control,
  name,
  label,
  placeHolder,
}: TextInputCustomProps<NewMetadataDetailsFormValues>) => {
  return (
    <TextInputCustom<NewMetadataDetailsFormValues>
      rules={{ required: false }}
      label={label}
      placeHolder={placeHolder}
      name={name}
      control={control}
      variant="labelOutside"
      containerStyle={{ marginBottom: layout.spacing_x1_5, width: "100%" }}
      boxMainContainerStyle={{ minHeight: 0 }}
      height={40}
    />
  );
};
