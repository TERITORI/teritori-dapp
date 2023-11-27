import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { Dispatch, SetStateAction } from "react";

import { useSelectedNetworkInfo } from "./useSelectedNetwork";
import useSelectedWallet from "./useSelectedWallet";
import { Post } from "../api/feed/v1/feed";
import { signingSocialFeedClient } from "../client-creators/socialFeedClient";
import { TERITORI_FEED_ID } from "../components/socialFeed/const";
import { useTeritoriSocialFeedReactPostMutation } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { mustGetGnoNetwork, NetworkKind } from "../networks";
import { adenaDoContract } from "../utils/gno";
import { getUpdatedReactions } from "../utils/social-feed";

export const useSocialReactions = ({
  post,
  setPost,
}: {
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
}) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkId = selectedNetworkInfo?.id || "";
  const wallet = useSelectedWallet();
  const { mutate: postMutate, isLoading: isPostMutationLoading } =
    useTeritoriSocialFeedReactPostMutation({
      onSuccess(_data, variables) {
        const reactions = getUpdatedReactions(
          post.reactions,
          variables.msg.icon,
        );

        setPost({ ...post, reactions });
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
        ownState: true,
      });
    }
    setPost({ ...post, reactions });
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

  return { handleReaction, isPostMutationLoading };
};
