import { bech32 } from "bech32";
import React, { FC, memo } from "react";
import { ColorValue, StyleProp, TextStyle } from "react-native";

import { useNSPrimaryAlias } from "../../hooks/useNSPrimaryAlias";
import { useValidators } from "../../hooks/useValidators";
import { NetworkKind, parseUserId } from "../../networks";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";

// FIXME: don't fetch validators list, and don't fetch validator info at all if this is not a validator address

export const Username: FC<{
  userId: string | undefined;
  addressLength?: number;
  textStyle?: StyleProp<TextStyle>;
  namedColor?: ColorValue;
  anonColor?: ColorValue;
  prefix?: string;
}> = memo(
  ({
    userId,
    addressLength,
    textStyle,
    namedColor = "#16BBFF",
    anonColor = "white",
    prefix = "@",
  }) => {
    const [network, userAddress] = parseUserId(userId);
    const { primaryAlias } = useNSPrimaryAlias(userId);
    const {
      data: { allValidators },
    } = useValidators(network?.id); // FIXME: this is ineficient
    const validator = allValidators?.find((val) => val.address === userAddress);
    const color = primaryAlias ? namedColor : anonColor;
    const text = `${prefix}${primaryAlias || tinyAddress(userAddress, addressLength || 14)}`;
    if (isUserValidator(userId) && validator) {
      return (
        <BrandText style={[textStyle, { color }]}>
          {validator.moniker}
        </BrandText>
      );
    }
    return (
      <OmniLink
        to={{
          screen: "UserPublicProfile",
          params: { id: userId },
        }}
      >
        <BrandText style={[textStyle, { color }]}>{text}</BrandText>
      </OmniLink>
    );
  },
);

const isUserValidator = (userId: string | undefined) => {
  const [network, userAddress] = parseUserId(userId);
  if (network?.kind !== NetworkKind.Cosmos) {
    return false;
  }
  try {
    const { prefix } = bech32.decode(userAddress);
    if (network?.addressPrefix + "valoper" === prefix) {
      // TODO: use chain-defined validator address prefix
      return true;
    }
  } catch {
    return false;
  }
};
