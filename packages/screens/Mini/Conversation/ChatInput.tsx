import React, { RefObject, useState } from "react";
import { View } from "react-native";

import cameraSVG from "../../../../assets/icons/camera-white.svg";
import micSVG from "../../../../assets/icons/mic-white.svg";
import chatPlusSVG from "../../../../assets/icons/plus-white.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { neutral77 } from "../../../utils/style/colors";
import { fontMedium16, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ReplyTo } from "../../../utils/types/message";
import { sendMessage } from "../../../weshnet/services";
import { bytesFromString } from "../../../weshnet/utils";
import MiniTextInput from "../components/MiniTextInput";

type Props = {
  conversationId: string;
  replyTo: ReplyTo | undefined;
  clearReplyTo: () => void;
};

export const ChatInput = ({ conversationId, replyTo, clearReplyTo }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  const [inputRef, setInputRef] = useState<RefObject<any> | null>(null);

  const onNewMessageChange = (text: string) => {
    setNewMessage(text);
  };
  const onPlusPress = () => {};
  const onCameraPress = async () => {};
  const onMicPress = () => {};

  const handleSendNewMessage = async (data?: any) => {
    if (!newMessage && !data?.message) {
      return;
    }

    try {
      await sendMessage({
        groupPk: bytesFromString(conversationId),
        message: {
          type: "message",
          parentId: replyTo ? replyTo?.id : "",
          payload: {
            message: newMessage || data?.message,
            files: [],
          },
        },
      });

      setNewMessage("");
      clearReplyTo();
      inputRef?.current?.focus();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: layout.spacing_x2,
      }}
    >
      <CustomPressable onPress={onPlusPress}>
        <SVG source={chatPlusSVG} />
      </CustomPressable>

      <View style={{ flex: 1 }}>
        <MiniTextInput
          placeholder="Message"
          setRef={setInputRef}
          value={newMessage}
          onChangeText={onNewMessageChange}
          style={{ paddingVertical: layout.spacing_x1 }}
          inputStyle={[fontMedium16, { color: neutral77 }]}
          numberOfLines={6}
          multiline
          autoFocus
          onSubmitEditing={() => {
            if (newMessage.length) {
              handleSendNewMessage();
            }
          }}
        />
      </View>
      {newMessage && (
        <CustomPressable onPress={handleSendNewMessage}>
          <BrandText style={[fontSemibold14]}>Send</BrandText>
        </CustomPressable>
      )}
      {!newMessage && (
        <>
          <CustomPressable onPress={onCameraPress}>
            <SVG source={cameraSVG} height={24} />
          </CustomPressable>
          <CustomPressable onPress={onMicPress}>
            <SVG source={micSVG} height={24} />
          </CustomPressable>
        </>
      )}
    </View>
  );
};
