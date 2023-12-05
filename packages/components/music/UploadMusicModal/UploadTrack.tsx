import React, { useState } from "react";
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import Add from "../../../../assets/icons/add-primary.svg";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useFeedPosting } from "../../../hooks/feed/useFeedPosting";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { selectNFTStorageAPI } from "../../../store/slices/settings";
import { generateIpfsKey, uploadFilesToPinata } from "../../../utils/ipfs";
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
import { FeedFeeText } from "../../socialFeed/FeedFeeText";
import {
  PostCategory,
  SocialFeedTrackMetadata,
} from "../../socialFeed/NewsFeed/NewsFeed.type";
import { NotEnoughFundModal } from "../../socialFeed/NewsFeed/NotEnoughFundModal";
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
  const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);
  const { makePost, canPayForPost, isProcessing } = useFeedPosting(
    selectedNetwork?.id,
    userId,
    PostCategory.MusicAudio,
    onUploadDone,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const userIPFSKey = useSelector(selectNFTStorageAPI);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [localAudioFile, setLocalAudioFile] = useState<LocalFileData>();

  const processCreateMusicAudioPost = async (
    track: SocialFeedTrackMetadata,
  ) => {
    if (!canPayForPost) {
      setNotEnoughFundModal(true);
      return;
    }

    // we need this hack until the createdAt field is properly provided by the contract
    const trackWithCreationDate = {
      ...track,
      createdAt: new Date().toISOString(),
    };

    try {
      await makePost(JSON.stringify(trackWithCreationDate));
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
      !localAudioFile
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
      files: [localAudioFile],
    });
    if (!uploadedFiles.find((file) => file.url)) {
      console.error("upload file err : Fail to pin to IPFS");
      setToastError({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
      });
      return;
    }
    const track: SocialFeedTrackMetadata = {
      title,
      description,
      audioFile: uploadedFiles[0],
    };
    await processCreateMusicAudioPost(track);
    setIsLoading(false);
    onUploadDone();
  };

  return (
    <>
      {isNotEnoughFundModal && (
        <NotEnoughFundModal
          visible
          onClose={() => setNotEnoughFundModal(false)}
        />
      )}

      <View style={inputBoxStyle}>
        <View style={textBoxStyle}>
          <TextInputCustom
            rules={{ required: true }}
            noBrokenCorners
            variant="labelOutside"
            onChangeText={(text) => setTitle(text)}
            label="Track name"
            name="trackName"
          />
          <SpacerColumn size={2.5} />

          <TextInputCustom
            multiline
            noBrokenCorners
            variant="labelOutside"
            onChangeText={(text) => setDescription(text)}
            label="Track description"
            name="trackDescription"
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
        category={PostCategory.MusicAudio}
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
            !localAudioFile?.url ||
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
