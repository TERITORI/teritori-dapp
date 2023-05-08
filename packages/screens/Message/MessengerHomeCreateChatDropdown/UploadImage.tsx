import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from "react-native";
import ImagePicker from "react-native-image-picker";

import close from "../../../../assets/icons/close.svg";
import file from "../../../../assets/icons/fileattach.svg";
import video from "../../../../assets/icons/videoattach.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { FileUploader } from "../../../components/fileUploader";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
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
  messages,
  setMessages,
  newMessage,
  setNewMessage,
  thumbnailFile,
  setThumbnailFile,
  visible,
  setVisible,
  showImage,
  setShowImage,
}) => {
  const [imageUri, setImageUri] = useState(null);

  const selectImage = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        setImageUri(response.uri);
      }
    });
  };

  // const selectVideo = () => {
  //   const options = {
  //     title: "Select Video",
  //     mediaType: "video",
  //     storageOptions: {
  //       skipBackup: true,
  //       path: "videos",
  //     },
  //   };

  //   ImagePicker.showImagePicker(options, (response) => {
  //     if (response.didCancel) {
  //       console.log("User cancelled video picker");
  //     } else if (response.error) {
  //       console.log("VideoPicker Error: ", response.error);
  //     } else if (response.customButton) {
  //       console.log("User tapped custom button: ", response.customButton);
  //     } else {
  //       setVideoSource({ uri: response.uri });
  //     }
  //   });
  // };
  const handleSend = () => {
    const newMsg: IMessage = {
      message: newMessage,
      isSender: true,
    };
    setMessages([...messages, newMsg, ...thumbnailFile?.url]);
    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        {showAttachmentModal &&
        !thumbnailFile &&
        ["ios", "android"].includes(Platform.OS) ? (
          <View style={styles.attachmentModal}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={selectImage}
              style={styles.attachmentItem}
              // onPress={() => handleAttachment("file")}
            >
              <FlexRow>
                <SVG source={file} />
                <SpacerRow size={1} />
                <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                  Attach file
                </BrandText>
              </FlexRow>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              // onPress={selectVideo}
              style={styles.attachmentItem}
              // onPress={() => handleAttachment("image")}
            >
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
                    // onPress={() => handleAttachment("file")}
                    onPress={onPress}
                  >
                    <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                      Attach file
                    </BrandText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.attachmentItem}
                    // onPress={() => handleAttachment("image")}
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

        {thumbnailFile ? (
          <Modal visible={visible} animationType="none" transparent>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              }}
            >
              <TertiaryBox
                mainContainerStyle={{
                  minWidth: showImage ? 300 : 200,
                  minHeight: showImage ? 400 : 200,
                  maxWidth: showImage ? 300 : 350,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: 10,
                  }}
                >
                  <View>
                    <FlexRow>
                      <TouchableOpacity onPress={() => setShowImage(true)}>
                        <Image
                          source={require("../../../../assets/icons/image.png")}
                          style={{ height: 30, width: 30 }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setShowImage(false)}>
                        <Image
                          source={require("../../../../assets/icons/closeimage.png")}
                          style={{ height: 30, width: 30 }}
                        />
                      </TouchableOpacity>
                    </FlexRow>
                  </View>
                  <TouchableOpacity onPress={() => setVisible(!visible)}>
                    <SVG source={close} height={20} width={20} />
                  </TouchableOpacity>
                </View>

                {showImage ? (
                  <View
                    style={{
                      backgroundColor: additionalRed,
                      width: "90%",
                      borderRadius: 6,
                    }}
                  >
                    <Image
                      source={{ uri: thumbnailFile.url }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      padding: 20,
                    }}
                  >
                    <Image
                      source={{ uri: thumbnailFile.url }}
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
                      {thumbnailFile.fileName}:
                    </BrandText>
                  </View>
                )}

                <SpacerColumn size={2} />
                <View style={{ flex: 1, width: "100%" }}>
                  <TextInputCustom
                    noBrokenCorners
                    fullWidth
                    squaresBackgroundColor="red"
                    name="message"
                    placeHolder="Type your Message"
                    value={newMessage}
                    onChangeText={setNewMessage}
                  >
                    <TouchableOpacity onPress={handleSend}>
                      <Image
                        style={styles.sendButton}
                        source={require("../../../../assets/icons/sent.png")}
                      />
                    </TouchableOpacity>
                  </TextInputCustom>
                </View>
              </TertiaryBox>
            </View>
          </Modal>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  sendButton: { height: 20, width: 20, marginRight: 10 },

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
  textInputContainer: {
    position: "relative",
  },

  image: {
    height: 300,
    width: 200,
    alignSelf: "center",
  },
  imagesmall: {
    height: 100,
    width: "40%",
    alignSelf: "center",
    borderRadius: 10,
  },
});

export default UploadImage;
