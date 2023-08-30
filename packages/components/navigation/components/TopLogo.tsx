import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import logoTopVersionSVG from "../../../../assets/logos/logo-hexagon-version-alpha.svg";
import { useAppNavigation } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { SVG } from "../../SVG";

export const TopLogo = () => {
  // variables
  const navigation = useAppNavigation();

  // returns
  return (
    <View style={styles.topDetailContainer}>
      <TouchableOpacity
        style={styles.topIconContainer}
        onPress={() => navigation.navigate("Home")}
      >
        <SVG width={68} height={68} source={logoTopVersionSVG} />
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
  topIconContainer: {
    paddingLeft: layout.padding_x0_5,
  },
});
