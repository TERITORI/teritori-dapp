import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import useSelectedWallet from "../../hooks/useSelectedWallet";
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
import { AvatarWithFrame } from "../images/AvatarWithFrame";
import { SpacerColumn, SpacerRow } from "../spacer";
import { CommentsContainer } from "./CommentsContainer";

export interface SocialCommentCardProps {
  comment: PostResult;
  style?: StyleProp<ViewStyle>;
  isLast?: boolean;
  onPressReply?: OnPressReplyType;
  overrideParentId?: string;
}

export const SocialCommentCard: React.FC<SocialCommentCardProps> = ({
  style,
  comment,
  isLast,
  onPressReply,
  overrideParentId,
}) => {
  const imageMarginRight = layout.padding_x3_5;
  const wallet = useSelectedWallet();
  const [subComments, setSubComments] = useState<PostResult[]>();
  const navigation = useAppNavigation();

  const metadata = JSON.parse(comment.metadata);
  const postByTNSMetadata = useTNSMetadata(comment?.post_by);
  const username = postByTNSMetadata?.metadata?.tokenId
    ? tinyAddress(postByTNSMetadata?.metadata?.tokenId || "", 19)
    : DEFAULT_USERNAME;

  const queryComments = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await socialFeedClient({
      walletAddress: wallet?.address,
    });

    const subCom = await client.querySubPosts({
      count: 5,
      from: 0,
      identifier: comment.identifier,
      sort: "asc",
    });

    setSubComments(subCom);
  };

  useEffect(() => {
    queryComments();
  }, [comment?.identifier]);

  return (
    <>
      <View style={styles.container}>
        {isLast && <View style={styles.extraLineHider} />}
        <View style={styles.curvedLine} />

        <View style={[styles.commentContainer, style]}>
          <AvatarWithFrame
            image={postByTNSMetadata?.metadata?.image}
            style={{
              marginRight: imageMarginRight,
            }}
            size={68}
          />
          <View style={styles.content}>
            <View style={styles.detailsContainer}>
              <View style={styles.rowCenter}>
                <BrandText style={fontSemibold16}>
                  {postByTNSMetadata?.metadata?.public_name || DEFAULT_NAME}
                </BrandText>
                <SpacerRow size={1.5} />
                <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                  @
                  {postByTNSMetadata?.metadata?.tokenId
                    ? tinyAddress(
                        postByTNSMetadata?.metadata?.tokenId || "",
                        19
                      )
                    : DEFAULT_USERNAME}
                </BrandText>
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
      {subComments && (
        <View style={styles.subCommentContainer}>
          <CommentsContainer
            comments={subComments}
            onPressReply={onPressReply}
            overrideParentId={comment.identifier}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    zIndex: 1000,
    position: "relative",
    marginLeft: -1,
    marginTop: 56,
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
    flex: 1,
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
