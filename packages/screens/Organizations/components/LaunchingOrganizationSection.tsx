import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";

import { BrandText } from "../../../components/BrandText";
import Lottie, { LottieRefCurrentProps } from "../../../components/Lottie";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SpacerColumn } from "../../../components/spacer";
import { useAppNavigation } from "../../../utils/navigation";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const LaunchingOrganizationSection: React.FC<{
  isLaunched: boolean;
  id: string | undefined;
}> = ({ isLaunched, id }) => {
  const { navigate } = useAppNavigation();
  const successAnimateValue = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (isLaunched) {
      Animated.timing(successAnimateValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      lottieRef.current?.stop();
      lottieRef.current?.play();
    }
  }, [isLaunched, successAnimateValue]);

  const fadeOutAnim = successAnimateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={styles.container}>
      <BrandText style={fontSemibold28}>
        {isLaunched ? "All done" : "Launch organization"}
      </BrandText>
      {isLaunched && id && (
        <View>
          <SpacerColumn size={1.5} />
          <BrandText style={[fontSemibold20, { color: neutralA3 }]}>
            Your organization is ready!
          </BrandText>
          <SpacerColumn size={3} />
          <View style={styles.row}>
            <PrimaryButton
              text="Get Started"
              onPress={() => navigate("UserPublicProfile", { id })}
            />
          </View>
        </View>
      )}

      <Animated.View
        style={[styles.lottieAnim, { opacity: successAnimateValue }]}
      >
        <Lottie
          lottieRef={lottieRef}
          style={{
            width: 200,
            height: 200,
          }}
          animationData={require("../../../../assets/lottie/animation-success.json")}
          autoPlay={false}
          loop={false}
        />
      </Animated.View>

      <Animated.View style={[styles.lottieAnim, { opacity: fadeOutAnim }]}>
        <Lottie
          style={{
            width: 200,
            height: 200,
          }}
          animationData={require("../../../../assets/lottie/animation-loading.json")}
          autoPlay
        />
      </Animated.View>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    padding: layout.contentSpacing,
    paddingRight: layout.spacing_x2_5,
    position: "relative",
    flex: 1,
    paddingTop: layout.topContentSpacingWithHeading,
  },
  lottieAnim: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: "auto",

    width: 200,
    height: 200,
  },
  row: { flexDirection: "row" },
});
