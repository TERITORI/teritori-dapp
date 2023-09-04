import React, {
  createRef,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { View, Pressable, StyleSheet, Image, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import CoverImg from "../../../assets/icons/player/cover-img.png";
import Img from "../../../assets/icons/player/img.svg";
import { pinataPinFileToIPFS } from "../../candymachine/pinata-upload";
import { signingVideoPlayerClient } from "../../client-creators/videoplayerClient";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { selectNFTStorageAPI } from "../../store/slices/settings";
import { defaultSocialFeedFee } from "../../utils/fee";
import { generateIpfsKey, ipfsURLToHTTPURL } from "../../utils/ipfs";
import { VIDEO_MIME_TYPES } from "../../utils/mime";
import {
  neutral17,
  neutral33,
  neutral77,
  primaryColor,
  secondaryColor,
  neutralA3,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { LocalFileData } from "../../utils/types/files";
import { VideoMetaInfo } from "../../utils/types/video";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { FileUploader } from "../fileUploader";
import ModalBase from "../modals/ModalBase";

interface UploadVideoModalProps {
  onClose: () => void;
  isVisible: boolean;
}
const modalWidth = 564;

export const UploadVideoModal: React.FC<UploadVideoModalProps> = ({
  onClose,
  isVisible,
}) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const [step, setStep] = useState<number>(0);
  const [videoFile, setVideoFile] = useState<VideoMetaInfo | null>(null);

  const uploadVideo = async () => {
    if (!videoFile) return;
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
          identifier: uuidv4(),
          metadata: JSON.stringify(videoFile),
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
    setStep(0);
    onClose();
  };

  return (
    <ModalBase
      label="Upload Video"
      visible={isVisible}
      onClose={() => {
        setStep(0);
        onClose();
      }}
      width={modalWidth}
    >
      {step === 0 && (
        <Step1Component setStep={setStep} setUploadVideo={setVideoFile} />
      )}
      {step === 1 && (
        <Step2Component
          videoFile={videoFile!}
          setVideoFile={setVideoFile}
          uploadVideo={uploadVideo}
        />
      )}
    </ModalBase>
  );
};

const Step1Component: React.FC<{
  setStep: Dispatch<SetStateAction<number>>;
  setUploadVideo: Dispatch<SetStateAction<VideoMetaInfo | null>>;
}> = ({ setStep, setUploadVideo }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const [uploadFile, setUploadFile] = useState<VideoMetaInfo | null>(null);
  const [canContinue, setCanContinue] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const paddingHorizontal = layout.spacing_x2_5;
  const styles = StyleSheet.create({
    contentContainer: {
      paddingBottom: layout.spacing_x2_5,
    },
    uploadBox: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: layout.spacing_x1,
      borderStyle: "dotted",
      borderWidth: 1,
      backgroundColor: "rgba(22, 187, 255, 0.1)",
      paddingVertical: layout.spacing_x4,
      borderColor: "#16BBFF",
      borderRadius: layout.spacing_x1_5,
    },
    buttonContainer: {
      marginTop: layout.spacing_x2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor,
        paddingHorizontal: layout.spacing_x1_5,
        paddingVertical: layout.spacing_x1,
        marginBottom: layout.spacing_x2_5,
        borderRadius: layout.spacing_x1,
        backgroundColor: "#2B2B33",
      },
    ]),
    divideLine: {
      height: 1,
      width: modalWidth - 2,
      marginLeft: -paddingHorizontal,
      backgroundColor: neutral33,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: layout.spacing_x2_5,
      paddingVertical: layout.spacing_x2,
    },
    footerText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutral77,
      },
    ]),
  });

  useEffect(() => {
    setCanContinue(!!uploadFile);
  }, [uploadFile]);

  const uploadVideoFile = async (files: LocalFileData[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const url = URL.createObjectURL(file.file);
    const video = document.createElement("video");
    video.preload = "metadata";
    const pinataJWTKey =
      userIPFSKey || (await generateIpfsKey(selectedNetworkId, userId));
    video.addEventListener("loadedmetadata", async () => {
      window.URL.revokeObjectURL(video.src);
      if (!pinataJWTKey) {
        return;
      }
      setIsUploading(true);
      const ipfsHash_data = await pinataPinFileToIPFS({
        file,
        pinataJWTKey,
      });
      const duration = video.duration;
      if (ipfsHash_data.IpfsHash! !== "") {
        setUploadFile({
          title: file.file.name,
          description: "",
          url: ipfsHash_data.IpfsHash,
          image: "",
          duration,
        });
      }
      setIsUploading(false);
    });
    video.src = url;
  };

  return (
    <>
      <View style={styles.contentContainer}>
        <FileUploader
          onUpload={uploadVideoFile}
          mimeTypes={VIDEO_MIME_TYPES}
          style={{
            marginTop: layout.spacing_x3,
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
            setUploadVideo(uploadFile);
            setStep(1);
          }}
        />
      </View>
    </>
  );
};

