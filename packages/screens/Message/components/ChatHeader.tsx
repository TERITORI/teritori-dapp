import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";

import { AudioCall } from "./AudioCall";
import { Calendar } from "./Calendar";
import { ConversationAvatar } from "./ConversationAvatar";
import VideoCallScreen from "./VideoCall";
import calender from "../../../../assets/icons/calendar.svg";
import close from "../../../../assets/icons/close.svg";
import dots from "../../../../assets/icons/dots.svg";
import searchSVG from "../../../../assets/icons/search.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral17,
  neutral33,
  secondaryColor,
  neutral55,
  successColor,
} from "../../../utils/style/colors";
import { fontSemibold13, fontMedium14 } from "../../../utils/style/fonts";
import { getConversationName } from "../../../weshnet/client/messageHelpers";
export const ChatHeader = ({
  searchInput,
  setSearchInput,
  name,
  conversation,
}: any) => {
  const [showTextInput, setShowTextInput] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [audioCall, setAudioCall] = useState(false);
  const [videoCall, setVideoCall] = useState(false);

  const handleSearchIconPress = () => {
    setShowTextInput(true);
    setShowCalendar(false);
  };
  const handleCancelPress = () => {
    setShowTextInput(false);
    setSearchInput("");
    setShowCalendar(false);
  };
  const handleMessageSearch = (text: string) => {
    setSearchInput(text);
  };

  // const handleAudio = () => {
  //   setAudioCall(true);
  //   setVideoCall(false);
  // };
  // const handleVideo = () => {
  //   setVideoCall(true);
  //   setAudioCall(false);
  // };
  return (
    <>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ConversationAvatar conversation={conversation} size={20} />
          <SpacerRow size={1} />
          <View>
            <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
              {getConversationName(conversation)}
            </BrandText>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {showTextInput ? (
            <>
              {!showCalendar && (
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: neutral33,
                    borderRadius: 6,
                    padding: 6,
                  }}
                >
                  <SVG source={searchSVG} width={20} height={20} />
                  <SpacerRow size={1} />
                  <TextInput
                    placeholder="Search..."
                    value={searchInput}
                    onChangeText={handleMessageSearch}
                    placeholderTextColor={secondaryColor}
                    style={[
                      fontMedium14,
                      {
                        color: "white",

                        minWidth: 90,
                        maxWidth: 90,
                      },
                    ]}
                  />
                </View>
              )}
              <SpacerRow size={1} />
              <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
                <SVG source={calender} />
              </TouchableOpacity>
              <SpacerRow size={1} />
            </>
          ) : (
            <View>
              <FlexRow>
                <SpacerRow size={4} />
                <TouchableOpacity onPress={handleSearchIconPress}>
                  <SVG
                    source={searchSVG}
                    style={{
                      height: 20,
                      width: 20,
                    }}
                  />
                </TouchableOpacity>
                <SpacerRow size={1} />
                <TouchableOpacity>
                  <SVG source={dots} />
                </TouchableOpacity>
                <SpacerRow size={1} />
              </FlexRow>
            </View>
          )}

          {showTextInput && (
            <TouchableOpacity onPress={handleCancelPress}>
              <SVG source={close} style={{ marginTop: 6 }} />
            </TouchableOpacity>
          )}
        </View>

        {showCalendar && (
          <View
            style={{
              position: "absolute",
              right: 0,
              top: 46.8,
            }}
          >
            <Calendar />
          </View>
        )}
      </View>
      {videoCall && (
        <View
          style={{
            position: "absolute",
            backgroundColor: neutral17,
            padding: 12,
            width: "100%",
            top: 46.8,
          }}
        >
          <VideoCallScreen videoCall={videoCall} setVideoCall={setVideoCall} />
        </View>
      )}
      {audioCall && (
        <View
          style={{
            position: "absolute",
            backgroundColor: neutral17,
            padding: 10,
            width: "100%",
          }}
        >
          <AudioCall audioCall={audioCall} setAudioCall={setAudioCall} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: neutral17,
    flexDirection: "row",
    padding: 6,
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: successColor,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 12,
    width: 2,
  },
  offlinebadge: {
    backgroundColor: neutral55,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 12,
    width: 2,
  },

  filterMessageWrapper: {
    backgroundColor: neutral17,
    position: "absolute",
    right: 0,
    top: 46.8,
    zIndex: 11,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: neutral33,
  },
});
