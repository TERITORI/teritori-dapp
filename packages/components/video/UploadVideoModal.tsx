import { ResizeMode, Video } from "expo-av";
import { FC, useState } from "react";
import {
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSelector } from "react-redux";

import Add from "../../../assets/icons/add-primary.svg";
import Img from "../../../assets/icons/img.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useFeedPosting } from "../../hooks/feed/useFeedPosting";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { selectNFTStorageAPI } from "../../store/slices/settings";
import {
  generateIpfsKey,
  ipfsURLToHTTPURL,
  uploadFilesToPinata,
} from "../../utils/ipfs";
import { IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from "../../utils/mime";
import {
  neutral30,
  neutral33,
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { LocalFileData } from "../../utils/types/files";
import { BrandText } from "../BrandText";
import { DeleteButton } from "../FilePreview/DeleteButton";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { FileUploader } from "../fileUploader";
import { TextInputCustom } from "../inputs/TextInputCustom";
import ModalBase from "../modals/ModalBase";
import { FeedFeeText } from "../socialFeed/FeedFeeText";
import {
  PostCategory,
  SocialFeedVideoMetadata,
} from "../socialFeed/NewsFeed/NewsFeed.type";
import { NotEnoughFundModal } from "../socialFeed/NewsFeed/NotEnoughFundModal";
import { SpacerColumn, SpacerRow } from "../spacer";

const UPLOAD_VIDEO_MODAL_WIDTH = 590;
const THUMBNAIL_SIZE = 198;
const VIDEO_HEIGHT = 300;
export const UploadVideoModal: FC<{
  onClose: () => void;
  isVisible: boolean;
}> = ({ onClose, isVisible }) => {
  const { setToastError } = useFeedbacks();
  const selectedNetwork = useSelectedNetworkInfo();
  const selectedWallet = useSelectedWallet();
  const userId = selectedWallet?.userId || "";
  const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);

  const { makePost, canPayForPost, isProcessing } = useFeedPosting(
    selectedNetwork?.id,
    userId,
    PostCategory.Video,
  );

  const [isThumbnailContainerHovered, setThumbnailContainerHovered] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const userIPFSKey = useSelector(selectNFTStorageAPI);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [localVideoFile, setLocalVideoFile] = useState<LocalFileData>();
  const [localImageFile, setLocalImageFile] = useState<LocalFileData>();

  const processCreateVideoPost = async (video: SocialFeedVideoMetadata) => {
    if (!canPayForPost) {
      setNotEnoughFundModal(true);
      return;
    }

    // we need this hack until the createdAt field is properly provided by the contract
    const videoWithCreationDate = {
      ...video,
      createdAt: new Date(),
    };

    try {
      await makePost(JSON.stringify(videoWithCreationDate));
    } catch (err) {
      console.error("post submit err", err);
      setToastError({
        title: "Post creation failed",
        message: err instanceof Error ? err.message : `${err}`,
      });
    }
    setIsUploading(false);
  };

  const onPressUpload = async () => {
    setIsLoading(true);
    if (
      !selectedWallet?.connected ||
      !selectedWallet.address ||
      !localVideoFile
    ) {
      return;
    }
    const pinataJWTKey =
      userIPFSKey || (await generateIpfsKey(selectedNetwork?.id || "", userId));
    if (!pinataJWTKey) {
      console.error("upload file err : No Pinata JWT");
      setToastError({
        title: "File upload failed",
        message: "No Pinata JWT",
      });
      return;
    }

    const uploadedFiles = await uploadFilesToPinata({
      pinataJWTKey,
      files: [
        {
          ...localVideoFile,
          //TODO: If !localImageFile => Generate thumbnail from video and use it as thumbnailFileData
          thumbnailFileData: localImageFile,
        },
      ],
    });
    if (!uploadedFiles.find((file) => file.url)) {
      console.error("upload file err : Fail to pin to IPFS");
      setToastError({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
      });
      return;
    }
    const video: SocialFeedVideoMetadata = {
      title,
      description,
      videoFile: uploadedFiles[0],
    };
    await processCreateVideoPost(video);
    setIsLoading(false);
    setLocalImageFile(undefined);
    setLocalVideoFile(undefined);
    setDescription("");
    setTitle("");
    onClose();
  };

  return (
    <ModalBase
      label="Upload video"
      visible={isVisible}
      onClose={onClose}
      width={UPLOAD_VIDEO_MODAL_WIDTH}
    >
      <View style={inputBoxStyle}>
        <FileUploader
          onUpload={(files) => setLocalImageFile(files[0])}
          mimeTypes={IMAGE_MIME_TYPES}
          maxUpload={1}
          setIsLoading={setIsLoading}
        >
          {({ onPress }) => (
            <CustomPressable
              onHoverOut={() => setThumbnailContainerHovered(false)}
              onHoverIn={() => setThumbnailContainerHovered(true)}
              style={[
                {
                  width: THUMBNAIL_SIZE,
                  height: THUMBNAIL_SIZE,
                },
                (isUploading || isLoading) && { opacity: 0.5 },
              ]}
              onPress={onPress}
              disabled={isUploading || isLoading}
            >
              {localImageFile?.url ? (
                <>
                  <DeleteButton
                    disabled={isUploading || isLoading}
                    onPress={() => setLocalImageFile(undefined)}
                    style={{ top: 12, right: 12 }}
                  />
                  <OptimizedImage
                    sourceURI={localImageFile?.url}
                    style={imgStyle}
                    width={THUMBNAIL_SIZE}
                    height={THUMBNAIL_SIZE}
                  />
                </>
              ) : (
                <View
                  style={[
                    {
                      borderRadius: layout.spacing_x1,
                      borderWidth: 1,
                      borderColor: neutral33,
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    },
                    isThumbnailContainerHovered && {
                      borderColor: secondaryColor,
                    },
                  ]}
                >
                  <View style={uploadButtonStyle}>
                    <SVG source={Img} width={16} height={16} />
                    <SpacerRow size={1} />
                    <BrandText style={fontSemibold14}>
                      Video Thumbnail
                    </BrandText>
                  </View>
                </View>
              )}
            </CustomPressable>
          )}
        </FileUploader>
        <View style={textBoxStyle}>
          <TextInputCustom
            rules={{ required: true }}
            noBrokenCorners
            variant="labelOutside"
            onChangeText={(text) => setTitle(text)}
            label="Video title"
            name="videoTitle"
          />
          <SpacerColumn size={2.5} />

          <TextInputCustom
            multiline
            noBrokenCorners
            variant="labelOutside"
            onChangeText={(text) => setDescription(text)}
            label="Video description"
            name="videoDescription"
          />
        </View>
      </View>

      <SpacerColumn size={2.5} />
      {localVideoFile?.url ? (
        <View>
          <DeleteButton
            disabled={isUploading || isLoading}
            onPress={() => setLocalVideoFile(undefined)}
            style={[
              { top: 12, right: 12 },
              (isUploading || isLoading) && { opacity: 0.5 },
            ]}
          />
          <Video
            source={{
              uri: ipfsURLToHTTPURL(localVideoFile.url),
            }}
            resizeMode={ResizeMode.COVER}
            useNativeControls
            style={{
              width: "100%",
              height: VIDEO_HEIGHT,
              marginTop: layout.spacing_x2,
              marginBottom: layout.spacing_x2,
            }}
            videoStyle={{
              width: "100%",
            }}
          />
        </View>
      ) : (
        <FileUploader
          onUpload={(files) => setLocalVideoFile(files[0])}
          style={uploadButtonStyle}
          mimeTypes={VIDEO_MIME_TYPES}
          setIsLoading={setIsLoading}
        >
          {({ onPress }) => (
            <TouchableOpacity
              style={[
                buttonContainerStyle,
                (isUploading || isLoading) && { opacity: 0.5 },
              ]}
              onPress={onPress}
              disabled={isUploading || isLoading}
            >
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

      <FeedFeeText
        networkId={selectedNetwork?.id}
        userId={selectedWallet?.userId}
        category={PostCategory.Video}
        style={{ marginTop: layout.spacing_x2 }}
      />

      <View style={footerStyle}>
        <BrandText style={footerTextStyle} numberOfLines={2}>
          By uploading, you confirm that your video complies with our Terms of
          Use.
        </BrandText>
        <PrimaryButton
          text="Upload"
          disabled={
            !localVideoFile?.url ||
            !title ||
            isUploading ||
            isProcessing ||
            isLoading ||
            !canPayForPost
          }
          size="SM"
          onPress={onPressUpload}
          isLoading={isUploading || isLoading || isProcessing}
        />
      </View>

      {isNotEnoughFundModal && (
        <NotEnoughFundModal
          visible
          onClose={() => setNotEnoughFundModal(false)}
        />
      )}
    </ModalBase>
  );
};

const buttonContainerStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: 40,
  borderRadius: 999,
  backgroundColor: neutral30,
};
const buttonTextStyle: TextStyle = {
  ...fontSemibold14,
  color: primaryColor,
};
const imgStyle: ImageStyle = {
  width: THUMBNAIL_SIZE,
  height: THUMBNAIL_SIZE,
  borderRadius: layout.spacing_x1,
};
const divideLineStyle: ViewStyle = {
  height: 1,
  width: UPLOAD_VIDEO_MODAL_WIDTH - 2,
  marginLeft: -layout.spacing_x2_5,
  backgroundColor: neutral33,
};
const footerStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
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
const textBoxStyle: ViewStyle = {
  width: 332,
};
const uploadButtonStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#2B2B33",
  borderRadius: 32,
  paddingLeft: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  height: 32,
  marginBottom: layout.spacing_x2,
};
