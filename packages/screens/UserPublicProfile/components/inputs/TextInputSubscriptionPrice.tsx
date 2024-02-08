import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps, View } from "react-native";

import usdcSVG from "../../../../../assets/icons/crypto-usdc.svg";
import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { layout } from "../../../../utils/style/layout";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { neutral00, neutral55 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";

interface TextInputCustomProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder: string;
  control: Control<T>;
  name: Path<T>;
}

export const TextInputSubscriptionPrice = <T extends FieldValues>({
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
      inputMode="decimal"
      variant="labelOutside"
      containerStyle={{ marginVertical: layout.spacing_x1 }}
      boxMainContainerStyle={{
        backgroundColor: neutral00,
        borderRadius: 12,
      }}
      children={
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BrandText
            style={[
              fontSemibold14,
              {
                color: neutral55,
                lineHeight: layout.spacing_x2,
                marginRight: layout.spacing_x1,
              },
            ]}
          >
            USDC
          </BrandText>
          <SVG source={usdcSVG} width={16} height={16} />
        </View>
      }
    />
  );
};
