import { omit } from "lodash";
import { CID } from "multiformats";

import { mustGetFeedClient } from "./backend";
import { LocalFileData, RemoteFileData } from "./types/files";
import { pinataPinFileToIPFS } from "../candymachine/pinata-upload";

interface UploadPostFilesToPinataParams {
  files: LocalFileData[];
  pinataJWTKey: string;
}

export const uploadFilesToPinata = async ({
  files,
  pinataJWTKey,
}: UploadPostFilesToPinataParams): Promise<RemoteFileData[]> => {
  const storedFile = async (file: LocalFileData): Promise<RemoteFileData> => {
    const fileData = await pinataPinFileToIPFS({
      file,
      pinataJWTKey,
    });
    if (file.thumbnailFileData) {
      const thumbnailData = await pinataPinFileToIPFS({
        file: file.thumbnailFileData,
        pinataJWTKey,
      });

      return {
        ...omit(file, "file"),
        url: fileData?.IpfsHash || "",
        thumbnailFileData: {
          ...omit(file.thumbnailFileData, "file"),
          url: thumbnailData?.IpfsHash || "",
        },
      };
    } else {
      return {
        ...omit(file, "file"),
        url: fileData?.IpfsHash || "",
      };
    }
  };

  const queries = [];
  for (const file of files) {
    const storedFileQuery = storedFile(file);
    queries.push(storedFileQuery);
  }
  return await Promise.all(queries);
};

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

/** Get the gateway web2 url for an ipfs url or passthrough if not an ipfs url */
export const ipfsURLToHTTPURL = (ipfsURL: string | undefined) => {
  if (!ipfsURL) {
    return "";
  }
  if (ipfsURL.startsWith("ipfs://")) {
    return ipfsURL.replace("ipfs://", "https://cf-ipfs.com/ipfs/");
  }
  try {
    const cid = CID.parse(ipfsURL);
    return `https://cf-ipfs.com/ipfs/${cid.toString()}`;
  } catch {}
  return ipfsURL;
};
