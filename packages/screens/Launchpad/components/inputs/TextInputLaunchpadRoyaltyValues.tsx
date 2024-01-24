import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { layout } from "../../../../utils/style/layout";

interface TextInputCustomProps<
  NewConfigureRoyaltyDetailsFormValues extends FieldValues,
> extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<NewConfigureRoyaltyDetailsFormValues>;
  name: Path<NewConfigureRoyaltyDetailsFormValues>;
  sublabel?: React.ReactElement;
}

export const TextInputLaunchpadRoyaltyValues = <
  NewConfigureRoyaltyDetailsFormValues extends FieldValues,
>({
  control,
  name,
  label,
  placeHolder,
  sublabel,
}: TextInputCustomProps<NewConfigureRoyaltyDetailsFormValues>) => {
  return (
    <TextInputCustom<NewConfigureRoyaltyDetailsFormValues>
      rules={{ required: true }}
      label={label}
      placeHolder={placeHolder}
      name={name}
      sublabel={sublabel}
      control={control}
      variant="labelOutside"
      containerStyle={{ marginBottom: layout.spacing_x2 }}
      boxMainContainerStyle={{ minHeight: 0 }}
      height={40}
    />
  );
};
