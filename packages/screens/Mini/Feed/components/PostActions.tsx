import { Dispatch, SetStateAction } from "react";
import { View } from "react-native";

import { PostCommentCount } from "./PostCommentCount";
import { Post } from "../../../../api/feed/v1/feed";
import { TipButton } from "../../../../components/socialFeed/SocialActions/TipButton";
import { SpacerRow } from "../../../../components/spacer";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import { parseUserId } from "../../../../networks";

type CardFooterProps = {
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
};

export function PostActions({ post, setPost }: CardFooterProps) {
  const wallet = useSelectedWallet();
  const authorNSInfo = useNSUserInfo(post.authorId);
  const [, authorAddress] = parseUserId(post.authorId);
  const username = authorNSInfo?.metadata?.tokenId || authorAddress;

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        <SpacerRow size={1} />
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
