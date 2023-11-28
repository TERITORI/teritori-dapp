import { ResizeMode } from "expo-av";
import React, { FC, memo, useEffect, useState } from "react";
import { StyleProp, useWindowDimensions, View, ViewStyle } from "react-native";

import { SOCIAl_CARD_BORDER_RADIUS } from "./SocialThreadCard";
import { Post } from "../../../../api/feed/v1/feed";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import {
  getNetworkObjectId,
  NetworkKind,
  parseUserId,
} from "../../../../networks";
import { useAppNavigation } from "../../../../utils/navigation";
import { zodTryParseJSON } from "../../../../utils/sanitize";
import { DEFAULT_USERNAME } from "../../../../utils/social-feed";
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
import { SpacerColumn, SpacerRow } from "../../../spacer";
import {
  ZodSocialFeedPostMetadata,
  ZodSocialFeedVideoMetadata,
} from "../../NewsFeed/NewsFeed.type";
import { DislikeButton } from "../../SocialActions/DislikeButton";
import { LikeButton } from "../../SocialActions/LikeButton";
import { ReportButton } from "../../SocialActions/ReportButton";
import { ShareButton } from "../../SocialActions/ShareButton";
import { TipButton } from "../../SocialActions/TipButton";
import { FlaggedCardFooter } from "../FlaggedCardFooter";
import { SocialCardHeader } from "../SocialCardHeader";
import { SocialCardWrapper } from "../SocialCardWrapper";

const VIDEO_CARD_PADDING_VERTICAL = layout.spacing_x2;
const VIDEO_CARD_PADDING_HORIZONTAL = layout.spacing_x2_5;

export const SocialVideoCard: FC<{
  post: Post;
  style?: StyleProp<ViewStyle>;
  refetchFeed?: () => Promise<any>;
  isFlagged?: boolean;
}> = memo(({ post, refetchFeed, style, isFlagged }) => {
  const navigation = useAppNavigation();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const wallet = useSelectedWallet();
  const [localPost, setLocalPost] = useState<Post>(post);
  const [viewWidth, setViewWidth] = useState(0);
  const { width: windowWidth } = useWindowDimensions();
  const [, authorAddress] = parseUserId(localPost.authorId);
  const authorNSInfo = useNSUserInfo(localPost.authorId);
  const username =
    authorNSInfo?.metadata?.tokenId || authorAddress || DEFAULT_USERNAME;

  const metadata = zodTryParseJSON(
    ZodSocialFeedVideoMetadata,
    localPost.metadata,
  );
  const oldMetadata = zodTryParseJSON(
    ZodSocialFeedPostMetadata,
    localPost.metadata,
  );
  const title = oldMetadata?.title || metadata?.title || "";
  const description = oldMetadata?.message || metadata?.description || "";

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

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
            flex: 1,
          },
          style,
        ]}
      >
        <MediaPlayerVideo
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

        <SpacerColumn size={1} />
        <CustomPressable
          onPress={() =>
            navigation.navigate("FeedPostView", {
              id: getNetworkObjectId(
                selectedNetworkInfo?.id,
                localPost.identifier,
              ),
            })
          }
          style={{
            flex: 1,
            paddingBottom: VIDEO_CARD_PADDING_VERTICAL,
            paddingHorizontal: VIDEO_CARD_PADDING_HORIZONTAL,
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
          <View
            style={[
              windowWidth >= SOCIAL_FEED_BREAKPOINT_M && {
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
              },
            ]}
          >
            <SocialCardHeader
              authorId={localPost.authorId}
              authorAddress={authorAddress}
              createdAt={localPost.createdAt}
              authorMetadata={authorNSInfo?.metadata}
            />
            {windowWidth < SOCIAL_FEED_BREAKPOINT_M && (
              <SpacerColumn size={0.5} />
            )}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <LikeButton post={localPost} setPost={setLocalPost} />
              <SpacerRow size={1.5} />
              <DislikeButton post={localPost} setPost={setLocalPost} />

              <SpacerRow size={1.5} />
              <TipButton
                disabled={localPost.authorId === wallet?.userId}
                amount={localPost.tipAmount}
                author={username}
                postId={localPost.identifier}
                useAltStyle
              />

              <SpacerRow size={1.5} />
              <ShareButton postId={localPost.identifier} useAltStyle />

              {selectedNetworkInfo?.kind === NetworkKind.Gno && (
                <>
                  <SpacerRow size={1.5} />
                  <ReportButton
                    refetchFeed={refetchFeed}
                    postId={localPost.identifier}
                    useAltStyle
                  />
                </>
              )}
            </View>
          </View>

          <SpacerColumn size={1.5} />
          <BrandText
            style={[fontSemibold14, { color: neutralA3 }]}
            numberOfLines={windowWidth < SOCIAL_FEED_BREAKPOINT_M ? 2 : 3}
          >
            {description.trim()}
          </BrandText>

          {isFlagged && (
            <>
              <SpacerColumn size={1.5} />
              <FlaggedCardFooter post={localPost} />
            </>
          )}
        </CustomPressable>
      </View>
    </SocialCardWrapper>
  );
});
