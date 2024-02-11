import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import { BrandText } from "@/components/BrandText";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { neutral00, neutral33, secondaryColor } from "@/utils/style/colors";
import { fontMedium14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

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
        <PrimaryBox
          style={{
            height: 24,
            flexDirection: "row",
            paddingHorizontal: layout.spacing_x1_5,
            backgroundColor: neutral33,
            alignItems: "center",
            borderColor: neutral33,
            borderRadius: 32,
          }}
        >
          <BrandText
            style={[
              fontMedium14,
              {
                color: secondaryColor,
                lineHeight: layout.spacing_x2,
              },
            ]}
          >
            days
          </BrandText>
        </PrimaryBox>
      }
    />
  );
};
