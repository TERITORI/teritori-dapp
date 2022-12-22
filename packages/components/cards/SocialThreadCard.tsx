import React, { useState } from "react";
import {
  StyleProp,
  View,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { useAppNavigation } from "../../utils/navigation";
import { DEFAULT_NAME, DEFAULT_USERNAME } from "../../utils/social-feed";
import {
  neutral15,
  neutral22,
  neutral77,
  neutralA3,
} from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { EmojiSelector } from "../EmojiSelector";
import { FilePreview } from "../FilePreview/FilePreview";
import { RichText } from "../RichText";
import { SocialActions, socialActionsHeight } from "../SocialActions";
import { tinyAddress } from "../WalletSelector";
import { AnimationFadeIn } from "../animations";
import { DotBadge } from "../badges/DotBadge";
import { AvatarWithFrame } from "../images/AvatarWithFrame";
import { CommentsContainer } from "./CommentsContainer";

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
}> = ({ post, style, singleView, isGovernance, refresh, fadeInDelay }) => {
  const [maxLayoutWidth, setMaxLayoutWidth] = useState(0);
  const imageMarginRight = layout.padding_x3_5;
  const tertiaryBoxPaddingHorizontal = layout.padding_x3;
  const { width: containerWidth } = useMaxResolution({
    responsive: true,
  });

  const postByTNSMetadata = useTNSMetadata(post.post_by);

  const wallet = useSelectedWallet();
  const [subPosts, setSubPosts] = useState([]);
  const navigation = useAppNavigation();

  const metadata = JSON.parse(post.metadata);

  const queryComments = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await socialFeedClient({
      walletAddress: wallet?.address,
    });

    const subPosts = await client.querySubPosts({
      count: 5,
      from: 0,
      identifier: post.identifier,
      sort: "asc",
    });

    setSubPosts(subPosts);
  };

  React.useEffect(() => {
    if (singleView) {
      queryComments();
    }
  }, [singleView, post?.identifier, refresh]);

  return (
    <AnimationFadeIn style={[style]} delay={fadeInDelay}>
      <View style={{ position: "relative" }}>
        <EmojiSelector containerStyle={styles.container} />
        <View
          style={[
            {
              backgroundColor: neutral15,
              paddingTop: layout.padding_x3,
              paddingHorizontal: tertiaryBoxPaddingHorizontal,
              paddingBottom: 52,
              borderRadius: 12,
            },
          ]}
        >
          <View style={{ flexDirection: "row", flex: 1 }}>
            <AvatarWithFrame
              image={postByTNSMetadata?.metadata?.image}
              style={{
                marginRight: imageMarginRight,
              }}
              size={getResponsiveAvatarSize(containerWidth)}
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
                        id: `tori-${post.post_by}`,
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
                </View>

                <DotBadge label="Gnolang" />
              </View>

              {!!metadata?.title && (
                <BrandText style={{ marginTop: layout.padding_x1 }}>
                  {metadata.title}
                </BrandText>
              )}

              <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                <RichText initialValue={metadata.message} readOnly />
              </BrandText>

              {!!metadata.fileURL && (
                <FilePreview
                  fileURL={metadata.fileURL}
                  maxWidth={maxLayoutWidth}
                />
              )}
              <View
                style={{
                  backgroundColor: neutral22,
                  width: "100%",
                  height: 1,
                  marginVertical: layout.padding_x2_5 / 2,
                }}
              />

              <BrandText style={[fontSemibold13, { color: neutral77 }]}>
                {post.post_by}
              </BrandText>
            </View>
          </View>
        </View>

        <SocialActions
          isGovernance={isGovernance}
          singleView={singleView}
          post={post}
          style={{
            position: "absolute",
            bottom: -socialActionsHeight / 2,
            alignSelf: "center",
          }}
        />
      </View>

      <CommentsContainer comments={subPosts} />
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
});
