import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { UPLOAD_ALBUM_MODAL_WIDTH } from "./index";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId } from "../../../networks";
import { selectNFTStorageAPI } from "../../../store/slices/settings";
import { generateIpfsKey, uploadFilesToPinata } from "../../../utils/ipfs";
import { AUDIO_MIME_TYPES } from "../../../utils/mime";
import {
  neutral33,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { LocalFileData, RemoteFileData } from "../../../utils/types/files";
import { BrandText } from "../../BrandText";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { FileUploader } from "../../fileUploader";

export const Step1Component: React.FC<{
  setStep: Dispatch<SetStateAction<number>>;
  setUploadedAudioFilesStep1: Dispatch<SetStateAction<RemoteFileData[]>>;
  isLoading: boolean;
}> = ({ setStep, setUploadedAudioFilesStep1, isLoading }) => {
  const [uploadedFiles1, setUploadedFiles1] = useState<RemoteFileData[]>([]);
  const [canContinue, setCanContinue] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { setToastError } = useFeedbacks();

  useEffect(() => {
    setCanContinue(uploadedFiles1.length > 0);
  }, [uploadedFiles1]);

  const uploadMusicFiles = async (files: LocalFileData[]) => {
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

    const uploadedFiles = await uploadFilesToPinata({
      files,
      pinataJWTKey,
    });

    if (!uploadedFiles.find((file) => file.url)) {
      console.error("upload file err : Fail to pin to IPFS");
      setToastError({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
      });
      return;
    }
    setUploadedFiles1(uploadedFiles);
    setIsUploading(false);
  };

  return (
    <>
      <View style={styles.contentContainer}>
        <FileUploader
          multiple
          onUpload={uploadMusicFiles}
          mimeTypes={AUDIO_MIME_TYPES}
          style={{
            marginTop: layout.padding_x3,
            width: "100%",
          }}
        />
      </View>
      <View style={styles.divideLine} />
      <View style={styles.footer}>
        <BrandText style={styles.footerText}>
          Provide FLAC, WAV or AIFF for highest audio quality.
        </BrandText>
        <PrimaryButton
          text="Continue"
          size="SM"
          disabled={!canContinue || isUploading || isLoading}
          isLoading={isUploading || isLoading}
          onPress={() => {
            setUploadedAudioFilesStep1(uploadedFiles1);
            setStep(1);
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: layout.padding_x2_5,
  },
  uploadBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: layout.padding_x1,
    borderStyle: "dotted",
    borderWidth: 1,
    backgroundColor: "rgba(22, 187, 255, 0.1)",
    paddingVertical: layout.padding_x4,
    borderColor: "#16BBFF",
    borderRadius: layout.padding_x1_5,
  },
  buttonContainer: {
    marginTop: layout.padding_x2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: primaryColor,
      paddingHorizontal: layout.padding_x1_5,
      paddingVertical: layout.padding_x1,
      marginBottom: layout.padding_x2_5,
      borderRadius: layout.padding_x1,
      backgroundColor: "#2B2B33",
    },
  ]),
  divideLine: {
    height: 1,
    width: UPLOAD_ALBUM_MODAL_WIDTH - 2,
    marginLeft: -layout.padding_x2_5,
    backgroundColor: neutral33,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.padding_x2_5,
    paddingVertical: layout.padding_x2,
  },
  footerText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]),
});
