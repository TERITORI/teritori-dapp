import React, { FC, useMemo } from "react";
import { useWindowDimensions, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { OmniLink } from "../../../components/OmniLink";
import { UserAvatarWithFrame } from "../../../components/images/AvatarWithFrame";
import {
  PostExtra,
  ZodSocialFeedPostMetadata,
} from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { DateTime } from "../../../components/socialFeed/SocialCard/DateTime";
import { SpacerRow } from "../../../components/spacer";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { parseUserId } from "../../../networks";
import { zodTryParseJSON } from "../../../utils/sanitize";
import { neutral77, primaryColor } from "../../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../../utils/style/fonts";
import { RESPONSIVE_BREAKPOINT_S } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";

export const VideoComment: FC<{
  comment: PostExtra;
}> = ({ comment }) => {
  const { width: windowWidth } = useWindowDimensions();
  const metadata = zodTryParseJSON(ZodSocialFeedPostMetadata, comment.metadata);
  const authorNSInfo = useNSUserInfo(comment.authorId);
  const [, userAddr] = parseUserId(comment.authorId);
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
        <OmniLink
          to={{
            screen: "UserPublicProfile",
            params: { id: comment.authorId },
          }}
        >
          <UserAvatarWithFrame
            userId={comment.authorId}
            size={windowWidth < RESPONSIVE_BREAKPOINT_S ? "XS" : "S"}
          />
        </OmniLink>
        <SpacerRow size={1.5} />

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <OmniLink
              to={{
                screen: "UserPublicProfile",
                params: { id: comment.authorId },
              }}
            >
              <BrandText style={[fontSemibold14, { color: primaryColor }]}>
                {username}
              </BrandText>
            </OmniLink>
            <SpacerRow size={1} />
            <DateTime
              date={comment.createdAt * 1000}
              textStyle={{ color: neutral77 }}
            />
          </View>
          <BrandText style={[fontMedium13, { width: "100%", maxWidth: 1200 }]}>
            {metadata?.message}
          </BrandText>
        </View>
      </View>
    </View>
  );
};
