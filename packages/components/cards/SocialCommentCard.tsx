import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../hooks/useFetchComments";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { OnPressReplyType } from "../../screens/FeedPostView/FeedPostViewScreen";
import { useAppNavigation } from "../../utils/navigation";
import { DEFAULT_NAME, DEFAULT_USERNAME } from "../../utils/social-feed";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral77,
  neutralA3,
  primaryColor,
} from "../../utils/style/colors";
import {
  fontMedium13,
  fontSemibold13,
  fontSemibold16,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { replaceTextWithComponent } from "../../utils/text";
import { BrandText } from "../BrandText";
import { FilePreview } from "../FilePreview/FilePreview";
import { SocialReactionActions } from "../SocialReactionActions";
import { tinyAddress } from "../WalletSelector";
import { AnimationFadeIn } from "../animations";
import { PrimaryButtonOutline } from "../buttons/PrimaryButtonOutline";
import { AvatarWithFrame } from "../images/AvatarWithFrame";
import { SpacerColumn, SpacerRow } from "../spacer";
import { CommentsContainer } from "./CommentsContainer";

export interface SocialCommentCardProps {
  comment: PostResult;
  style?: StyleProp<ViewStyle>;
  isLast?: boolean;
  onPressReply?: OnPressReplyType;
  overrideParentId?: string;
  refresh?: number;
  isFirst?: boolean;
}

const MARGIN_HEIGHT = 56;

export const SocialCommentCard: React.FC<SocialCommentCardProps> = ({
  style,
  comment,
  isLast,
  onPressReply,
  overrideParentId,
  refresh,
  isFirst,
}) => {
  const imageMarginRight = layout.padding_x3_5;
  const navigation = useAppNavigation();
  const [replyShown, setReplyShown] = useState(false);
  const { data, refetch, fetchNextPage, hasNextPage, isFetching } =
    useFetchComments({
      parentId: comment.identifier,
      totalCount: comment.sub_post_length,
      enabled: replyShown,
    });
  const comments = useMemo(
    () => (data ? combineFetchCommentPages(data.pages) : []),
    [data]
  );
  const moreCommentsCount = comment.sub_post_length - comments.length;

  const metadata = JSON.parse(comment.metadata);
  const postByTNSMetadata = useTNSMetadata(comment?.post_by);
  const username = postByTNSMetadata?.metadata?.tokenId
    ? tinyAddress(postByTNSMetadata?.metadata?.tokenId || "", 19)
    : DEFAULT_USERNAME;

  const onShowReply = () => {
    if (replyShown) {
      if (hasNextPage) {
        fetchNextPage();
      }
    } else {
      setReplyShown(true);
    }
  };

  useEffect(() => {
    if (replyShown) {
      refetch();
    }
  }, [comment?.identifier, refresh]);

  return (
    <AnimationFadeIn>
      <View style={[styles.container, isFirst && { marginTop: MARGIN_HEIGHT }]}>
        <View style={styles.curvedLine} />
        {isLast && <View style={styles.extraLineHider} />}

        <View style={[styles.commentContainer, style]}>
          <AvatarWithFrame
            image={postByTNSMetadata?.metadata?.image}
            style={{
              marginRight: imageMarginRight,
            }}
            size={68}
            onPress={() =>
              navigation.navigate("UserPublicProfile", {
                id: `tori-${comment.post_by}`,
              })
            }
          />
          <View style={styles.content}>
            <View style={styles.detailsContainer}>
              <View style={styles.rowCenter}>
                <Pressable
                  onPress={() =>
                    navigation.navigate("PublicProfile", {
                      id: `tori-${comment.post_by}`,
                    })
                  }
                >
                  <BrandText style={fontSemibold16}>
                    {postByTNSMetadata?.metadata?.public_name || DEFAULT_NAME}
                  </BrandText>
                </Pressable>
                <SpacerRow size={1.5} />
                <Pressable
                  onPress={() =>
                    navigation.navigate("PublicProfile", {
                      id: `tori-${comment.post_by}`,
                    })
                  }
                >
                  <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                    @
                    {postByTNSMetadata?.metadata?.tokenId
                      ? tinyAddress(
                          postByTNSMetadata?.metadata?.tokenId || "",
                          19
                        )
                      : DEFAULT_USERNAME}
                  </BrandText>
                </Pressable>
              </View>

              <SpacerColumn size={1} />
              <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                {replaceTextWithComponent(
                  metadata.message,
                  /(@[\w&.-]+)/,
                  ({ match }) => (
                    <Pressable
                      onPress={() =>
                        navigation.navigate("PublicProfile", {
                          id: match.replace("@", ""),
                        })
                      }
                    >
                      <BrandText
                        style={[fontSemibold13, { color: primaryColor }]}
                      >
                        {match}
                      </BrandText>
                    </Pressable>
                  )
                )}
                {}
              </BrandText>
              {!!metadata.fileURL && <FilePreview fileURL={metadata.fileURL} />}
            </View>

            <View style={styles.actionContainer}>
              <BrandText style={[fontMedium13, { color: neutral77 }]}>
                {comment.post_by}
              </BrandText>
              <SocialReactionActions
                statStyle={styles.stat}
                isComment
                onPressReply={() =>
                  onPressReply &&
                  onPressReply(username, overrideParentId || comment.identifier)
                }
              />
            </View>
          </View>
        </View>
      </View>

      {comments && (
        <>
          <View style={styles.subCommentContainer}>
            {isLast && <View style={[styles.extraLineHider, { left: -61 }]} />}
            <CommentsContainer
              comments={comments}
              onPressReply={onPressReply}
              overrideParentId={comment.identifier}
            />
          </View>
        </>
      )}

      {isLast && overrideParentId ? null : (
        <AnimationFadeIn style={styles.footer}>
          {moreCommentsCount > 0 && (
            <PrimaryButtonOutline
              size="SM"
              text={`View Replies (${moreCommentsCount})`}
              onPress={onShowReply}
              isLoading={isFetching}
              width={200}
            />
          )}
        </AnimationFadeIn>
      )}
    </AnimationFadeIn>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    zIndex: 1,
    position: "relative",
    marginLeft: -1,
  },
  curvedLine: {
    width: 60,
    height: 10,
    marginTop: 70,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 30,
    borderColor: neutral22,
  },
  commentContainer: {
    paddingVertical: layout.padding_x3,
    paddingHorizontal: layout.padding_x3,
    borderRadius: 12,
    marginVertical: 0.5,
    borderColor: neutral33,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
  },
  content: { flex: 1 },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: MARGIN_HEIGHT,
  },
  detailsContainer: {},
  actionContainer: {
    borderTopWidth: 1,
    marginTop: layout.padding_x1_5,
    paddingTop: layout.padding_x1_5,
    borderColor: neutral22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: { backgroundColor: neutral22 },
  extraLineHider: {
    marginTop: 73,
    width: 1,
    height: "100%",
    backgroundColor: neutral00,
    zIndex: 1000,
    position: "absolute",
    left: 0,
  },
  subCommentContainer: {
    marginLeft: 60,
  },
});
