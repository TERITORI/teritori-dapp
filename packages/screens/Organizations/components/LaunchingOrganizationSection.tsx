import Lottie from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SpacerColumn } from "@/components/spacer";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { neutralA3 } from "@/utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const LaunchingOrganizationSection: React.FC<{
  isLaunched: boolean;
  id: string | undefined;
  resetForm: () => Promise<void>;
}> = ({ isLaunched, id, resetForm }) => {
  const { navigate } = useAppNavigation();
  const successAnimateValue = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<Lottie>(null);

  useEffect(() => {
    if (isLaunched) {
      Animated.timing(successAnimateValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      lottieRef.current?.pause();
      lottieRef.current?.play();
    }
  }, [isLaunched, successAnimateValue]);

  const fadeOutAnim = successAnimateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={containerCStyle}>
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
          <View style={rowCStyle}>
            <PrimaryButton
              text="Get Started"
              loader
              onPress={async () => {
                await resetForm();
                navigate("UserPublicProfile", { id });
              }}
            />
          </View>
        </View>
      )}

      <Animated.View
        style={[lottieAnimCStyle, { opacity: successAnimateValue }]}
      >
        <Lottie
          ref={lottieRef}
          style={{
            width: 200,
            height: 200,
          }}
          source={require("../../../../assets/lottie/animation-success.json")}
          autoPlay={false}
          loop={false}
        />
      </Animated.View>

      <Animated.View style={[lottieAnimCStyle, { opacity: fadeOutAnim }]}>
        <Lottie
          style={{
            width: 200,
            height: 200,
          }}
          source={require("../../../../assets/lottie/animation-loading.json")}
          autoPlay
        />
      </Animated.View>
    </View>
  );
};

const containerCStyle: ViewStyle = {
  padding: layout.contentSpacing,
  paddingRight: layout.spacing_x2_5,
  position: "relative",
  flex: 1,
  paddingTop: layout.topContentSpacingWithHeading,
};

const lottieAnimCStyle: ViewStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  margin: "auto",

  width: 200,
  height: 200,
};

const rowCStyle: ViewStyle = { flexDirection: "row" };
