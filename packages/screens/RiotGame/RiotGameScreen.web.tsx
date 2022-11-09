import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import screenfull from "screenfull";

import { ComingSoon } from "../../components/ComingSoon";
import { neutral00 } from "../../utils/style/colors";
import { RiotGameHeader } from "./component/RiotGameHeader";

export const RiotGameScreen = () => {
  // variables
  const [isFullscreenEnabled, setIsFullscreenEnabled] = useState(false);

  // hooks
  useEffect(() => {
    if (screenfull.isEnabled) {
      const callBack = () => {
        setIsFullscreenEnabled(screenfull.isFullscreen);
      };
      screenfull.on("change", callBack);

      return () => screenfull.off("change", callBack);
    }
  }, []);

  // returns
  return (
    <View style={styles.container}>
      <RiotGameHeader />
      <ComingSoon />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral00,
  },
});
