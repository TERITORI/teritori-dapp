import { ResizeMode, Video } from "expo-av";
import React, { FC, useState } from "react";
import {
  ImageStyle,
  Platform,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { useSelector } from "react-redux";

import Img from "../../../assets/icons/img.svg";
import VideoSVG from "../../../assets/icons/video.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useWalletControl } from "../../context/WalletControlProvider";
import { useFeedPosting } from "../../hooks/feed/useFeedPosting";
import { useIpfs } from "../../hooks/useIpfs";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkFeature } from "../../networks";
import { selectNFTStorageAPI } from "../../store/slices/settings";
import { generateIpfsKey, web3ToWeb2URI } from "../../utils/ipfs";
import { IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from "../../utils/mime";
import {
  neutral30,
  neutral33,
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontRegular14, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import {
  CustomLatLngExpression,
  PostCategory,
  SocialFeedVideoMetadata,
} from "../../utils/types/feed";
import { LocalFileData } from "../../utils/types/files";
import { BrandText } from "../BrandText";
import { DeleteButton } from "../FilePreview/DeleteButton";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import { FileUploader } from "../inputs/fileUploader";
import { FeedPostingProgressBar } from "../loaders/FeedPostingProgressBar";
import { SelectAudioVideo } from "../mini/SelectAudioVideo";
import { SelectPicture } from "../mini/SelectPicture";
import ModalBase from "../modals/ModalBase";
import { FeedFeeText } from "../socialFeed/FeedFeeText";
import { SpacerColumn, SpacerRow } from "../spacer";

import LocationRefinedSvg from "@/assets/icons/location-refined.svg";
import { MapModal } from "@/components/socialFeed/modals/MapModal/MapModal";
import { FeedPostingStepId, feedPostingStep } from "@/utils/feed/posting";

const UPLOAD_VIDEO_MODAL_WIDTH = 590;
const THUMBNAIL_SIZE = 198;
const VIDEO_HEIGHT = 300;
export const UploadVideoModal: FC<{
  onClose: () => void;
  isVisible: boolean;
}> = ({ onClose, isVisible }) => {
  const [isMapShown, setIsMapShown] = useState(false);
  const [location, setLocation] = useState<
    CustomLatLngExpression | undefined
  >();

  const { setToast } = useFeedbacks();
  const selectedNetwork = useSelectedNetworkInfo();
  const selectedWallet = useSelectedWallet();
  const userId = selectedWallet?.userId || "";
  const { uploadFilesToPinata, ipfsUploadProgress } = useIpfs();
  const postCategory = PostCategory.Video;
  const {
    makePost,
    canPayForPost,
    isProcessing,
    publishingFee,
    step,
    setStep,
  } = useFeedPosting(selectedNetwork?.id, userId, postCategory, () => {
    // Timeout here to let a few time to see the progress bar "100% Done"
    setTimeout(() => {
      setIsUploadLoading(false);
      setLocalImageFile(undefined);
      setLocalVideoFile(undefined);
      setDescription("");
      setTitle("");
      setIsProgressBarShown(false);
      onClose();
    }, 1000);
  });
  const [isThumbnailContainerHovered, setThumbnailContainerHovered] =
    useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isProgressBarShown, setIsProgressBarShown] = useState(false);
  const { showNotEnoughFundsModal, showConnectWalletModal } =
    useWalletControl();
  const isLoading = isUploadLoading || isProcessing;
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [localVideoFile, setLocalVideoFile] = useState<LocalFileData>();
  const [localImageFile, setLocalImageFile] = useState<LocalFileData>();
  const isPublishDisabled =
    !localVideoFile?.url || !title || isLoading || !canPayForPost;

  const processCreateVideoPost = async (video: SocialFeedVideoMetadata) => {
    // we need this hack until the createdAt field is properly provided by the contract
    const videoWithCreationDate = {
      ...video,
      createdAt: new Date(),
    };

    try {
      await makePost(JSON.stringify(videoWithCreationDate));
    } catch (err) {
      console.error("post submit err", err);
      setIsUploadLoading(false);
      setIsProgressBarShown(false);
      setToast({
        title: "Post creation failed",
        message: err instanceof Error ? err.message : `${err}`,
        mode: "normal",
        type: "success",
      });
    }
  };

  const onPressUpload = async () => {
    const action = "Publish a Video";
    if (!selectedWallet?.address || !selectedWallet.connected) {
      showConnectWalletModal({
        forceNetworkFeature: NetworkFeature.SocialFeed,
        action,
      });
      return;
    }
    if (!canPayForPost) {
      showNotEnoughFundsModal({
        action,
        cost: {
          amount: publishingFee.toString(),
          denom: publishingFee.denom || "",
        },
      });
      return;
    }
    if (!localVideoFile) {
      return;
    }
    setIsUploadLoading(true);
    setIsProgressBarShown(true);
    setStep(feedPostingStep(FeedPostingStepId.GENERATING_KEY));

    const pinataJWTKey =
      userIPFSKey || (await generateIpfsKey(selectedNetwork?.id || "", userId));
    if (!pinataJWTKey) {
      console.error("upload file err : No Pinata JWT");
      setToast({
        title: "File upload failed",
        message: "No Pinata JWT",
        mode: "normal",
        type: "success",
      });
      setIsUploadLoading(false);
      return;
    }
    setStep(feedPostingStep(FeedPostingStepId.UPLOADING_FILES));

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
      setToast({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
        mode: "normal",
        type: "success",
      });
      setIsUploadLoading(false);
      return;
    }
    const video: SocialFeedVideoMetadata = {
      title,
      description,
      videoFile: uploadedFiles[0],
      location,
    };
    await processCreateVideoPost(video);
  };

  return (
    <ModalBase
      label="Upload video"
      visible={isVisible}
      onClose={onClose}
      width={UPLOAD_VIDEO_MODAL_WIDTH}
    >
      <KeyboardAwareScrollView>
        <View
          style={
            Platform.OS === "web"
              ? inputBoxStyle
              : {
                  flexDirection: "column",
                  gap: layout.spacing_x2_5,
                }
          }
        >
          {Platform.OS === "web" ? (
            <FileUploader
              onUpload={(files) => setLocalImageFile(files[0])}
              mimeTypes={IMAGE_MIME_TYPES}
              maxUpload={1}
              setIsLoading={setIsUploadLoading}
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
                    isLoading && { opacity: 0.5 },
                  ]}
                  onPress={onPress}
                  disabled={isLoading}
                >
                  {localImageFile?.url ? (
                    <>
                      <DeleteButton
                        disabled={isLoading}
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
                        <BrandText style={fontRegular14}>
                          Video Thumbnail
                        </BrandText>
                      </View>
                    </View>
                  )}
                </CustomPressable>
              )}
            </FileUploader>
          ) : (
            <View>
              {localImageFile?.url ? (
                <View style={{ alignItems: "center" }}>
                  <DeleteButton
                    disabled={isLoading}
                    onPress={() => setLocalImageFile(undefined)}
                    style={{ top: 3, right: 12 }}
                  />
                  <OptimizedImage
                    sourceURI={localImageFile?.url}
                    style={imgStyle}
                    width={THUMBNAIL_SIZE}
                    height={THUMBNAIL_SIZE}
                  />
                </View>
              ) : (
                <SelectPicture
                  onSelectFile={(files) => setLocalImageFile(files[0])}
                  files={localImageFile ? [localImageFile] : []}
                  squareSelector
                  squareSelectorOptions={{
                    placeholder: "Video Thumbnail",
                    height: THUMBNAIL_SIZE,
                  }}
                />
              )}
            </View>
          )}
          <View style={textBoxStyle}>
            <TextInputCustom
              rules={{ required: true }}
              noBrokenCorners
              variant="labelOutside"
              onChangeText={(text) => setTitle(text)}
              label="Video title"
              name="videoTitle"
              disabled={isLoading}
              style={isLoading && { opacity: 0.5 }}
            />
            <SpacerColumn size={2.5} />

            <TextInputCustom
              multiline
              noBrokenCorners
              variant="labelOutside"
              onChangeText={(text) => setDescription(text)}
              label="Video description"
              name="videoDescription"
              disabled={isLoading}
              style={isLoading && { opacity: 0.5 }}
            />
          </View>
        </View>

        <SpacerColumn size={3} />
        {localVideoFile?.url ? (
          <View>
            <DeleteButton
              disabled={isLoading}
              onPress={() => setLocalVideoFile(undefined)}
              style={[{ top: 12, right: 12 }, isLoading && { opacity: 0.5 }]}
            />
            <Video
              source={{
                uri: web3ToWeb2URI(localVideoFile.url),
              }}
              resizeMode={ResizeMode.COVER}
              useNativeControls
              style={{
                width: "100%",
                height: VIDEO_HEIGHT - 100,
                marginTop: layout.spacing_x2,
                marginBottom: layout.spacing_x2,
              }}
              videoStyle={{
                width: "100%",
              }}
            />
          </View>
        ) : (
          <View>
            {Platform.OS !== "web" ? (
              <SelectAudioVideo
                onSelectFile={(files) => setLocalVideoFile(files[0])}
                files={localVideoFile ? [localVideoFile] : []}
                type="video"
                title={
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      borderColor: neutral33,
                      borderWidth: 1,
                      borderRadius: layout.borderRadius,
                      paddingVertical: layout.spacing_x2,
                    }}
                  >
                    <BrandText style={[fontSemibold14]}>Add Video</BrandText>
                  </View>
                }
              />
            ) : (
              <FileUploader
                onUpload={(files) => setLocalVideoFile(files[0])}
                style={uploadButtonStyle}
                mimeTypes={VIDEO_MIME_TYPES}
                setIsLoading={setIsUploadLoading}
              >
                {({ onPress }) => (
                  <TouchableOpacity
                    style={[
                      buttonContainerStyle,
                      isLoading && { opacity: 0.5 },
                    ]}
                    onPress={onPress}
                    disabled={isLoading}
                  >
                    <SVG
                      source={VideoSVG}
                      width={20}
                      height={20}
                      color={primaryColor}
                    />
                    <SpacerRow size={1} />
                    <BrandText style={buttonTextStyle}>Add video</BrandText>
                  </TouchableOpacity>
                )}
              </FileUploader>
            )}
          </View>
        )}

        <SpacerColumn size={2.5} />
        <TouchableOpacity
          style={[buttonContainerStyle, isLoading && { opacity: 0.5 }]}
          onPress={() => setIsMapShown(true)}
          disabled={isLoading}
        >
          <SVG
            source={LocationRefinedSvg}
            width={20}
            height={20}
            stroke={!location ? primaryColor : undefined}
            color={location ? primaryColor : undefined}
          />
          <SpacerRow size={1} />
          <BrandText style={buttonTextStyle}>Handle location</BrandText>
        </TouchableOpacity>

        <SpacerColumn size={3} />
        <BrandText style={[fontRegular14, { color: neutral77 }]}>
          Provide 2k video for highest video quality.
        </BrandText>
        <SpacerColumn size={2.5} />

        <View style={divideLineStyle} />

        <FeedFeeText
          networkId={selectedNetwork?.id}
          userId={selectedWallet?.userId}
          category={postCategory}
          style={{ marginTop: layout.spacing_x2 }}
        />

        <View style={footerStyle}>
          <BrandText style={footerTextStyle} numberOfLines={2}>
            By uploading, you confirm that your video complies with our Terms of
            Use.
          </BrandText>
          <PrimaryButton
            text="Publish"
            disabled={isPublishDisabled}
            size="SM"
            onPress={onPressUpload}
            isLoading={isLoading}
            loader
          />
        </View>

        {step.id !== "UNDEFINED" && isProgressBarShown && (
          <>
            <View style={divideLineStyle} />
            <SpacerColumn size={2} />
            <FeedPostingProgressBar
              step={step}
              ipfsUploadProgress={ipfsUploadProgress}
            />
            <SpacerColumn size={2} />
          </>
        )}
        {Platform.OS !== "web" ? <SpacerColumn size={20} /> : null}
      </KeyboardAwareScrollView>

      {isMapShown && (
        <MapModal
          visible
          onClose={() => setIsMapShown(false)}
          setLocation={setLocation}
          location={location}
          postCategory={postCategory}
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
  ...fontRegular14,
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
  ...fontRegular14,

  color: neutral77,
  width: "55%",
};
const inputBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
};
const textBoxStyle: ViewStyle = {
  width: Platform.OS === "web" ? 332 : "100%",
};
const uploadButtonStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#2B2B33",
  borderRadius: 32,
  paddingLeft: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  height: 32,
  // marginBottom: layout.spacing_x2,
};
