import { Dispatch, SetStateAction, useState } from "react";
import { View } from "react-native";

import { PostCommentCount } from "./PostCommentCount";
import { PostReactions } from "./PostReactions";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";

import { Post } from "@/api/feed/v1/feed";
import { Spinner } from "@/components/Spinner";
import { EmojiSelector } from "@/components/socialFeed/EmojiSelector";
import { TipButton } from "@/components/socialFeed/SocialActions/TipButton";
import { SpacerRow } from "@/components/spacer";
import { useSocialReactions } from "@/hooks/feed/useSocialReactions";
import { layout } from "@/utils/style/layout";

type CardFooterProps = {
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
};

export function PostActions({ post, setPost }: CardFooterProps) {
  const wallet = useSelectedWallet();
  const { handleReact, isReactLoading } = useSocialReactions({
    post,
    setPost,
  });
  const [loading, setLoading] = useState(false);

  const handleEmojiReactions = async (emoji: string) => {
    setLoading(true);
    await handleReact(emoji);
    setLoading(false);
  };

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
          onPressReaction={handleReact}
        />
        <SpacerRow size={0.75} />
        {loading || isReactLoading ? (
          <Spinner size={14} />
        ) : (
          <EmojiSelector
            onEmojiSelected={handleEmojiReactions}
            buttonStyle={{ marginRight: layout.spacing_x2 }}
          />
        )}
      </View>

      <TipButton
        disabled={post.authorId === wallet?.userId}
        amount={post.tipAmount}
        authorId={post.authorId}
        postId={post.id}
      />
    </View>
  );
}
