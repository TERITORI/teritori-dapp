import React, { FC } from "react";
import { useWindowDimensions, View } from "react-native";

import { DateTime } from "./DateTime";
import { DEFAULT_NAME } from "../../../utils/social-feed";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { OmniLink } from "../../OmniLink";
import { AnimationFadeIn } from "../../animations/AnimationFadeIn";
import { AvatarWithFrame } from "../../images/AvatarWithFrame";
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
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/*---- User image */}
          <AvatarWithFrame
            style={{
              marginRight: layout.padding_x2,
            }}
            image={authorMetadata?.image}
            size={width < 512 ? "XM" : "M"}
            isLoading={loading}
          />
          {/*---- User name */}
          <AnimationFadeIn>
            <BrandText style={fontSemibold16}>
              {authorMetadata?.public_name || DEFAULT_NAME}
            </BrandText>
          </AnimationFadeIn>

          {/*---- User TNS name */}
          <BrandText
            style={[
              fontSemibold14,
              {
                marginHorizontal: layout.padding_x1_5,
                color: neutral77,
              },
            ]}
            numberOfLines={1}
          >
            {" "}
            @{authorMetadata?.tokenId ? authorMetadata.tokenId : authorAddress}
          </BrandText>
        </OmniLink>

        {/*---- Date */}
        {width > 512 && <DateTime date={postMetadata.createdAt} />}
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
