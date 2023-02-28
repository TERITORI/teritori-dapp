import React, { useEffect, useMemo, useState } from "react";
import { StyleProp, View, ViewStyle, TouchableOpacity } from "react-native";

import { socialFeedClient } from "../../../client-creators/socialFeedClient";
import { useTeritoriSocialFeedReactPostMutation } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { PostResult } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId } from "../../../networks";
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
import { ShareButton } from "../SocialActions/ShareButton";
import { SocialThreadGovernance } from "../SocialActions/SocialThreadGovernance";
import { TipButton } from "../SocialActions/TipButton";
import { DateTime } from "./DateTime";
import { SocialMessageContent } from "./SocialMessageContent";

export const SocialThreadCard: React.FC<{
  post: PostResult;
  style?: StyleProp<ViewStyle>;
  isPostConsultation?: boolean;
  refresh?: number;
  fadeInDelay?: number;
  onPressReply?: OnPressReplyType;
  allowTruncation?: boolean;
  isGovernance?: boolean;
}> = ({ post, style, isPostConsultation, fadeInDelay, isGovernance }) => {
  const [localPost, setLocalPost] = useState<PostResult>(post);
  const { mutate, isLoading: isReactLoading } =
    useTeritoriSocialFeedReactPostMutation({
      onSuccess(_data, variables) {
        const reactions = getUpdatedReactions(post, variables.msg.icon);

        setLocalPost({ ...localPost, reactions });
      },
    });

  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const authorId = getUserId(selectedNetworkId, localPost.post_by);
  const authorNSInfo = useNSUserInfo(authorId);
  const userInfo = useNSUserInfo(wallet?.userId);
  const navigation = useAppNavigation();
  const metadata: SocialFeedMetadata = JSON.parse(localPost.metadata);

  const hashtag = useMemo(() => {
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
                  id: authorId,
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
                  id: authorId,
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
                  id: authorId,
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
                  : localPost.post_by}
              </BrandText>
            </TouchableOpacity>

            {/*---- Date */}
            <DateTime date={metadata.createdAt} />
          </View>

          {/*---- Badges */}
          {!!hashtag && (
            <DotBadge
              label={hashtag.hashtag}
              dotColor={hashtag.color}
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
            <SpacerRow size={2.5} />
            <CommentsCount post={localPost} />

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
