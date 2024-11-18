import React, { Dispatch, FC, SetStateAction } from "react";
import { View } from "react-native";

import FlexRow from "../../FlexRow";
import { SpacerRow } from "../../spacer";
import { EmojiSelector } from "../EmojiSelector";
import { CommentsCount } from "../SocialActions/CommentsCount";
import { nbReactionsShown, Reactions } from "../SocialActions/Reactions";
import { ReplyButton } from "../SocialActions/ReplyButton";
import { ReportButton } from "../SocialActions/ReportButton";
import { ShareButton } from "../SocialActions/ShareButton";
import { TipButton } from "../SocialActions/TipButton";

import { Post } from "@/api/feed/v1/feed";
import { useReactToPost } from "@/hooks/feed/useReactToPost";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkKind, getNetwork } from "@/networks";

// ====== Handle reactions, tip, comments
export const SocialCardFooter: FC<{
  cardWidth: number;
  isPostConsultation?: boolean;
  post: Post;
  handleReply?: () => void;
  refetchFeed?: () => Promise<any>;
  setPost: Dispatch<SetStateAction<Post>>;
}> = ({
  cardWidth,
  isPostConsultation,
  post,
  handleReply,
  setPost,
  refetchFeed,
}) => {
  const wallet = useSelectedWallet();
  const postNetwork = getNetwork(post.networkId);
  const { handleReact, isReactLoading } = useReactToPost({
    post,
    setPost,
  });

  return (
    <FlexRow justifyContent="flex-end">
      <Reactions
        nbShown={nbReactionsShown(cardWidth)}
        reactions={post.reactions}
        onPressReaction={handleReact}
        isLoading={isReactLoading}
      />

      <SpacerRow size={1.5} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          zIndex: -1,
        }}
      >
        <EmojiSelector
          onEmojiSelected={handleReact}
          isLoading={isReactLoading}
        />
        {isPostConsultation && handleReply && (
          <>
            <SpacerRow size={2} />
            <ReplyButton onPress={handleReply} />
          </>
        )}
        <SpacerRow size={2} />
        <CommentsCount count={post.subPostLength} />

        <SpacerRow size={2} />
        <TipButton
          disabled={post.authorId === wallet?.userId}
          amount={post.tipAmount}
          authorId={post.authorId}
          postId={post.id}
        />

        {postNetwork?.kind === NetworkKind.Gno && (
          <>
            <SpacerRow size={2} />
            <ReportButton refetchFeed={refetchFeed} postId={post.id} />
          </>
        )}

        <SpacerRow size={2} />
        <ShareButton postId={post.id} />
      </View>
    </FlexRow>
  );
};
