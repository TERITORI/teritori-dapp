import React, { useState } from "react";
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import Add from "../../../../assets/icons/add-primary.svg";
import { Coin } from "../../../api/teritori-chain/cosmos/base/v1beta1/coin";
import { useCanPay } from "../../../hooks/feed/useCanPay";
import { useFeedPostFee } from "../../../hooks/feed/useFeedPostFee";
import { useMakeTrack } from "../../../hooks/feed/useMakeTrack";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getStakingCurrency } from "../../../networks";
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
import { PostCategory } from "../../socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn, SpacerRow } from "../../spacer";

interface Props {
  onUploadDone: () => void;
}

const UPLOAD_ALBUM_MODAL_WIDTH = 564;

export const UploadTrack: React.FC<Props> = ({ onUploadDone }) => {
  const selectedWallet = useSelectedWallet();
  const userId = selectedWallet?.userId;
  const networkId = useSelectedNetworkId();
  const { postFee } = useFeedPostFee(networkId, PostCategory.MusicAudio);
  const feeCurrency = getStakingCurrency(networkId);
  const cost: Coin = {
    amount: postFee.toString(),
    denom: feeCurrency?.denom || "",
  };
  const canPay = useCanPay({ userId, cost });
  const { makeTrack, isProcessing, isLoading } = useMakeTrack({
    userId,
    onSuccess: onUploadDone,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [localAudioFile, setLocalAudioFile] = useState<LocalFileData>();

  const onPressUpload = async () => {
    if (!localAudioFile) return;
    await makeTrack({ title, description, localAudioFile });
    onUploadDone();
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
          setIsLoading={setIsUploading}
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
          text={!canPay ? "Not enough funds" : "Upload"}
          disabled={
            !localAudioFile?.url ||
            !title ||
            isUploading ||
            isProcessing ||
            isLoading ||
            !canPay
          }
          size="SM"
          onPress={onPressUpload}
          isLoading={isLoading || isProcessing}
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
