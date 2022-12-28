// Query the name service
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { getNetwork } from "../networks";
import { selectSelectedNetworkId } from "../store/slices/settings";
import { getNonSigningCosmWasmClient } from "../utils/keplr";
import { isTokenOwnedByUser } from "../utils/tns";

// TNS : From a given name, returns if it exists through a queryContractSmart() with an unsigned cosmWasmClient
export const useCheckNameAvailability = (name: string, tokens: string[]) => {
  const [nameAvailable, setNameAvailable] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setToastError } = useFeedbacks();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);

  useEffect(() => {}, [nameAvailable]);

  useEffect(() => {
    const getToken = async () => {
      setLoading(true);

      const contract = process.env
        .TERITORI_NAME_SERVICE_CONTRACT_ADDRESS as string;
      // We just want to read, so we use a non-signing client
      const cosmWasmClient = await getNonSigningCosmWasmClient(selectedNetwork);
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
  }, [name]);

  return { nameAvailable, nameError, loading };
};
