import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import calender from "../../../../assets/icons/calendar.svg";
import close from "../../../../assets/icons/close.svg";
import search from "../../../../assets/icons/search.svg";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerRow } from "../../../components/spacer";
import Calendars from "./Calendar";
const ChatHeader = ({ searchInput, setSearchInput }) => {
  const [showTextInput, setShowTextInput] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const handleSearchIconPress = () => {
    setShowTextInput(true);
    setShowCalendar(false);
  };
  const handleCancelPress = () => {
    setShowTextInput(false);
    setSearchInput("");
    setShowCalendar(false);
  };
  return (
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
          <Text style={styles.groupName}>IntoSoft office </Text>
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
            <TextInputCustom
              name="search"
              placeHolder="Search..."
              value={searchInput}
              onChangeText={setSearchInput}
              iconSVG={search}
              iconStyle={{ width: 20, height: 40 }}
              height={30}
              noBrokenCorners
            />
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
        <View style={{ position: "absolute", marginTop: 100 }}>
          <Calendars />
        </View>
      )}
    </View>
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
});
