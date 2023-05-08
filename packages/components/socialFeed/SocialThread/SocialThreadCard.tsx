import React, { useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { Post } from "../../../api/feed/v1/feed";
import { signingSocialFeedClient } from "../../../client-creators/socialFeedClient";
import { useTeritoriSocialFeedReactPostMutation } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { parseUserId } from "../../../networks";
import { OnPressReplyType } from "../../../screens/FeedPostView/FeedPostViewScreen";
import { useAppNavigation } from "../../../utils/navigation";
import { getUpdatedReactions } from "../../../utils/social-feed";
import {
  neutral00,
  neutral17,
  neutral33,
  withAlpha,
} from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import FlexRow from "../../FlexRow";
import { AnimationFadeIn } from "../../animations/AnimationFadeIn";
import { CustomPressable } from "../../buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../../spacer";
import { EmojiSelector } from "../EmojiSelector";
import { SocialFeedMetadata } from "../NewsFeed/NewsFeed.type";
import { CommentsCount } from "../SocialActions/CommentsCount";
import { nbReactionsShown, Reactions } from "../SocialActions/Reactions";
import { ReplyButton } from "../SocialActions/ReplyButton";
import { ShareButton } from "../SocialActions/ShareButton";
import { SocialThreadGovernance } from "../SocialActions/SocialThreadGovernance";
import { TipButton } from "../SocialActions/TipButton";
import { SocialCardHeader } from "./SocialCardHeader";
import { SocialMessageContent } from "./SocialMessageContent";

const BREAKPOINT_S = 480;

export const SocialThreadCard: React.FC<{
  post: Post;
  style?: StyleProp<ViewStyle>;
  isPostConsultation?: boolean;
  fadeInDelay?: number;
  onPressReply?: OnPressReplyType;
  isGovernance?: boolean;
  isPreview?: boolean;
}> = ({
  post,
  style,
  isPostConsultation,
  fadeInDelay,
  onPressReply,
  isGovernance,
  isPreview,
}) => {
  const [localPost, setLocalPost] = useState<Post>(post);
  const [viewWidth, setViewWidth] = useState(0);
  const { mutate: postMutate, isLoading: isPostMutationLoading } =
    useTeritoriSocialFeedReactPostMutation({
      onSuccess(_data, variables) {
        const reactions = getUpdatedReactions(
          post.reactions,
          variables.msg.icon
        );

        setLocalPost({ ...localPost, reactions });
      },
    });

  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const authorNSInfo = useNSUserInfo(localPost.createdBy);
  const [, userAddress] = parseUserId(localPost.createdBy);
  const userInfo = useNSUserInfo(wallet?.userId);
  const navigation = useAppNavigation();
  const metadata: SocialFeedMetadata = JSON.parse(localPost.metadata);
  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : userAddress;

  //TODO: Handle this later
  // const communityHashtag = useMemo(() => {
  //   return getCommunityHashtag(metadata?.hashtags || []);
  // }, [metadata]);

  const handleReaction = async (emoji: string) => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingSocialFeedClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });

    postMutate({
      client,
      msg: {
        icon: emoji,
        identifier: localPost.identifier,
        up: true,
      },
    });
  };

  const handleReply = () =>
    onPressReply?.({
      username,
    });

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  return (
    <CustomPressable
      onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}
      disabled={isPostConsultation}
      onPress={() =>
        navigation.navigate("FeedPostView", { id: localPost.identifier })
      }
    >
      <AnimationFadeIn
        style={[
          {
            borderWidth: isPostConsultation ? 4 : 1,
            borderColor: isPostConsultation
              ? withAlpha(neutral33, 0.5)
              : neutral33,
            borderRadius: 12,
            paddingVertical: layout.padding_x2,
            paddingHorizontal: layout.padding_x2_5,
            backgroundColor: neutral00,
          },
          style,
        ]}
        delay={fadeInDelay}
      >
        {/*====== Card Header */}
        <SocialCardHeader
          authorAddress={userAddress}
          authorId={localPost.createdBy}
          postMetadata={metadata}
          authorMetadata={authorNSInfo?.metadata}
        />

        <SpacerColumn size={2} />

        {/*====== Card Content */}
        <SocialMessageContent
          metadata={metadata}
          postCategory={localPost.category}
          isPreview={isPreview}
        />
        <SpacerColumn size={2} />

        {/*====== Card Actions */}
        {isGovernance ? (
          <FlexRow justifyContent="flex-end" style={{ height: 48 }}>
            <SocialThreadGovernance
              squaresBackgroundColor={
                isPostConsultation ? neutral17 : neutral00
              }
            />
          </FlexRow>
        ) : (
          <FlexRow
            justifyContent="flex-end"
            style={
              viewWidth < BREAKPOINT_S && {
                flexDirection: "column",
                alignItems: "flex-end",
              }
            }
          >
            <Reactions
              nbShown={nbReactionsShown(viewWidth)}
              reactions={localPost.reactions}
              onPressReaction={handleReaction}
              isLoading={isPostMutationLoading}
            />

            {viewWidth < BREAKPOINT_S && localPost.reactions.length ? (
              <SpacerColumn size={2} />
            ) : (
              <SpacerRow size={2.5} />
            )}

            <View
              style={{ flexDirection: "row", alignItems: "center", zIndex: -1 }}
            >
              <EmojiSelector
                onEmojiSelected={handleReaction}
                isLoading={isPostMutationLoading}
              />
              {isPostConsultation && onPressReply && (
                <>
                  <SpacerRow size={2.5} />
                  <ReplyButton onPress={handleReply} />
                </>
              )}
              <SpacerRow size={2.5} />
              <CommentsCount count={localPost.subPostLength} />

              <SpacerRow size={2.5} />
              <TipButton
                disabled={
                  authorNSInfo?.metadata?.tokenId ===
                  userInfo?.metadata?.tokenId
                }
                amount={localPost.tipAmount}
                author={username}
                postId={localPost.identifier}
              />

              {isPostConsultation && (
                <>
                  <SpacerRow size={2.5} />
                  <ShareButton postId={localPost.identifier} />
                </>
              )}
            </View>
          </FlexRow>
        )}
      </AnimationFadeIn>
    </CustomPressable>
  );
};
