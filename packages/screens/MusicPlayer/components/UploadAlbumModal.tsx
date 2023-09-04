import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import Add from "../../../../assets/music-player/add-primary.svg";
import DefaultAlbumImage from "../../../../assets/music-player/album.png";
import Img from "../../../../assets/music-player/img.svg";
import List from "../../../../assets/music-player/list.svg";
import Remove from "../../../../assets/music-player/remove.svg";
import { signingMusicPlayerClient } from "../../../client-creators/musicplayerClient";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { FileUploader } from "../../../components/fileUploader";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId } from "../../../networks";
import { selectNFTStorageAPI } from "../../../store/slices/settings";
import { defaultSocialFeedFee } from "../../../utils/fee";
import {
  generateIpfsKey,
  ipfsURLToHTTPURL,
  uploadFilesToPinata,
  uploadFileToIPFS,
} from "../../../utils/ipfs";
import { AUDIO_MIME_TYPES, IMAGE_MIME_TYPES } from "../../../utils/mime";
import {
  neutral17,
  neutral33,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/files";
import {
  AlbumInfo,
  AlbumMetadataInfo,
  Media,
} from "../../../utils/types/mediaPlayer";

interface UploadAlbumModalProps {
  onClose: () => void;
  isVisible: boolean;
}
export const UPLOAD_ALBUM_MODAL_WIDTH = 564;

export const UploadAlbumModal: React.FC<UploadAlbumModalProps> = ({
  onClose,
  isVisible,
}) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const [albumInfo, setAlbumInfo] = useState<AlbumInfo>({
    id: "",
    name: "",
    description: "",
    image: "",
    createdBy: "",
    audios: [],
  });
  const [audios, setAudios] = useState<Media[]>([]);

  const removeTrack = (index: number) => {
    setAudios(audios.splice(index, 1));
  };

  const onUploadAlbumImage = async (files: LocalFileData[]) => {
    setIsUploading(true);
    console.log("files[0]files[0]files[0]", files[0]);
    const uploadedFile = await uploadFileToIPFS({
      userKey: userIPFSKey,
      file: files[0],
      networkId: selectedNetworkId,
      userId,
    });
    console.log("uploadedFileuploadedFileuploadedFile", uploadedFile);
    if (!uploadedFile?.url) {
      console.error("upload file err : Fail to pin to IPFS");
      setToastError({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
      });
      return;
    }
    setAlbumInfo({ ...albumInfo, image: uploadedFile.url });
    setIsUploading(false);
  };

  const onUploadAudioFiles = async (files: LocalFileData[]) => {
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
    const addedAudios = uploadedFiles.map((remoteFileData) => {
      // For each tracks of this album, some Media props depends on this AlbumInfo props
      return {
        duration: remoteFileData.audioMetadata?.duration, //ms,
        imageUrl: albumInfo.image,
        name: remoteFileData.fileName,
        fileUrl: remoteFileData.url,
        createdBy: albumInfo.createdBy,
        albumId: albumInfo.id,
      };
    });
    setAudios(addedAudios);
    setIsUploading(false);
  };

  const handleAlbumNameTextChange = (text: string) => {
    setAlbumInfo({ ...albumInfo, name: text.trim() });
  };

  const handleAlbumDescriptionTextChange = (text: string) => {
    setAlbumInfo({ ...albumInfo, description: text.trim() });
  };

  const onPressUpload = async () => {
    setIsLoading(true);

    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    const metadata: AlbumMetadataInfo = {
      title: albumInfo.name,
      description: albumInfo.description,
      image: albumInfo.image,
      audios: audios.map((a) => {
        return {
          duration: a?.duration || 0,
          ipfs: a.fileUrl,
          name: a.name,
        };
      }),
    };

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
    setIsLoading(false);
    onClose();
  };

  return (
    <ModalBase
      label="Upload album"
      visible={isVisible}
      onClose={onClose}
      width={UPLOAD_ALBUM_MODAL_WIDTH}
    >
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
            <FileUploader
              onUpload={onUploadAlbumImage}
              style={styles.uploadButton}
              mimeTypes={IMAGE_MIME_TYPES}
              maxUpload={1}
            >
              {({ onPress }) => (
                <TouchableOpacity style={styles.uploadButton} onPress={onPress}>
                  <SVG
                    source={Img}
                    width={layout.padding_x2}
                    height={layout.padding_x2}
                  />
                  <BrandText style={fontSemibold14}>upload image</BrandText>
                </TouchableOpacity>
              )}
            </FileUploader>
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
        {audios.map((audio, index) => (
          // TODO: Able to grab and place track
          <View key={index} style={styles.unitBox}>
            <View style={styles.oneLine}>
              <TouchableOpacity>
                <SVG
                  source={List}
                  width={layout.padding_x2}
                  height={layout.padding_x2}
                />
              </TouchableOpacity>
              <BrandText style={fontSemibold14}>{audio.name}</BrandText>
            </View>
            <View style={styles.oneLine}>
              <TouchableOpacity onPress={() => removeTrack(index)}>
                <SVG
                  source={Remove}
                  width={layout.padding_x3}
                  height={layout.padding_x3}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <FileUploader
        multiple
        onUpload={onUploadAudioFiles}
        style={styles.uploadButton}
        mimeTypes={AUDIO_MIME_TYPES}
      >
        {({ onPress }) => (
          <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
            <SVG
              source={Add}
              width={layout.padding_x2_5}
              height={layout.padding_x2_5}
            />
            <BrandText style={styles.buttonText}>Add songs</BrandText>
          </TouchableOpacity>
        )}
      </FileUploader>

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

      <View style={styles.divideLine} />

      <View style={styles.footer}>
        <BrandText style={styles.footerText} numberOfLines={2}>
          By uploading, you confirm that your sounds comply with our Terms of
          Use.
        </BrandText>
        <PrimaryButton
          text="Upload"
          disabled={
            albumInfo.name === "" ||
            albumInfo.description === "" ||
            !albumInfo.image ||
            !audios.length ||
            isUploading ||
            isLoading
          }
          size="SM"
          onPress={onPressUpload}
          isLoading={isUploading || isLoading}
        />
      </View>
    </ModalBase>
  );
};

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
    marginBottom: layout.padding_x2,
  },
  buttonText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: primaryColor,
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
    width: 172,
    height: 172,
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
