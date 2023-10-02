import React, { Dispatch, SetStateAction, useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { HandleSendParams } from "./ChatSection";
import { FileRenderer } from "./FileRenderer";
import sent from "../../../../assets/icons/sent.svg";
import { SVG } from "../../../components/SVG";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { neutral17, neutral77 } from "../../../utils/style/colors";
import { fontMedium14 } from "../../../utils/style/fonts";
import { MessageFileData } from "../../../utils/types/message";

interface UploadedPreviewProps {
  handleSend: (params: HandleSendParams) => void;
  setFile: Dispatch<SetStateAction<MessageFileData | undefined>>;
  file: MessageFileData;
}

export const UploadedPreview = ({
  handleSend,
  setFile,
  file,
}: UploadedPreviewProps) => {
  const [message, setMessage] = useState("");

  const onSend = () => {
    if (file && message.length) {
      handleSend({
        files: [file],
        message,
      });
      setMessage("");
    }
  };

  if (!file) {
    return;
  }
  return (
    <ModalBase
      label="File upload"
      onClose={() => setFile(undefined)}
      visible
      hideMainSeparator
      width={400}
    >
      {!!file && (
        <FileRenderer files={[file]} maxWidth={360} waveFormMaxWidth={300} />
      )}
      <SpacerColumn size={10} />

      <View style={{ position: "absolute", bottom: 0, right: 0, left: 0 }}>
        <TextInputCustom
          autoFocus
          fullWidth
          noBrokenCorners
          name="message"
          placeHolder="Add a message..."
          placeholderTextColor={neutral77}
          labelStyle={[fontMedium14, { color: neutral77 }]}
          value={message}
          onChangeText={setMessage}
          boxMainContainerStyle={{ backgroundColor: neutral17 }}
          textInputStyle={{ marginLeft: 10, top: -8 }}
          onSubmitEditing={onSend}
          label=""
        >
          <TouchableOpacity onPress={onSend}>
            <SVG source={sent} />
          </TouchableOpacity>
          <SpacerRow size={1} />
        </TextInputCustom>
      </View>
    </ModalBase>
  );
};
