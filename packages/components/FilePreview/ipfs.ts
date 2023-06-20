// temporary hotfix
// pinata-pinned files are weirdly handled by nft.storage gateway

export const ipfsURLToHTTPURL = (ipfsURL: string | undefined) => {
  if (!ipfsURL) {
    return "";
  }
  if (
    ipfsURL.startsWith("https://") ||
    ipfsURL.startsWith("blob:") ||
    ipfsURL.startsWith("data:")
  ) {
    return ipfsURL;
  }
  if (ipfsURL.startsWith("ipfs://")) {
    return ipfsURL.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
  }
  return "https://cloudflare-ipfs.com/ipfs/" + ipfsURL;
};
