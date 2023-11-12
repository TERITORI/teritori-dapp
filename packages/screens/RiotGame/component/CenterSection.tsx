import React, { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";

import startButtonSVG from "../../../../assets/game/start-button.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import { neutral00 } from "../../../utils/style/colors";
import { fontBold16, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface CenterSectionProps {
  cardWidth: number;
  cardHeight: number;
  onPress(): void;
}

export const CenterSection: React.FC<CenterSectionProps> = ({
  cardWidth,
  cardHeight,
  onPress,
}) => {
  const pulseOpacityRef = useRef(new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacityRef.current, {
          toValue: 0.4,
          duration: 2000,
          delay: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacityRef.current, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: 5,
      },
    ).start();
  }, []);

  return (
    <>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 5,
          margin: "auto",
          justifyContent: "center",
          alignItems: "center",
          width: cardWidth * 2,
          height: cardHeight,
          paddingHorizontal: layout.spacing_x2_5,
        }}
      >
        <Pressable
          onPress={onPress}
          style={{
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            width: cardWidth * 2 - layout.spacing_x2_5 * 2,
            height: cardHeight * 0.37,
          }}
        >
          <Animated.View
            style={[
              {
                opacity: pulseOpacityRef.current,
                backgroundColor: neutral00,
                position: "relative",
                width: cardWidth * 2 - layout.spacing_x2_5 * 2,
                height: cardHeight * 0.37,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <SVG
              source={startButtonSVG}
              width={cardWidth * 2 - layout.spacing_x2_5 * 2}
              height={cardHeight * 0.37}
            />
            <BrandText
              style={[
                fontBold16,
                {
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                },
              ]}
            >
              Start the Game
            </BrandText>
          </Animated.View>
        </Pressable>
        <SpacerColumn size={2.5} />
        <BrandText style={[fontSemibold14, { textAlign: "center" }]}>
          Rioters Play2Earn Fight to Defend your Squad !
        </BrandText>
      </View>
    </>
  );
};
