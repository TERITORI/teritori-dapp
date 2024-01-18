import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { layout } from "../../../../utils/style/layout";

interface TextInputCustomProps<TeamandInvestmentFormValues extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<TeamandInvestmentFormValues>;
  name: Path<TeamandInvestmentFormValues>;
  required?: boolean;
  sublabel?: React.ReactElement;
  multiline?: boolean;
}

export const TextInputLaunchpadTandIValues = <
  TeamandInvestmentFormValues extends FieldValues,
>({
  control,
  required = false,
  name,
  label,
  placeHolder,
  sublabel,
  multiline = false,
}: TextInputCustomProps<TeamandInvestmentFormValues>) => {
  return (
    <TextInputCustom<TeamandInvestmentFormValues>
      rules={{ required }}
      label={label}
      placeHolder={placeHolder}
      name={name}
      sublabel={sublabel}
      control={control}
      multiline={multiline}
      variant="labelOutside"
      containerStyle={{ marginBottom: layout.spacing_x2 }}
      boxMainContainerStyle={{
        minHeight: 40,
      }}
    />
  );
};
