import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

// import centerGradientSVG from "../../../../assets/game/center-gradient.svg";

import startButtonSVG from "../../../../assets/game/start-button.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import { fontBold16, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface CenterSectionProps {
  cardWidth: number;
  cardHeight: number;
}

export const CenterSection: React.FC<CenterSectionProps> = ({
  cardWidth,
  cardHeight,
}) => {
  // variables
  const pulseOpacityRef = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacityRef, {
          toValue: 0.4,
          duration: 2000,
          delay: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacityRef, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: 5,
      }
    ).start();
  }, []);

  // returns
  return (
    <>
      <View
        style={[
          styles.section,
          {
            width: cardWidth * 2,
            height: cardHeight,
            paddingHorizontal: layout.padding_x2_5,
          },
        ]}
      >
        <View
          style={[
            styles.buttonContainer,
            {
              width: cardWidth * 2 - layout.padding_x2_5 * 2,
              height: cardHeight * 0.37,
            },
          ]}
        >
          <Animated.View
            style={[styles.positionAbsolute, { opacity: pulseOpacityRef }]}
          >
            <SVG
              source={startButtonSVG}
              width={cardWidth * 2 - layout.padding_x2_5 * 2}
              height={cardHeight * 0.37}
            />
          </Animated.View>
          <BrandText style={fontBold16}>Start the Game</BrandText>
        </View>
        <SpacerColumn size={2.5} />
        <BrandText style={[fontSemibold14, { textAlign: "center" }]}>
          Rioters Play2Earn Fight to Defend your Squad !
        </BrandText>
      </View>
      {/* <View style={[styles.section, { opacity: 0.5, zIndex: -2 }]}>
        <SVG
          source={centerGradientSVG}
          width={cardWidth * 5}
          height={cardHeight * 4}
        />
      </View> */}
    </>
  );
};
const styles = StyleSheet.create({
  section: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  positionAbsolute: {
    position: "absolute",
  },
});
