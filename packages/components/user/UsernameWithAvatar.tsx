import React from "react";
import { StyleProp, TextStyle } from "react-native";

import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";

import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";

export const UsernameWithAvatar: React.FC<{
  userId: string | undefined;
  style?: StyleProp<TextStyle>;
  addrLen?: number;
}> = ({ userId, style, addrLen = 30 }) => {
  const [, userAddress] = parseUserId(userId);
  const userInfo = useNSUserInfo(userId);
  const name =
    userInfo?.metadata?.tokenId || tinyAddress(userAddress, addrLen) || "";

  return (
    <OmniLink
      to={{ screen: "UserPublicProfile", params: { id: userId } }}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <UserAvatarWithFrame size="XXS" userId={userId} />
      <BrandText
        style={[{ marginLeft: layout.spacing_x1_5 }, fontSemibold14]}
        ellipsizeMode="middle"
        numberOfLines={1}
      >
        {name}
      </BrandText>
    </OmniLink>
  );
};
