// Query the name service
import { useContext, useEffect, useState } from "react";

import { TNSContext } from "../context/TNSProvider";
import { isTokenOwnedByUser } from "../utils/tns";
import { getNonSigningClient } from "./cosmwasm";

// TNS : From a given name, returns if it exists through a queryContractSmart() with an unsigned cosmWasmClient
export const useCheckNameAvailability = (name, tokens: string[]) => {
  const [nameAvailable, setNameAvailable] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setTnsError } = useContext(TNSContext);

  useEffect(() => {}, [nameAvailable]);

  useEffect(() => {
    const getToken = async () => {
      setLoading(true);

      const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string;
      // We just want to read, so we use a non-signing client
      const cosmWasmClient = await getNonSigningClient();
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
        setTnsError({
          title: "Something went wrong!",
          message: e.message,
        });
      });
  }, [name]);

  return { nameAvailable, nameError, loading };
};
