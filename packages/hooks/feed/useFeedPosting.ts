import { coin } from "@cosmjs/proto-signing";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { useCreatePost } from "./useCreatePost";
import { useFeedPostFee } from "./useFeedPostFee";
import { signingSocialFeedClient } from "../../client-creators/socialFeedClient";
import { PostCategory } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { TERITORI_FEED_ID } from "../../components/socialFeed/const";
import { parseUserId, mustGetCosmosNetwork, NetworkKind } from "../../networks";
import { defaultSocialFeedFee } from "../../utils/fee";
import { adenaDoContract } from "../../utils/gno";
import { useIsDAO } from "../cosmwasm/useCosmWasmContractInfo";
import { useDAOMakeProposal } from "../dao/useDAOMakeProposal";

interface UseFeedPostingParams {
  networkId?: string;
  userId?: string;
  postCategory: PostCategory;
  onSuccess?: () => void;
}

export const useFeedPosting = ({
  networkId,
  userId,
  postCategory,
  onSuccess,
}: UseFeedPostingParams) => {
  const [network, userAddress] = parseUserId(userId);
  if (network) {
    networkId = network.id;
  }
  const { postFee } = useFeedPostFee(networkId, postCategory);
  const { isDAO } = useIsDAO(userId);
  const makeProposal = useDAOMakeProposal(isDAO ? userId : undefined);
  const { mutateAsync, isLoading: isProcessing } = useCreatePost({
    onSuccess,
  });

  const processFeedPosting = useCallback(
    async (metadata: string, parentPostIdentifier?: string) => {
      const networkId = network?.id;
      if (!networkId) {
        throw new Error("Invalid network");
      }

      const identifier = uuidv4();
      const msg = {
        category: postCategory,
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

          const txHash = await adenaDoContract(
            network.id,
            [{ type: "/vm.m_call", value: vmCall }],
            { gasWanted: 2_000_000 },
          );

          const provider = new GnoJSONRPCProvider(network.endpoint);
          await provider.waitForTransaction(txHash);
        } else {
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
        }
      }
    },
    [
      postCategory,
      isDAO,
      makeProposal,
      mutateAsync,
      network,
      postFee,
      userAddress,
    ],
  );

  return {
    processFeedPosting,
    isProcessing,
  };
};
