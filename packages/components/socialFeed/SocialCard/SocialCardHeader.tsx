import React, { FC } from "react";
import { useWindowDimensions, View } from "react-native";

import { DateTime } from "./DateTime";
import { DEFAULT_NAME } from "../../../utils/social-feed";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout, RESPONSIVE_BREAKPOINT_S } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
import { BrandText } from "../../BrandText";
import { OmniLink } from "../../OmniLink";
import { AnimationFadeIn } from "../../animations/AnimationFadeIn";
import { UserAvatarWithFrame } from "../../images/AvatarWithFrame";
import { DotSeparator } from "../../separators/DotSeparator";
import { SpacerRow } from "../../spacer";

// ====== Handle author image and username, date
export const SocialCardHeader: FC<{
  authorId: string;
  authorAddress: string;
  createdAt?: number;
  authorMetadata?: any;
  isWrapped?: boolean;
}> = ({ authorId, authorAddress, authorMetadata, createdAt, isWrapped }) => {
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <OmniLink
          to={{ screen: "UserPublicProfile", params: { id: authorId } }}
        >
          {/*---- User image */}
          <UserAvatarWithFrame
            style={{
              marginRight:
                width < RESPONSIVE_BREAKPOINT_S
                  ? layout.spacing_x1
                  : layout.spacing_x1_5,
            }}
            userId={authorId}
            size={width < RESPONSIVE_BREAKPOINT_S ? "XS" : "S"}
          />
        </OmniLink>
        <View
          style={{
            flexDirection:
              width < RESPONSIVE_BREAKPOINT_S && isWrapped ? "column" : "row",
            flex: 1,
          }}
        >
          <OmniLink
            to={{ screen: "UserPublicProfile", params: { id: authorId } }}
          >
            {/*---- User name */}
            <AnimationFadeIn>
              <BrandText style={fontSemibold16} numberOfLines={1}>
                {authorMetadata?.public_name ||
                  (!authorMetadata?.tokenId
                    ? DEFAULT_NAME
                    : authorMetadata.tokenId.split(".")[0]) ||
                  DEFAULT_NAME}
              </BrandText>
            </AnimationFadeIn>
          </OmniLink>

          {(width >= RESPONSIVE_BREAKPOINT_S || !isWrapped) && (
            <SpacerRow size={1.5} />
          )}

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {width >= RESPONSIVE_BREAKPOINT_S && (
              <>
                {/* ---- User TNS name*/}
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
                <DotSeparator
                  style={{ marginHorizontal: layout.spacing_x0_75 }}
                />
              </>
            )}
            {/*---- Date */}
            {!!createdAt && (
              <DateTime
                date={createdAt * 1000}
                textStyle={{ color: neutral77 }}
              />
            )}
          </View>
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
    </View>
  );
};
