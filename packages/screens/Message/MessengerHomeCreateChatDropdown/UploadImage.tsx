import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";

import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { FileUploader } from "../../../components/fileUploader";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { LocalFileData } from "../../../utils/types/feed";

interface IMessage {
  message: string;
  isSender: boolean;
  file: LocalFileData;

  onUploadThumbnail: (updatedFile: LocalFileData) => void;
  time: string;
  name: string;
}

const UploadImage = ({ showAttachmentModal, setShowAttachmentModal }) => {
  const [thumbnailFile, setThumbnailFile] = useState<LocalFileData>();
  const [visible, setVisible] = useState(true);
  //   const [closeModal, setCloseModal] = useState(false);
  //   const [deleteImage, setDeleteImage] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        {showAttachmentModal && !thumbnailFile ? (
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
                  <Text style={styles.attach}>Attach file</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.attachmentItem}
                  // onPress={() => handleAttachment("image")}
                  onPress={onPress}
                >
                  <Text style={styles.attach}>Attach image/video</Text>
                </TouchableOpacity>
              </View>
            )}
          </FileUploader>
        ) : null}

        {thumbnailFile ? (
          <Modal visible={visible} animationType="none" transparent>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <TertiaryBox>
                <TouchableOpacity
                  style={styles.background}
                  activeOpacity={1}
                  //   onPressOut={closeModal}
                >
                  <View style={styles.modal}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: thumbnailFile.url }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      //   onPress={deleteImage}
                    >
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.closeButton}
                      //   onPress={closeModal}
                    >
                      <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 24,
  },

  attachmentModal: {
    position: "absolute",
    top: -50,
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

  attach: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 10,
    color: "#A3A3A3",
  },
  background: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "90%",
    maxWidth: 400,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: "center",
  },
  imageContainer: {
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: 16,
  },
  image: {
    height: 200,
    width: 200,
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UploadImage;
