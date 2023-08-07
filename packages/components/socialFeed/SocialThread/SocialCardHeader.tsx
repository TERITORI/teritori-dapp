import React, { FC } from "react";
import { useWindowDimensions, View } from "react-native";

import { DateTime } from "./DateTime";
import { DEFAULT_NAME } from "../../../utils/social-feed";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout, RESPONSIVE_BREAKPOINT_S } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { OmniLink } from "../../OmniLink";
import { AnimationFadeIn } from "../../animations/AnimationFadeIn";
import { UserAvatarWithFrame } from "../../images/AvatarWithFrame";
import { SocialFeedMetadata } from "../NewsFeed/NewsFeed.type";

export const SocialCardHeader: FC<{
  authorId: string;
  authorAddress: string;
  postMetadata: SocialFeedMetadata;
  authorMetadata?: any;
  loading?: boolean;
}> = ({ authorId, authorAddress, authorMetadata, postMetadata, loading }) => {
  const { width } = useWindowDimensions();
  return (
    <FlexRow justifyContent="space-between">
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <OmniLink
          to={{ screen: "UserPublicProfile", params: { id: authorId } }}
        >
          {/*---- User image */}
          <UserAvatarWithFrame
            style={{
              marginRight:
                width < RESPONSIVE_BREAKPOINT_S
                  ? layout.padding_x1
                  : layout.padding_x2,
            }}
            userId={authorId}
            size={width < RESPONSIVE_BREAKPOINT_S ? "S" : "M"}
          />
        </OmniLink>
        <View
          style={{
            flexDirection: width < RESPONSIVE_BREAKPOINT_S ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <OmniLink
            to={{ screen: "UserPublicProfile", params: { id: authorId } }}
          >
            {/*---- User name */}
            <AnimationFadeIn>
              <BrandText style={fontSemibold16}>
                {authorMetadata?.public_name || DEFAULT_NAME}
              </BrandText>
              <View style={{ flexDirection: "row" }}>
                <OmniLink
                  to={{ screen: "UserPublicProfile", params: { id: authorId } }}
                >
                  <BrandText
                    style={[
                      fontSemibold14,
                      {
                        color: neutral77,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {" "}
                    @
                    {authorMetadata?.tokenId
                      ? authorMetadata.tokenId
                      : tinyAddress(authorAddress, 19)}
                  </BrandText>
                </OmniLink>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/*---- User TNS name */}

                  {/* A dot separator */}
                  <View
                    style={{
                      backgroundColor: neutral77,
                      height: 2,
                      width: 2,
                      borderRadius: 999,
                      marginHorizontal: layout.padding_x0_75,
                    }}
                  />
                  {/*---- Date */}
                  <DateTime
                    date={postMetadata.createdAt}
                    textStyle={{ color: neutral77 }}
                  />
                </View>
              </View>
            </AnimationFadeIn>
          </OmniLink>
        </View>
      </View>

      {/*---- Badges TODO: Handle this later */}
      {/*{!!communityHashtag && (*/}
      {/*  <DotBadge*/}
      {/*    label={communityHashtag.hashtag}*/}
      {/*    dotColor={communityHashtag.color}*/}
      {/*    style={{*/}
      {/*      backgroundColor: isPostConsultation ? neutral00 : neutral17,*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}
    </FlexRow>
  );
};
