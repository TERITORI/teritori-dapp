import { useQuery } from "@tanstack/react-query";

import {
  Cw2981QueryMsg,
  Cw721MembershipQueryClient,
} from "@/contracts-clients/cw721-membership";
import { mustGetNonSigningCosmWasmClient, parseCollectionId } from "@/networks";

const royaltyQueryRange = 1000000;

export const useCw2981RoyaltyInfo = (
  collectionId: string | undefined,
  tokenId: string | undefined,
) => {
  return useQuery(
    ["cw2981-royalty-info", collectionId, tokenId],
    async () => {
      if (!collectionId || !tokenId) {
        return 0;
      }

      const [network, mintContractAddress] = parseCollectionId(collectionId);
      if (!network) {
        return 0;
      }

      const client = await mustGetNonSigningCosmWasmClient(network.id);

      const getRoyaltyGain = async (contractAddress: string) => {
        const cwClient = new Cw721MembershipQueryClient(
          client,
          contractAddress,
        );
        let res;
        try {
          const checkRes = await cwClient.extension({
            msg: { check_royalties: {} },
          });
          if (!("royalty_payments" in checkRes)) {
            throw new Error("check_royalties response is invalid");
          }
          if (!checkRes.royalty_payments) {
            throw new Error("royalties are not supported");
          }
          res = await cwClient.extension({
            msg: {
              royalty_info: {
                token_id: tokenId,
                sale_price: royaltyQueryRange.toString(),
              },
            },
          });
        } catch (err) {
          try {
            // early teritori collections use this non-standard query
            res = await cwClient.extension({
              msg: {
                RoyaltyInfo: {
                  token_id: tokenId,
                  sale_price: royaltyQueryRange.toString(),
                },
              } as unknown as Cw2981QueryMsg,
            });
          } catch {
            throw err;
          }
        }
        if (!("royalty_amount" in res) || !res.royalty_amount) {
          throw new Error("royalty_info response is invalid");
        }
        return +res.royalty_amount / royaltyQueryRange;
      };

      try {
        return await getRoyaltyGain(mintContractAddress);
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.includes("unknown variant `extension`")
        ) {
          const conf = await client.queryContractSmart(mintContractAddress, {
            config: {},
          });

          const nftContractAddr = conf.nft_addr || conf.child_contract_addr;
          return await getRoyaltyGain(nftContractAddr);
        }
        throw err;
      }
    },
    {
      enabled: !!collectionId,
      staleTime: Infinity,
    },
  );
};
