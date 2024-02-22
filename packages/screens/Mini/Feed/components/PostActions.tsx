import { Dispatch, SetStateAction } from "react";
import { View } from "react-native";

import { PostCommentCount } from "./PostCommentCount";
import { PostReactions } from "./PostReactions";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";

import { Post } from "@/api/feed/v1/feed";
import { EmojiSelector } from "@/components/socialFeed/EmojiSelector";
import { TipButton } from "@/components/socialFeed/SocialActions/TipButton";
import { SpacerRow } from "@/components/spacer";
import { useSocialReactions } from "@/hooks/feed/useSocialReactions";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { layout } from "@/utils/style/layout";

type CardFooterProps = {
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
};

export function PostActions({ post, setPost }: CardFooterProps) {
  const wallet = useSelectedWallet();
  const authorNSInfo = useNSUserInfo(post.authorId);
  const [, authorAddress] = parseUserId(post.authorId);
  const username = authorNSInfo?.metadata?.tokenId || authorAddress;
  const { handleReaction } = useSocialReactions({
    post,
    setPost,
  });

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <PostCommentCount count={post.subPostLength} />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <PostReactions
          reactions={post.reactions}
          onPressReaction={handleReaction}
        />
        <SpacerRow size={0.75} />
        <EmojiSelector
          onEmojiSelected={handleReaction}
          buttonStyle={{ marginRight: layout.spacing_x2 }}
        />
      </View>

      <TipButton
        disabled={post.authorId === wallet?.userId}
        amount={post.tipAmount}
        author={username}
        postId={post.identifier}
      />
    </View>
  );
}
