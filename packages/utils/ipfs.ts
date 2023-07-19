import { omit } from "lodash";

import { mustGetFeedClient } from "./backend";
import { pinataPinFileToIPFS } from "../candymachine/pinata-upload";
import { pinataPinJSONToIPFS } from "../candymachine/pinata-upload";

interface UploadPostFilesToPinataParams {
  files: LocalFileData[];
  pinataJWTKey: string;
}

interface UploadPostJSONToPinataParams {
  json: object;
  networkId: string;
  userId: string;
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

export const generateIpfsKey = async (networkId: string, userId: string) => {
  try {
    const backendClient = mustGetFeedClient(networkId);
    const response = await backendClient.IPFSKey({ userId });
    return response.jwt;
  } catch (e) {
    console.error("ERROR WHILE GENERATING IPFSKey : ", e);
    return undefined;
  }
};

// Get IPFS Key and upload files.
// But you can do separately generateIpfsKey then uploadFilesToPinata (Ex in NewsFeedInput.tsx)
export const uploadFileToIPFS = async (
  file: LocalFileData,
  networkId: string,
  userId: string,
  userKey?: string
) => {
  let uploadedFiles: RemoteFileData[] = [];
  const pinataJWTKey = userKey || (await generateIpfsKey(networkId, userId));

  if (pinataJWTKey) {
    uploadedFiles = await uploadFilesToPinata({
      files: [file],
      pinataJWTKey,
    });
  }
  if (!uploadedFiles.find((file) => file.url)) {
    console.error("upload file err : Fail to pin to IPFS");
  } else return uploadedFiles[0];
};

export const uploadJSONToIPFS = async ({
  json,
  networkId,
  userId,
}: UploadPostJSONToPinataParams): Promise<
  (object & { url: string }) | undefined
> => {
  const pinataJWTKey = await generateIpfsKey(networkId, userId);
  if (!pinataJWTKey) return;
  const uploadedFile = await pinataPinJSONToIPFS({
    json,
    pinataJWTKey,
  });
  if (!uploadedFile) {
    console.error("upload file err : Fail to pin to IPFS");
  } else {
    return {
      ...json,
      url: uploadedFile.IpfsHash,
    };
  }
  if (!uploadedFile) {
    console.error("upload file err : Fail to pin to IPFS");
  } else return uploadedFile;
};



// Used to get a correct image URL for displaying or storing
export const ipfsURLToHTTPURL = (ipfsURL: string | undefined) => {
  if (!ipfsURL) {
    return "";
  }
  if (ipfsURL.startsWith("https://") || ipfsURL.startsWith("blob:")) {
    return ipfsURL;
  }
  if (ipfsURL.startsWith("ipfs://")) {
    return ipfsURL.replace("ipfs://", "https://nftstorage.link/ipfs/");
  }
  return "https://nftstorage.link/ipfs/" + ipfsURL;
};
