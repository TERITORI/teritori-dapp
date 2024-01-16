import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { neutral00 } from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";

interface TextInputCustomProps<TeamandInvestmentFormValues extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<TeamandInvestmentFormValues>;
  name: Path<TeamandInvestmentFormValues>;
  required?: boolean;
  sublabel?: React.ReactElement;
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
}: TextInputCustomProps<TeamandInvestmentFormValues>) => {
  return (
    <TextInputCustom<TeamandInvestmentFormValues>
      rules={{ required }}
      label={label}
      placeHolder={placeHolder}
      name={name}
      sublabel={sublabel}
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
