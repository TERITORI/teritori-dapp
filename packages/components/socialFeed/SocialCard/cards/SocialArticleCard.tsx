import { LinearGradient } from "expo-linear-gradient";
import React, { FC, memo, useEffect, useMemo, useState } from "react";
import { StyleProp, useWindowDimensions, View, ViewStyle } from "react-native";

import { SOCIAl_CARD_BORDER_RADIUS } from "./SocialThreadCard";
import defaultThumbnailImage from "../../../../../assets/default-images/default-article-thumbnail.png";
import { Post } from "../../../../api/feed/v1/feed";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../../../hooks/useSelectedNetwork";
import { getNetworkObjectId, parseUserId } from "../../../../networks";
import { useAppNavigation } from "../../../../utils/navigation";
import { zodTryParseJSON } from "../../../../utils/sanitize";
import {
  neutral00,
  neutral33,
  neutralA3,
} from "../../../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../../../utils/style/fonts";
import {
  layout,
  SOCIAL_FEED_BREAKPOINT_M,
} from "../../../../utils/style/layout";
import { BrandText } from "../../../BrandText";
import { OptimizedImage } from "../../../OptimizedImage";
import { CustomPressable } from "../../../buttons/CustomPressable";
import { SpacerColumn } from "../../../spacer";
import {
  ZodSocialFeedArticleMetadata,
  ZodSocialFeedPostMetadata,
} from "../../NewsFeed/NewsFeed.type";
import {
  createStateFromHTML,
  getTruncatedArticleHTML,
  isArticleHTMLNeedsTruncate,
} from "../../RichText/RichText.web";
import { FlaggedCardFooter } from "../FlaggedCardFooter";
import { SocialCardFooter } from "../SocialCardFooter";
import { SocialCardHeader } from "../SocialCardHeader";
import { SocialCardWrapper } from "../SocialCardWrapper";

const ARTICLE_CARD_PADDING_VERTICAL = layout.spacing_x2;
const ARTICLE_CARD_PADDING_HORIZONTAL = layout.spacing_x2_5;

export const SocialArticleCard: FC<{
  post: Post;
  isPostConsultation?: boolean;
  style?: StyleProp<ViewStyle>;
  refetchFeed?: () => Promise<any>;
  isFlagged?: boolean;
}> = memo(({ post, isPostConsultation, refetchFeed, style, isFlagged }) => {
  const navigation = useAppNavigation();
  const [localPost, setLocalPost] = useState<Post>(post);
  const [viewWidth, setViewWidth] = useState(0);
  const { width: windowWidth } = useWindowDimensions();
  const [, authorAddress] = parseUserId(localPost.authorId);
  const authorNSInfo = useNSUserInfo(localPost.authorId);
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkId = selectedNetworkInfo?.id || "";
  const articleCardHeight = windowWidth < SOCIAL_FEED_BREAKPOINT_M ? 214 : 254;
  const thumbnailImageWidth = viewWidth / 3;

  const metadata = zodTryParseJSON(
    ZodSocialFeedArticleMetadata,
    localPost.metadata,
  );
  const oldMetadata = zodTryParseJSON(
    ZodSocialFeedPostMetadata,
    localPost.metadata,
  );
  const thumbnailImage =
    metadata?.thumbnailImage ||
    // Old articles doesn't have thumbnailImage, but they have a file thumbnailImage = true
    oldMetadata?.files?.find((file) => file.isCoverImage);
  const simplePostMetadata = metadata || oldMetadata;
  const message = simplePostMetadata?.message;

  const shortDescription = useMemo(() => {
    if (metadata?.shortDescription) {
      return metadata.shortDescription;
    }
    if (!message) return "";
    if (isArticleHTMLNeedsTruncate(message, true)) {
      const { truncatedHtml } = getTruncatedArticleHTML(message);
      const contentState =
        createStateFromHTML(truncatedHtml).getCurrentContent();
      return (
        metadata?.shortDescription ||
        // Old articles doesn't have shortDescription, so we use the start of the html content
        contentState.getPlainText()
      );
    }
    return "";
  }, [message, metadata?.shortDescription]);

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const thumbnailURI = thumbnailImage?.url
    ? thumbnailImage.url.includes("://")
      ? thumbnailImage.url
      : "ipfs://" + thumbnailImage.url // we need this hack because ipfs "urls" in feed are raw CIDs
    : defaultThumbnailImage;

  const title = simplePostMetadata?.title;

  return (
    <SocialCardWrapper
      post={localPost}
      isFlagged={isFlagged}
      refetchFeed={refetchFeed}
    >
      <CustomPressable
        onPress={() =>
          navigation.navigate("FeedPostView", {
            id: getNetworkObjectId(selectedNetworkId, localPost.identifier),
          })
        }
        onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}
        style={[
          {
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: SOCIAl_CARD_BORDER_RADIUS,
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
              authorAddress={authorAddress}
              createdAt={localPost.createdAt}
              authorMetadata={authorNSInfo?.metadata}
            />

            <SpacerColumn size={1.5} />
            <BrandText
              numberOfLines={2}
              style={
                windowWidth < SOCIAL_FEED_BREAKPOINT_M
                  ? fontSemibold16
                  : fontSemibold20
              }
            >
              {title?.trim().replace("\n", " ")}
            </BrandText>

            <SpacerColumn size={1} />
            <BrandText
              style={[fontSemibold14, { color: neutralA3 }]}
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
              windowWidth < SOCIAL_FEED_BREAKPOINT_M ? 0 : thumbnailImageWidth,
            bottom: 0,
            width:
              windowWidth < SOCIAL_FEED_BREAKPOINT_M
                ? "100%"
                : viewWidth - thumbnailImageWidth - 2,
            paddingHorizontal: ARTICLE_CARD_PADDING_HORIZONTAL,
            paddingVertical: ARTICLE_CARD_PADDING_VERTICAL,
            borderBottomRightRadius: SOCIAl_CARD_BORDER_RADIUS,
            borderBottomLeftRadius: SOCIAl_CARD_BORDER_RADIUS,
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
          sourceURI={thumbnailURI}
          fallbackURI={defaultThumbnailImage}
          style={{
            zIndex: -1,
            width: thumbnailImageWidth,
            height: articleCardHeight - 2,
            borderTopRightRadius:
              windowWidth < SOCIAL_FEED_BREAKPOINT_M
                ? 0
                : SOCIAl_CARD_BORDER_RADIUS,
            borderBottomRightRadius:
              windowWidth < SOCIAL_FEED_BREAKPOINT_M
                ? 0
                : SOCIAl_CARD_BORDER_RADIUS,
          }}
        />
      </CustomPressable>
    </SocialCardWrapper>
  );
});
