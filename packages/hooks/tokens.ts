import { useSigningClient } from '../context/cosmwasm'
import { useEffect, useState } from 'react'
import { useStore } from '../store/cosmwasm'
import * as R from 'ramda'

export const isPath = (str: string) => R.includes('::', str)
export const isToken = R.complement(isPath)
export const noTokens = (tokenIds: string[]): boolean =>
  tokenIds === undefined || R.isEmpty(tokenIds)

export const getHandlePrev = (
  page: number,
  pageStartTokens: string[],
  setPage: Function,
  setStartAfter: Function
) => {
  return () => {
    const prevPageIndex = page - 1

    if (page === 0) {
      setPage(0)
      setStartAfter(undefined)
    } else if (page === 1) {
      setPage(prevPageIndex)
      setStartAfter(undefined)
    } else {
      setPage(prevPageIndex)

      if (prevPageIndex < pageStartTokens.length) {
        const minusTwo = prevPageIndex - 1
        const newIdx = minusTwo === 0 ? 0 : minusTwo
        setStartAfter(pageStartTokens[prevPageIndex - 1])
      }
    }
  }
}

export const getHandleNext = (
  page: number,
  tokens: string[],
  setPage: Function,
  setStartAfter: Function
) => {
  return () => {
    setPage(page + 1)
    setStartAfter(tokens[tokens.length - 1])
  }
}

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
    }
  } else {
    return {
      tokens: {
        owner: walletAddress,
        limit: perPage,
      },
    }
  }
}

// start_after starts after the token_id
// so simply take the last token_id from the last page
// and pass it in with a perPage for the limit arg
// note that 30 is the limit for that
export function useTokenList() {
  const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string
  const perPage = 10

  const setStoreTokens = useStore((state) => state.setTokenIds)
  const tokens: string[] = useStore((state) => state.tokenIds)

  const setStorePaths = useStore((state) => state.setPathIds)
  const paths: string[] = useStore((state) => state.pathIds)

  const [pathsAndTokens, setPathsAndTokens] = useState<string[]>([])

  const [startAfter, setStartAfter] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(0)
  const [loadingTokens, setLoading] = useState(false)

  const { signingClient } = useSigningClient()
  const walletAddress = useStore((state) => state.walletAddress)

  useEffect(() => {
    if (!signingClient || !walletAddress) {
      return
    }

    const getTokens = async () => {
      setLoading(true)

      const query = getValidQuery(walletAddress, startAfter, perPage)

      try {
        let tokenList = await signingClient.queryContractSmart(contract, query)

        if (!R.isNil(tokenList.tokens) && !R.isEmpty(tokenList.tokens)) {
          // filter tokens and paths
          const returnedTokens = R.filter(isToken, tokenList.tokens)
          const returnedPaths = R.filter(isPath, tokenList.tokens)

          setStoreTokens(returnedTokens)
          setStorePaths(returnedPaths)
          setPathsAndTokens(tokenList.tokens)
        }
        setLoading(false)
      } catch (e) {
        setStoreTokens([])
        console.warn(e)
      }
    }

    getTokens()
  }, [tokens.length, walletAddress, startAfter])

  return {
    pathsAndTokens,
    tokens,
    paths,
    loadingTokens,
    startAfter,
    setStartAfter,
    page,
    setPage,
  }
}
