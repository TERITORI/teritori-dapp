import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import FlexRow from "../../../components/FlexRow";
import { SpacerRow } from "../../../components/spacer";
export default function ChatHeader() {
  return (
    <View style={styles.container}>
      <FlexRow>
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
      </FlexRow>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#333333",

    width: "100%",
    padding: 6,
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
