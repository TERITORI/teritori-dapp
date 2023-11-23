import { ResizeMode } from "expo-av";
import React, { FC, memo, useEffect, useMemo, useState } from "react";
import { StyleProp, useWindowDimensions, View, ViewStyle } from "react-native";

import { SOCIAl_CARD_BORDER_RADIUS } from "./SocialThreadCard";
import defaultThumbnailImage from "../../../../../assets/default-images/default-video-thumbnail.jpg";
import { Post } from "../../../../api/feed/v1/feed";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import { parseUserId } from "../../../../networks";
import { zodTryParseJSON } from "../../../../utils/sanitize";
import {
  errorColor,
  neutral00,
  neutral33,
  neutralA3,
} from "../../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../../../utils/style/fonts";
import {
  layout,
  SOCIAL_FEED_BREAKPOINT_M,
} from "../../../../utils/style/layout";
import { BrandText } from "../../../BrandText";
import { CustomPressable } from "../../../buttons/CustomPressable";
import { MediaPlayerVideo } from "../../../mediaPlayer/MediaPlayerVideo";
import { SpacerColumn } from "../../../spacer";
import {
  ZodSocialFeedPostMetadata,
  ZodSocialFeedVideoMetadata,
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

export const SocialVideoCard: FC<{
  post: Post;
  isPostConsultation?: boolean;
  style?: StyleProp<ViewStyle>;
  refetchFeed?: () => Promise<any>;
  isFlagged?: boolean;
}> = memo(({ post, isPostConsultation, refetchFeed, style, isFlagged }) => {
  const [localPost, setLocalPost] = useState<Post>(post);
  const [viewWidth, setViewWidth] = useState(0);
  const { width: windowWidth } = useWindowDimensions();
  const [, authorAddress] = parseUserId(localPost.authorId);
  const authorNSInfo = useNSUserInfo(localPost.authorId);
  const articleCardHeight = windowWidth < SOCIAL_FEED_BREAKPOINT_M ? 214 : 254;

  const metadata = zodTryParseJSON(
    ZodSocialFeedVideoMetadata,
    localPost.metadata,
  );
  const oldMetadata = zodTryParseJSON(
    ZodSocialFeedPostMetadata,
    localPost.metadata,
  );
  const thumbnailImage =
    metadata?.videoFile.thumbnailFileData ||
    oldMetadata?.files?.find((file) => file.isCoverImage);
  const title = oldMetadata?.title || metadata?.title || "";

  const shortDescription = useMemo(() => {
    if (metadata?.description) return metadata.description;
    if (
      oldMetadata?.message &&
      isArticleHTMLNeedsTruncate(oldMetadata.message, true)
    ) {
      const { truncatedHtml } = getTruncatedArticleHTML(oldMetadata.message);
      const contentState =
        createStateFromHTML(truncatedHtml).getCurrentContent();
      return contentState.getPlainText();
    }
    return "";
  }, [metadata?.description, oldMetadata?.message]);

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const thumbnailURI = thumbnailImage?.url
    ? thumbnailImage.url.includes("://")
      ? thumbnailImage.url
      : "ipfs://" + thumbnailImage.url // we need this hack because ipfs "urls" in feed are raw CIDs
    : defaultThumbnailImage;

  if (!metadata)
    return (
      <BrandText style={[fontSemibold13, { color: errorColor }]}>
        Video not found
      </BrandText>
    );
  return (
    <SocialCardWrapper
      post={localPost}
      isFlagged={isFlagged}
      refetchFeed={refetchFeed}
    >
      <View
        onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}
        style={[
          {
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: SOCIAl_CARD_BORDER_RADIUS,
            backgroundColor: neutral00,
            width: "100%",
            height: articleCardHeight,
            flex: 1,
          },
          style,
        ]}
      >
        <MediaPlayerVideo
          thumbnailURI={thumbnailURI}
          videoMetadata={metadata}
          style={{
            height: 400,
            width: viewWidth - 2,
            borderTopRightRadius: SOCIAl_CARD_BORDER_RADIUS,
            borderTopLeftRadius: SOCIAl_CARD_BORDER_RADIUS,
          }}
          resizeMode={ResizeMode.CONTAIN}
          authorId={localPost.authorId}
          postId={localPost.identifier}
        />

        <CustomPressable
          // TODO: Make a FeedVideoViewScreen
          // onPress={() =>
          //   navigation.navigate("FeedVideoView", {
          //     id: getNetworkObjectId(selectedNetworkId, localPost.identifier),
          //   })
          // }
          style={{
            flex: 1,
            paddingBottom: ARTICLE_CARD_PADDING_VERTICAL,
            paddingHorizontal: ARTICLE_CARD_PADDING_HORIZONTAL,
          }}
        >
          <BrandText
            numberOfLines={2}
            style={
              windowWidth < SOCIAL_FEED_BREAKPOINT_M
                ? fontSemibold16
                : fontSemibold20
            }
          >
            {title?.trim()}
          </BrandText>

          <SpacerColumn size={1} />
          <SocialCardHeader
            authorId={localPost.authorId}
            authorAddress={authorAddress}
            createdAt={localPost.createdAt}
            authorMetadata={authorNSInfo?.metadata}
          />

          <SpacerColumn size={1.5} />
          <BrandText
            style={[fontSemibold14, { color: neutralA3 }]}
            numberOfLines={windowWidth < SOCIAL_FEED_BREAKPOINT_M ? 2 : 3}
          >
            {shortDescription.trim()}
          </BrandText>

          <SpacerColumn size={1.5} />
          {isFlagged ? (
            <FlaggedCardFooter post={localPost} />
          ) : (
            <SocialCardFooter
              cardWidth={viewWidth}
              isPostConsultation={isPostConsultation}
              post={localPost}
              refetchFeed={refetchFeed}
              setLocalPost={setLocalPost}
            />
          )}
        </CustomPressable>
      </View>
    </SocialCardWrapper>
  );
});
