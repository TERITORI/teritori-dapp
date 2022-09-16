import {CollectionNFTsRequest, NFT} from "../api/marketplace/v1/marketplace"
import {useCallback, useEffect, useRef, useState} from "react"
import {backendClient} from "../utils/backend"

function usePrevious<T>(value: T, initialValue: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>(initialValue)

  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current
}

export const useCollectionNFTs = (
  req: CollectionNFTsRequest,
  ready: boolean
) => {
  const [nfts, setNFTs] = useState<NFT[]>([])
  const [firstLoading, setFirstLoading] = useState(false)
  const [isFirstLoadDone, setIsFetFirstLoad] = useState(false)

  const fetchMore = useCallback(async () => {
    if (!isFirstLoadDone) setFirstLoading(true)
    try {
      const offsetReq = {
        ...req,
        offset: req.offset + nfts.length
      }
      console.log("fetching", offsetReq)
      const stream = backendClient.CollectionNFTs(offsetReq)

      let newNFTS: NFT[] = []
      await stream.forEach((response) => {
        if (!response.nft) {
          return
        }
        newNFTS = [...newNFTS, response.nft]
      })

      setNFTs((collec) => [...collec, ...newNFTS])

      if (!isFirstLoadDone) {
        console.log(' UNE FOIS')
        setFirstLoading(false)
        setIsFetFirstLoad(true)
      }
    } catch (err) {
      console.warn("failed to fetch collection nfts:", err)

      if (!isFirstLoadDone) {
        setFirstLoading(false)
        setIsFetFirstLoad(true)
      }
    }
  }, [req, nfts])

  const prevReady = usePrevious(ready, false)

  useEffect(() => {
    if (ready && !prevReady) {
      setNFTs([])
      fetchMore()
    }
  }, [req.mintAddress, ready, prevReady])

  return {nfts, fetchMore, firstLoading}
}
