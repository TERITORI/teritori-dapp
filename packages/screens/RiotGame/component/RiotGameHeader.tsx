import React from "react";
import { StyleSheet, View } from "react-native";

import { ConnectWalletButton } from "../../../components/ConnectWalletButton";
import { SpacerRow } from "../../../components/spacer";
import { neutral33 } from "../../../utils/style/colors";
import {
  headerHeight,
  headerMarginHorizontal,
} from "../../../utils/style/layout";

export const RiotGameHeader = () => {
  return (
    <View style={styles.container}>
      <SpacerRow size={1} />
      <ConnectWalletButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: headerHeight,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: neutral33,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: headerMarginHorizontal,
  },
});
