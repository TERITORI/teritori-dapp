import React, { useMemo, useState } from "react";
import {
  StyleProp,
  View,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { SendFundModal } from "../../components/modals/teritoriNameService/TNSSendFundsModal";
import { useTNS } from "../../context/TNSProvider";
import { useTeritoriSocialFeedReactPostMutation } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { OnPressReplyType } from "../../screens/FeedPostView/FeedPostViewScreen";
import { useAppNavigation } from "../../utils/navigation";
import {
  DEFAULT_NAME,
  DEFAULT_USERNAME,
  getUpdatedReactions,
} from "../../utils/social-feed";
import { getCommunityHashtag } from "../../utils/socialFeedCommunityHashtags";
import { neutral15, neutral22, neutral77 } from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tokenWithoutTld } from "../../utils/tns";
import { BrandText } from "../BrandText";
import { DateTime } from "../DateTime";
import { EmojiSelector } from "../EmojiSelector";
import { SocialFeedMetadata } from "../NewsFeed/NewsFeed.type";
import { SocialActions, socialActionsHeight } from "../SocialActions";
import { SocialReactionActions } from "../SocialReactionActions";
import { SocialThreadContent } from "../SocialThread/SocialThreadContent";
import { tinyAddress } from "../WalletSelector";
import { AnimationFadeIn } from "../animations";
import { DotBadge } from "../badges/DotBadge";
import { AvatarWithFrame } from "../images/AvatarWithFrame";

export const getResponsiveAvatarSize = (width: number) => {
  if (width >= 992) {
    return 92;
  } else if (width >= 768) {
    return 48;
  } else if (width >= 576) {
    return 32;
  } else {
    return 24;
  }
};

export const SocialThreadCard: React.FC<{
  post: PostResult;
  style?: StyleProp<ViewStyle>;
  singleView?: boolean;
  isGovernance?: boolean;
  refresh?: number;
  fadeInDelay?: number;
  onPressReply?: OnPressReplyType;
  allowTruncation?: boolean;
}> = ({
  post,
  style,
  singleView,
  isGovernance,
  fadeInDelay,
  allowTruncation,
}) => {
  const [localPost, setLocalPost] = useState(post);
  const { setName } = useTNS();
  const imageMarginRight = layout.padding_x3_5;
  const tertiaryBoxPaddingHorizontal = layout.padding_x3;
  const { width: containerWidth } = useMaxResolution();
  const { mutate, isLoading: isReactLoading } =
    useTeritoriSocialFeedReactPostMutation({
      onSuccess(_data, variables) {
        const reactions = getUpdatedReactions(post, variables.msg.icon);

        setLocalPost({ ...localPost, reactions });
      },
    });

  const [sendFundsModalVisible, setSendFundsModalVisible] = useState(false);
  const wallet = useSelectedWallet();

  const postByTNSMetadata = useTNSMetadata(localPost.post_by);

  const navigation = useAppNavigation();

  const metadata: SocialFeedMetadata = JSON.parse(localPost.metadata);

  const hashtag = useMemo(() => {
    return getCommunityHashtag(metadata?.hashtags || []);
  }, [metadata]);

  const currentUserMetadata = useTNSMetadata(wallet?.address);
  const handlePressTip = () => {
    setName(tokenWithoutTld(postByTNSMetadata?.metadata?.tokenId || ""));
    setSendFundsModalVisible(true);
  };

  const handleReaction = async (e: string) => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await socialFeedClient({
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

  return (
    <AnimationFadeIn style={[style]} delay={fadeInDelay}>
      <Pressable
        style={{ position: "relative" }}
        onPress={() =>
          navigation.navigate("FeedPostView", { id: post.identifier })
        }
      >
        <View
          style={[
            {
              backgroundColor: neutral15,
              paddingTop: layout.padding_x3,
              paddingHorizontal: tertiaryBoxPaddingHorizontal,
              paddingBottom: singleView ? layout.padding_x3 : 52,
              borderRadius: 12,
            },
          ]}
        >
          <View style={{ flexDirection: "row", flex: 1 }}>
            <AvatarWithFrame
              onPress={() =>
                navigation.navigate("UserPublicProfile", {
                  id: `tori-${localPost.post_by}`,
                })
              }
              image={postByTNSMetadata?.metadata?.image}
              style={{
                marginRight: imageMarginRight,
              }}
              size={singleView ? 68 : getResponsiveAvatarSize(containerWidth)}
              isLoading={postByTNSMetadata.loading}
            />

            <View
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("PublicProfile", {
                        id: `tori-${localPost.post_by}`,
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <AnimationFadeIn>
                      <BrandText
                        style={[
                          fontSemibold16,
                          {
                            textTransform: "uppercase",
                          },
                        ]}
                      >
                        {postByTNSMetadata?.metadata?.public_name ||
                          DEFAULT_NAME}
                      </BrandText>
                    </AnimationFadeIn>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("PublicProfile", {
                        id: `tori-${localPost.post_by}`,
                      })
                    }
                  >
                    <BrandText
                      style={[
                        fontSemibold14,
                        {
                          marginLeft: layout.padding_x1_5,
                          color: neutral77,
                        },
                      ]}
                    >
                      @
                      {postByTNSMetadata?.metadata?.tokenId
                        ? tinyAddress(
                            postByTNSMetadata?.metadata?.tokenId || "",
                            19
                          )
                        : DEFAULT_USERNAME}
                    </BrandText>
                  </TouchableOpacity>
                  <DateTime date={metadata.createdAt} />
                </View>

                {!!hashtag && (
                  <DotBadge label={hashtag.hashtag} dotColor={hashtag.color} />
                )}
              </View>
              <SocialThreadContent
                metadata={metadata}
                type={localPost.category}
              />
              <View style={styles.actionContainer}>
                <BrandText style={[fontSemibold13, { color: neutral77 }]}>
                  {localPost.post_by}
                </BrandText>
                {singleView && (
                  <SocialReactionActions
                    commentCount={localPost.sub_post_length}
                    onPressTip={handlePressTip}
                    reactions={localPost.reactions}
                    onPressReaction={handleReaction}
                    showEmojiSelector
                    isReactionLoading={isReactLoading}
                    isTippable={
                      postByTNSMetadata.metadata?.tokenId !==
                      currentUserMetadata?.metadata?.tokenId
                    }
                  />
                )}
              </View>
            </View>
          </View>
        </View>

        {!singleView && (
          <SocialActions
            onPressTip={handlePressTip}
            onPressReaction={handleReaction}
            isGovernance={isGovernance}
            isTippable={
              postByTNSMetadata.metadata?.tokenId !==
              currentUserMetadata?.metadata?.tokenId
            }
            singleView={singleView}
            post={localPost}
            style={{
              position: "absolute",
              bottom: -socialActionsHeight / 2,
              alignSelf: "center",
            }}
            isReactionLoading={isReactLoading}
          />
        )}

        {!singleView && (
          <EmojiSelector
            containerStyle={styles.container}
            onEmojiSelected={handleReaction}
            isLoading={isReactLoading}
          />
        )}
        <SendFundModal
          onClose={() => {
            setName("");
            setSendFundsModalVisible(false);
          }}
          visible={sendFundsModalVisible}
        />
      </Pressable>
    </AnimationFadeIn>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 9,
  },

  actionContainer: {
    borderTopWidth: 1,
    paddingTop: layout.padding_x1_5,
    borderColor: neutral22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
