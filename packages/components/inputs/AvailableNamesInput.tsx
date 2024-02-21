import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps, View, ViewStyle } from "react-native";

import { TextInputCustom } from "./TextInputCustom";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { NetworkKind } from "@/networks";
import {
  neutral33,
  neutral77,
  primaryColor,
  redDefault,
} from "@/utils/style/colors";
import { NameFinderFormType } from "@/utils/types/tns";

export interface TextInputCustomProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  name: Path<T>;
  loading: boolean;
  nameValue: string;
  label: string;
  placeHolder: string;
  value?: string;
  onChangeText?: (value: string) => void;
  onPressEnter?: () => void;
  isInvalid: boolean;
  isNameAvailabel: boolean;
  isTaken: boolean;
  price: string;
  usdPrice?: number | undefined;
  control?: Control<T>;
  style?: ViewStyle;
}

export const AvailableNamesInput = <T extends FieldValues>({
  loading,
  nameValue,
  label,
  name,
  placeHolder,
  value,
  onChangeText = () => {},
  onPressEnter = () => {},
  isInvalid,
  isNameAvailabel,
  isTaken,
  price,
  usdPrice,
  control,
  style,
}: TextInputCustomProps<T>) => {
  const selectedNetwork = useSelectedNetworkInfo();
  let availabilityInfo = <></>;
  if (nameValue && selectedNetwork?.kind === NetworkKind.Cosmos) {
    if (isInvalid) {
      availabilityInfo = (
        <BrandText style={{ color: redDefault, ...fontSemibold14 }}>
          Invalid
        </BrandText>
      );
    } else if (isNameAvailabel) {
      availabilityInfo = (
        <View style={{ flexDirection: "row" }}>
          {!!usdPrice && (
            <>
              <BrandText style={{ color: neutral77, ...fontSemibold14 }}>
                ${usdPrice?.toFixed(2)}
              </BrandText>
              <BrandText style={{ color: neutral33, ...fontSemibold14 }}>
                {" - "}
              </BrandText>
            </>
          )}
          <BrandText style={{ color: primaryColor, ...fontSemibold14 }}>
            {price}
          </BrandText>
        </View>
      );
    } else if (isTaken) {
      availabilityInfo = (
        <BrandText style={{ color: redDefault, ...fontSemibold14 }}>
          Taken
        </BrandText>
      );
    }
  }

  return (
    <TextInputCustom<NameFinderFormType>
      noBrokenCorners
      isLoading={loading}
      variant="labelOutside"
      label={label}
      placeHolder={placeHolder}
      name={name as "name" | "associatedHandle"}
      onChangeText={(val: string) => onChangeText(val)}
      onPressEnter={onPressEnter}
      value={value}
      rules={{ required: true }}
      regexp={new RegExp(/^[a-zA-Z]+$/)}
      style={style}
      control={
        control
          ? (control as unknown as Control<NameFinderFormType>)
          : undefined
      }
    >
      {availabilityInfo}
    </TextInputCustom>
  );
};
