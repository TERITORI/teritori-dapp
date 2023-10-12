import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { neutral33, primaryColor } from "../../utils/style/colors";

const NftTypeTab: React.FC<{
  tabName: string;
  setTabName: (text: string) => void;
}> = memo(({ tabName, setTabName }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", height: "100%" }}>
        <TouchableOpacity style={styles.tab} onPress={() => setTabName("New")}>
          <View
            style={[
              styles.tabButton,
              tabName === "New" && {
                backgroundColor: primaryColor,
                borderRadius: 7,
              },
            ]}
          >
            <BrandText
              style={[styles.tabText, tabName === "New" && { color: "black" }]}
            >
              New
            </BrandText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setTabName("Existing")}
        >
          <View
            style={[
              styles.tabButton,
              tabName === "Existing" && {
                backgroundColor: primaryColor,
                borderRadius: 7,
              },
            ]}
          >
            <BrandText
              style={[
                styles.tabText,
                tabName === "Existing" && { color: "black" },
              ]}
            >
              Existing
            </BrandText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default NftTypeTab;

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    height: 40,
    borderRadius: 10,
    borderColor: neutral33,
    borderWidth: 1,
  },
  tab: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    textAlign: "center",
    fontSize: 14,
  },
  tabButton: {
    width: "96%",
    height: "90%",
    justifyContent: "center",
  },
});
