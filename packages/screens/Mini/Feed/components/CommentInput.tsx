import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { Post } from "../../../../api/feed/v1/feed";
import { BrandText } from "../../../../components/BrandText";
import { UserAvatarWithFrame } from "../../../../components/images/AvatarWithFrame";
import {
  PostCategory,
  ReplyToType,
} from "../../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { generatePostMetadata } from "../../../../components/socialFeed/NewsFeed/NewsFeedQueries";
import { NotEnoughFundModal } from "../../../../components/socialFeed/NewsFeed/NotEnoughFundModal";
import { SpacerColumn, SpacerRow } from "../../../../components/spacer";
import { useFeedPosting } from "../../../../hooks/feed/useFeedPosting";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import {
  SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT,
  hashtagMatch,
  mentionMatch,
} from "../../../../utils/social-feed";
import { neutral77, secondaryColor } from "../../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../../utils/style/fonts";
import { CustomButton } from "../../components/CustomButton";

const INPUT_MIN_HEIGHT = 20;
const INPUT_MAX_HEIGHT = 400;

type Props = {
  post: Post;
  count: number;
  networkId: string;
  onComment?: () => void;
};

export const CommentInput = ({ count, networkId, post, onComment }: Props) => {
  const wallet = useSelectedWallet();

  const [replyTo, setReplyTo] = useState<ReplyToType>();
  const [newComment, setNewComment] = useState("");
  const [isCreateCommentLoading, setCreateCommentLoading] = useState(false);
  const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);
  const inputHeight = useSharedValue(INPUT_MIN_HEIGHT);

  const { makePost, canPayForPost, isProcessing } = useFeedPosting(
    networkId,
    wallet?.userId,
    PostCategory.Comment,
    () => {
      setNewComment("");
      setReplyTo(undefined);
      if (onComment) {
        onComment();
      }
    },
  );
  const handleNewCommentTextChange = (text: string) => {
    // Comments are blocked at 2500
    if (text.length > SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT) return;
    setNewComment(text);
  };

  const handleSubmitComment = async () => {
    if (!canPayForPost) {
      setNotEnoughFundModal(true);
      return;
    }
    setCreateCommentLoading(true);
    try {
      const hasUsername =
        replyTo?.parentId && newComment.includes(`@${replyTo.username}`);
      // ---- Adding hashtag texts or mentioned texts to the metadata
      const mentions: string[] = [];
      mentionMatch(newComment)?.map((item) => {
        //TODO: Check NS token id before sending mentioned text ?

        mentions.push(item);
      });
      const hashtags: string[] = [];
      hashtagMatch(newComment)?.map((item) => {
        hashtags.push(item);
      });
      // ---- Adding hashtag or mentioned user at the end of the message and to the metadata
      const finalMessage = newComment || "";

      const metadata = generatePostMetadata({
        title: "",
        message: finalMessage,
        files: [],
        hashtags,
        mentions,
        gifs: [],
      });

      await makePost(
        JSON.stringify(metadata),
        hasUsername ? replyTo?.parentId : post.identifier,
      );
    } catch (err) {
      console.error("post submit err", err);
    }
    setCreateCommentLoading(false);
  };
  const isCreateBtnDisabled =
    !wallet || !newComment || isCreateCommentLoading || isProcessing;

  return (
    <View>
      <View>
        <BrandText style={fontSemibold16}>{count} comments</BrandText>
        <SpacerColumn size={1.5} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <UserAvatarWithFrame userId={wallet?.userId} size="S" />
          <SpacerRow size={1} />
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TextInput
              value={newComment}
              placeholder="Leave your comment here"
              placeholderTextColor={neutral77}
              onChangeText={handleNewCommentTextChange}
              multiline
              onContentSizeChange={(e) => {
                if (e.nativeEvent.contentSize.height < INPUT_MAX_HEIGHT) {
                  inputHeight.value = e.nativeEvent.contentSize.height;
                }
              }}
              style={[
                fontSemibold14,
                {
                  height: newComment
                    ? inputHeight.value || INPUT_MIN_HEIGHT
                    : INPUT_MIN_HEIGHT,
                  //   width: "100%",
                  flex: 1,
                  color: secondaryColor,
                },
              ]}
            />
            <CustomButton
              onPress={handleSubmitComment}
              title="Comment"
              size="small"
              width={100}
              style={{}}
              isDisabled={isCreateBtnDisabled}
            />
          </View>
        </View>
      </View>
      {isNotEnoughFundModal && (
        <NotEnoughFundModal
          visible
          onClose={() => setNotEnoughFundModal(false)}
        />
      )}
    </View>
  );
};
