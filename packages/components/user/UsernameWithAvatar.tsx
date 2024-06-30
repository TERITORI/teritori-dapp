import React from "react";

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
  addrLen?: number;
}> = ({ userId, addrLen = 30 }) => {
  const [, userAddress] = parseUserId(userId);
  const userInfo = useNSUserInfo(userId);

  if (!userId) {
    return (
      <BrandText
        style={fontSemibold14}
        ellipsizeMode="middle"
        numberOfLines={1}
      >
        None
      </BrandText>
    );
  }

  const name =
    userInfo?.metadata?.tokenId || tinyAddress(userAddress, addrLen) || "";

  return (
    <OmniLink
      to={{ screen: "UserPublicProfile", params: { id: userId } }}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <UserAvatarWithFrame size="XXS" userId={userId} />
      <BrandText
        style={[{ marginLeft: layout.spacing_x1 }, fontSemibold14]}
        ellipsizeMode="middle"
        numberOfLines={1}
      >
        {name}
      </BrandText>
    </OmniLink>
  );
};
