import axios from "axios";
import { omit } from "lodash";
import { CID } from "multiformats";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { parseUserId } from "@/networks";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { generateIpfsKey } from "@/utils/ipfs";
import { AppMode } from "@/utils/types/app-mode";
import { LocalFileData, RemoteFileData } from "@/utils/types/files";

interface UploadPostFilesToPinataParams {
  files: LocalFileData[];
  pinataJWTKey: string;
  mode?: AppMode;
}

interface IPFSUploadProgress {
  fileUrl: string;
  progress: number; // 0 to 1
}

export interface PinataFileProps {
  file: LocalFileData;
  pinataJWTKey: string;
  mode?: AppMode;
}

export const useIpfs = () => {
  const [ipfsUploadProgresses, setIpfsUploadProgresses] = useState<
    IPFSUploadProgress[]
  >([]);

  const pinataPinFileToIPFS = useCallback(
    async ({
      file,
      pinataJWTKey,
      mode,
    }: PinataFileProps): Promise<string | undefined> => {
      try {
        const formData = new FormData();
        if (mode === "mini") {
          //@ts-expect-error: description instead of adding file when adding url in formdata file upload to pinata
          formData.append("file", {
            uri: file.url,
            name: file.fileName,
            type: file.mimeType,
          });
        } else {
          formData.append("file", file.file);
        }

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
    },
    [],
  );

  const uploadFilesToPinata = useCallback(
    async ({
      files,
      pinataJWTKey,
      mode = "normal",
    }: UploadPostFilesToPinataParams): Promise<RemoteFileData[]> => {
      setIpfsUploadProgresses([]);

      const storedFile = async (
        file: LocalFileData,
      ): Promise<RemoteFileData> => {
        const fileIpfsHash = await pinataPinFileToIPFS({
          file,
          pinataJWTKey,
          mode,
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
    },
    [pinataPinFileToIPFS],
  );

  const userIPFSKey = useSelector(selectNFTStorageAPI);

  const uploadToIPFS = useCallback(
    async (userId: string, file: LocalFileData) => {
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
    },
    [pinataPinFileToIPFS, userIPFSKey],
  );

  return useMemo(() => {
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
  }, [
    ipfsUploadProgresses,
    pinataPinFileToIPFS,
    uploadFilesToPinata,
    uploadToIPFS,
  ]);
};
