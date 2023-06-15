import React from "react";
import { View } from "react-native";

import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold9 } from "../../../utils/style/fonts";
import { fullSidebarWidth, layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { OmniLink } from "../../OmniLink";
import { AvatarWithFrame } from "../../images/AvatarWithFrame";

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
            marginVertical: layout.padding_x1,
            marginLeft: layout.padding_x0_25,
          },
          isExpanded && { flexDirection: "row", alignItems: "center" },
        ]}
      >
        <AvatarWithFrame userId={userId} />

        <View
          style={[
            { marginLeft: layout.padding_x0_5 },
            !isExpanded && {
              maxWidth: imageWidth - layout.padding_x0_5,
              alignItems: "center",
              marginTop: layout.padding_x0_5,
            },
            isExpanded && {
              marginLeft: layout.padding_x0_5,
              maxWidth:
                fullSidebarWidth -
                imageWidth -
                layout.padding_x0_5 * 2 -
                layout.padding_x2,
            },
          ]}
        >
          {!!tokenId && (
            <BrandText style={fontSemibold12} numberOfLines={1}>
              {`@${tokenId}`}
            </BrandText>
          )}
          <BrandText style={[fontSemibold9, { color: neutral77 }]}>
            My Profile
          </BrandText>
        </View>
      </View>
    </OmniLink>
  );
};
