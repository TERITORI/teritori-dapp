import { ResizeMode } from "expo-av";
import React, { useState } from "react";
import {
  Image,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSelector } from "react-redux";

import Add from "../../../assets/icons/add-alt.svg";
import DefaultVideoImage from "../../../assets/icons/player/cover-img.png";
import Img from "../../../assets/icons/player/img.svg";
import { signingVideoPlayerClient } from "../../client-creators/videoplayerClient";
import ModalBase from "../../components/modals/ModalBase";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { MediaPlayerVideo } from "../../context/MediaPlayerProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { selectNFTStorageAPI } from "../../store/slices/settings";
import { defaultSocialFeedFee } from "../../utils/fee";
import {
  generateIpfsKey,
  ipfsURLToHTTPURL,
  uploadFileToIPFS,
} from "../../utils/ipfs";
import { IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from "../../utils/mime";
import {
  neutral30,
  neutral33,
  neutral77,
  primaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { LocalFileData } from "../../utils/types/files";
import { VideoInfoWithMeta } from "../../utils/types/video";
import { BrandText } from "../BrandText";
import { DeleteButton } from "../FilePreview/DeleteButton";
import { SVG } from "../SVG";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { FileUploader } from "../fileUploader";
import { TextInputCustom } from "../inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../spacer";

interface UploadAlbumModalProps {
  onClose: () => void;
  isVisible: boolean;
}
const DEFAULT_VIDEO_INFO = {
  identifier: "",
  createdBy: "",
  createdAt: 0,
  viewCount: 0,
  like: 0,
  dislike: 0,
  viewLastTimestamp: 0,
  videoMetaInfo: {
    title: "",
    description: "",
    url: "",
    image: "",
    duration: 0,
  },
};

export const MODAL_WIDTH = 564;
export const CreateVideoModal: React.FC<UploadAlbumModalProps> = ({
  onClose,
  isVisible,
}) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const [videoInfo, setVideoInfo] =
    useState<VideoInfoWithMeta>(DEFAULT_VIDEO_INFO);

  const onUploadVideoImage = async (files: LocalFileData[]) => {
    setIsUploading(true);
    const uploadedFile = await uploadFileToIPFS({
      userKey: userIPFSKey,
      file: files[0],
      networkId: selectedNetworkId,
      userId,
    });
    if (!uploadedFile?.url) {
      console.error("upload file err : Fail to pin to IPFS");
      setToastError({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
      });
      return;
    }
    setVideoInfo({
      ...videoInfo,
      videoMetaInfo: { ...videoInfo.videoMetaInfo, image: uploadedFile.url },
    });
    setIsUploading(false);
  };

  const onUploadVideoFile = async (files: LocalFileData[]) => {
    setIsUploading(true);
    const pinataJWTKey =
      userIPFSKey || (await generateIpfsKey(selectedNetworkId, userId));
    if (!pinataJWTKey) {
      console.error("upload file err : No Pinata JWT");
      setToastError({
        title: "File upload failed",
        message: "No Pinata JWT",
      });
      return;
    }
    const uploadedFile = await uploadFileToIPFS({
      userKey: userIPFSKey,
      file: files[0],
      networkId: selectedNetworkId,
      userId,
    });
    if (!uploadedFile?.url) {
      console.error("upload file err : Fail to pin to IPFS");
      setToastError({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
      });
      return;
    }
    setVideoInfo((videoInfo) => {
      return {
        ...videoInfo,
        videoMetaInfo: {
          ...videoInfo.videoMetaInfo,
          url: uploadedFile.url,
        },
      };
    });
    setIsUploading(false);
  };

  const handleVideoNameTextChange = (text: string) => {
    setVideoInfo({
      ...videoInfo,
      videoMetaInfo: {
        ...videoInfo.videoMetaInfo,
        title: text.trim(),
      },
    });
  };

  const handleVideoDescriptionTextChange = (text: string) => {
    setVideoInfo({
      ...videoInfo,
      videoMetaInfo: {
        ...videoInfo.videoMetaInfo,
        description: text.trim(),
      },
    });
  };

  const handleRemoveVideo = () => {
    setVideoInfo(DEFAULT_VIDEO_INFO);
  };

  const onPressUpload = async () => {
    setIsLoading(true);

    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingVideoPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.createVideo(
        {
          metadata: JSON.stringify(videoInfo.videoMetaInfo),
        },
        defaultSocialFeedFee,
        ""
      );

      if (res.transactionHash) {
        setToastSuccess({
          title: "Uploaded video successfully",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to upload video",
        message: `Error: ${err}`,
      });
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <ModalBase
      label="Upload video"
      visible={isVisible}
      onClose={onClose}
      width={MODAL_WIDTH}
    >
      <View style={inputBoxStyle}>
        <View style={imgBoxStyle}>
          <Image
            source={
              videoInfo.videoMetaInfo.image === ""
                ? DefaultVideoImage
                : ipfsURLToHTTPURL(videoInfo.videoMetaInfo.image)
            }
            style={imgStyle}
          />
          <View style={uploadImgStyle}>
            <FileUploader
              onUpload={onUploadVideoImage}
              style={uploadButtonStyle}
              mimeTypes={IMAGE_MIME_TYPES}
              maxUpload={1}
              setIsLoading={setIsLoading}
            >
              {({ onPress }) => (
                <TouchableOpacity style={uploadButtonStyle} onPress={onPress}>
                  <SVG source={Img} width={16} height={16} />
                  <SpacerRow size={1} />
                  <BrandText style={fontSemibold14}>upload image</BrandText>
                </TouchableOpacity>
              )}
            </FileUploader>
          </View>
        </View>
        <View style={textBoxStyle}>
          <TextInputCustom
            rules={{ required: true }}
            noBrokenCorners
            variant="labelOutside"
            onChangeText={handleVideoNameTextChange}
            label="Video title"
            name="videoTitle"
          />
          <SpacerColumn size={2.5} />

          <TextInputCustom
            rules={{ required: true }}
            noBrokenCorners
            variant="labelOutside"
            onChangeText={handleVideoDescriptionTextChange}
            label="Video description"
            name="videoDescription"
          />
        </View>
      </View>

      <SpacerColumn size={2} />
      {videoInfo.videoMetaInfo.url ? (
        <View>
          <DeleteButton
            onPress={handleRemoveVideo}
            style={{ top: 12, right: 12 }}
          />

          <MediaPlayerVideo
            videoUrl={videoInfo.videoMetaInfo.url}
            resizeMode={ResizeMode.CONTAIN}
            authorId={userId}
          />
        </View>
      ) : (
        <FileUploader
          onUpload={onUploadVideoFile}
          style={uploadButtonStyle}
          mimeTypes={VIDEO_MIME_TYPES}
          setIsLoading={setIsLoading}
        >
          {({ onPress }) => (
            <TouchableOpacity style={buttonContainerStyle} onPress={onPress}>
              <SVG source={Add} width={20} height={20} stroke={primaryColor} />
              <SpacerRow size={1} />
              <BrandText style={buttonTextStyle}>Add video</BrandText>
            </TouchableOpacity>
          )}
        </FileUploader>
      )}
      <SpacerColumn size={2.5} />

      <BrandText
        style={[
          fontSemibold14,
          {
            color: neutral77,
          },
        ]}
      >
        Provide 2k video for highest video quality.
      </BrandText>
      <SpacerColumn size={2.5} />

      <View style={divideLineStyle} />

      <View style={footerStyle}>
        <BrandText style={footerTextStyle} numberOfLines={2}>
          By uploading, you confirm that your sounds comply with our Terms of
          Use.
        </BrandText>
        <PrimaryButton
          text="Upload"
          disabled={
            !videoInfo.videoMetaInfo.title ||
            !videoInfo.videoMetaInfo.description ||
            !videoInfo.videoMetaInfo.image ||
            !videoInfo.videoMetaInfo.url ||
            isUploading ||
            isLoading
          }
          size="SM"
          onPress={onPressUpload}
          isLoading={isUploading || isLoading}
        />
      </View>
    </ModalBase>
  );
};

const buttonContainerStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: 40,
  borderRadius: layout.spacing_x1,
  backgroundColor: neutral30,
};
const buttonTextStyle: TextStyle = {
  ...fontSemibold14,

  color: primaryColor,
};
const divideLineStyle: ViewStyle = {
  height: 1,
  width: MODAL_WIDTH - 2,
  marginLeft: -layout.spacing_x2_5,
  backgroundColor: neutral33,
};
const footerStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: layout.spacing_x2_5,
  paddingVertical: layout.spacing_x2,
};
const footerTextStyle: TextStyle = {
  ...fontSemibold14,

  color: neutral77,
  width: "55%",
};
const inputBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
};
const imgBoxStyle: ViewStyle = {
  position: "relative",
};
const imgStyle: ImageStyle = {
  width: 172,
  height: 172,
  borderRadius: layout.spacing_x1,
};
const textBoxStyle: ViewStyle = {
  width: 332,
};

const uploadImgStyle: ViewStyle = {
  width: "100%",
  position: "absolute",
  left: 0,
  bottom: layout.spacing_x1,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};
const uploadButtonStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#2B2B33",
  borderRadius: layout.spacing_x4,
  paddingLeft: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  paddingVertical: layout.spacing_x1,
};
