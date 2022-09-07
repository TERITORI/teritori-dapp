export const ipfsURLToHTTPURL = (ipfsURL: string) => {
  if (!ipfsURL.startsWith("ipfs://")) {
    throw new Error("not an ipfs url");
  }
  return ipfsURL.replace("ipfs://", "https://nftstorage.link/ipfs/");
};
