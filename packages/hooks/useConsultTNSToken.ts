import { useEffect, useState } from "react";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

export const useConsultTNSToken = (name: string) => {
  const [loading, setLoading] = useState(false);
  const [tokenExtension, setTokenExtension] =
    useState<TeritoriNameServiceQueryClient>();
  const { setToastError } = useFeedbacks();

  useEffect(() => {
    const getToken = async () => {
      setLoading(true);

      const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string;
      // We just want to read, so we use a non-signing client
      const cosmWasmClient = await getNonSigningCosmWasmClient();
      try {
        // If this query fails it means that the token does not exist.
        const token = await cosmWasmClient.queryContractSmart(contract, {
          nft_info: {
            token_id: name + process.env.TLD,
          },
        });
        console.log("========== token", token);
        return token.extension;
      } catch {
        // ---- If here, "cannot contract", probably because not found, so the token is considered as available
        return undefined;
      }
    };

    getToken()
      .then((tokenExtension) => {
        console.log("========== tokenExtension", tokenExtension);
        if (tokenExtension) setTokenExtension(tokenExtension);
        setLoading(false);
      })
      .catch((e) => {
        console.warn("ERROR getToken() : ", e);
        setLoading(false);
        setToastError({
          title: "Something went wrong!",
          message: e.message,
        });
      });
  }, [name]);

  return { loading, tokenExtension };
};
