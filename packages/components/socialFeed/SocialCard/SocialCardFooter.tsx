import React, { Dispatch, FC, SetStateAction } from "react";
import { View } from "react-native";

import { Post } from "../../../api/feed/v1/feed";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { useSocialReactions } from "../../../hooks/useSocialReactions";
import { NetworkKind, parseUserId } from "../../../networks";
import FlexRow from "../../FlexRow";
import { SpacerRow } from "../../spacer";
import { EmojiSelector } from "../EmojiSelector";
import { CommentsCount } from "../SocialActions/CommentsCount";
import { nbReactionsShown, Reactions } from "../SocialActions/Reactions";
import { ReplyButton } from "../SocialActions/ReplyButton";
import { ReportButton } from "../SocialActions/ReportButton";
import { ShareButton } from "../SocialActions/ShareButton";
import { TipButton } from "../SocialActions/TipButton";

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
  const authorNSInfo = useNSUserInfo(post.authorId);
  const [, authorAddress] = parseUserId(post.authorId);
  const username = authorNSInfo?.metadata?.tokenId || authorAddress;
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const { handleReaction, isPostMutationLoading } = useSocialReactions({
    post,
    setPost,
  });

  return (
    <FlexRow justifyContent="flex-end">
      <Reactions
        nbShown={nbReactionsShown(cardWidth)}
        reactions={post.reactions}
        onPressReaction={handleReaction}
        isLoading={isPostMutationLoading}
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
          onEmojiSelected={handleReaction}
          isLoading={isPostMutationLoading}
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
          author={username}
          postId={post.identifier}
        />

        {selectedNetworkInfo?.kind === NetworkKind.Gno && (
          <>
            <SpacerRow size={2} />
            <ReportButton refetchFeed={refetchFeed} postId={post.identifier} />
          </>
        )}

        <SpacerRow size={2} />
        <ShareButton postId={post.identifier} />
      </View>
    </FlexRow>
  );
};
