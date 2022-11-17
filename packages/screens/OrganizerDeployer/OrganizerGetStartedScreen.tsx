import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { layout } from "../../utils/style/layout";

const OrganizerGetStartedScreen = () => {
  return (
    <View style={styles.container}>
      <Text>OrganizerGetStartedScreen</Text>
    </View>
  );
};

export default OrganizerGetStartedScreen;

const styles = StyleSheet.create({
  container: {
    padding: layout.contentPadding,
    paddingRight: layout.padding_x2_5,
  },
});
