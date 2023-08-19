import React, {
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { View, Pressable, StyleSheet, TextInput, Image } from "react-native";
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
  const paddingHorizontal = layout.padding_x2_5;
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
      width: modalWidth - 2,
      marginLeft: -paddingHorizontal,
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

  const [uploadFile, setUploadFile] = useState<VideoMetaInfo | null>(null);
  const [canContinue, setCanContinue] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const userIPFSKey = useSelector(selectNFTStorageAPI);

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
      const pinataRes = await pinataPinFileToIPFS({
        file,
        pinataJWTKey,
      });
      const duration = video.duration;
      if (pinataRes.IpfsHash! !== "") {
        setUploadFile({
          title: file.file.name,
          description: "",
          url: pinataRes.IpfsHash,
          coverImage: "",
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
            marginTop: layout.padding_x3,
            width: "100%",
          }}
        />
      </View>
      <View style={styles.divideLine} />
      <View style={styles.footer}>
        <BrandText style={styles.footerText}>
          Provide 2k video for highest video quality.
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
  const paddingHorizontal = layout.padding_x2_5;
  const imgSize = 172;
  const styles = StyleSheet.create({
    buttonContainer: {
      marginTop: layout.padding_x2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 40,
      borderRadius: layout.padding_x1,
      backgroundColor: "#2B2B33",
      gap: layout.padding_x1,
      marginBottom: layout.padding_x2_5,
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
      paddingHorizontal: layout.padding_x2_5,
      paddingVertical: layout.padding_x2,
    },
    footerText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutral77,
        width: "55%",
      },
    ]),
    unitBox: {
      backgroundColor: neutral17,
      paddingHorizontal: layout.padding_x1_5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: layout.padding_x1,
      height: 40,
    },
    oneLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x1_5,
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
      borderRadius: layout.padding_x1,
    },
    textBox: {
      width: 332,
    },
    inputTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutralA3,
        marginBottom: layout.padding_x1_5,
      },
    ]),
    required: StyleSheet.flatten([
      fontSemibold14,
      {
        color: "#FFAEAE",
        paddingLeft: layout.padding_x0_5,
      },
    ]),
    input: StyleSheet.flatten([
      fontSemibold14,
      {
        color: secondaryColor,
        padding: layout.padding_x2,
        borderWidth: 1,
        borderColor: neutral33,
        marginBottom: layout.padding_x2_5,
        borderRadius: 10,
        outlineStyle: "none",
      },
    ]),
    uploadImg: {
      width: "100%",
      position: "absolute",
      left: 0,
      bottom: layout.padding_x1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    uploadButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#2B2B33",
      borderRadius: layout.padding_x4,
      gap: layout.padding_x1,
      paddingLeft: layout.padding_x1,
      paddingRight: layout.padding_x1_5,
      paddingVertical: layout.padding_x1,
    },
  });

  const [isUploading, setIsUploading] = useState(false);
  const inputImageFileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const userIPFSKey = useSelector(selectNFTStorageAPI);

  const handleVideoNameTextChange = (text: string) => {
    setTitle(text.trim());
    setVideoFile({ ...videoFile, title: text });
  };

  const handleVideoDescriptionTextChange = (text: string) => {
    setDescription(text.trim());
    setVideoFile({ ...videoFile, description: text });
  };

  const clickUploadCoverImage = () => {
    inputImageFileRef.current?.click();
  };
  const onInputCoverImagehange: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    setIsUploading(true);
    const file = e.target?.files?.[0];
    if (file) {
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
      // const pinataJWTKey =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxZjdjMGE4Yy00MjEyLTQ1ZTItOWUzMC00NDFmMjUxZDk5YzUiLCJlbWFpbCI6Im1pbmlvbmxhbmNlcjI4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4NmMwMjNlNDMyNjY4MjZmMTYzZSIsInNjb3BlZEtleVNlY3JldCI6IjA5YTA0NGFlZWUzOTk4NjNmNWU3MzBmZGY0N2Y3ODdhM2ZiMTI0ZDczNDE5ZTNmYWI3NjhlMmQ5NjQ5NTVmMDMiLCJpYXQiOjE2OTEwOTU4NTZ9.uLekzSqr9gzn6e91PumoAVDAu1X8Smm5QveBUoElbj8";
      if (!pinataJWTKey) {
        setIsUploading(false);
        return;
      }
      const pinataRes = await pinataPinFileToIPFS({
        file: local_file_data,
        pinataJWTKey,
      });
      setVideoFile({ ...videoFile, coverImage: pinataRes.IpfsHash });
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={onInputCoverImagehange}
        ref={inputImageFileRef}
      />
      <View style={styles.inputBox}>
        <View style={styles.imgBox}>
          <Image
            source={
              !videoFile || videoFile.coverImage === ""
                ? CoverImg
                : ipfsURLToHTTPURL(videoFile.coverImage)
            }
            style={styles.img}
          />
          <View style={styles.uploadImg}>
            <Pressable
              style={styles.uploadButton}
              onPress={clickUploadCoverImage}
            >
              <SVG
                source={Img}
                width={layout.padding_x2}
                height={layout.padding_x2}
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
            Video description<BrandText style={styles.required}>*</BrandText>
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
          By uploading, you confirm that your video comply with our Terms of
          Use.
        </BrandText>
        <PrimaryButton
          text="Upload"
          size="SM"
          disabled={
            videoFile.coverImage === "" ||
            title.trim() === "" ||
            description.trim() === ""
          }
          onPress={uploadVideo}
          isLoading={isUploading}
        />
      </View>
    </>
  );
};
