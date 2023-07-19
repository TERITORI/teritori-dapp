import React from "react";
import { TouchableOpacity, View, Image } from "react-native";

import penSVG from "../../../assets/icons/manage.svg";
import trashSVG from "../../../assets/icons/trash.svg";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { uploadFileToIPFS, ipfsURLToHTTPURL } from "../../utils/ipfs";
import { IMAGE_MIME_TYPES } from "../../utils/mime";
import { LocalFileData } from "../../utils/types/feed";
import { FileUploader } from "../fileUploader";

export const PortfolioImage: React.FC<{
  width: number;
  height: number;
  source: any;
  onUpdate?: (url: string) => void;
  onRemove?: () => void;
  style?: any;
}> = ({ width, height, source, onUpdate, onRemove, style }) => {
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
      onUpdate!(uploadedFile?.url);
    }
  };

  return (
    <TertiaryBox width={width} height={height} style={style}>
      <View
        style={{
          position: "absolute",
          top: 3,
          right: 3,
          flexDirection: "row",
          zIndex: 1,
        }}
      >
        {onRemove && (
          <TouchableOpacity onPress={onRemove}>
            <SVG
              source={trashSVG}
              width={22}
              height={22}
              style={{ marginTop: 2 }}
            />
          </TouchableOpacity>
        )}
      </View>

      {onUpdate ? (
        <FileUploader
          onUpload={(files) => onFileInputChange(files[0])}
          mimeTypes={IMAGE_MIME_TYPES}
        >
          {({ onPress }) => (
            <TouchableOpacity onPress={onPress}>
              <SVG
                source={penSVG}
                width={24}
                height={24}
                style={{ marginTop: 2 }}
              />
              <Image
                source={{ uri: ipfsURLToHTTPURL(source) }}
                style={{ width, height }}
              />
            </TouchableOpacity>
          )}
        </FileUploader>
      ) : (
        <Image
          source={{ uri: ipfsURLToHTTPURL(source) }}
          style={{ width, height }}
        />
      )}
    </TertiaryBox>
  );
};
