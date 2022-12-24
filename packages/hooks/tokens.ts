import { useEffect, useState } from "react";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { Metadata } from "../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { getNonSigningCosmWasmClient } from "../utils/keplr";
import { isPath, isToken } from "../utils/tns";
import useSelectedWallet from "./useSelectedWallet";
import {useSelector} from "react-redux";
import {selectSelectedNetworkId} from "../store/slices/settings";
import {getNetwork} from "../networks";

// start_after starts after the token_id
// so simply take the last token_id from the last page
// and pass it in with a perPage for the limit arg
// note that 30 is the limit for that
export function useTokenList() {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);

  const contract = process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS as string;
  const perPage = 10;

  const [tokens, setStoreTokens] = useState<string[]>([]);
  const [paths, setStorePaths] = useState<string[]>([]);

  const [pathsAndTokens, setPathsAndTokens] = useState<string[]>([]);

  const [startAfter, setStartAfter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [loadingTokens, setLoading] = useState(false);

  useEffect(() => {
    const getTokens = async () => {
      setLoading(true);
      try {
        if (!selectedWallet?.address) {
          setStoreTokens([]);
          setStorePaths([]);
          setPathsAndTokens([]);
          setLoading(false);
          return;
        }

        const query = {
          tokens: {
            owner: selectedWallet.address,
            limit: perPage,
            start_after: startAfter,
          },
        };

        const cosmwasmClient = await getNonSigningCosmWasmClient(selectedNetwork);

        const tokenList = await cosmwasmClient.queryContractSmart(
          contract,
          query
        );

        if (Array.isArray(tokenList?.tokens) && tokenList.tokens.length) {
          // filter tokens and paths
          const returnedTokens = tokenList.tokens.filter(isToken);
          const returnedPaths = tokenList.tokens.filter(isPath);
          setStoreTokens(returnedTokens);
          setStorePaths(returnedPaths);
          setPathsAndTokens(tokenList.tokens);
        }
        setLoading(false);
      } catch (e) {
        setStoreTokens([]);
        console.warn(e);
      }
    };

    getTokens();
  }, [tokens.length, startAfter, selectedWallet?.address]);

  return {
    pathsAndTokens,
    tokens,
    paths,
    loadingTokens,
    startAfter,
    setStartAfter,
    page,
    setPage,
  };
}

export function useToken(tokenId: string, tld: string) {
  const contract = process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS as string;

  const [token, setStoreToken] = useState<Metadata | null>();

  //const [token, setToken] = useState<Metadata>()
  const [loadingToken, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);

  const { setToastError } = useFeedbacks();

  useEffect(() => {
    const getToken = async () => {
      setLoading(true);

      try {
        const cosmwasmClient = await getNonSigningCosmWasmClient(selectedNetwork);

        try {
          const tokenInfo = await cosmwasmClient.queryContractSmart(contract, {
            nft_info: {
              token_id: tokenId + tld,
            },
          });

          setStoreToken(tokenInfo.extension);
          setNotFound(false);
        } catch {
          // ---- If here, "cannot contract", probably because not found, so the token is considered as available
          setStoreToken(null);
          setNotFound(true);
        }
      } catch (e) {
        setStoreToken(null);
        setNotFound(true);
        console.warn(e);
      }

      setLoading(false);
    };

    // If no entered name (tokenId), we don't handle getTokenWithSigningClient() to avoid useless errors
    if (tokenId) {
      getToken()
        .then()
        .catch((e) => {
          console.warn("ERROR getToken() : ", e);
          setLoading(false);
          setToastError({
            title: "Something went wrong!",
            message: e.message,
          });
        });
    }
  }, [tokenId]);

  return { token, loadingToken, notFound };
}
