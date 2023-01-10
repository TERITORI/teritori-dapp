import moment from "moment";
import React, { useState } from "react";
import {
  StyleProp,
  View,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
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
import {
  neutral15,
  neutral22,
  neutral77,
  neutralA3,
} from "../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tokenWithoutTld } from "../../utils/tns";
import { BrandText } from "../BrandText";
import { EmojiSelector } from "../EmojiSelector";
import { FilePreview } from "../FilePreview/FilePreview";
import { RichText } from "../RichText";
import { SocialActions, socialActionsHeight } from "../SocialActions";
import { SocialReactionActions } from "../SocialReactionActions";
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
}> = ({ post, style, singleView, isGovernance, fadeInDelay }) => {
  const [localPost, setLocalPost] = useState(post);
  const [maxLayoutWidth, setMaxLayoutWidth] = useState(0);
  const { setName } = useTNS();
  const imageMarginRight = layout.padding_x3_5;
  const tertiaryBoxPaddingHorizontal = layout.padding_x3;
  const { width: containerWidth } = useMaxResolution({
    responsive: true,
  });
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

  const metadata = JSON.parse(localPost.metadata);

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
      <View style={{ position: "relative" }}>
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
              onLayout={(e) => setMaxLayoutWidth(e.nativeEvent.layout.width)}
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
                  <BrandText
                    style={[
                      fontSemibold12,
                      {
                        marginLeft: layout.padding_x1_5,
                      },
                    ]}
                  >
                    {moment(metadata.createdAt).local().fromNow()}
                  </BrandText>
                </View>

                <DotBadge label="Gnolang" />
              </View>

              {!!metadata?.title && (
                <BrandText style={{ marginTop: layout.padding_x1 }}>
                  {metadata.title}
                </BrandText>
              )}

              <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                <RichText
                  initialValue={metadata.message}
                  openGraph={metadata.openGraph}
                  readOnly
                />
              </BrandText>

              {!!metadata.fileURL && (
                <FilePreview
                  fileURL={metadata.fileURL}
                  maxWidth={maxLayoutWidth}
                />
              )}

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
      </View>
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
