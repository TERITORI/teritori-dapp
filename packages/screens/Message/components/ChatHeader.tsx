import React, { useRef, useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { useDispatch } from "react-redux";

import { AudioCall } from "./AudioCall";
import { Calendar } from "./Calendar";
import { ConversationAvatar } from "./ConversationAvatar";
import VideoCallScreen from "./VideoCall";
import close from "../../../../assets/icons/close.svg";
import dots from "../../../../assets/icons/dots.svg";
import searchSVG from "../../../../assets/icons/search.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SpacerRow } from "../../../components/spacer";
import { useDropdowns } from "../../../context/DropdownsProvider";
import { updateConversationById } from "../../../store/slices/message";
import {
  neutral17,
  neutral33,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontMedium14,
  fontSemibold12,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Conversation } from "../../../utils/types/message";
import { weshClient } from "../../../weshnet/client";
import { getConversationName } from "../../../weshnet/client/messageHelpers";
import { bytesFromString } from "../../../weshnet/client/utils";

interface ChatHeaderProps {
  searchInput: string;
  setSearchInput: (input: string) => void;

  conversation: Conversation;
}

export const ChatHeader = ({
  searchInput,
  setSearchInput,
  conversation,
}: ChatHeaderProps) => {
  const dispatch = useDispatch();

  const [showTextInput, setShowTextInput] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [audioCall, setAudioCall] = useState(false);
  const [videoCall, setVideoCall] = useState(false);

  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);
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

  const LIST_ITEMS = [
    conversation.type === "contact" && {
      label: "Block Contact",
      onPress: () => {
        closeOpenedDropdown();
        dispatch(
          updateConversationById({
            id: conversation.id,
            status: "blocked",
          })
        );
      },
    },
    conversation.type === "group" && {
      label: "Leave Group",
      onPress: async () => {
        await weshClient.client.MultiMemberGroupLeave({
          groupPk: bytesFromString(conversation.id),
        });
        closeOpenedDropdown();
      },
    },
    conversation.status === "active" && {
      label: "Archive Chat",
      onPress: () => {
        dispatch(
          updateConversationById({
            id: conversation.id,
            status: "archived",
          })
        );
        closeOpenedDropdown();
      },
    },
    conversation.status === "archived" && {
      label: "Unarchive Chat",
      onPress: () => {
        dispatch(
          updateConversationById({
            id: conversation.id,
            status: "active",
          })
        );
        closeOpenedDropdown();
      },
    },
  ].filter(Boolean);

  return (
    <>
      <View
        style={{
          backgroundColor: neutral17,
          flexDirection: "row",
          padding: 6,
          justifyContent: "space-between",
          alignItems: "center",
          height: 46,
        }}
        ref={dropdownRef}
      >
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

              <SpacerRow size={1} />
            </>
          ) : (
            <View>
              <FlexRow>
                <SpacerRow size={4} />
                <TouchableOpacity
                  onPress={handleSearchIconPress}
                  style={{
                    padding: layout.spacing_x0_75,
                  }}
                >
                  <SVG
                    source={searchSVG}
                    style={{
                      height: 20,
                      width: 20,
                    }}
                  />
                </TouchableOpacity>
                <SpacerRow size={1} />
                <TouchableOpacity
                  style={{
                    padding: layout.spacing_x0_75,
                  }}
                  onPress={() => onPressDropdownButton(dropdownRef)}
                >
                  <SVG source={dots} />
                </TouchableOpacity>
                {isDropdownOpen(dropdownRef) && (
                  <TertiaryBox
                    width={140}
                    style={{ position: "absolute", top: 30, right: 10 }}
                    mainContainerStyle={{
                      paddingHorizontal: layout.spacing_x2,
                      paddingTop: layout.spacing_x2,
                      backgroundColor: neutral17,
                      alignItems: "flex-start",
                    }}
                    squaresBackgroundColor={neutral17}
                    noRightBrokenBorder
                  >
                    {LIST_ITEMS.map((item) => {
                      return (
                        <TouchableOpacity
                          style={{
                            marginBottom: layout.spacing_x2,
                          }}
                          key={item.label}
                          onPress={item.onPress}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <BrandText
                              style={[
                                fontSemibold12,
                                { marginLeft: layout.spacing_x1_5 },
                              ]}
                            >
                              {item.label}
                            </BrandText>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </TertiaryBox>
                )}

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
