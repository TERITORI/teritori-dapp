import { CID } from "multiformats";

import { mustGetFeedClient } from "./backend";

export const generateIpfsKey = async (
  networkId: string,
  userId: string | undefined,
) => {
  try {
    if (!userId) {
      throw new Error("Invalid userId");
    }
    const backendClient = mustGetFeedClient(networkId);
    const response = await backendClient.IPFSKey({ userId });
    return response.jwt;
  } catch (e) {
    console.error("ERROR WHILE GENERATING IPFSKey : ", e);
    return undefined;
  }
};

const gatewayBase = "w3s.link";

const ipfsPathToWeb2URL = (path: string) => {
  const separatorIndex = path.indexOf("/");
  const cidString =
    separatorIndex === -1 ? path : path.substring(0, separatorIndex);
  const subpath =
    separatorIndex === -1 ? "" : path.substring(separatorIndex + 1);
  const cid = CID.parse(cidString);
  const finalPath = subpath ? `/${subpath}` : "";
  const finalCIDString = cid.toV1().toString();
  const gatewayURL = `https://${finalCIDString}.ipfs.${gatewayBase}${finalPath}`;
  return gatewayURL;
};

/** Get the web2 url for a web3 uri or passthrough if not a web3 uri
 * Only supports ipfs for now
 */
export const web3ToWeb2URI = (web3URI: string | undefined) => {
  if (!web3URI) {
    return "";
  }
  if (web3URI.startsWith("ipfs://")) {
    web3URI = web3URI.substring("ipfs://".length);
  }
  try {
    return ipfsPathToWeb2URL(web3URI);
  } catch {}
  return web3URI;
};
