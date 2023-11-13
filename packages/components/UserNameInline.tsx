import React from "react";
import { StyleProp, TextStyle } from "react-native";

import { BrandText } from "./BrandText";
import FlexRow from "./FlexRow";
import { OmniLink } from "./OmniLink";
import { UserAvatarWithFrame } from "./images/AvatarWithFrame";
import { RoundedGradientImageSize } from "./images/RoundedGradientImage";
import { useNSUserInfo } from "../hooks/useNSUserInfo";
import { parseUserId } from "../networks";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { tinyAddress } from "../utils/text";

type PlayerNameProps = {
  userId: string | undefined;
  multisignWalletAddres?: string | null;
  showText?: boolean;
  style?: StyleProp<TextStyle>;
  size?: RoundedGradientImageSize;
};

export const UserNameInline: React.FC<PlayerNameProps> = ({
  userId,
  style,
  showText = true,
  size = "XXS",
}) => {
  const [, userAddress] = parseUserId(userId);
  const userInfo = useNSUserInfo(userId);
  const name =
    userInfo?.metadata?.tokenId || tinyAddress(userAddress, 30) || "";

  return (
    <FlexRow alignItems="center" style={style}>
      <OmniLink
        to={{ screen: "UserPublicProfile", params: { id: userId } }}
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
      >
        <UserAvatarWithFrame size={size} userId={userId} />
        {showText && (
          <BrandText
            style={[{ marginLeft: layout.spacing_x1_5 }, fontSemibold14]}
            ellipsizeMode="middle"
            numberOfLines={1}
          >
            {name}
          </BrandText>
        )}
      </OmniLink>
    </FlexRow>
  );
};
