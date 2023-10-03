import React, { FC, memo } from "react";
import { StyleProp, TextStyle } from "react-native";

import { useNSPrimaryAlias } from "../../hooks/useNSPrimaryAlias";
import { parseUserId } from "../../networks";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";

export const Username: FC<{
  userId: string | undefined;
  addressLength?: number;
  textStyle?: StyleProp<TextStyle>;
}> = memo(({ userId, addressLength, textStyle }) => {
  const [, userAddress] = parseUserId(userId);
  const { primaryAlias } = useNSPrimaryAlias(userId);
  return (
    <OmniLink
      to={{
        screen: "UserPublicProfile",
        params: { id: userId },
      }}
    >
      <BrandText style={[textStyle, { color: "#16BBFF" }]}>
        {primaryAlias
          ? `@${primaryAlias}`
          : tinyAddress(userAddress, addressLength || 10)}
      </BrandText>
    </OmniLink>
  );
});
