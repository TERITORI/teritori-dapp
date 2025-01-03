import React, { useEffect } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps, View, ViewStyle } from "react-native";

import { TextInputCustom } from "./TextInputCustom";
import { fontRegular14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

import { useNSAvailability } from "@/hooks/useNSAvailability";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { NetworkInfo, NetworkKind, getNetwork } from "@/networks";
import { LETTERS_REGEXP } from "@/utils/regex";
import {
  neutral17,
  neutral33,
  neutral77,
  primaryColor,
  redDefault,
} from "@/utils/style/colors";
import { NameFinderFormType, NSAvailability } from "@/utils/types/tns";

interface TextInputCustomProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  name: Path<T>;
  nameValue: string;
  label: string;
  placeHolder: string;
  value?: string;
  onChangeText?: (value: string) => void;
  onPressEnter?: () => void;
  control?: Control<T>;
  style?: ViewStyle;
  variant?: "regular" | "labelOutside" | "noStyle";
  error?: string;
  readOnly?: boolean;
  onError?: (errorMsg: string) => void;
}

type AvailabilityInfoProps = {
  nameValue: string;
  nameAvailability: NSAvailability;
  onError?: (errorMsg: string) => void;
};
const AvailabilityInfo: React.FC<AvailabilityInfoProps> = ({
  nameValue,
  onError,
  nameAvailability,
}) => {
  const price =
    nameAvailability.availability === "mint"
      ? nameAvailability.prettyPrice
      : "";
  const usdPrice =
    nameAvailability.availability === "mint" ? nameAvailability?.usdPrice : 0;

  useEffect(() => {
    if (nameAvailability.availability === "none") {
      onError?.("not available");
    }
  }, [onError, nameAvailability.availability]);

  if (nameValue) {
    if (nameAvailability.availability === "invalid") {
      return (
        <BrandText style={{ color: redDefault, ...fontRegular14 }}>
          Invalid
        </BrandText>
      );
    }

    if (nameAvailability.availability === "mint") {
      return (
        <View style={{ flexDirection: "row" }}>
          {!!usdPrice && (
            <>
              <BrandText style={{ color: neutral77, ...fontRegular14 }}>
                ${usdPrice?.toFixed(2)}
              </BrandText>
              <BrandText style={{ color: neutral33, ...fontRegular14 }}>
                {" - "}
              </BrandText>
            </>
          )}
          <BrandText style={{ color: primaryColor, ...fontRegular14 }}>
            {price}
          </BrandText>
        </View>
      );
    }

    if (
      nameAvailability.availability === "market" ||
      nameAvailability.availability === "none"
    ) {
      return (
        <BrandText style={{ color: redDefault, ...fontRegular14 }}>
          Taken
        </BrandText>
      );
    }
  }

  return null;
};

const getNameByNetwork = (
  network: NetworkInfo | undefined,
  nameValue: string,
) => {
  if (!nameValue) return "";

  let res = nameValue;
  switch (network?.kind) {
    case NetworkKind.Gno:
      res = nameValue + ".gno";
      break;
    case NetworkKind.Cosmos:
      res = nameValue + network?.nameServiceTLD;
      break;
  }

  return ": " + res;
};

export const AvailableNamesInput = <T extends FieldValues>({
  nameValue,
  label,
  name,
  placeHolder,
  value,
  onChangeText = () => {},
  onPressEnter = () => {},
  control,
  style,
  variant = "labelOutside",
  error,
  readOnly,
  onError,
}: TextInputCustomProps<T>) => {
  const selectedNetwork = useSelectedNetworkInfo();
  const network = getNetwork(selectedNetwork?.id);

  const nameAvailability = useNSAvailability(selectedNetwork?.id, nameValue);

  return (
    <TextInputCustom<NameFinderFormType>
      error={error}
      noBrokenCorners
      isLoading={nameAvailability.availability === "loading"}
      variant={variant}
      label={`${label}: ${getNameByNetwork(network, nameValue)}`}
      placeHolder={placeHolder}
      name={name as "name" | "associatedHandle"}
      onChangeText={(val: string) => onChangeText(val)}
      onPressEnter={onPressEnter}
      value={value}
      rules={{ required: true }}
      regexp={new RegExp(LETTERS_REGEXP)}
      style={style}
      readOnly={readOnly}
      boxMainContainerStyle={{
        backgroundColor: readOnly ? neutral17 : undefined,
      }}
      textInputStyle={[fontRegular14]}
      control={
        control
          ? (control as unknown as Control<NameFinderFormType>)
          : undefined
      }
    >
      {!readOnly && (
        <AvailabilityInfo
          nameValue={nameValue}
          onError={onError}
          nameAvailability={nameAvailability}
        />
      )}
    </TextInputCustom>
  );
};