const Step2Component: React.FC<{
  videoFile: VideoMetaInfo;
  setVideoFile: Dispatch<SetStateAction<VideoMetaInfo | null>>;
  uploadVideo: () => void;
}> = ({ videoFile, setVideoFile, uploadVideo }) => {
  const inputFileRef = createRef<HTMLInputElement>();
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const paddingHorizontal = layout.spacing_x2_5;
  const imgSize = 172;
  const styles = StyleSheet.create({
    buttonContainer: {
      marginTop: layout.spacing_x2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 40,
      borderRadius: layout.spacing_x1,
      backgroundColor: "#2B2B33",
      gap: layout.spacing_x1,
      marginBottom: layout.spacing_x2_5,
    },
    buttonText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor,
      },
    ]),
    divideLine: {
      height: 1,
      width: modalWidth - 2,
      marginLeft: -paddingHorizontal,
      backgroundColor: neutral33,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: layout.spacing_x2_5,
      paddingVertical: layout.spacing_x2,
    },
    footerText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutral77,
        width: "55%",
      },
    ]),
    songGroup: {
      flexDirection: "column",
      gap: layout.spacing_x1,
    },
    unitBox: {
      backgroundColor: neutral17,
      paddingHorizontal: layout.spacing_x1_5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: layout.spacing_x1,
      height: 40,
    },
    oneLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.spacing_x1_5,
    },
    inputBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    imgBox: {
      position: "relative",
    },
    img: {
      width: imgSize,
      height: imgSize,
      borderRadius: layout.spacing_x1,
    },
    textBox: {
      width: 332,
    },
    inputTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutralA3,
        marginBottom: layout.spacing_x1_5,
      },
    ]),
    required: StyleSheet.flatten([
      fontSemibold14,
      {
        color: "#FFAEAE",
        paddingLeft: layout.spacing_x0_5,
      },
    ]),
    input: StyleSheet.flatten([
      fontSemibold14,
      {
        color: secondaryColor,
        padding: layout.spacing_x2,
        borderWidth: 1,
        borderColor: neutral33,
        marginBottom: layout.spacing_x2_5,
        borderRadius: 10,
        outlineStyle: "none",
      },
    ]),
    uploadImg: {
      width: "100%",
      position: "absolute",
      left: 0,
      bottom: layout.spacing_x1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    uploadButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#2B2B33",
      borderRadius: layout.spacing_x4,
      gap: layout.spacing_x1,
      paddingLeft: layout.spacing_x1,
      paddingRight: layout.spacing_x1_5,
      paddingVertical: layout.spacing_x1,
    },
  });

  const clickUploadImage = () => {
    inputFileRef.current?.click();
  };

  const onInputFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target?.files?.[0];
    const pinataJWTKey = await generateIpfsKey(selectedNetworkId, userId);
    if (file && pinataJWTKey) {
      const local_file_data = {
        file,
        fileName: file.name,
        mimeType: "",
        size: 0,
        url: "",
        fileType: "image",
      } as LocalFileData;
      const pinataJWTKey =
        userIPFSKey || (await generateIpfsKey(selectedNetworkId, userId));
      if (!pinataJWTKey) {
        setIsUploading(false);
        return;
      }
      const ipfsHash_data = await pinataPinFileToIPFS({
        file: local_file_data,
        pinataJWTKey,
      });

      const videoImage = ipfsHash_data.IpfsHash;
      setVideoFile({ ...videoFile, image: videoImage });
    }
  };

  const handleVideoNameTextChange = (text: string) => {
    setVideoFile({ ...videoFile, title: text });
  };

  const handleVideoDescriptionTextChange = (text: string) => {
    setVideoFile({ ...videoFile, description: text });
  };

  return (
    <>
      <input
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={onInputFileChange}
        ref={inputFileRef}
      />
      <View style={styles.inputBox}>
        <View style={styles.imgBox}>
          <Image
            source={
              !videoFile?.image ? CoverImg : ipfsURLToHTTPURL(videoFile.image)
            }
            style={styles.img}
          />
          <View style={styles.uploadImg}>
            <Pressable style={styles.uploadButton} onPress={clickUploadImage}>
              <SVG
                source={Img}
                width={layout.spacing_x2}
                height={layout.spacing_x2}
              />
              <BrandText style={fontSemibold14}>upload image</BrandText>
            </Pressable>
          </View>
        </View>
        <View style={styles.textBox}>
          <BrandText style={styles.inputTitle}>
            Video name<BrandText style={styles.required}>*</BrandText>
          </BrandText>
          <TextInput
            style={styles.input}
            onChangeText={handleVideoNameTextChange}
          />
          <BrandText style={styles.inputTitle}>
            Album Description<BrandText style={styles.required}>*</BrandText>
          </BrandText>
          <TextInput
            style={styles.input}
            onChangeText={handleVideoDescriptionTextChange}
            numberOfLines={4}
            multiline
          />
        </View>
      </View>

      <View style={styles.divideLine} />

      <View style={styles.footer}>
        <BrandText style={styles.footerText} numberOfLines={2}>
          By uploading, you confirm that your sounds comply with our Terms of
          Use.
        </BrandText>
        <PrimaryButton
          text="Upload"
          size="SM"
          disabled={
            videoFile.image === "" ||
            videoFile.title.trim() === "" ||
            videoFile.description.trim() === ""
          }
          onPress={uploadVideo}
          isLoading={isUploading}
        />
      </View>
    </>
  );
};
