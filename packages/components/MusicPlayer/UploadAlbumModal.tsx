import React, {
  createRef,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { View, Pressable, StyleSheet, Image, TextInput } from "react-native";
import { v4 as uuidv4 } from "uuid";

import Add from "../../../assets/music-player/add-primary.svg";
import DefaultAlbumImage from "../../../assets/music-player/album.png";
import Img from "../../../assets/music-player/img.svg";
import List from "../../../assets/music-player/list.svg";
import Remove from "../../../assets/music-player/remove.svg";
import Upload from "../../../assets/music-player/upload.svg";
import { pinataPinFileToIPFS } from "../../candymachine/pinata-upload";
import { signingMusicPlayerClient } from "../../client-creators/musicplayerClient";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { defaultSocialFeedFee } from "../../utils/fee";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
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
import { UploadFileInfo, AlbumMetadataInfo } from "../../utils/types/music";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { PrimaryButton } from "../buttons/PrimaryButton";
import ModalBase from "../modals/ModalBase";
interface AlbumInfo {
  name: string;
  description: string;
  image: string;
}

interface UploadAlbumModalProps {
  onClose: () => void;
  isVisible: boolean;
}
const modalWidth = 564;

export const UploadAlbumModal: React.FC<UploadAlbumModalProps> = ({
  onClose,
  isVisible,
}) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const [step, setStep] = useState<number>(0);
  const [uploadFiles, setUploadFiles] = useState<UploadFileInfo[]>([]);

  const [albumInfo, setAlbumInfo] = useState<AlbumInfo>({
    name: "",
    description: "",
    image: "",
  });
  const uploadAlbum = async () => {
    if (!albumInfo) return;
    if (!albumInfo.name) return;
    if (!albumInfo.description) return;
    if (uploadFiles.length === 0) return;

    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    const audios: UploadFileInfo[] = uploadFiles.map((uploadFile) => ({
      name: uploadFile.name,
      ipfs: uploadFile.ipfs,
      duration: uploadFile.duration,
    }));

    const metadata: AlbumMetadataInfo = {
      title: albumInfo.name,
      description: albumInfo.description,
      image: albumInfo.image,
      audios,
    };
    console.log("---------metadata");
    console.log({
      metadata: JSON.stringify(metadata),
      identifier: uuidv4(),
    });

    try {
      const res = await client.createMusicAlbum(
        {
          metadata: JSON.stringify(metadata),
          identifier: uuidv4(),
        },
        defaultSocialFeedFee,
        ""
      );

      if (res.transactionHash) {
        setToastSuccess({
          title: "Uploaded album successfully",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to upload album",
        message: `Error: ${err}`,
      });
    }
    setStep(0);
    onClose();
  };

  return (
    <ModalBase
      label="Upload album"
      visible={isVisible}
      onClose={() => {
        setStep(0);
        onClose();
      }}
      width={modalWidth}
    >
      {step === 0 && (
        <Step1Component setStep={setStep} setUploadFiles={setUploadFiles} />
      )}
      {step === 1 && (
        <Step2Component
          uploadFiles={uploadFiles}
          setUploadFiles={setUploadFiles}
          albumInfo={albumInfo}
          setAlbumInfo={setAlbumInfo}
          uploadAlbum={uploadAlbum}
        />
      )}
    </ModalBase>
  );
};

const Step1Component: React.FC<{
  setStep: Dispatch<SetStateAction<number>>;
  setUploadFiles: Dispatch<SetStateAction<UploadFileInfo[]>>;
}> = ({ setStep, setUploadFiles }) => {
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

  const [uploadFiles1, setUploadFiles1] = useState<UploadFileInfo[]>([]);
  const [canContinue, setCanContinue] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const inputFileRef = createRef<HTMLInputElement>();
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);

  useEffect(() => {
    setCanContinue(uploadFiles1.length > 0);
  }, [uploadFiles1]);

  const uploadMusicFiles = async () => {
    setIsUploading(true);
    inputFileRef.current?.click();
  };
  const onInputFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target?.files![0];
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    const pinataJWTKey = await generateIpfsKey(selectedNetworkId, userId);
    // const pinataJWTKey =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxZjdjMGE4Yy00MjEyLTQ1ZTItOWUzMC00NDFmMjUxZDk5YzUiLCJlbWFpbCI6Im1pbmlvbmxhbmNlcjI4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4NmMwMjNlNDMyNjY4MjZmMTYzZSIsInNjb3BlZEtleVNlY3JldCI6IjA5YTA0NGFlZWUzOTk4NjNmNWU3MzBmZGY0N2Y3ODdhM2ZiMTI0ZDczNDE5ZTNmYWI3NjhlMmQ5NjQ5NTVmMDMiLCJpYXQiOjE2OTEwOTU4NTZ9.uLekzSqr9gzn6e91PumoAVDAu1X8Smm5QveBUoElbj8";
    audio.addEventListener("loadedmetadata", async () => {
      window.URL.revokeObjectURL(url);
      if (!pinataJWTKey) {
        setIsUploading(false);
        return;
      }
      const local_file_data = {
        file,
        fileName: file.name,
        mimeType: "",
        size: 0,
        url: "",
        fileType: "audio",
      } as LocalFileData;

      const pinataRes = await pinataPinFileToIPFS({
        file: local_file_data,
        pinataJWTKey,
      });
      if (pinataRes.IpfsHash !== "") {
        setUploadFiles1([
          ...uploadFiles1,
          {
            name: file.name,
            ipfs: pinataRes.IpfsHash,
            duration: audio.duration,
          },
        ]);
      }
      setIsUploading(false);
    });
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
          <BrandText>Drag and drop your tracks & albums here</BrandText>
        </Pressable>
        <View style={styles.buttonContainer}>
          <Pressable onPress={uploadMusicFiles}>
            <BrandText style={styles.buttonText}>
              or choose files to upload
            </BrandText>
          </Pressable>
        </View>
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
      <input
        type="file"
        style={{ display: "none" }}
        accept="audio/mp3"
        onChange={onInputFileChange}
        ref={inputFileRef}
      />
    </>
  );
};

