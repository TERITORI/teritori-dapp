import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps, View, ViewStyle } from "react-native";

import { TextInputCustom } from "./TextInputCustom";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

import { useNSAvailability } from "@/hooks/useNSAvailability";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { NetworkKind, getCosmosNetwork } from "@/networks";
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
  nameValue: string;
  label: string;
  placeHolder: string;
  value?: string;
  onChangeText?: (value: string) => void;
  onPressEnter?: () => void;
  usdPrice?: number | undefined;
  control?: Control<T>;
  style?: ViewStyle;
}

export const AvailableNamesInput = <T extends FieldValues>({
  nameValue,
  label,
  name,
  placeHolder,
  value,
  onChangeText = () => {},
  onPressEnter = () => {},
  usdPrice,
  control,
  style,
}: TextInputCustomProps<T>) => {
  const selectedNetwork = useSelectedNetworkInfo();
  const cosmosNetwork = getCosmosNetwork(selectedNetwork?.id);
  const nameAvailability = useNSAvailability(selectedNetwork?.id, nameValue);
  const price =
    nameAvailability.availability === "mint"
      ? nameAvailability.prettyPrice
      : "";

  let availabilityInfo = <></>;
  if (nameValue && selectedNetwork?.kind === NetworkKind.Cosmos) {
    if (nameAvailability.availability === "invalid") {
      availabilityInfo = (
        <BrandText style={{ color: redDefault, ...fontSemibold14 }}>
          Invalid
        </BrandText>
      );
    } else if (nameAvailability.availability === "mint") {
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
    } else if (
      nameAvailability.availability === "market" ||
      nameAvailability.availability === "none"
    ) {
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
      isLoading={nameAvailability.availability === "loading"}
      variant="labelOutside"
      label={`${label}${
        nameValue
          ? `: ${
              selectedNetwork?.kind === NetworkKind.Gno
                ? "gno.land/r/demo/" + name
                : nameValue + cosmosNetwork?.nameServiceTLD
            }`
          : ""
      }`}
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
