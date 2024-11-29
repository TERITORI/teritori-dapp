import { coin } from "@cosmjs/proto-signing";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { Buffer } from "buffer";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useCreatePost } from "./useCreatePost";
import { useFeedPostFee } from "./useFeedPostFee";
import { useFreePostsCount } from "./useFreePostsCount";
import { useIsDAO } from "../cosmwasm/useCosmWasmContractInfo";
import { useDAOMakeProposal } from "../dao/useDAOMakeProposal";
import { useBalances } from "../useBalances";
import useSelectedWallet from "../useSelectedWallet";

import { signingSocialFeedClient } from "@/client-creators/socialFeedClient";
import { TeritoriSocialFeedCreatePostMutation } from "@/contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import {
  getStakingCurrency,
  mustGetCosmosNetwork,
  NetworkKind,
  parseNetworkObjectId,
  parseUserId,
} from "@/networks";
import { prettyPrice } from "@/utils/coins";
import { defaultSocialFeedFee } from "@/utils/fee";
import { TERITORI_FEED_ID } from "@/utils/feed/constants";
import { feedPostingStep, FeedPostingStepId } from "@/utils/feed/posting";
import { adenaDoContract, AdenaDoContractMessageType } from "@/utils/gno";
import {
  GnoCreatePostMessage,
  GnoSingleChoiceProposal,
} from "@/utils/gnodao/messages";
import { PostCategory } from "@/utils/types/feed";

export const useFeedPosting = (
  networkId: string | undefined,
  userId: string | undefined,
  category: PostCategory,
  onSuccess?: () => void,
) => {
  const [network, userAddress] = parseUserId(userId);
  if (network) {
    networkId = network.id;
  }
  const [step, setStep] = useState(
    feedPostingStep(FeedPostingStepId.UNDEFINED),
  );

  const selectedWallet = useSelectedWallet();
  const { balances } = useBalances(networkId, userAddress);
  const { postFee } = useFeedPostFee(networkId, category);
  const { freePostCount } = useFreePostsCount(userId, category);
  const { isDAO } = useIsDAO(userId);
  const makeProposal = useDAOMakeProposal(isDAO ? userId : undefined);
  const { mutateAsync, isLoading: isProcessing } = useCreatePost({
    onMutate: () => {},
    onSuccess,
  });

  const feeCurrency = getStakingCurrency(networkId);
  const feeBalance = balances.find((bal) => bal.denom === feeCurrency?.denom);

  const canPayForPost =
    freePostCount > 0 || postFee <= Number(feeBalance?.amount || "0");

  const makePost = useCallback(
    async (metadata: string, parentPostId?: string) => {
      if (!canPayForPost) {
        throw new Error("Not enough funds");
      }

      const networkId = network?.id;
      if (!networkId) {
        throw new Error("Invalid network");
      }

      const [parentPostNetwork, parentPostLocalIdentifier] =
        parseNetworkObjectId(parentPostId);
      if (parentPostId && (!parentPostNetwork || !parentPostLocalIdentifier)) {
        throw new Error("Invalid parent post ID");
      }

      // FIXME: use id generated on-chain
      const identifier = uuidv4();

      const parentPostIdentifier = parentPostLocalIdentifier || undefined;
      const msg: TeritoriSocialFeedCreatePostMutation["msg"] = {
        category,
        identifier,
        metadata,
        parentPostIdentifier,
      };

      if (isDAO) {
        if (network?.kind === NetworkKind.Gno) {
          if (!selectedWallet) {
            throw new Error("No wallet selected");
          }

          const msg: GnoCreatePostMessage = {
            type: "gno.land/r/teritori/social_feeds.CreatePost",
            payload: {
              feedId: TERITORI_FEED_ID,
              parentId: "0",
              category: category.toString(),
              metadata,
            },
          };

          const propReq: GnoSingleChoiceProposal = {
            title: "Post on feed",
            description: JSON.stringify(msg),
            messages: [msg],
          };

          setStep(feedPostingStep(FeedPostingStepId.PROPOSING));
          const vmCall = {
            caller: selectedWallet.address,
            send: "",
            pkg_path: userAddress,
            func: "ProposeJSON",
            args: ["0", JSON.stringify(propReq)],
          };
          await adenaDoContract(
            network.id,
            [{ type: AdenaDoContractMessageType.CALL, value: vmCall }],
            { gasWanted: 20_000_000 },
          );
          setStep(feedPostingStep(FeedPostingStepId.DONE));
          onSuccess && onSuccess();
        } else {
          const network = mustGetCosmosNetwork(networkId);

          if (!network.socialFeedContractAddress) {
            throw new Error("Social feed contract address not found");
          }
          if (!selectedWallet || !selectedWallet.address) {
            throw new Error("Invalid sender");
          }
          setStep(feedPostingStep(FeedPostingStepId.PROPOSING));

          await makeProposal(selectedWallet.address, {
            title: "Post on feed",
            description: "",
            msgs: [
              {
                wasm: {
                  execute: {
                    contract_addr: network.socialFeedContractAddress,
                    msg: Buffer.from(
                      JSON.stringify({ create_post: msg }),
                    ).toString("base64"),
                    funds: [{ amount: postFee.toString(), denom: "utori" }],
                  },
                },
              },
            ],
          });
          setStep(feedPostingStep(FeedPostingStepId.DONE));
        }
      } else {
        if (network?.kind === NetworkKind.Gno) {
          const vmCall = {
            caller: userAddress,
            send: "",
            pkg_path: network.socialFeedsPkgPath,
            func: "CreatePost",
            args: [
              TERITORI_FEED_ID,
              parentPostLocalIdentifier || "0",
              msg.category.toString(),
              msg.metadata,
            ],
          };
          setStep(feedPostingStep(FeedPostingStepId.POSTING));

          const txHash = await adenaDoContract(
            network.id,
            [{ type: AdenaDoContractMessageType.CALL, value: vmCall }],
            { gasWanted: 2_000_000 },
          );

          const provider = new GnoJSONRPCProvider(network.endpoint);
          await provider.waitForTransaction(txHash);
          setStep(feedPostingStep(FeedPostingStepId.DONE));
          onSuccess && onSuccess();
        } else {
          setStep(feedPostingStep(FeedPostingStepId.POSTING));

          const client = await signingSocialFeedClient({
            networkId: network?.id,
            walletAddress: userAddress,
          });
          await mutateAsync({
            client,
            msg,
            args: {
              fee: defaultSocialFeedFee,
              memo: "",
              funds: [coin(postFee, "utori")],
            },
          });
          setStep(feedPostingStep(FeedPostingStepId.DONE));
        }
      }
    },
    [
      canPayForPost,
      category,
      isDAO,
      makeProposal,
      mutateAsync,
      onSuccess,
      network,
      postFee,
      userAddress,
      selectedWallet,
    ],
  );

  return {
    canPayForPost,
    makePost,
    isProcessing,
    publishingFee: { networkId, amount: postFee, denom: feeCurrency?.denom },
    prettyPublishingFee: prettyPrice(
      networkId,
      postFee.toString(),
      feeCurrency?.denom,
    ),
    freePostCount,
    feeBalance,
    prettyFeeBalance: prettyPrice(
      networkId,
      feeBalance?.amount || "0",
      feeCurrency?.denom,
    ),
    step,
    setStep,
  };
};
