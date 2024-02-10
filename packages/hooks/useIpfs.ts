import axios from "axios";
import { omit } from "lodash";
import { CID } from "multiformats";
import { useState } from "react";
import { useSelector } from "react-redux";

import { LocalFileData, RemoteFileData } from "../utils/types/files";

import { parseUserId } from "@/networks";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { generateIpfsKey } from "@/utils/ipfs";

interface UploadPostFilesToPinataParams {
  files: LocalFileData[];
  pinataJWTKey: string;
}

interface IPFSUploadProgress {
  fileUrl: string;
  progress: number; // 0 to 1
}

export interface PinataFileProps {
  file: LocalFileData;
  pinataJWTKey: string;
}

export const useIpfs = () => {
  const [ipfsUploadProgresses, setIpfsUploadProgresses] = useState<
    IPFSUploadProgress[]
  >([]);

  const pinataPinFileToIPFS = async ({
    file,
    pinataJWTKey,
  }: PinataFileProps): Promise<string | undefined> => {
    try {
      const formData = new FormData();
      formData.append("file", file.file);

      const responseFile = await axios({
        onUploadProgress: (progressEvent) => {
          // Map the different progresses for each file to prevent a bad finalProgress
          setIpfsUploadProgresses((ipfsUploadProgresses) =>
            ipfsUploadProgresses.map((progressItem) => {
              if (progressItem.fileUrl === file.url) {
                return {
                  ...progressItem,
                  progress: progressEvent.progress || 0,
                };
              } else {
                return progressItem;
              }
            }),
          );
        },
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          Authorization: "Bearer " + pinataJWTKey,
          "Content-Type": "multipart/form-data",
        },
      });
      return CID.parse(responseFile.data.IpfsHash).toV1().toString();
    } catch (err) {
      console.error("Error pinning " + file.fileName + " to IPFS", err);
    }
  };

  const uploadFilesToPinata = async ({
    files,
    pinataJWTKey,
  }: UploadPostFilesToPinataParams): Promise<RemoteFileData[]> => {
    setIpfsUploadProgresses([]);

    const storedFile = async (file: LocalFileData): Promise<RemoteFileData> => {
      const fileIpfsHash = await pinataPinFileToIPFS({
        file,
        pinataJWTKey,
      });
      const url = !fileIpfsHash ? "" : "ipfs://" + fileIpfsHash;

      if (file.thumbnailFileData) {
        const thumbnailFileIpfsHash = await pinataPinFileToIPFS({
          file: file.thumbnailFileData,
          pinataJWTKey,
        });
        const thumbnailUrl = !thumbnailFileIpfsHash
          ? ""
          : "ipfs://" + thumbnailFileIpfsHash;

        return {
          ...omit(file, "file"),
          url,
          thumbnailFileData: {
            ...omit(file.thumbnailFileData, "file"),
            url: thumbnailUrl,
          },
        };
      } else {
        return {
          ...omit(file, "file"),
          // Thumbnails cannot have a thumbnail, so we set isThumbnailImage here
          isThumbnailImage: file.isThumbnailImage,
          url,
        };
      }
    };

    const queries = [];
    for (const file of files) {
      setIpfsUploadProgresses((ipfsUploadProgresses) => [
        ...ipfsUploadProgresses,
        {
          fileUrl: file.url,
          progress: 0,
        },
      ]);

      const storedFileQuery = storedFile(file);
      queries.push(storedFileQuery);
    }
    return await Promise.all(queries);
  };

  const userIPFSKey = useSelector(selectNFTStorageAPI);

  const uploadToIPFS = async (userId: string, file: LocalFileData) => {
    const [network] = parseUserId(userId);
    if (!network) {
      throw new Error("Invalid user id");
    }
    const pinataJWTKey =
      userIPFSKey || (await generateIpfsKey(network.id, userId));
    if (!pinataJWTKey) {
      throw new Error("Failed to get upload key");
    }
    const fileIpfsHash = await pinataPinFileToIPFS({
      file,
      pinataJWTKey,
    });
    if (!fileIpfsHash) {
      throw new Error("Failed to pin file");
    }
    return "ipfs://" + fileIpfsHash;
  };

  const finalProgress = !ipfsUploadProgresses.length
    ? 0
    : ipfsUploadProgresses.reduce(
        (acc, progressItem) => acc + progressItem.progress,
        0,
      ) / ipfsUploadProgresses.length;

  return {
    uploadToIPFS,
    uploadFilesToPinata,
    pinataPinFileToIPFS,
    ipfsUploadProgress: finalProgress,
  };
};
