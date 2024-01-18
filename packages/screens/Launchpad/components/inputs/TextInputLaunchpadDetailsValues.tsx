import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { layout } from "../../../../utils/style/layout";

interface TextInputCustomProps<
  NewCollectionDetailsFormValues extends FieldValues,
> extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<NewCollectionDetailsFormValues>;
  name: Path<NewCollectionDetailsFormValues>;
  required?: boolean;
  sublabel?: React.ReactElement;
}

export const TextInputLaunchpadDetailsValues = <
  NewCollectionDetailsFormValues extends FieldValues,
>({
  control,
  required = false,
  name,
  label,
  placeHolder,
  sublabel,
}: TextInputCustomProps<NewCollectionDetailsFormValues>) => {
  return (
    <TextInputCustom<NewCollectionDetailsFormValues>
      rules={{ required }}
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
