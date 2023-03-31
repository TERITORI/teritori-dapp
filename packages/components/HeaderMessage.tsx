import React from "react";
import { View, StyleSheet } from "react-native";

import { neutral44 } from "../utils/style/colors";
import { NetworkSelector } from "./NetworkSelector";
import { SearchInput } from "./sorts/SearchInput";
const HeaderMessage: React.FC = () => {
  return (
    <View style={styles.container}>
      <SearchInput style={{ width: 250, marginRight: 30 }} />
      <View
        style={{
          borderWidth: 0.3,
          borderColor: neutral44,
          marginRight: 20,
          height: 78,
          overflow: "hidden",
        }}
      />
      <NetworkSelector hideDropdown="textHidden" style={{ marginRight: 20 }} />
      <NetworkSelector iconHide="iconHidden" />
    </View>
  );
};

export default HeaderMessage;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