const Step2Component: React.FC<{
  uploadFiles: UploadFileInfo[];
  setUploadFiles: Dispatch<SetStateAction<UploadFileInfo[]>>;
  albumInfo: AlbumInfo;
  setAlbumInfo: Dispatch<SetStateAction<AlbumInfo>>;
  uploadAlbum: () => void;
}> = ({
  uploadFiles,
  setUploadFiles,
  albumInfo,
  setAlbumInfo,
  uploadAlbum,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const inputImageFileRef = createRef<HTMLInputElement>();
  const inputMusicFileRef = createRef<HTMLInputElement>();

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
    songGroup: {
      flexDirection: "column",
      gap: layout.padding_x1,
    },
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

  const removeSong = (index: number) => {
    setUploadFiles((data: UploadFileInfo[]) => {
      data.splice(index, 1);
      return [...data];
    });
  };

  const clickUploadAlbumImage = () => {
    inputImageFileRef.current?.click();
  };

  const clickUploadMusicFile = () => {
    inputMusicFileRef.current?.click();
  };

  const onInputImageFileChange: React.ChangeEventHandler<
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
      const pinataJWTKey = await generateIpfsKey(selectedNetworkId, userId);
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
      // const pinataRes = await uploadFileToIPFS(file);
      setAlbumInfo({ ...albumInfo, image: pinataRes.IpfsHash });
      setIsUploading(false);
    }
  };
  const onInputMusicFileChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    setIsUploading(true);
    const file = e.target?.files![0];
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    const pinataJWTKey = await generateIpfsKey(selectedNetworkId, userId);
    // const pinataJWTKey =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxZjdjMGE4Yy00MjEyLTQ1ZTItOWUzMC00NDFmMjUxZDk5YzUiLCJlbWFpbCI6Im1pbmlvbmxhbmNlcjI4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4NmMwMjNlNDMyNjY4MjZmMTYzZSIsInNjb3BlZEtleVNlY3JldCI6IjA5YTA0NGFlZWUzOTk4NjNmNWU3MzBmZGY0N2Y3ODdhM2ZiMTI0ZDczNDE5ZTNmYWI3NjhlMmQ5NjQ5NTVmMDMiLCJpYXQiOjE2OTEwOTU4NTZ9.uLekzSqr9gzn6e91PumoAVDAu1X8Smm5QveBUoElbj8";
    audio.addEventListener("loadedmetadata", async () => {
      window.URL.revokeObjectURL(url);
      if (!pinataJWTKey) {
        setIsUploading(false);
        return;
      }
      const local_file_data = {
        file,
        fileName: file.name,
        mimeType: "",
        size: 0,
        url: "",
        fileType: "audio",
      } as LocalFileData;

      const pinataRes = await pinataPinFileToIPFS({
        file: local_file_data,
        pinataJWTKey,
      });
      if (pinataRes.IpfsHash !== "") {
        setUploadFiles([
          ...uploadFiles,
          {
            name: file.name,
            ipfs: pinataRes.IpfsHash,
            duration: audio.duration,
          },
        ]);
      }
      setIsUploading(false);
    });
  };

  const handleAlbumNameTextChange = (text: string) => {
    setAlbumInfo({ ...albumInfo, name: text.trim() });
  };

  const handleAlbumDescriptionTextChange = (text: string) => {
    setAlbumInfo({ ...albumInfo, description: text.trim() });
  };

  return (
    <>
      <input
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={onInputImageFileChange}
        ref={inputImageFileRef}
      />
      <input
        type="file"
        style={{ display: "none" }}
        accept="audio/mp3"
        onChange={onInputMusicFileChange}
        ref={inputMusicFileRef}
      />
      <View style={styles.inputBox}>
        <View style={styles.imgBox}>
          <Image
            source={
              albumInfo.image === ""
                ? DefaultAlbumImage
                : ipfsURLToHTTPURL(albumInfo.image)
            }
            style={styles.img}
          />
          <View style={styles.uploadImg}>
            <Pressable
              style={styles.uploadButton}
              onPress={clickUploadAlbumImage}
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
            Album name<BrandText style={styles.required}>*</BrandText>
          </BrandText>
          <TextInput
            style={styles.input}
            onChangeText={handleAlbumNameTextChange}
          />
          <BrandText style={styles.inputTitle}>
            Album Description<BrandText style={styles.required}>*</BrandText>
          </BrandText>
          <TextInput
            style={styles.input}
            onChangeText={handleAlbumDescriptionTextChange}
            numberOfLines={4}
            multiline
          />
        </View>
      </View>
      <View style={styles.songGroup}>
        {uploadFiles.map((item, index) => (
          <View key={index} style={styles.unitBox}>
            <View style={styles.oneLine}>
              <Pressable>
                <SVG
                  source={List}
                  width={layout.padding_x2}
                  height={layout.padding_x2}
                />
              </Pressable>
              <BrandText style={fontSemibold14}>{item.name}</BrandText>
            </View>
            <View style={styles.oneLine}>
              <Pressable onPress={() => removeSong(index)}>
                <SVG
                  source={Remove}
                  width={layout.padding_x3}
                  height={layout.padding_x3}
                />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
      <Pressable
        style={styles.buttonContainer}
        onPress={() => clickUploadMusicFile()}
      >
        <SVG
          source={Add}
          width={layout.padding_x2_5}
          height={layout.padding_x2_5}
        />
        <BrandText style={styles.buttonText}>Add more</BrandText>
      </Pressable>

      <View style={styles.divideLine} />

      <View style={styles.footer}>
        <BrandText style={styles.footerText} numberOfLines={2}>
          By uploading, you confirm that your sounds comply with our Terms of
          Use.
        </BrandText>
        <PrimaryButton
          text="Upload"
          disabled={albumInfo.name === "" || albumInfo.description === ""}
          size="SM"
          onPress={uploadAlbum}
          isLoading={isUploading}
        />
      </View>
    </>
  );
};
