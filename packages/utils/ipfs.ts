export const ipfsURLToHTTPURL = (ipfsURL: string) => {
  if (!ipfsURL.startsWith("ipfs://")) {
    return ipfsURL;
  }
  return ipfsURL.replace("ipfs://", "https://nftstorage.link/ipfs/");
};
