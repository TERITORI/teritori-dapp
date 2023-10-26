import React, { FC, useMemo } from "react";
import { View } from "react-native";

import { CommentInfo } from "../../../api/video/v1/video";
import { BrandText } from "../../../components/BrandText";
import { OmniLink } from "../../../components/OmniLink";
import { UserAvatarWithFrame } from "../../../components/images/AvatarWithFrame";
import { DateTime } from "../../../components/socialFeed/SocialThread/DateTime";
import { SpacerRow } from "../../../components/spacer";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { parseUserId } from "../../../networks";
import { neutral77, primaryColor } from "../../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../../utils/style/fonts";
import { tinyAddress } from "../../../utils/text";

export const VideoComment: FC<{
  comment: CommentInfo;
}> = ({ comment }) => {
  const authorNSInfo = useNSUserInfo(comment.createdBy);
  const [, userAddr] = parseUserId(comment.createdBy);
  const username = useMemo(() => {
    return authorNSInfo?.metadata?.tokenId
      ? authorNSInfo?.metadata?.tokenId
      : tinyAddress(userAddr);
  }, [authorNSInfo, userAddr]);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <UserAvatarWithFrame userId={comment.createdBy} size="XXS" noFrame />
        <SpacerRow size={1.5} />

        <View style={{ width: "100%" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <OmniLink
              to={{
                screen: "UserPublicProfile",
                params: { id: comment.createdBy },
              }}
            >
              <BrandText style={[fontSemibold14, { color: primaryColor }]}>
                {username}
              </BrandText>
            </OmniLink>
            <SpacerRow size={1} />
            <DateTime
              date={new Date(comment.createdAt * 1000).toISOString()}
              textStyle={{ color: neutral77 }}
            />
          </View>
          <BrandText style={[fontMedium13, { width: "100%", maxWidth: 1200 }]}>
            {comment.comment}
          </BrandText>
        </View>
      </View>
    </View>
  );
};
