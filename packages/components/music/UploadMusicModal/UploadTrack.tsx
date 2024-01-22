import React, { useState } from "react";
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import Add from "../../../../assets/icons/add-primary.svg";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useWalletControl } from "../../../context/WalletControlProvider";
import { useFeedPosting } from "../../../hooks/feed/useFeedPosting";
import { useIpfs } from "../../../hooks/useIpfs";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { NetworkFeature } from "../../../networks";
import { selectNFTStorageAPI } from "../../../store/slices/settings";
import { generateIpfsKey } from "../../../utils/ipfs";
import { AUDIO_MIME_TYPES } from "../../../utils/mime";
import {
  neutral30,
  neutral33,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/files";
import { BrandText } from "../../BrandText";
import { EditableAudioPreview } from "../../FilePreview/EditableAudioPreview";
import { SVG } from "../../SVG";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { FileUploader } from "../../fileUploader";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import {
  FeedPostingProgressBar,
  feedPostingStep,
  FeedPostingStepId,
} from "../../loaders/FeedPostingProgressBar";
import { FeedFeeText } from "../../socialFeed/FeedFeeText";
import {
  PostCategory,
  SocialFeedTrackMetadata,
} from "../../socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn, SpacerRow } from "../../spacer";

interface Props {
  onUploadDone: () => void;
}

const UPLOAD_ALBUM_MODAL_WIDTH = 564;

export const UploadTrack: React.FC<Props> = ({ onUploadDone }) => {
  const { setToastError } = useFeedbacks();
  const selectedNetwork = useSelectedNetworkInfo();
  const selectedWallet = useSelectedWallet();
  const userId = selectedWallet?.userId;
  const { uploadFilesToPinata, ipfsUploadProgress } = useIpfs();
  const postCategory = PostCategory.MusicAudio;
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
      setIsProgressBarShown(false);
      onUploadDone();
    }, 1000);
  });
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isProgressBarShown, setIsProgressBarShown] = useState(false);
  const { showNotEnoughFundsModal, showConnectWalletModal } =
    useWalletControl();
  const isLoading = isUploadLoading || isProcessing;
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [localAudioFile, setLocalAudioFile] = useState<LocalFileData>();

  const processCreateMusicAudioPost = async (
    track: SocialFeedTrackMetadata,
  ) => {
    // we need this hack until the createdAt field is properly provided by the contract
    const trackWithCreationDate = {
      ...track,
      createdAt: new Date().toISOString(),
    };

    try {
      await makePost(JSON.stringify(trackWithCreationDate));
    } catch (err) {
      console.error("post submit err", err);
      setIsUploadLoading(false);
      setIsProgressBarShown(false);
      setToastError({
        title: "Post creation failed",
        message: err instanceof Error ? err.message : `${err}`,
      });
    }
  };

  const onPressUpload = async () => {
    const action = "Publish a Track";
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
          amount: publishingFee.amount.toString(),
          denom: publishingFee.denom || "",
        },
      });
      return;
    }
    if (!localAudioFile) {
      return;
    }
    setIsUploadLoading(true);
    setIsProgressBarShown(true);
    setStep(feedPostingStep(FeedPostingStepId.GENERATING_KEY));

    const pinataJWTKey =
      userIPFSKey || (await generateIpfsKey(selectedNetwork?.id || "", userId));
    if (!pinataJWTKey) {
      console.error("upload file err : No Pinata JWT");
      setToastError({
        title: "File upload failed",
        message: "No Pinata JWT",
      });
      setIsUploadLoading(false);
      return;
    }
    setStep(feedPostingStep(FeedPostingStepId.UPLOADING_FILES));

    const uploadedFiles = await uploadFilesToPinata({
      pinataJWTKey,
      files: [localAudioFile],
    });
    if (!uploadedFiles.find((file) => file.url)) {
      console.error("upload file err : Fail to pin to IPFS");
      setToastError({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
      });
      setIsUploadLoading(false);
      return;
    }
    const track: SocialFeedTrackMetadata = {
      title,
      description,
      audioFile: uploadedFiles[0],
    };
    await processCreateMusicAudioPost(track);
  };

  return (
    <>
      <View style={inputBoxStyle}>
        <View style={textBoxStyle}>
          <TextInputCustom
            rules={{ required: true }}
            noBrokenCorners
            variant="labelOutside"
            onChangeText={(text) => setTitle(text)}
            label="Track name"
            name="trackName"
            disabled={isLoading}
            style={isLoading && { opacity: 0.5 }}
          />
          <SpacerColumn size={2.5} />

          <TextInputCustom
            multiline
            noBrokenCorners
            variant="labelOutside"
            onChangeText={(text) => setDescription(text)}
            label="Track description"
            name="trackDescription"
            disabled={isLoading}
            style={isLoading && { opacity: 0.5 }}
          />
        </View>
      </View>

      <SpacerColumn size={2} />
      {localAudioFile?.url ? (
        <EditableAudioPreview
          file={localAudioFile}
          onDelete={() => setLocalAudioFile(undefined)}
          onUploadThumbnail={(updatedFile) => setLocalAudioFile(updatedFile)}
        />
      ) : (
        <FileUploader
          onUpload={(files) => setLocalAudioFile(files[0])}
          style={uploadButtonStyle}
          mimeTypes={AUDIO_MIME_TYPES}
          setIsLoading={setIsUploadLoading}
        >
          {({ onPress }) => (
            <TouchableOpacity
              style={[buttonContainerStyle, isLoading && { opacity: 0.5 }]}
              onPress={onPress}
              disabled={isLoading}
            >
              <SVG source={Add} width={20} height={20} stroke={primaryColor} />
              <SpacerRow size={1} />
              <BrandText style={buttonTextStyle}>Add audio</BrandText>
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
        Provide FLAC, WAV or AIFF for highest audio quality.
      </BrandText>
      <SpacerColumn size={2.5} />

      <View style={divideLineStyle} />

      <FeedFeeText
        networkId={selectedNetwork?.id}
        userId={selectedWallet?.userId}
        category={postCategory}
        style={{ marginTop: layout.spacing_x2 }}
      />

      <View style={footerBottomCStyle}>
        <BrandText
          style={[footerTextStyle, { width: "55%" }]}
          numberOfLines={2}
        >
          By uploading, you confirm that your sounds comply with our Terms of
          Use.
        </BrandText>
        <PrimaryButton
          text="Upload"
          disabled={
            !localAudioFile?.url || !title || isLoading || !canPayForPost
          }
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
    </>
  );
};

const buttonContainerStyle: ViewStyle = {
  marginTop: layout.spacing_x2_5,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: 40,
  borderRadius: 999,
  backgroundColor: neutral30,
  marginBottom: layout.spacing_x2,
};
const buttonTextStyle: TextStyle = {
  ...fontSemibold14,
  color: primaryColor,
};
const divideLineStyle: ViewStyle = {
  height: 1,
  width: UPLOAD_ALBUM_MODAL_WIDTH - 2,
  marginLeft: -layout.spacing_x2_5,
  backgroundColor: neutral33,
};
const footerBottomCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: layout.spacing_x1,
  marginBottom: layout.spacing_x2,
};
const footerTextStyle: TextStyle = {
  ...fontSemibold14,

  color: neutral77,
};
const inputBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
};
const textBoxStyle: ViewStyle = {
  width: "100%",
};
const uploadButtonStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#2B2B33",
  borderRadius: 32,
  paddingLeft: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  paddingVertical: layout.spacing_x1,
};
