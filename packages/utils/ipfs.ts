export const ipfsURLToHTTPURL = (ipfsURL: string | undefined) => {
  if (!ipfsURL) {
    return;
  }
  if (!ipfsURL.startsWith("ipfs://")) {
    return ipfsURL;
  }
  return ipfsURL.replace("ipfs://", "https://nftstorage.link/ipfs/");
};
