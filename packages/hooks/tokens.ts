import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import * as R from "ramda";
import { useContext, useEffect, useState } from "react";

import { NSBContext } from "../context/NSBProvider";
import { useSigningClient } from "../context/cosmwasm";
import { useStore } from "../store/cosmwasm";
import { Metadata } from "../utils/types/messages";
import { getNonSigningClient, useSigningCosmWasmClient } from "./cosmwasm";

export const isPath = (str: string) => R.includes("::", str);
export const isToken = R.complement(isPath);
export const noTokens = (tokenIds: string[]): boolean => {
  console.log(
    "==============================================================================================",
    tokenIds
  );
  return tokenIds === undefined || R.isEmpty(tokenIds);
};

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
        const minusTwo = prevPageIndex - 1;
        const newIdx = minusTwo === 0 ? 0 : minusTwo;
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
  const { connectWallet } = useSigningCosmWasmClient();
  const walletAddress = useStore((state) => state.walletAddress);

  // ---- Init
  useEffect(() => {
    const initCosmWasm = async () => {
      await connectWallet();
    };
    initCosmWasm();
  }, []);

  // ----
  useEffect(() => {
    if (!signingClient || !walletAddress) {
      return;
    }

    const getTokens = async () => {
      console.log("eeeeeeeeeeeeeeeeeeeeeeeee");
      setLoading(true);

      const query = getValidQuery(walletAddress, startAfter, perPage);
      console.log("zzzzzzzzzzzzzzzzzzzzzzzzzz");

      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuu");
        const tokenList = await signingClient.queryContractSmart(
          contract,
          query
        );
        console.log(" ############################# tokenList", tokenList);
        console.log("pppppppppppppppppppppppppppp");
        if (!R.isNil(tokenList.tokens) && !R.isEmpty(tokenList.tokens)) {
          console.log("nbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
          // filter tokens and paths
          const returnedTokens = R.filter(isToken, tokenList.tokens);
          const returnedPaths = R.filter(isPath, tokenList.tokens);
          console.log(
            "returnedTokensreturnedTokensreturnedTokensreturnedTokens",
            returnedTokens
          );
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

export function useToken(tokenId: string) {
  console.log(
    "tokenIdtokenIdtokenIdtokenIdtokenIdtokenIdtokenIdtokenIdtokenIdtokenId",
    tokenId
  );
  const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string;

  const setStoreToken = useStore((state) => state.setToken);
  const token = useStore((state) => state.token);
  //const [token, setToken] = useState<Metadata>()
  const [loadingToken, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const { signingClient } = useSigningClient();
  const walletAddress = useStore((state) => state.walletAddress);
  const { setNsbError } = useContext(NSBContext);

  useEffect(() => {
    if (!signingClient) {
      return;
    }

    // TODO: Reuse getToken() declared bellow
    const _getToken = async () => {
      setLoading(true);
      try {
        const tokenInfo = await signingClient.queryContractSmart(contract, {
          nft_info: {
            token_id: tokenId,
          },
        });
        //setToken(tokenInfo.extension)
        setStoreToken(tokenInfo.extension);
        setLoading(false);
      } catch (e) {
        setStoreToken(null);
        setNotFound(true);
        setNsbError({
          title: "Something went wrong!",
          message: e.message,
        });
        console.warn(e);
      }
    };

    _getToken();
  }, [tokenId, walletAddress]);

  return { token, loadingToken, notFound };
}

export const getToken = async (
  name: string = "",
  client?: CosmWasmClient
): Promise<Metadata | undefined> => {
  const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string;
  // We just want to read, so we use a non-signing client
  if (!client) client = await getNonSigningClient();

  try {
    // If this query fails it means that the token does not exist.
    const token = await client.queryContractSmart(contract, {
      nft_info: {
        token_id: name + process.env.TLD,
      },
    });
    return token.extension;
  } catch (e) {
    return undefined;
  }
};
