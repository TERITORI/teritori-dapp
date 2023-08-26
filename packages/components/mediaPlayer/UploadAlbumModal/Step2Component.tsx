import React, { createRef, Dispatch, SetStateAction, useState } from "react";
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
import { pinataPinFileToIPFS } from "../../../candymachine/pinata-upload";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId } from "../../../networks";
import { selectNFTStorageAPI } from "../../../store/slices/settings";
import { generateIpfsKey, ipfsURLToHTTPURL } from "../../../utils/ipfs";
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
import { AlbumInfo } from "../../../utils/types/mediaPlayer";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { PrimaryButton } from "../../buttons/PrimaryButton";

export const Step2Component: React.FC<{
  uploadFiles: LocalFileData[];
  setUploadFiles: Dispatch<SetStateAction<LocalFileData[]>>;
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
  const userIPFSKey = useSelector(selectNFTStorageAPI);

  const removeSong = (index: number) => {
    setUploadFiles((data: LocalFileData[]) => {
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
      const pinataJWTKey =
        userIPFSKey || (await generateIpfsKey(selectedNetworkId, userId));
      if (!pinataJWTKey) {
        setIsUploading(false);
        return;
      }
      const pinataRes = await pinataPinFileToIPFS({
        file: local_file_data,
        pinataJWTKey,
      });
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
    const pinataJWTKey =
      userIPFSKey || (await generateIpfsKey(selectedNetworkId, userId));
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
            file,
            fileName: file.name,
            mimeType: file.type,
            size: file.size,
            url: pinataRes.IpfsHash,
            fileType: "audio",
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
      {/*TODO: FileUploader instead of input (Just wrap the buttons with FileUploader)*/}
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
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={clickUploadAlbumImage}
            >
              <SVG
                source={Img}
                width={layout.padding_x2}
                height={layout.padding_x2}
              />
              <BrandText style={fontSemibold14}>upload image</BrandText>
            </TouchableOpacity>
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
              <TouchableOpacity>
                <SVG
                  source={List}
                  width={layout.padding_x2}
                  height={layout.padding_x2}
                />
              </TouchableOpacity>
              <BrandText style={fontSemibold14}>{item.fileName}</BrandText>
            </View>
            <View style={styles.oneLine}>
              <TouchableOpacity onPress={() => removeSong(index)}>
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
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => clickUploadMusicFile()}
      >
        <SVG
          source={Add}
          width={layout.padding_x2_5}
          height={layout.padding_x2_5}
        />
        <BrandText style={styles.buttonText}>Add more</BrandText>
      </TouchableOpacity>

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
