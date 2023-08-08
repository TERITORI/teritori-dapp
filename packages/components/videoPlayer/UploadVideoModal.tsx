import React, {
  createRef,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { View, Pressable, StyleSheet, TextInput } from "react-native";
import { v4 as uuidv4 } from "uuid";

import Upload from "../../../assets/icons/player/upload.svg";
import { pinataPinFileToIPFS } from "../../candymachine/pinata-upload";
import { signingVideoPlayerClient } from "../../client-creators/videoplayerClient";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { defaultSocialFeedFee } from "../../utils/fee";
import { generateIpfsKey } from "../../utils/social-feed";
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
import { LocalFileData } from "../../utils/types/feed";
import { VideoMetaInfo } from "../../utils/types/video";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { PrimaryButton } from "../buttons/PrimaryButton";
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
  const inputFileRef = createRef<HTMLInputElement>();
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);

  useEffect(() => {
    setCanContinue(!!uploadFile);
  }, [uploadFile]);

  const uploadVideoFile = async () => {
    setIsUploading(true);
    inputFileRef.current?.click();
  };
  const onInputFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target?.files![0];
    const video = document.createElement("video");
    video.preload = "metadata";
    const pinataJWTKey = await generateIpfsKey(selectedNetworkId, userId);
    // const pinataJWTKey =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxZjdjMGE4Yy00MjEyLTQ1ZTItOWUzMC00NDFmMjUxZDk5YzUiLCJlbWFpbCI6Im1pbmlvbmxhbmNlcjI4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4NmMwMjNlNDMyNjY4MjZmMTYzZSIsInNjb3BlZEtleVNlY3JldCI6IjA5YTA0NGFlZWUzOTk4NjNmNWU3MzBmZGY0N2Y3ODdhM2ZiMTI0ZDczNDE5ZTNmYWI3NjhlMmQ5NjQ5NTVmMDMiLCJpYXQiOjE2OTEwOTU4NTZ9.uLekzSqr9gzn6e91PumoAVDAu1X8Smm5QveBUoElbj8";

    video.addEventListener("loadedmetadata", async () => {
      window.URL.revokeObjectURL(video.src);
      if (!pinataJWTKey) {
        return;
      }
      const local_file_data = {
        file,
        fileName: file.name,
        mimeType: "",
        size: 0,
        url: "",
        fileType: "video",
      } as LocalFileData;
      const pinataRes = await pinataPinFileToIPFS({
        file: local_file_data,
        pinataJWTKey,
      });
      const duration = video.duration;
      if (pinataRes.IpfsHash! !== "") {
        setUploadFile({
          title: "",
          description: "",
          url: pinataRes.IpfsHash,
          duration,
        });
      }
      setIsUploading(false);
    });
    video.src = URL.createObjectURL(file);
  };

  return (
    <>
      <View style={styles.contentContainer}>
        <Pressable style={styles.uploadBox}>
          <SVG
            source={Upload}
            width={layout.padding_x2}
            height={layout.padding_x2}
          />
          <BrandText>Drag and drop your video here</BrandText>
        </Pressable>
        <View style={styles.buttonContainer}>
          <Pressable onPress={uploadVideoFile}>
            <BrandText style={styles.buttonText}>
              or choose files to upload
            </BrandText>
          </Pressable>
        </View>
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
      <input
        type="file"
        style={{ display: "none" }}
        accept="video/mp4"
        onChange={onInputFileChange}
        ref={inputFileRef}
      />
    </>
  );
};

const Step2Component: React.FC<{
  videoFile: VideoMetaInfo;
  setVideoFile: Dispatch<SetStateAction<VideoMetaInfo | null>>;
  uploadVideo: () => void;
}> = ({ videoFile, setVideoFile, uploadVideo }) => {
  const paddingHorizontal = layout.padding_x2_5;
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
    inputBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    textBox: {
      width: "100%",
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
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleVideoNameTextChange = (text: string) => {
    setTitle(text.trim());
    setVideoFile({ ...videoFile, title: text });
  };

  const handleVideoDescriptionTextChange = (text: string) => {
    setDescription(text.trim());
    setVideoFile({ ...videoFile, description: text });
  };

  return (
    <>
      <View style={styles.inputBox}>
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
          disabled={title.trim() === "" || description.trim() === ""}
          onPress={uploadVideo}
        />
      </View>
    </>
  );
};
