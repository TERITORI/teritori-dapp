import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useEffect, useState } from "react";
import {
  Image,
  StyleProp,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import { SOCIAl_CARD_BORDER_RADIUS } from "./SocialThreadCard";
import defaultThumbnailImage from "../../../../../assets/default-images/default-article-thumbnail.png";
import { Post } from "../../../../api/feed/v1/feed";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../../../hooks/useSelectedNetwork";
import { getNetworkObjectId, parseUserId } from "../../../../networks";
import { ipfsURLToHTTPURL } from "../../../../utils/ipfs";
import { useAppNavigation } from "../../../../utils/navigation";
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
import { CustomPressable } from "../../../buttons/CustomPressable";
import { SpacerColumn } from "../../../spacer";
import {
  SocialFeedArticleMetadata,
  SocialFeedMetadata,
  ZodSocialFeedArticleMetadata,
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
  isSmall?: boolean;
  style?: StyleProp<ViewStyle>;
  refetchFeed?: () => Promise<any>;
  isFlagged?: boolean;
}> = ({ post, isPostConsultation, refetchFeed, style, isFlagged }) => {
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

  // TODO: Remove oldMetadata usage after feed indexer reroll
  const [shortDescription, setShortDescription] = useState("");
  const metadata: SocialFeedArticleMetadata | null =
    ZodSocialFeedArticleMetadata.safeParse(JSON.parse(localPost.metadata))
      .success
      ? ZodSocialFeedArticleMetadata.parse(localPost.metadata)
      : null;
  const oldMetadata: SocialFeedMetadata = JSON.parse(localPost.metadata);
  const thumbnailImage =
    metadata?.thumbnailImage ||
    // Old articles doesn't have thumbnailImage, but they have a file thumbnailImage = true
    oldMetadata?.files?.find((file) => file.isCoverImage);

  // Truncate the article html
  useEffect(() => {
    if (isArticleHTMLNeedsTruncate((metadata || oldMetadata).message, true)) {
      const { truncatedHtml } = getTruncatedArticleHTML(
        (metadata || oldMetadata).message,
      );
      const contentState =
        createStateFromHTML(truncatedHtml).getCurrentContent();
      setShortDescription(
        metadata?.shortDescription ||
          // Old articles doesn't have shortDescription, so we use the start of the html content
          contentState.getPlainText(),
      );
    }
  }, [metadata?.message, metadata, oldMetadata]);

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
              authorId={localPost.authorId}
              authorAddress={authorAddress}
              postMetadata={metadata || oldMetadata}
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
              {(metadata || oldMetadata).title.trim().replace("\n", "")}
            </BrandText>

            <SpacerColumn size={1} />
            <BrandText
              style={[fontSemibold14, { color: neutralA3 }]}
              numberOfLines={windowWidth < SOCIAL_FEED_BREAKPOINT_M ? 2 : 3}
            >
              {shortDescription.trim().replace("\n", "")}
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
              setLocalPost={setLocalPost}
            />
          )}
        </LinearGradient>

        <Image
          width={thumbnailImageWidth}
          height={articleCardHeight - 2}
          source={{
            uri: ipfsURLToHTTPURL(thumbnailImage?.url) || defaultThumbnailImage,
          }}
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
};
