import React from "react";
import { View } from "react-native";

import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { neutral77 } from "../../../utils/style/colors";
import { fontMedium10, fontMedium12 } from "../../../utils/style/fonts";
import { fullSidebarWidth, layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { OmniLink } from "../../OmniLink";
import { UserAvatarWithFrame } from "../../images/AvatarWithFrame";

export const SidebarProfileButton: React.FC<{
  userId: string;
  isExpanded?: boolean;
}> = ({ userId, isExpanded }) => {
  const imageWidth = 68;
  const {
    metadata: { tokenId },
  } = useNSUserInfo(userId);

  return (
    <OmniLink to={{ screen: "UserPublicProfile", params: { id: userId } }}>
      <View
        style={[
          {
            marginVertical: layout.spacing_x1,
            marginLeft: layout.spacing_x0_25,
          },
          isExpanded && { flexDirection: "row", alignItems: "center" },
        ]}
      >
        <UserAvatarWithFrame userId={userId} />

        <View
          style={[
            { marginLeft: layout.spacing_x0_5 },
            !isExpanded && {
              maxWidth: imageWidth - layout.spacing_x0_5,
              alignItems: "center",
              marginTop: layout.spacing_x0_5,
            },
            isExpanded && {
              marginLeft: layout.spacing_x0_5,
              maxWidth:
                fullSidebarWidth -
                imageWidth -
                layout.spacing_x0_5 * 2 -
                layout.spacing_x2,
            },
          ]}
        >
          {!!tokenId && (
            <BrandText style={fontMedium12} numberOfLines={1}>
              {`@${tokenId}`}
            </BrandText>
          )}
          <BrandText style={[fontMedium10, { color: neutral77 }]}>
            My Profile
          </BrandText>
        </View>
      </View>
    </OmniLink>
  );
};
