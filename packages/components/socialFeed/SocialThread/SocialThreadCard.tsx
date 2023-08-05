import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import React, { useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { SocialCardHeader } from "./SocialCardHeader";
import { SocialMessageContent } from "./SocialMessageContent";
import { Post } from "../../../api/feed/v1/feed";
import { signingSocialFeedClient } from "../../../client-creators/socialFeedClient";
import { useTeritoriSocialFeedReactPostMutation } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { NetworkKind, parseUserId } from "../../../networks";
import { OnPressReplyType } from "../../../screens/FeedPostView/FeedPostViewScreen";
import { adenaDoContract } from "../../../utils/gno";
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
import { GNO_SOCIAL_FEEDS_PKG_PATH, TERITORI_FEED_ID } from "../const";

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
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkId = selectedNetworkInfo?.id;
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

  const cosmosReaction = async (emoji: string, walletAddress: string) => {
    const client = await signingSocialFeedClient({
      networkId: selectedNetworkId || "",
      walletAddress,
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

  const gnoReaction = async (emoji: string, rpcEndpoint: string) => {
    const vmCall = {
      caller: wallet?.address || "",
      send: "",
      pkg_path: GNO_SOCIAL_FEEDS_PKG_PATH,
      func: "ReactPost",
      args: [TERITORI_FEED_ID, localPost.identifier, emoji, "true"],
    };

    const txHash = await adenaDoContract(
      selectedNetworkId || "",
      [{ type: "/vm.m_call", value: vmCall }],
      {
        gasWanted: 2_000_000,
      }
    );

    const provider = new GnoJSONRPCProvider(rpcEndpoint);

    // Wait for tx done
    await provider.waitForTransaction(txHash);

    const reactions = [...post.reactions];
    const currentReactionIdx = reactions.findIndex((r) => r.icon === emoji);

    if (currentReactionIdx > -1) {
      reactions[currentReactionIdx].count++;
    } else {
      reactions.push({
        icon: emoji,
        count: 1,
      });
    }
    setLocalPost({ ...localPost, reactions });
  };

  const handleReaction = async (emoji: string) => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }

    if (selectedNetworkInfo?.kind === NetworkKind.Gno) {
      gnoReaction(emoji, selectedNetworkInfo?.endpoint || "");
    } else {
      cosmosReaction(emoji, wallet.address);
    }
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
