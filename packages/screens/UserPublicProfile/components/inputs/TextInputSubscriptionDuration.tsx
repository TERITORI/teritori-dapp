import React, { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps, View } from "react-native";

import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { layout } from "../../../../utils/style/layout";
import {
  DurationDropdown,
  dropdownOptions,
} from "../dropdowns/DurationDropdown";

import { neutral00 } from "@/utils/style/colors";

interface TextInputCustomProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<T>;
  name: Path<T>;
}

export const TextInputSubscriptionDuration = <T extends FieldValues>({
  control,
  name,
  label,
  placeHolder,
}: TextInputCustomProps<T>) => {
  const [selectedDuration, setSelectedDuration] = useState(dropdownOptions[1]);

  return (
    <TextInputCustom<T>
      noBrokenCorners
      rules={{ required: true }}
      height={48}
      label={label}
      placeHolder={placeHolder}
      name={name}
      control={control}
      inputMode="numeric"
      variant="labelOutside"
      containerStyle={{ marginVertical: layout.spacing_x1, zIndex: 2 }}
      boxMainContainerStyle={{
        backgroundColor: neutral00,
        borderRadius: 12,
      }}
      children={
        <View style={{}}>
          <DurationDropdown
            item={selectedDuration}
            setItem={setSelectedDuration}
          />
        </View>
      }
    />
  );
};
