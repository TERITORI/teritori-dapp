export const ipfsURLToHTTPURL = (ipfsURL: string | undefined) => {
  if (!ipfsURL) {
    return "";
  }
  if (ipfsURL.startsWith("https://") || ipfsURL.startsWith("blob:")) {
    return ipfsURL;
  }
  if (ipfsURL.startsWith("ipfs://")) {
    return ipfsURL.replace(
      "ipfs://",
      "https://magenta-convenient-felidae-524.mypinata.cloud/ipfs/"
    );
  }
  return (
    "https://magenta-convenient-felidae-524.mypinata.cloud/ipfs/" + ipfsURL
  );
};
