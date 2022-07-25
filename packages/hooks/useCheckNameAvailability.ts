// Query the name service
import { useEffect, useState } from "react";

import { getNonSigningClient } from "./cosmwasm";
import { useIsUserOwnsToken } from "./useIsUserOwnsToken";

// NSB : From a given name, returns if it exists through a queryContractSmart() with an unsigned cosmWasmClient
export const useCheckNameAvailability = (name) => {
  const [nameAvailable, setNameAvailable] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);
  const isUserOwnsToken = useIsUserOwnsToken(name);
  let cosmWasmClient = null;

  useEffect(() => {
    console.log("nameAvailablenameAvailablegbzeuygbei", nameAvailable);
  }, [nameAvailable]);

  useEffect(() => {
    // TODO: Reuse getToken() declared in tokens.ts
    const _getToken = async () => {
      setLoading(true);

      const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string;
      // We just want to read, so we use a non-signing client
      cosmWasmClient = await getNonSigningClient();

      try {
        // If this query fails it means that the token does not exist.
        const token = await cosmWasmClient.queryContractSmart(contract, {
          nft_info: {
            token_id: name,
          },
        });
        return token.extension;
      } catch (e) {
        console.log("rrrerze", e);
        // ---- If here, "cannot contract", so the token is considered as available
        return undefined;
      }
    };

    _getToken()
      .then((tokenExtension) => {
        console.log(
          "isUserOwnsTokenisUserOwnsTokenisUserOwnsTokenisUserOwnsTokenisUserOwnsToken",
          isUserOwnsToken
        );

        // ----- User owns
        if (isUserOwnsToken) {
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
            console.log(
              "èèèèèèèèèèèèèèèèèèèèèèèèèèèèèèèèèèè isUserOwnsToken",
              isUserOwnsToken
            );
            setNameAvailable(false);
            setNameError(false);
          }
        }

        console.log(
          "tokenExtensiontokenExtensiontokenExtension",
          tokenExtension
        );

        setLoading(false);
      })
      .catch((e) => {
        console.warn("ERROR getToken() : ", e);
        setLoading(false);
        setNameAvailable(false);
        setNameError(true);
      });
  }, [name]);

  return { nameAvailable, nameError, loading, isUserOwnsToken };
};
