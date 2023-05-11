import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";

import Calendars from "./Calendar";
import avatar from "../../../../assets/icons/avatar.svg";
import calender from "../../../../assets/icons/calendar.svg";
import close from "../../../../assets/icons/close.svg";
import search from "../../../../assets/icons/search.svg";
import searchSVG from "../../../../assets/icons/search.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  neutral17,
  neutral33,
  neutralA3,
  secondaryColor,
  neutral55,
  successColor,
} from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold11,
  fontMedium10,
  fontMedium14,
} from "../../../utils/style/fonts";
const ChatHeader = ({ messages }: any) => {
  const [showTextInput, setShowTextInput] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filterMessageData, setFilterMessageData] = useState<any[]>([]);
  const handleSearchIconPress = () => {
    setShowTextInput(true);
    setShowCalendar(false);
  };
  const handleCancelPress = () => {
    setShowTextInput(false);
    setSearchInput("");
    setShowCalendar(false);
    setFilterMessageData(null);
  };
  const handleMessageSearch = (text: string) => {
    setSearchInput(text);
    const filterMessages = messages?.filter((message: any) =>
      message.message.toLowerCase().includes(text.toLowerCase())
    );
    setFilterMessageData(filterMessages);
  };
  const HandleSearchData = () => {
    setFilterMessageData(null);
  };
  const dataLength = filterMessageData?.length;
  return (
    <>
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../../../assets/icons/groupicon.png")}
            style={{ width: 32, height: 32 }}
          />

          <SpacerRow size={1} />
          <View>
            <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
              Office group
            </BrandText>
            <FlexRow>
              <View>
                <FlexRow>
                  <View style={styles.badge} />
                  <SpacerRow size={1} />
                  <BrandText style={[fontSemibold11, { color: neutralA3 }]}>
                    2 Online
                  </BrandText>
                </FlexRow>
              </View>

              <SpacerRow size={1} />

              <View>
                <FlexRow>
                  <View style={styles.offlinebadge} />
                  <SpacerRow size={1} />
                  <BrandText style={[fontSemibold11, { color: neutralA3 }]}>
                    3 Offline
                  </BrandText>
                </FlexRow>
              </View>
            </FlexRow>
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
                    // value={value}
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
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={handleSearchIconPress}>
                <SVG
                  source={search}
                  style={{
                    height: 20,
                    width: 20,
                    marginTop: 10,
                  }}
                />
              </TouchableOpacity>
              <SpacerRow size={1} />

              <BrandText style={{ color: secondaryColor }}>...</BrandText>

              <SpacerRow size={1} />
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
              top: ["android", "ios"].includes(Platform.OS) ? 46.8 : 53.5,
            }}
          >
            <Calendars />
          </View>
        )}
      </View>
      <View style={styles.filterMessageWrapper}>
        {filterMessageData?.map((message: any, index) => {
          return (
            <View
              key={index}
              style={{
                width: ["android", "ios"].includes(Platform.OS) ? 350 : 400,
              }}
            >
              <TouchableOpacity onPress={HandleSearchData}>
                <FlexRow
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ padding: 10 }}
                >
                  <View>
                    <FlexRow>
                      <SVG source={avatar} />
                      <SpacerRow size={1} />
                      <View>
                        <BrandText
                          style={[fontSemibold13, { color: "#FFFFFF" }]}
                        >
                          {message?.name}
                        </BrandText>
                        <SpacerColumn size={0.5} />

                        <BrandText
                          style={[fontSemibold11, { color: "#A3A3A3" }]}
                        >
                          {message?.message.split(" ").slice(0, 5).join(" ")}
                          {message?.message.split(" ").length > 5 ? "..." : ""}
                        </BrandText>
                      </View>
                      <SpacerColumn size={2} />
                    </FlexRow>
                  </View>
                  <View>
                    <BrandText style={[fontMedium10, { color: "#777777" }]}>
                      {message?.date}
                    </BrandText>

                    <BrandText
                      style={[
                        fontMedium10,
                        { color: "#777777", textAlign: "right", marginTop: 6 },
                      ]}
                    >
                      {message?.time}
                    </BrandText>
                  </View>
                </FlexRow>
              </TouchableOpacity>

              {index < dataLength - 1 && (
                <View style={{ marginLeft: 10, marginRight: 10 }}>
                  <Separator key={index} />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </>
  );
};
export default ChatHeader;
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
    top: ["android", "ios"].includes(Platform.OS) ? 46.8 : 53.5,
    zIndex: 11,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderLeftWidth: 1,
    borderBottomWidth: 1,

    borderRightWidth: 1,

    borderColor: neutral33,
  },
});
