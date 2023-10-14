import React from "react";
import { StyleProp, TextStyle } from "react-native";

import { BrandText } from "./BrandText";
import FlexRow from "./FlexRow";
import { OmniLink } from "./OmniLink";
import { RoundedGradientImage } from "./images/RoundedGradientImage";
import { useIsDAO } from "../hooks/cosmwasm/useCosmWasmContractInfo";
import { useNSUserInfo } from "../hooks/useNSUserInfo";
import { parseUserId } from "../networks";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { tinyAddress } from "../utils/text";
import { nameServiceDefaultImage } from "../utils/tns";

type PlayerNameProps = {
  userId: string | undefined;
  multisignWalletAddres?: string | null;
  style?: StyleProp<TextStyle>;
};

export const UserNameInline: React.FC<PlayerNameProps> = ({
  userId,
  style,
}) => {
  const [userNetwork, userAddress] = parseUserId(userId);
  const userInfo = useNSUserInfo(userId);
  const { isDAO } = useIsDAO(userId);
  const name =
    userInfo?.metadata?.tokenId || tinyAddress(userAddress, 30) || "";

  return (
    <FlexRow alignItems="center" style={style}>
      <OmniLink
        to={{ screen: "UserPublicProfile", params: { id: userId } }}
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
      >
        <RoundedGradientImage
          size="XXS"
          sourceURI={userInfo?.metadata?.image}
          fallbackURI={nameServiceDefaultImage(isDAO, userNetwork)}
        />
        <BrandText
          style={[{ marginLeft: layout.spacing_x1_5 }, fontSemibold14]}
          ellipsizeMode="middle"
          numberOfLines={1}
        >
          {name}
        </BrandText>
      </OmniLink>
    </FlexRow>
  );
};
