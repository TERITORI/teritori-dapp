// Query the name service
import { useEffect, useState } from "react";

import { useSelectedNetworkId } from "./useSelectedNetwork";
import { useFeedbacks } from "../context/FeedbacksProvider";
import { mustGetNonSigningCosmWasmClient } from "../networks";
import { isTokenOwnedByUser } from "../utils/tns";
// TNS : From a given name, returns if it exists through a queryContractSmart() with an unsigned cosmWasmClient
export const useCheckNameAvailability = (name: string, tokens: string[]) => {
  const networkId = useSelectedNetworkId();
  const [nameAvailable, setNameAvailable] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setToastError } = useFeedbacks();

  useEffect(() => {}, [nameAvailable]);

  useEffect(() => {
    const getToken = async () => {
      setLoading(true);

      const contract = process.env
        .TERITORI_NAME_SERVICE_CONTRACT_ADDRESS as string;
      // We just want to read, so we use a non-signing client
      const cosmWasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      try {
        // If this query fails it means that the token does not exist.
        const token = await cosmWasmClient.queryContractSmart(contract, {
          nft_info: {
            token_id: name + process.env.TLD,
          },
        });

        return token.extension;
      } catch {
        // ---- If here, "cannot contract", probably because not found, so the token is considered as available
        return undefined;
      }
    };

    getToken()
      .then((tokenExtension) => {
        // ----- User owns
        if (isTokenOwnedByUser(tokens, name)) {
          setNameAvailable(false);
          setNameError(false);
        } else {
          // ------ Available
          if (!tokenExtension) {
            setNameAvailable(true);
            setNameError(false);
          }
          // ------ Minted
          else {
            setNameAvailable(false);
            setNameError(false);
          }
        }

        setLoading(false);
      })
      .catch((e) => {
        console.warn("ERROR getToken() : ", e);
        setLoading(false);
        setNameAvailable(false);
        setNameError(true);
        setToastError({
          title: "Something went wrong!",
          message: e.message,
        });
      });
  }, [name, setToastError, tokens, networkId]);

  return { nameAvailable, nameError, loading };
};
