import * as ImagePicker from "expo-image-picker";
import { omit } from "lodash";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
} from "react-native";

import deleteIcon from "../../../../assets/icons/delete.svg";
import file from "../../../../assets/icons/fileattach.svg";
import largeActive from "../../../../assets/icons/large-active.svg";
import large from "../../../../assets/icons/large.svg";
import sent from "../../../../assets/icons/sent.svg";
import smallActive from "../../../../assets/icons/small-active.svg";
import small from "../../../../assets/icons/small.svg";
import video from "../../../../assets/icons/videoattach.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { FileUploader } from "../../../components/fileUploader";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { convertFileToBase64 } from "../../../utils/file";
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "../../../utils/mime";
import {
  additionalRed,
  neutral17,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontMedium14,
  fontSemibold14,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { RemoteFileData } from "../../../utils/types/feed";
import { HandleSendParams } from "../MessengerGroupChat/ChatSection";

interface IMessage {
  id: Key | null | undefined;
  source: any;
  message: string;
  isSender: boolean;

  time: string;
  name: string;
}

interface UploadImageProps {
  onClose: () => void;
  handleSend: (params: HandleSendParams) => void;
}

export const UploadImage = ({ onClose, handleSend }: UploadImageProps) => {
  const [isAttachmentModal, setIsAttachmentModal] = useState(true);
  const [thumbnail, setThumbnail] = useState(null);
  const [image, setImage] = useState(null);
  const [isImageLarge, setIsImageLarge] = useState(true);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<RemoteFileData>();

  const handleShowImage = () => {
    setIsImageLarge(true);
  };

  const handleCloseImage = () => {
    setIsImageLarge(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    console.log("base64 img", result);
    // setImage(result?.assets[0]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        {isAttachmentModal &&
        !thumbnail &&
        ["ios", "android"].includes(Platform.OS) ? (
          <View style={styles.attachmentModal}>
            <TouchableOpacity style={styles.attachmentItem} onPress={pickImage}>
              <FlexRow>
                <SVG source={file} />
                <SpacerRow size={1} />
                <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                  Attach file
                </BrandText>
              </FlexRow>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentItem}>
              <FlexRow>
                <SVG source={video} />
                <SpacerRow size={1} />
                <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                  Attach image/video
                </BrandText>
              </FlexRow>
            </TouchableOpacity>
          </View>
        ) : (
          isAttachmentModal &&
          !thumbnail && (
            <View style={styles.attachmentModal}>
              <FileUploader
                onUpload={async (files) => {
                  console.log("files", files);
                  if (files[0].file) {
                    const base64 = await convertFileToBase64(files[0].file);
                    const file = files[0];
                    files.length &&
                      setFile({
                        ...omit(file, "file"),
                        url: base64,
                      });
                  }
                }}
                mimeTypes={[...AUDIO_MIME_TYPES]}
              >
                {({ onPress }) => (
                  <TouchableOpacity
                    style={styles.attachmentItem}
                    onPress={onPress}
                  >
                    <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                      Attach file
                    </BrandText>
                  </TouchableOpacity>
                )}
              </FileUploader>
              <FileUploader
                onUpload={async (files) => {
                  console.log("files", files);
                  if (files[0].file) {
                    const base64 = await convertFileToBase64(files[0].file);
                    const file = files[0];
                    files.length &&
                      setFile({
                        ...omit(file, "file"),
                        url: base64,
                      });
                  }
                }}
                mimeTypes={[...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES]}
              >
                {({ onPress }) => (
                  <TouchableOpacity
                    style={styles.attachmentItem}
                    onPress={onPress}
                  >
                    <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                      Attach image/video
                    </BrandText>
                  </TouchableOpacity>
                )}
              </FileUploader>
            </View>
          )
        )}

        <ModalBase
          label={
            <FlexRow>
              <TouchableOpacity onPress={handleShowImage}>
                {isImageLarge ? (
                  <SVG source={largeActive} />
                ) : (
                  <SVG source={large} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCloseImage}>
                {isImageLarge ? (
                  <SVG source={small} />
                ) : (
                  <SVG source={smallActive} />
                )}
              </TouchableOpacity>
            </FlexRow>
          }
          onClose={() => setFile(undefined)}
          visible={!!file}
          hideMainSeparator
          width={350}

          // containerStyle={{ height: 900 }}
        >
          {isImageLarge ? (
            <View
              style={{
                backgroundColor: additionalRed,

                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ alignSelf: "center" }}>
                <FlexRow>
                  <Image
                    source={{
                      uri: Platform.OS === "web" ? file?.url : image?.uri,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </FlexRow>
                <TouchableOpacity onPress={() => setImage(null)}>
                  <View style={styles.svgContainer}>
                    <SVG source={deleteIcon} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <FlexRow>
              <View style={{ width: "100%" }}>
                <FlexRow>
                  <Image
                    source={{
                      uri: Platform.OS === "web" ? file?.url : image?.uri,
                    }}
                    style={styles.imagesmall}
                    resizeMode="stretch"
                  />
                  <SpacerRow size={2} />
                  <View style={{ width: "60%" }}>
                    <BrandText
                      style={[fontSemibold14, { color: secondaryColor }]}
                    >
                      {Platform.OS === "web" ? file?.fileName : "filename.png"}
                    </BrandText>
                    <SpacerColumn size={0.6} />
                    <BrandText style={[fontSemibold13, { color: neutral77 }]}>
                      {Platform.OS === "web" ? file?.size : image?.fileSize}
                    </BrandText>
                    <TouchableOpacity onPress={() => setImage(null)}>
                      <View style={styles.svgContainerShort}>
                        <SVG source={deleteIcon} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </FlexRow>
              </View>
            </FlexRow>
          )}

          <SpacerColumn size={10} />

          <View style={styles.footer}>
            <TextInputCustom
              noBrokenCorners
              name="message"
              placeHolder="Add a message..."
              placeholderTextColor={neutral77}
              labelStyle={[fontMedium14, { color: neutral77 }]}
              value={message}
              onChangeText={setMessage}
              boxMainContainerStyle={{ backgroundColor: neutral17 }}
              textInputStyle={{ marginLeft: 10, top: -8 }}
            >
              <TouchableOpacity
                onPress={async () => {
                  if (file) {
                    handleSend({
                      files: [file],
                      message,
                    });
                    setMessage("");
                    setFile(undefined);
                    onClose();
                  }
                }}
              >
                <SVG source={sent} />
              </TouchableOpacity>
              <SpacerRow size={1} />
            </TextInputCustom>
          </View>
        </ModalBase>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: { position: "absolute", bottom: 0, width: 350, left: 0 },
  attachmentModal: {
    position: "absolute",
    top: -55,
    left: 10,
    backgroundColor: "rgba(41, 41, 41, 0.8)",
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,

    zIndex: 111,
  },
  svgContainer: {
    position: "absolute",
    bottom: 10,
    right: 0,
    transform: [{ translateX: 45 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 10, // Adjust the translateY value based on the icon size
  },
  svgContainerShort: {
    position: "absolute",
    // transform: [{ translateX: 45 }],
    backgroundColor: "rgba(244, 111, 118, 0.1)",
    padding: 10,
    borderRadius: 10, // Adjust the translateY value based on the icon size
    right: 0,
  },
  attachmentItem: {
    height: 25,
  },
  // textInputContainer: {
  //   position: "relative",
  // },

  image: {
    height: 300,
    width: 200,
    alignSelf: "center",
  },
  imagesmall: {
    height: 90,
    width: "40%",
    borderRadius: 10,
  },
});
