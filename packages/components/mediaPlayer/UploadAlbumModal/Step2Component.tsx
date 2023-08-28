import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { UPLOAD_ALBUM_MODAL_WIDTH } from "./index";
import Add from "../../../../assets/music-player/add-primary.svg";
import DefaultAlbumImage from "../../../../assets/music-player/album.png";
import Img from "../../../../assets/music-player/img.svg";
import List from "../../../../assets/music-player/list.svg";
import Remove from "../../../../assets/music-player/remove.svg";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId } from "../../../networks";
import { selectNFTStorageAPI } from "../../../store/slices/settings";
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
import { LocalFileData, RemoteFileData } from "../../../utils/types/files";
import { AlbumInfo } from "../../../utils/types/mediaPlayer";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { FileUploader } from "../../fileUploader";

export const Step2Component: React.FC<{
  uploadedAudioFilesStep1: RemoteFileData[];
  uploadAlbum: (albumInfo: AlbumInfo) => void;
  isLoading: boolean;
}> = ({ uploadedAudioFilesStep1, uploadAlbum, isLoading }) => {
  const [isUploading, setIsUploading] = useState(false);
  const selectedNetworkId = useSelectedNetworkId();
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
  const { setToastError } = useFeedbacks();

  const removeTrack = (index: number) => {
    const audios = albumInfo.audios.splice(index, 1);
    setAlbumInfo({ ...albumInfo, audios });
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
    // For each tracks of this album, the track image will be the album image
    const audios = albumInfo.audios.map((a) => {
      return {
        ...a,
        imageUrl: uploadedFile.url,
      };
    });
    setAlbumInfo({ ...albumInfo, image: uploadedFile.url, audios });
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
      return {
        duration: remoteFileData.audioMetadata?.duration, //ms,
        imageUrl: albumInfo.image,
        name: remoteFileData.fileName,
        fileUrl: remoteFileData.url,
        createdBy: albumInfo.createdBy,
        albumId: albumInfo.id,
      };
    });
    setAlbumInfo({
      ...albumInfo,
      audios: [...albumInfo.audios, ...addedAudios],
    });
    setIsUploading(false);
  };

  const handleAlbumNameTextChange = (text: string) => {
    setAlbumInfo({ ...albumInfo, name: text.trim() });
  };

  const handleAlbumDescriptionTextChange = (text: string) => {
    setAlbumInfo({ ...albumInfo, description: text.trim() });
  };

  // Sync the files got at step 1
  useEffect(() => {
    const audios = uploadedAudioFilesStep1.map((remoteFileData) => {
      return {
        duration: remoteFileData.audioMetadata?.duration, //ms,
        imageUrl: albumInfo.image,
        name: remoteFileData.fileName,
        fileUrl: remoteFileData.url,
        createdBy: albumInfo.createdBy,
        albumId: albumInfo.id,
      };
    });
    setAlbumInfo({ ...albumInfo, audios });
  }, [uploadedAudioFilesStep1, albumInfo]);

  return (
    <>
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
        {albumInfo.audios.map((audio, index) => (
          // TODO: Able to grab and replace track
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
            <BrandText style={styles.buttonText}>Add more</BrandText>
          </TouchableOpacity>
        )}
      </FileUploader>

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
            !albumInfo.audios.length ||
            isUploading ||
            isLoading
          }
          size="SM"
          onPress={() => uploadAlbum(albumInfo)}
          isLoading={isUploading || isLoading}
        />
      </View>
    </>
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
