import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { neutral00 } from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";

interface TextInputCustomProps<
  NewCollectionAdditionalFormValues extends FieldValues,
> extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<NewCollectionAdditionalFormValues>;
  name: Path<NewCollectionAdditionalFormValues>;
  required?: boolean;
  sublabel?: React.ReactElement;
  multiline?: boolean;
}

export const TextInputLaunchpadAdditionalValues = <
  NewCollectionAdditionalFormValues extends FieldValues,
>({
  control,
  required = false,
  name,
  label,
  placeHolder,
  sublabel,
  multiline = false,
}: TextInputCustomProps<NewCollectionAdditionalFormValues>) => {
  return (
    <TextInputCustom<NewCollectionAdditionalFormValues>
      rules={{ required }}
      label={label}
      placeHolder={placeHolder}
      name={name}
      sublabel={sublabel}
      control={control}
      multiline={multiline}
      variant="labelOutside"
      containerStyle={{ marginBottom: layout.spacing_x3 }}
      boxMainContainerStyle={{
        backgroundColor: neutral00,
        borderRadius: 12,
      }}
    />
  );
};