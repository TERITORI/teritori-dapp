import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { View } from "react-native";

import { Post } from "../../../api/feed/v1/feed";
import { signingSocialFeedClient } from "../../../client-creators/socialFeedClient";
import { useTeritoriSocialFeedReactPostMutation } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { mustGetGnoNetwork, NetworkKind, parseUserId } from "../../../networks";
import { adenaDoContract } from "../../../utils/gno";
import { getUpdatedReactions } from "../../../utils/social-feed";
import FlexRow from "../../FlexRow";
import { SpacerRow } from "../../spacer";
import { EmojiSelector } from "../EmojiSelector";
import { CommentsCount } from "../SocialActions/CommentsCount";
import { FlagButton } from "../SocialActions/FlagButton";
import { nbReactionsShown, Reactions } from "../SocialActions/Reactions";
import { ReplyButton } from "../SocialActions/ReplyButton";
import { ShareButton } from "../SocialActions/ShareButton";
import { TipButton } from "../SocialActions/TipButton";
import { TERITORI_FEED_ID } from "../const";

// ====== Handle reactions, tip, comments
export const SocialCardFooter: FC<{
  cardWidth: number;
  isPostConsultation?: boolean;
  post: Post;
  handleReply?: () => void;
  refetchFeed?: () => Promise<any>;
  setLocalPost: Dispatch<SetStateAction<Post>>;
}> = ({
  cardWidth,
  isPostConsultation,
  post,
  handleReply,
  setLocalPost,
  refetchFeed,
}) => {
  const wallet = useSelectedWallet();
  const authorNSInfo = useNSUserInfo(post.authorId);
  const [, authorAddress] = parseUserId(post.authorId);
  const username = authorNSInfo?.metadata?.tokenId || authorAddress;
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkId = selectedNetworkInfo?.id || "";
  const { mutate: postMutate, isLoading: isPostMutationLoading } =
    useTeritoriSocialFeedReactPostMutation({
      onSuccess(_data, variables) {
        const reactions = getUpdatedReactions(
          post.reactions,
          variables.msg.icon,
        );

        setLocalPost({ ...post, reactions });
      },
    });

  const cosmosReaction = async (emoji: string, walletAddress: string) => {
    const client = await signingSocialFeedClient({
      networkId: selectedNetworkId,
      walletAddress,
    });

    postMutate({
      client,
      msg: {
        icon: emoji,
        identifier: post.identifier,
        up: true,
      },
    });
  };

  const gnoReaction = async (emoji: string, rpcEndpoint: string) => {
    const gnoNetwork = mustGetGnoNetwork(selectedNetworkId);
    const vmCall = {
      caller: wallet?.address || "",
      send: "",
      pkg_path: gnoNetwork.socialFeedsPkgPath,
      func: "ReactPost",
      args: [TERITORI_FEED_ID, post.identifier, emoji, "true"],
    };
    const txHash = await adenaDoContract(
      selectedNetworkId,
      [{ type: "/vm.m_call", value: vmCall }],
      {
        gasWanted: 2_000_000,
      },
    );
    const provider = new GnoJSONRPCProvider(rpcEndpoint);
    // Wait for tx done
    await provider.waitForTransaction(txHash);
    const reactions = [...post.reactions];
    const currentReactionIdx = reactions.findIndex((r) => r.icon === emoji);

    if (currentReactionIdx > -1) {
      reactions[currentReactionIdx].count++;
    } else {
      reactions.push({
        icon: emoji,
        count: 1,
      });
    }
    setLocalPost({ ...post, reactions });
  };

  const handleReaction = async (emoji: string) => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    if (selectedNetworkInfo?.kind === NetworkKind.Gno) {
      gnoReaction(emoji, selectedNetworkInfo?.endpoint || "");
    } else {
      cosmosReaction(emoji, wallet.address);
    }
  };

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
            <FlagButton refetchFeed={refetchFeed} postId={post.identifier} />
          </>
        )}

        {isPostConsultation && (
          <>
            <SpacerRow size={2} />
            <ShareButton postId={post.identifier} />
          </>
        )}
      </View>
    </FlexRow>
  );
};
