import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { UPLOAD_ALBUM_MODAL_WIDTH } from "./index";
import { pinataPinFileToIPFS } from "../../../candymachine/pinata-upload";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId } from "../../../networks";
import { selectNFTStorageAPI } from "../../../store/slices/settings";
import { generateIpfsKey } from "../../../utils/ipfs";
import { AUDIO_MIME_TYPES } from "../../../utils/mime";
import {
  neutral33,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/files";
import { BrandText } from "../../BrandText";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { FileUploader } from "../../fileUploader";

export const Step1Component: React.FC<{
  setStep: Dispatch<SetStateAction<number>>;
  setUploadFiles: Dispatch<SetStateAction<LocalFileData[]>>;
}> = ({ setStep, setUploadFiles }) => {
  const [uploadFiles1, setUploadFiles1] = useState<LocalFileData[]>([]);
  const [canContinue, setCanContinue] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const userIPFSKey = useSelector(selectNFTStorageAPI);

  useEffect(() => {
    setCanContinue(uploadFiles1.length > 0);
  }, [uploadFiles1]);

  const uploadMusicFiles = async (files: LocalFileData[]) => {
    const pinataJWTKey =
      userIPFSKey || (await generateIpfsKey(selectedNetworkId, userId));
    files.map((file) => {
      const url = URL.createObjectURL(file.file);
      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", async () => {
        window.URL.revokeObjectURL(url);
        if (!pinataJWTKey) {
          return;
        }
        setIsUploading(true);
        const pinataRes = await pinataPinFileToIPFS({
          file,
          pinataJWTKey,
        });
        if (pinataRes.IpfsHash !== "") {
          setUploadFiles1((uploadFiles1) => [...uploadFiles1, file]);
        }
        setIsUploading(false);
      });
    });
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
          disabled={!canContinue}
          isLoading={isUploading}
          onPress={() => {
            setUploadFiles([...uploadFiles1]);
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
