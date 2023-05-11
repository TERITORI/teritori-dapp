import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

import MessagePopup from "./MessagePopup";
import avatar from "../../../../assets/icons/avatar.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral77,
  secondaryColor,
  purpleDark,
  neutral17,
} from "../../../utils/style/colors";
import {
  fontBold10,
  fontMedium10,
  fontSemibold11,
} from "../../../utils/style/fonts";
interface IChatMessageProps {
  message: string;
  isSender: boolean;
  time: string;
  receiverName?: string;
  source?: any;
  height: number;
  width: number;
  imageStyle?: any;
}

const ChatMessage = ({
  message,
  isSender,
  time,
  receiverName,
  source,
  height,
  width,
  imageStyle,
}: IChatMessageProps) => {
  const senderName = "me";
  const [showPopup, setShowPopup] = useState(false);
  const [isForwarding, setIsForwarding] = useState(false);
  return (
    <>
      <View style={isSender ? styles.senderWrapper : styles.receiverWrapper}>
        {!isSender && <SVG source={avatar} style={{ width: 30, height: 30 }} />}
        <View
          style={[isSender ? styles.senderContainer : styles.receiverContainer]}
        >
          <TouchableOpacity onPress={() => setShowPopup(!showPopup)}>
            <BrandText style={[fontSemibold11, { color: secondaryColor }]}>
              {message}
            </BrandText>
          </TouchableOpacity>

          {source && (
            <Image source={source} style={{ height, width, ...imageStyle }} />
          )}
          {!isSender && showPopup && (
            <View style={styles.popupContainer}>
              <MessagePopup
                isForwarding={isForwarding}
                setIsForwarding={setIsForwarding}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              top: -15,
              left: 10,
            }}
          >
            {!isSender && receiverName && (
              <BrandText style={[fontBold10, { color: secondaryColor }]}>
                {receiverName}
              </BrandText>
            )}
            {isSender && (
              <BrandText style={[fontBold10, { color: secondaryColor }]}>
                {senderName}
              </BrandText>
            )}
            <SpacerRow size={0.5} />
            <BrandText style={[fontMedium10, { color: neutral77 }]}>
              {time}
            </BrandText>
          </View>
        </View>
      </View>
    </>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  senderWrapper: {
    flexDirection: "row",
    flex: 1,
    marginBottom: 20,
    marginTop: 25,
  },
  receiverWrapper: {
    flexDirection: "row",
    marginBottom: 8,
  },
  senderContainer: {
    backgroundColor: neutral17,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 10,
    marginLeft: "auto",
    width: "auto",
    maxWidth: "40%",
    zIndex: 1,
  },
  receiverContainer: {
    backgroundColor: purpleDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 10,
    width: "auto",
    maxWidth: "40%",
    zIndex: 1,
    marginRight: "auto",
  },
  popupContainer: {
    backgroundColor: "rgba(41, 41, 41, 0.8)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,

    width: "auto",

    zIndex: 11111,

    position: "absolute",
    right: -50,
    top: -170,
  },
});
