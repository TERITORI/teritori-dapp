import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import * as R from "ramda";
import { useContext, useEffect, useState } from "react";

import { TNSContext } from "../context/TNSProvider";
import { useSigningClient } from "../context/cosmwasm";
import { useStore } from "../store/cosmwasm";
import { getNonSigningClient } from "./cosmwasm";

export const isPath = (str: string) => R.includes("::", str);
export const isToken = R.complement(isPath);
export const noTokens = (tokenIds: string[]): boolean =>
  tokenIds === undefined || R.isEmpty(tokenIds);

export const getHandlePrev = (
  page: number,
  pageStartTokens: string[],
  setPage: Function,
  setStartAfter: Function
) => {
  return () => {
    const prevPageIndex = page - 1;

    if (page === 0) {
      setPage(0);
      setStartAfter(undefined);
    } else if (page === 1) {
      setPage(prevPageIndex);
      setStartAfter(undefined);
    } else {
      setPage(prevPageIndex);

      if (prevPageIndex < pageStartTokens.length) {
        setStartAfter(pageStartTokens[prevPageIndex - 1]);
      }
    }
  };
};

export const getHandleNext = (
  page: number,
  tokens: string[],
  setPage: Function,
  setStartAfter: Function
) => {
  return () => {
    setPage(page + 1);
    setStartAfter(tokens[tokens.length - 1]);
  };
};

// if start_after is unset,
// it should return default (i.e. page 0)
const getValidQuery = (
  walletAddress: string,
  startAfter: string | undefined,
  perPage: number
) => {
  if (startAfter) {
    return {
      tokens: {
        owner: walletAddress,
        start_after: startAfter,
        limit: perPage,
      },
    };
  } else {
    return {
      tokens: {
        owner: walletAddress,
        limit: perPage,
      },
    };
  }
};

// start_after starts after the token_id
// so simply take the last token_id from the last page
// and pass it in with a perPage for the limit arg
// note that 30 is the limit for that
export function useTokenList() {
  const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string;
  const perPage = 10;

  const setStoreTokens = useStore((state) => state.setTokenIds);
  const tokens: string[] = useStore((state) => state.tokenIds);

  const setStorePaths = useStore((state) => state.setPathIds);
  const paths: string[] = useStore((state) => state.pathIds);

  const [pathsAndTokens, setPathsAndTokens] = useState<string[]>([]);

  const [startAfter, setStartAfter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [loadingTokens, setLoading] = useState(false);

  const { signingClient } = useSigningClient();
  const walletAddress = useStore((state) => state.walletAddress);

  window.onload = async () => {
   console.log('walletAddress çççççç ', walletAddress)
  }

  useEffect(() => {
    const getTokens = async () => {
      let client: CosmWasmClient;

      if (!signingClient) {
        client = await getNonSigningClient();
      }
      else client = signingClient

      console.log("clientclientclient", client)
      console.log("############ walletAddress", walletAddress)
      console.log("############ startAfter", startAfter)
      console.log("############ perPage", perPage)

      setLoading(true);

      const query = getValidQuery(walletAddress, startAfter, perPage);

      console.log("queryqueryqueryquery", query)
      console.log("contractcontractcontract", contract)

      try {
        const tokenList = await client.queryContractSmart(contract, query);
        if (!R.isNil(tokenList.tokens) && !R.isEmpty(tokenList.tokens)) {
          // filter tokens and paths
          const returnedTokens = R.filter(isToken, tokenList.tokens);
          const returnedPaths = R.filter(isPath, tokenList.tokens);
          setStoreTokens(returnedTokens);
          setStorePaths(returnedPaths);
          setPathsAndTokens(tokenList.tokens);
          console.log("tokenListtokenListtokenList", tokenList)
        }
        setLoading(false);
      } catch (e) {
        setStoreTokens([]);
        console.warn(e);
        setLoading(false);
      }
    };

    getTokens();
  }, [tokens.length, walletAddress, startAfter]);

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
  const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string;

  const setStoreToken = useStore((state) => state.setToken);
  const token = useStore((state) => state.token);
  //const [token, setToken] = useState<Metadata>()
  const [loadingToken, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const { signingClient } = useSigningClient();
  const walletAddress = useStore((state) => state.walletAddress);
  const { setTnsError } = useContext(TNSContext);

  useEffect(() => {
    const getTokenWithClient = async () => {
      let client: CosmWasmClient = signingClient;
      if (!signingClient) {
        client = await getNonSigningClient();
      }

      setLoading(true);

      try {
        const tokenInfo = await client.queryContractSmart(contract, {
          nft_info: {
            token_id: tokenId + tld,
          },
        });

        //setToken(tokenInfo.extension)
        setStoreToken(tokenInfo.extension);
        setNotFound(false);
        setLoading(false);
      } catch (e) {
        // ---- If here, "cannot contract", probably because not found, so the token is considered as available
        setStoreToken(null);
        setNotFound(true);
        setLoading(false);
        console.warn(e);
      }
    };

    // If no entered name (tokenId), we don't handle getTokenWithSigningClient() to avoid useless errors
    if (tokenId) {
      getTokenWithClient()
        .then()
        .catch((e) => {
          console.warn("ERROR getTokenWithClient() : ", e);
          setLoading(false);
          setTnsError({
            title: "Something went wrong!",
            message: e.message,
          });
        });
    }
  }, [tokenId, walletAddress]);

  return { token, loadingToken, notFound };
}
