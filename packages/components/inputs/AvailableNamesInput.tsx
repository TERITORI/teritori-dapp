import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps, View, ViewStyle } from "react-native";

import { TextInputCustom } from "./TextInputCustom";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

import { useNSAvailability } from "@/hooks/useNSAvailability";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { NetworkInfo, NetworkKind, getNetwork } from "@/networks";
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
}

type AvailabilityInfoProps = {
  nameValue: string;
  network: NetworkInfo | undefined;
  price: string;
  usdPrice: number | undefined;
  nameAvailability: NSAvailability;
};
const AvailabilityInfo: React.FC<AvailabilityInfoProps> = ({
  nameValue,
  network,
  price,
  usdPrice,
  nameAvailability,
}) => {
  if (nameValue && network?.kind === NetworkKind.Cosmos) {
    if (nameAvailability.availability === "invalid") {
      return (
        <BrandText style={{ color: redDefault, ...fontSemibold14 }}>
          Invalid
        </BrandText>
      );
    }

    if (nameAvailability.availability === "mint") {
      return (
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
    }

    if (
      nameAvailability.availability === "market" ||
      nameAvailability.availability === "none"
    ) {
      return (
        <BrandText style={{ color: redDefault, ...fontSemibold14 }}>
          Taken
        </BrandText>
      );
    }
  }

  if (network?.kind === NetworkKind.Gno) {
    return (
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
  }

  return null;
};

const getNameByNetwork = (
  network: NetworkInfo | undefined,
  name: string,
  nameValue: string,
) => {
  if (!nameValue) return "";

  if (network?.kind === NetworkKind.Cosmos) {
    return `: ${nameValue}${network?.nameServiceTLD}`;
  }

  if (network?.kind === NetworkKind.Gno) {
    return " : " + (name.includes(".gno") ? name : `${name}.gno`);
  }

  throw Error(`unsupported network kind: ${network?.kind}`);
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
}: TextInputCustomProps<T>) => {
  const selectedNetwork = useSelectedNetworkInfo();
  const network = getNetwork(selectedNetwork?.id);

  const nameAvailability = useNSAvailability(selectedNetwork?.id, nameValue);

  const price =
    nameAvailability.availability === "mint"
      ? nameAvailability.prettyPrice
      : "";
  const usdPrice =
    nameAvailability.availability === "mint" ? nameAvailability?.usdPrice : 0;

  return (
    <TextInputCustom<NameFinderFormType>
      error={error}
      noBrokenCorners
      isLoading={nameAvailability.availability === "loading"}
      variant={variant}
      label={`${label}${getNameByNetwork(network, name, nameValue)}`}
      placeHolder={placeHolder}
      name={name as "name" | "associatedHandle"}
      onChangeText={(val: string) => onChangeText(val)}
      onPressEnter={onPressEnter}
      value={value}
      rules={{ required: true }}
      regexp={new RegExp(/^[a-zA-Z]+$/)}
      style={style}
      readOnly={readOnly}
      boxMainContainerStyle={{
        backgroundColor: readOnly ? neutral17 : undefined,
      }}
      control={
        control
          ? (control as unknown as Control<NameFinderFormType>)
          : undefined
      }
    >
      <AvailabilityInfo
        price={price}
        usdPrice={usdPrice}
        network={network}
        nameValue={nameValue}
        nameAvailability={nameAvailability}
      />
    </TextInputCustom>
  );
};
