import React, { useState } from "react";
import { TouchableOpacity, Image } from "react-native";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { uploadFileToIPFS, ipfsURLToHTTPURL } from "../../utils/ipfs";
import { IMAGE_MIME_TYPES } from "../../utils/mime";
import { LocalFileData } from "../../utils/types/files";
import { FileUploader } from "../fileUploader";

export const AvatarImage: React.FC<{
  source: any;
  style: any;
  onUpdate?: (url: string) => void;
}> = ({ source, style, onUpdate }) => {
  const [sourceData, setSourceData] = useState(source);
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const { setToastError } = useFeedbacks();

  const onFileInputChange = async (file: LocalFileData) => {
    if (file) {
      const uploadedFile = await uploadFileToIPFS(
        file,
        selectedNetworkId,
        userId
      );
      if (!uploadedFile) {
        setToastError({
          title: "File upload failed",
          message: "Fail to pin to IPFS, please try to Publish again",
        });
        return;
      }
      setSourceData(uploadedFile.url);
      onUpdate!(uploadedFile.url);
    }
  };

  return (
    <>
      {onUpdate ? (
        <FileUploader
          onUpload={(files) => onFileInputChange(files[0])}
          mimeTypes={IMAGE_MIME_TYPES}
        >
          {({ onPress }) => (
            <TouchableOpacity onPress={onPress}>
              <Image
                source={{ uri: ipfsURLToHTTPURL(sourceData) }}
                style={[style]}
              />
            </TouchableOpacity>
          )}
        </FileUploader>
      ) : (
        <Image source={{ uri: ipfsURLToHTTPURL(sourceData) }} style={[style]} />
      )}
    </>
  );
};
