import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import avatar from "../../../../assets/icons/avatar.svg";
import calender from "../../../../assets/icons/calendar.svg";
import close from "../../../../assets/icons/close.svg";
import search from "../../../../assets/icons/search.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { neutral17, neutral33 } from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold11,
  fontMedium10,
} from "../../../utils/style/fonts";
import Calendars from "./Calendar";
const ChatHeader = ({ messages }: any) => {
  console.log(messages);
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
          <View>
            <Image
              source={require("../../../../assets/icons/groupicon.png")}
              style={{ width: 40, height: 40 }}
            />
          </View>
          <SpacerRow size={1} />
          <View>
            <Text style={styles.groupName}>Office group</Text>
            <FlexRow>
              <View>
                <FlexRow>
                  <View style={styles.badge} />
                  <SpacerRow size={1} />
                  <Text style={styles.status}>2 Online</Text>
                </FlexRow>
              </View>
              <SpacerRow size={1} />
              <View>
                <FlexRow>
                  <View style={styles.offlinebadge} />
                  <SpacerRow size={1} />
                  <Text style={styles.status}>3 Offline</Text>
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
                <TextInputCustom
                  name="search"
                  placeHolder="Search..."
                  value={searchInput}
                  onChangeText={handleMessageSearch}
                  iconSVG={search}
                  iconStyle={{ width: 20, height: 40 }}
                  height={30}
                  noBrokenCorners
                />
              )}
              <SpacerRow size={2} />
              <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
                <SVG source={calender} />
              </TouchableOpacity>
              <SpacerRow size={2} />
            </>
          ) : (
            <>
              <TouchableOpacity onPress={handleSearchIconPress}>
                <SVG
                  source={search}
                  style={{
                    height: 20,
                    width: 20,
                    marginTop: 2,
                    marginRight: 10,
                  }}
                />
              </TouchableOpacity>
              <Text style={{ color: "#fff", marginRight: 5 }}>...</Text>
            </>
          )}
          {showTextInput && (
            <TouchableOpacity onPress={handleCancelPress}>
              <SVG source={close} height={20} style={{ marginTop: 6 }} />
            </TouchableOpacity>
          )}
          <SpacerRow size={1} />
        </View>

        {showCalendar && (
          <View
            style={{
              position: "absolute",
              right: 0,
              top: 53.5,
            }}
          >
            <Calendars />
          </View>
        )}
      </View>
      <View style={styles.filterMessageWrapper}>
        {filterMessageData?.map((message: any, index) => {
          return (
            <View key={index} style={{ minWidth: 400 }}>
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
    backgroundColor: "#171717",
    flexDirection: "row",
    padding: 6,
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#C8FFAE",
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 12,
    width: 2,
  },
  offlinebadge: {
    backgroundColor: "#555555",
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 12,
    width: 2,
  },
  groupName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  status: {
    color: "#A3A3A3",
    fontWeight: "500",
    fontSize: 11,
    lineHeight: 18,
  },
  filterMessageWrapper: {
    backgroundColor: neutral17,
    position: "absolute",

    right: 0,
    top: 53.5,
    zIndex: 11,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderLeftWidth: 1,
    borderBottomWidth: 1,

    borderRightWidth: 1,

    borderColor: neutral33,
  },
});
