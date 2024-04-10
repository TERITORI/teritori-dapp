import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps, View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { CurrencyIcon } from "@/components/currency/CurrencyIcon";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import {
  getNativeCurrency,
  keplrCurrencyFromNativeCurrencyInfo,
} from "@/networks";
import { neutral00, neutral55 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

interface TextInputCustomProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  networkId: string;
  denom: string;
  placeHolder: string;
  control: Control<T>;
  name: Path<T>;
}

export const TextInputSubscriptionPrice = <T extends FieldValues>({
  control,
  networkId,
  denom,
  name,
  label,
  placeHolder,
}: TextInputCustomProps<T>) => {
  const nativeCurrency = getNativeCurrency(networkId, denom);
  return (
    <TextInputCustom<T>
      noBrokenCorners
      rules={{ required: true }}
      height={48}
      label={label}
      placeHolder={placeHolder}
      name={name}
      control={control}
      currency={keplrCurrencyFromNativeCurrencyInfo(nativeCurrency)}
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
            {nativeCurrency?.displayName}
          </BrandText>
          <CurrencyIcon size={16} denom={denom} networkId={networkId} />
        </View>
      }
    />
  );
};
