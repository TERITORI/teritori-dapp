import { LinearGradient } from "expo-linear-gradient";
import React, { FC, memo, useEffect, useState } from "react";
import { StyleProp, useWindowDimensions, View, ViewStyle } from "react-native";

import { BrandText } from "../../../BrandText";
import { OptimizedImage } from "../../../OptimizedImage";
import { CustomPressable } from "../../../buttons/CustomPressable";
import { SpacerColumn } from "../../../spacer";
import { FlaggedCardFooter } from "../FlaggedCardFooter";
import { SocialCardFooter } from "../SocialCardFooter";
import { SocialCardHeader } from "../SocialCardHeader";
import { SocialCardWrapper } from "../SocialCardWrapper";

import { Post } from "@/api/feed/v1/feed";
import defaultThumbnailImage from "@/assets/default-images/default-article-thumbnail.png";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  ARTICLE_THUMBNAIL_IMAGE_MAX_WIDTH,
  SOCIAl_CARD_BORDER_RADIUS,
} from "@/utils/social-feed";
import {
  neutral00,
  neutral33,
  neutralA3,
  withAlpha,
} from "@/utils/style/colors";
import { fontRegular13, fontRegular15 } from "@/utils/style/fonts";
import {
  layout,
  RESPONSIVE_BREAKPOINT_S,
  SOCIAL_FEED_BREAKPOINT_M,
} from "@/utils/style/layout";
import { ZodSocialFeedArticleMarkdownMetadata } from "@/utils/types/feed";

const ARTICLE_CARD_PADDING_VERTICAL = layout.spacing_x2;
const ARTICLE_CARD_PADDING_HORIZONTAL = layout.spacing_x2_5;

// TODO: It's a copy of SocialArticleCard.tsx, just made waiting for a posts UI (and data) refacto. => Merge them in the future

export const SocialArticleMarkdownCard: FC<{
  post: Post;
  isPostConsultation?: boolean;
  style?: StyleProp<ViewStyle>;
  refetchFeed?: () => Promise<any>;
  isFlagged?: boolean;
  disabled?: boolean;
}> = memo(
  ({ post, isPostConsultation, refetchFeed, style, isFlagged, disabled }) => {
    const navigation = useAppNavigation();
    const [localPost, setLocalPost] = useState<Post>(post);
    const [viewWidth, setViewWidth] = useState(0);
    const { width: windowWidth } = useWindowDimensions();

    const articleCardHeight =
      windowWidth < SOCIAL_FEED_BREAKPOINT_M ? 214 : 254;
    const thumbnailImageWidth = viewWidth / 3;
    const borderRadius =
      windowWidth < RESPONSIVE_BREAKPOINT_S ? 0 : SOCIAl_CARD_BORDER_RADIUS;

    const metadata = zodTryParseJSON(
      ZodSocialFeedArticleMarkdownMetadata,
      localPost.metadata,
    );
    const thumbnailImage = metadata?.thumbnailImage;
    const shortDescription = metadata?.shortDescription || "";
    const title = metadata?.title;

    useEffect(() => {
      setLocalPost(post);
    }, [post]);

    return (
      <SocialCardWrapper
        post={localPost}
        isFlagged={isFlagged}
        refetchFeed={refetchFeed}
      >
        <CustomPressable
          disabled={disabled}
          onPress={() =>
            navigation.navigate("FeedPostView", {
              id: localPost.id,
            })
          }
          onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}
          style={[
            {
              borderWidth: 1,
              borderColor: withAlpha(neutral33, 0.5),
              borderRadius,
              backgroundColor: neutral00,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              height: articleCardHeight,
              flex: 1,
            },
            style,
          ]}
        >
          <View
            style={{
              justifyContent: "space-between",
              flex: 1,
              paddingVertical: ARTICLE_CARD_PADDING_VERTICAL,
              paddingHorizontal: ARTICLE_CARD_PADDING_HORIZONTAL,
            }}
          >
            <View>
              <SocialCardHeader
                isWrapped
                authorId={localPost.authorId}
                createdAt={localPost.createdAt}
                postWithLocationId={metadata?.location && localPost.id}
              />

              <SpacerColumn size={1.5} />
              <BrandText
                numberOfLines={2}
                style={
                  windowWidth < SOCIAL_FEED_BREAKPOINT_M
                    ? fontRegular15
                    : fontRegular15
                }
              >
                {title?.trim().replace("\n", " ")}
              </BrandText>

              <SpacerColumn size={1} />
              <BrandText
                style={[fontRegular13, { color: neutralA3 }]}
                numberOfLines={windowWidth < SOCIAL_FEED_BREAKPOINT_M ? 2 : 3}
              >
                {shortDescription.trim().replace("\n", " ")}
              </BrandText>
            </View>
          </View>

          {/*We use a shadow to highlight the footer when it's onto the thumbnail image (mobile)*/}
          <LinearGradient
            style={{
              position: "absolute",
              right:
                windowWidth < SOCIAL_FEED_BREAKPOINT_M
                  ? 0
                  : thumbnailImageWidth,
              bottom: 0,
              width:
                windowWidth < SOCIAL_FEED_BREAKPOINT_M
                  ? "100%"
                  : viewWidth - thumbnailImageWidth - 2,
              paddingHorizontal: ARTICLE_CARD_PADDING_HORIZONTAL,
              paddingVertical: ARTICLE_CARD_PADDING_VERTICAL,
              borderBottomRightRadius: borderRadius,
              borderBottomLeftRadius: borderRadius,
              maxWidth: ARTICLE_THUMBNAIL_IMAGE_MAX_WIDTH,
            }}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            colors={["rgba(0,0,0,1)", "rgba(0,0,0,.8)", "rgba(0,0,0,0)"]}
          >
            {isFlagged ? (
              <FlaggedCardFooter post={localPost} />
            ) : (
              <SocialCardFooter
                cardWidth={viewWidth}
                isPostConsultation={isPostConsultation}
                post={localPost}
                refetchFeed={refetchFeed}
                setPost={setLocalPost}
              />
            )}
          </LinearGradient>

          <OptimizedImage
            width={thumbnailImageWidth}
            height={articleCardHeight - 2}
            sourceURI={thumbnailImage?.url}
            fallbackURI={defaultThumbnailImage}
            style={{
              zIndex: -1,
              width: thumbnailImageWidth,
              height: articleCardHeight - 2,
              borderTopRightRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
            }}
          />
        </CustomPressable>
      </SocialCardWrapper>
    );
  },
);