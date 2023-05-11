import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";

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
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { additionalRed, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { LocalFileData } from "../../../utils/types/feed";

interface IMessage {
  id: Key | null | undefined;
  source: any;
  message: string;
  isSender: boolean;
  file: LocalFileData;

  time: string;
  name: string;
}

const UploadImage = ({
  showAttachmentModal,
  setShowAttachmentModal,
  messages,
  setMessages,
  newMessage,
  setNewMessage,
  thumbnailFile,
  setThumbnailFile,
}) => {
  const [image, setImage] = useState(null);
  const [isImageLarge, setIsImageLarge] = useState(true);
  const [visible, setVisible] = useState(false);
  const handleSend = () => {
    const newMsg: IMessage = {
      message: newMessage,
      isSender: true,
    };
    setMessages([...messages, newMsg, ...thumbnailFile?.url]);
    setNewMessage("");
  };
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
    });
    setImage(result?.assets[0]);
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        {showAttachmentModal &&
        !thumbnailFile &&
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
          showAttachmentModal &&
          !thumbnailFile && (
            <FileUploader
              onUpload={(files) => {
                setThumbnailFile(files[0]);
              }}
              mimeTypes={IMAGE_MIME_TYPES}
            >
              {({ onPress }) => (
                <View style={styles.attachmentModal}>
                  <TouchableOpacity
                    style={styles.attachmentItem}
                    onPress={onPress}
                  >
                    <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                      Attach file
                    </BrandText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.attachmentItem}
                    onPress={onPress}
                  >
                    <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                      Attach image/video
                    </BrandText>
                  </TouchableOpacity>
                </View>
              )}
            </FileUploader>
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
          onClose={() => setVisible(!visible)}
          visible={visible}
          hideMainSeparator
          width={350}
          // containerStyle={{ height: 900 }}
        >
          {isImageLarge ? (
            <View
              style={{
                backgroundColor: additionalRed,
                width: Platform.OS === "web" ? "90%" : null,
                borderRadius: 6,
              }}
            >
              <Image
                source={{
                  uri: Platform.OS === "web" ? thumbnailFile?.url : image?.uri,
                }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: Platform.OS === "web" ? thumbnailFile?.url : image?.uri,
                }}
                style={styles.imagesmall}
                resizeMode="stretch"
              />
              <BrandText
                style={{
                  color: "red",
                  marginLeft: 10,
                  width: "60%",
                }}
              >
                {Platform.OS === "web"
                  ? thumbnailFile?.fileName
                  : image?.fileSize}
              </BrandText>
            </View>
          )}

          <SpacerColumn size={2} />
          <TextInputCustom
            noBrokenCorners
            name="message"
            placeHolder="Add a message"
            value={newMessage}
            onChangeText={setNewMessage}
          >
            <TouchableOpacity onPress={handleSend}>
              <SVG source={sent} />
            </TouchableOpacity>
          </TextInputCustom>
        </ModalBase>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

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
    height: 120,
    width: "40%",
    borderRadius: 10,
  },
});

export default UploadImage;
