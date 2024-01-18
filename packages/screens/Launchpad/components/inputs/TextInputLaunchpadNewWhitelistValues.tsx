import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { layout } from "../../../../utils/style/layout";

interface TextInputCustomProps<
  NewWhitelistDetailsFormValues extends FieldValues,
> extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<NewWhitelistDetailsFormValues>;
  name: Path<NewWhitelistDetailsFormValues>;
  sublabel?: React.ReactElement;
}

export const TextInputLaunchpadNewWhitelistValues = <
  NewWhitelistDetailsFormValues extends FieldValues,
>({
  control,
  name,
  label,
  placeHolder,
  sublabel,
}: TextInputCustomProps<NewWhitelistDetailsFormValues>) => {
  return (
    <TextInputCustom<NewWhitelistDetailsFormValues>
      rules={{ required: true }}
      label={label}
      placeHolder={placeHolder}
      name={name}
      sublabel={sublabel}
      control={control}
      variant="labelOutside"
      containerStyle={{ marginBottom: layout.spacing_x2 }}
      boxMainContainerStyle={{
        minHeight: 40,
      }}
    />
  );
};
