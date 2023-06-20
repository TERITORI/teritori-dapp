export const ipfsURLToHTTPURL = (ipfsURL: string | undefined) => {
  if (!ipfsURL) {
    return;
  }

  if (
    ipfsURL.startsWith("https://") ||
    ipfsURL.startsWith("blob:") ||
    ipfsURL.startsWith("data:")
  ) {
    return ipfsURL;
  }
  if (ipfsURL.startsWith("ipfs://")) {
    return ipfsURL.replace("ipfs://", "https://nftstorage.link/ipfs/");
  }
  return "https://nftstorage.link/ipfs/" + ipfsURL;
};
