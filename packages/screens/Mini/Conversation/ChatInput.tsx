import React, { RefObject, useState } from "react";
import { FlatList, Image, useWindowDimensions, View } from "react-native";
import { Asset, launchImageLibrary } from "react-native-image-picker";

import cameraSVG from "../../../../assets/icons/camera-white.svg";
import crossSVG from "../../../../assets/icons/close.svg";
import micSVG from "../../../../assets/icons/mic-white.svg";
import chatPlusSVG from "../../../../assets/icons/plus-white.svg";
import sendSVG from "../../../../assets/icons/sent.svg";
import MiniTextInput from "../components/MiniTextInput";

import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { neutral00, neutral77 } from "@/utils/style/colors";
import { fontMedium16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { ReplyTo } from "@/utils/types/message";
import { sendMessage } from "@/weshnet/services";
import { bytesFromString } from "@/weshnet/utils";

type Props = {
  conversationId: string;
  replyTo: ReplyTo | undefined;
  clearReplyTo: () => void;
};

export const ChatInput = ({ conversationId, replyTo, clearReplyTo }: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const [newMessage, setNewMessage] = useState("");
  const [inputRef, setInputRef] = useState<RefObject<any> | null>(null);
  const [files, setFiles] = useState<Asset[] | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  const onNewMessageChange = (text: string) => {
    setNewMessage(text);
  };
  const onPlusPress = () => {};
  const onCameraPress = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true,
        presentationStyle: "fullScreen",
        selectionLimit: 5,
      });
      if (result.assets && result.assets.length > 0) {
        setFiles(result.assets.filter((x) => x.base64));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onMicPress = () => {};

  const handleSendNewMessage = async (data?: any) => {
    if (!newMessage && !data?.message && !files) {
      return;
    }
    setSendingMessage(true);
    const fileToSendFormat = files
      ?.map((x) => ({
        type: x.type,
        base64: x.base64,
        name: x.fileName,
        duration: x.duration || "",
      }))
      .filter((x) => x.base64);

    try {
      await sendMessage({
        groupPk: bytesFromString(conversationId),
        message: {
          type: "message",
          parentId: replyTo ? replyTo?.id : "",
          payload: {
            message: newMessage || data?.message || "",
            files: fileToSendFormat || [],
          },
        },
      });

      setNewMessage("");
      setFiles(null);
      clearReplyTo();
      setSendingMessage(false);

      inputRef?.current?.focus();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <View>
      {files && Array.isArray(files) ? (
        <FlatList
          data={files}
          horizontal
          keyExtractor={({ id, fileName }) => `${id}-${fileName}`}
          contentContainerStyle={{
            gap: layout.spacing_x2,
            flexDirection: "row",
            marginBottom: layout.spacing_x2,
            flexWrap: "wrap",
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={{ position: "relative" }}>
                <CustomPressable
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    backgroundColor: neutral00,
                    zIndex: 99999,
                    borderRadius: 30,
                  }}
                  onPress={() => {
                    setFiles((prevFiles) =>
                      prevFiles
                        ? prevFiles?.filter((x, idx) => idx !== index)
                        : null,
                    );
                  }}
                >
                  <SVG source={crossSVG} height={22} width={22} />
                </CustomPressable>
                <Image
                  source={{
                    uri: `data:${item.type};base64,${item.base64}`,
                  }}
                  height={80}
                  width={(windowWidth - 120) / 4}
                  style={{
                    borderRadius: 11,
                  }}
                  resizeMode="cover"
                />
              </View>
            );
          }}
        />
      ) : null}
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
            inputStyle={[fontMedium16, { color: neutral77, lineHeight: 0 }]}
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
        {(newMessage || (files && files?.length > 0)) && (
          <CustomPressable
            onPress={handleSendNewMessage}
            disabled={sendingMessage}
          >
            <SVG source={sendSVG} height={24} />
          </CustomPressable>
        )}
      </View>
    </View>
  );
};
