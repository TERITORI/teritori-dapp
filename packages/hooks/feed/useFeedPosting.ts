import { coin } from "@cosmjs/proto-signing";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useCreatePost } from "./useCreatePost";
import { useFeedPostFee } from "./useFeedPostFee";
import { useFreePostsCount } from "./useFreePostsCount";
import { signingSocialFeedClient } from "../../client-creators/socialFeedClient";
import {
  feedPostingStep,
  FeedPostingStepId,
} from "../../components/loaders/FeedPostingProgressBar";
import { PostCategory } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { TERITORI_FEED_ID } from "../../components/socialFeed/const";
import {
  parseUserId,
  getStakingCurrency,
  mustGetCosmosNetwork,
  NetworkKind,
} from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { defaultSocialFeedFee } from "../../utils/fee";
import { adenaDoContract } from "../../utils/gno";
import { useIsDAO } from "../cosmwasm/useCosmWasmContractInfo";
import { useDAOMakeProposal } from "../dao/useDAOMakeProposal";
import { useBalances } from "../useBalances";

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
  const balances = useBalances(networkId, userAddress);
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
    async (metadata: string, parentPostIdentifier?: string) => {
      if (!canPayForPost) {
        throw new Error("Not enough funds");
      }

      const networkId = network?.id;
      if (!networkId) {
        throw new Error("Invalid network");
      }

      const identifier = uuidv4();
      const msg = {
        category,
        identifier,
        metadata,
        parentPostIdentifier,
      };

      if (isDAO) {
        const network = mustGetCosmosNetwork(networkId);

        if (!network.socialFeedContractAddress) {
          throw new Error("Social feed contract address not found");
        }
        if (!userAddress) {
          throw new Error("Invalid sender");
        }
        setStep(feedPostingStep(FeedPostingStepId.PROPOSING));

        await makeProposal(userAddress, {
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
      } else {
        if (network?.kind === NetworkKind.Gno) {
          const vmCall = {
            caller: userAddress,
            send: "",
            pkg_path: network.socialFeedsPkgPath,
            func: "CreatePost",
            args: [
              TERITORI_FEED_ID,
              "0",
              msg.category.toString(),
              msg.metadata,
            ],
          };
          setStep(feedPostingStep(FeedPostingStepId.POSTING));

          const txHash = await adenaDoContract(
            network.id,
            [{ type: "/vm.m_call", value: vmCall }],
            { gasWanted: 2_000_000 },
          );

          const provider = new GnoJSONRPCProvider(network.endpoint);
          await provider.waitForTransaction(txHash);
          setStep(feedPostingStep(FeedPostingStepId.DONE));
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
      network,
      postFee,
      userAddress,
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
