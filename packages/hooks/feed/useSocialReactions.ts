import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { Dispatch, SetStateAction } from "react";

import { useFeedPosting } from "./useFeedPosting";
import { useSelectedNetworkInfo } from "../useSelectedNetwork";
import useSelectedWallet from "../useSelectedWallet";

import { Post } from "@/api/feed/v1/feed";
import { signingSocialFeedClient } from "@/client-creators/socialFeedClient";
import { useWalletControl } from "@/context/WalletControlProvider";
import { useTeritoriSocialFeedReactPostMutation } from "@/contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { mustGetGnoNetwork, NetworkFeature, NetworkKind } from "@/networks";
import { TERITORI_FEED_ID } from "@/utils/feed/constants";
import { adenaDoContract } from "@/utils/gno";
import {
  DISLIKE_EMOJI,
  getUpdatedReactions,
  LIKE_EMOJI,
} from "@/utils/social-feed";
import { PostCategory } from "@/utils/types/feed";

export const useSocialReactions = ({
  post,
  setPost,
}: {
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
}) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkId = selectedNetworkInfo?.id || "";
  const selectedWallet = useSelectedWallet();
  const userId = selectedWallet?.userId;
  const { showNotEnoughFundsModal, showConnectWalletModal } =
    useWalletControl();
  const postCategory = PostCategory.Reaction;
  const { canPayForPost: canPayForReaction, publishingFee } = useFeedPosting(
    selectedNetworkId,
    userId,
    postCategory,
  );
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

    //Update reactions on post
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
  const gnoReaction = async (emoji: string, rpcEndpoint: string) => {
    const gnoNetwork = mustGetGnoNetwork(selectedNetworkId);
    const vmCall = {
      caller: selectedWallet?.address || "",
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
    const action =
      emoji === LIKE_EMOJI
        ? "Like"
        : emoji === DISLIKE_EMOJI
          ? "Dislike"
          : "React";

    if (!selectedWallet?.address || !selectedWallet.connected) {
      showConnectWalletModal({
        forceNetworkFeature: NetworkFeature.SocialFeed,
        action,
      });
      return;
    }
    if (!canPayForReaction) {
      showNotEnoughFundsModal({
        action,
        cost: {
          amount: publishingFee.amount.toString(),
          denom: publishingFee.denom || "",
        },
      });
      return;
    }
    if (selectedNetworkInfo?.kind === NetworkKind.Gno) {
      gnoReaction(emoji, selectedNetworkInfo?.endpoint || "");
    } else {
      cosmosReaction(emoji, selectedWallet.address);
    }
  };

  return { handleReaction, isPostMutationLoading };
};
