import React, { useEffect, useMemo, useState } from "react";
import { StyleProp, View, ViewStyle, TouchableOpacity } from "react-native";

import { Post } from "../../../api/feed/v1/feed";
import { socialFeedClient } from "../../../client-creators/socialFeedClient";
import { useTeritoriSocialFeedReactPostMutation } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { OnPressReplyType } from "../../../screens/FeedPostView/FeedPostViewScreen";
import { useAppNavigation } from "../../../utils/navigation";
import { DEFAULT_NAME, getUpdatedReactions } from "../../../utils/social-feed";
import { getCommunityHashtag } from "../../../utils/socialFeedCommunityHashtags";
import {
  neutral00,
  neutral17,
  neutral33,
  neutral77,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { tinyAddress } from "../../WalletSelector";
import { AnimationFadeIn } from "../../animations";
import { DotBadge } from "../../badges/DotBadge";
import { CustomPressable } from "../../buttons/CustomPressable";
import { AvatarWithFrame } from "../../images/AvatarWithFrame";
import { SpacerColumn, SpacerRow } from "../../spacer";
import { EmojiSelector } from "../EmojiSelector";
import { SocialFeedMetadata } from "../NewsFeed/NewsFeed.type";
import { CommentsCount } from "../SocialActions/CommentsCount";
import { Reactions } from "../SocialActions/Reactions";
import { ReplyButton } from "../SocialActions/ReplyButton";
import { ShareButton } from "../SocialActions/ShareButton";
import { SocialThreadGovernance } from "../SocialActions/SocialThreadGovernance";
import { TipButton } from "../SocialActions/TipButton";
import { DateTime } from "./DateTime";
import { SocialMessageContent } from "./SocialMessageContent";

export const SocialThreadCard: React.FC<{
  post: Post;
  style?: StyleProp<ViewStyle>;
  isPostConsultation?: boolean;
  refresh?: number;
  fadeInDelay?: number;
  onPressReply?: OnPressReplyType;
  isGovernance?: boolean;
}> = ({
  post,
  style,
  isPostConsultation,
  fadeInDelay,
  onPressReply,
  isGovernance,
}) => {
  const [localPost, setLocalPost] = useState<Post>(post);
  const { mutate, isLoading: isReactLoading } =
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
  const userInfo = useNSUserInfo(wallet?.userId);
  const navigation = useAppNavigation();
  const metadata: SocialFeedMetadata = JSON.parse(localPost.metadata);
  const username = authorNSInfo?.metadata?.tokenId
    ? tinyAddress(authorNSInfo?.metadata?.tokenId || "", 19)
    : localPost.createdBy;
  const communityHashtag = useMemo(() => {
    return getCommunityHashtag(metadata?.hashtags || []);
  }, [metadata]);

  const handleReaction = async (e: string) => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await socialFeedClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });

    mutate({
      client,
      msg: {
        icon: e,
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
      disabled={isPostConsultation}
      onPress={() =>
        navigation.navigate("FeedPostView", { id: post.identifier })
      }
    >
      <AnimationFadeIn
        style={[
          {
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 12,
            paddingVertical: layout.padding_x2,
            paddingHorizontal: layout.padding_x2_5,
          },
          isPostConsultation && { backgroundColor: neutral17 },
          style,
        ]}
        delay={fadeInDelay}
      >
        {/*====== Card Header */}
        <FlexRow justifyContent="space-between">
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/*---- User image */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("UserPublicProfile", {
                  id: localPost.createdBy,
                })
              }
              style={{
                marginRight: layout.padding_x2,
              }}
            >
              <AvatarWithFrame
                image={authorNSInfo?.metadata?.image}
                size="M"
                isLoading={authorNSInfo.loading}
              />
            </TouchableOpacity>

            {/*---- User name */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("UserPublicProfile", {
                  id: localPost.createdBy,
                })
              }
              activeOpacity={0.7}
            >
              <AnimationFadeIn>
                <BrandText style={fontSemibold16}>
                  {authorNSInfo?.metadata?.public_name || DEFAULT_NAME}
                </BrandText>
              </AnimationFadeIn>
            </TouchableOpacity>

            {/*---- User TNS name */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("UserPublicProfile", {
                  id: localPost.createdBy,
                })
              }
              style={{ marginHorizontal: layout.padding_x1_5 }}
            >
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    color: neutral77,
                  },
                ]}
              >
                {" "}
                @
                {authorNSInfo?.metadata?.tokenId
                  ? tinyAddress(authorNSInfo.metadata.tokenId, 19)
                  : localPost.createdBy}
              </BrandText>
            </TouchableOpacity>

            {/*---- Date */}
            <DateTime date={metadata.createdAt} />
          </View>

          {/*---- Badges */}
          {!!communityHashtag && (
            <DotBadge
              label={communityHashtag.hashtag}
              dotColor={communityHashtag.color}
              style={{
                backgroundColor: isPostConsultation ? neutral00 : neutral17,
              }}
            />
          )}
        </FlexRow>
        <SpacerColumn size={2} />

        {/*====== Card Content */}
        <SocialMessageContent
          isPostConsultation={isPostConsultation}
          metadata={metadata}
          type={localPost.category}
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
          <FlexRow justifyContent="flex-end">
            <Reactions
              reactions={localPost.reactions}
              onPressReaction={() => {}}
            />
            <SpacerRow size={2.5} />
            <EmojiSelector
              onEmojiSelected={handleReaction}
              isLoading={isReactLoading}
            />
            {isPostConsultation && onPressReply && (
              <>
                <SpacerRow size={2.5} />
                <ReplyButton onPress={handleReply} />
              </>
            )}
            <SpacerRow size={2.5} />
            <CommentsCount count={localPost.subPostLength} />

            {authorNSInfo.metadata?.tokenId !== userInfo?.metadata?.tokenId && (
              <>
                <SpacerRow size={2.5} />
                <TipButton
                  postTokenId={authorNSInfo?.metadata?.tokenId || ""}
                />
              </>
            )}

            {isPostConsultation && (
              <>
                <SpacerRow size={2.5} />
                <ShareButton postId={localPost.identifier} />
              </>
            )}
          </FlexRow>
        )}
      </AnimationFadeIn>
    </CustomPressable>
  );
};
