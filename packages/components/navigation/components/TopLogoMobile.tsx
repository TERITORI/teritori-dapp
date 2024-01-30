import React, { FC } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import logoTopVersionMobileSVG from "../../../../assets/logos/logo-version-alpha-small.svg";
import { SVG } from "../../SVG";

import { router } from "@/utils/router";

export const TopLogoMobile: FC = () => {
  return (
    <View style={styles.topDetailContainer}>
      <TouchableOpacity onPress={() => router.navigate("")}>
        <SVG width={48} height={48} source={logoTopVersionMobileSVG} />
      </TouchableOpacity>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  topDetailContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
