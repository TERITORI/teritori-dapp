import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { layout } from "../../../../utils/style/layout";

interface TextInputCustomProps<NewCollectionMintFormValues extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<NewCollectionMintFormValues>;
  name: Path<NewCollectionMintFormValues>;
  sublabel?: React.ReactElement;
}

export const TextInputLaunchpadMintValues = <
  NewCollectionMintFormValues extends FieldValues,
>({
  control,
  name,
  label,
  placeHolder,
  sublabel,
}: TextInputCustomProps<NewCollectionMintFormValues>) => {
  return (
    <TextInputCustom<NewCollectionMintFormValues>
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
