import axios from "axios";
import { omit } from "lodash";
import { CID } from "multiformats";
import { useCallback, useMemo, useState } from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";

import { parseUserId } from "@/networks";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { generateIpfsKey } from "@/utils/ipfs";
import { LocalFileData, RemoteFileData } from "@/utils/types/files";

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

  const pinataPinFileToIPFS = useCallback(
    async ({
      file,
      pinataJWTKey,
    }: PinataFileProps): Promise<
      { ipfsCid: string | undefined; ipfsHash: string } | undefined
    > => {
      try {
        const formData = new FormData();
        if (Platform.OS !== "web") {
          //@ts-expect-error: description - instead of converting selected file to File type as of WEB just using url to prepare formdata  upload to pinata
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
        return {
          ipfsCid: CID.parse(responseFile.data.IpfsHash).toV1().toString(),
          ipfsHash: responseFile.data.IpfsHash,
        };
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
    }: UploadPostFilesToPinataParams): Promise<RemoteFileData[]> => {
      setIpfsUploadProgresses([]);

      const storedFile = async (
        file: LocalFileData,
      ): Promise<RemoteFileData> => {
        const pinFileToIPFSResult = await pinataPinFileToIPFS({
          file,
          pinataJWTKey,
        });

        const url = !pinFileToIPFSResult?.ipfsCid
          ? ""
          : "ipfs://" + pinFileToIPFSResult.ipfsCid;

        if (file.thumbnailFileData) {
          const pinThumbnailToIPFSResult = await pinataPinFileToIPFS({
            file: file.thumbnailFileData,
            pinataJWTKey,
          });

          const thumbnailUrl = !pinThumbnailToIPFSResult?.ipfsCid
            ? ""
            : "ipfs://" + pinThumbnailToIPFSResult.ipfsCid;

          return {
            ...omit(file, "file"),
            url,
            hash: pinFileToIPFSResult?.ipfsHash,
            thumbnailFileData: {
              ...omit(file.thumbnailFileData, "file"),
              url: thumbnailUrl,
              hash: pinThumbnailToIPFSResult?.ipfsHash,
            },
          };
        } else {
          return {
            ...omit(file, "file"),
            // Thumbnails cannot have a thumbnail, so we set isThumbnailImage here
            isThumbnailImage: file.isThumbnailImage,
            url,
            hash: pinFileToIPFSResult?.ipfsHash,
          };
        }
      };

      const queries: Promise<RemoteFileData>[] = [];
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
      const pinFileToIPFSResult = await pinataPinFileToIPFS({
        file,
        pinataJWTKey,
      });
      if (!pinFileToIPFSResult?.ipfsCid) {
        throw new Error("Failed to pin file");
      }
      return "ipfs://" + pinFileToIPFSResult.ipfsCid;
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
