import Lottie, { LottieRefCurrentProps } from "lottie-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { neutral00 } from "../../../utils/style/colors";

interface CheckLoadingModalProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export const CheckLoadingModal: React.FC<CheckLoadingModalProps> = ({
  isVisible,
  onComplete,
}) => {
  // variables
  const { width, height } = useWindowDimensions();
  const successAnimateValue = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [localVisibleValue, setLocalVisibleValue] = useState<boolean>(false);
  const [init, setInit] = useState<boolean>(false);

  // hooks
  useEffect(() => {
    if (!isVisible) {
      Animated.timing(successAnimateValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      lottieRef.current?.stop();
      lottieRef.current?.play();

      setTimeout(() => {
        setLocalVisibleValue(false);
        if (init) {
          onComplete && onComplete();
        } else {
          setInit(true);
        }
      }, 1000);
    } else {
      Animated.timing(successAnimateValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setLocalVisibleValue(true);
    }
  }, [init, isVisible, onComplete, successAnimateValue]);

  // animation
  const fadeOutAnim = successAnimateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <Modal visible={localVisibleValue} transparent animationType="fade">
      <View style={[styles.container, { width, height }]}>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: neutral00 + "CC" },
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
});
