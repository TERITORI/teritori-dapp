import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import farward from "../../../assets/icons/farward.svg";
import friends from "../../../assets/icons/friends.svg";
import { SVG } from "../../../packages/components/SVG";
const Searchbar = () => {
  return (
    <View style={styles.friendBox}>
      <View style={styles.iconandText}>
        <SVG source={friends} />
        <Text style={styles.friendText}>Friends</Text>
      </View>
      <View style={styles.iconandText}>
        <Text style={styles.number}>0</Text>
        <TouchableOpacity>
          <SVG source={farward} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  friendText: {
    color: "#FFFFFF",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 18,
  },
  number: {
    color: "#FFFFFF",
    marginRight: 15,
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 18,
  },
  friendBox: {
    flexDirection: "row",
    backgroundColor: "#222222",

    padding: 8,
    height: 40,
    borderRadius: 6,
    justifyContent: "space-between",
    marginTop: 20,
  },
  iconandText: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 10,
  },
});
export default Searchbar;
