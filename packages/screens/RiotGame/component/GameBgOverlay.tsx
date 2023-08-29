// libraries
import React, { useMemo } from "react";
import { useWindowDimensions, View, ViewStyle } from "react-native";

import gameBgShadowVerticalSVG from "../../../../assets/game-bg-shadow-vertical.svg";
import gameBgShadowSVG from "../../../../assets/game-bg-shadow.svg";
import { SVG } from "../../../components/SVG";
import { headerHeight } from "../../../utils/style/layout";

// misc

type GameBgOverlayProps = {
  type: "top" | "bottom" | "left" | "right";
};

const DEFAULT_SIZE = 190;

export const GameBgOverlay: React.FC<GameBgOverlayProps> = ({ type }) => {
  // variables
  const { width, height } = useWindowDimensions();

  const shadowHeight = useMemo(() => {
    switch (type) {
      case "top":
      case "bottom":
        return DEFAULT_SIZE;

      case "right":
      case "left":
        return height - headerHeight;

      default:
        return DEFAULT_SIZE;
    }
  }, [type, height]);

  const shadowWidth = useMemo(() => {
    switch (type) {
      case "top":
      case "bottom":
        return width;

      case "right":
      case "left":
        return DEFAULT_SIZE;

      default:
        return width;
    }
  }, [type, width]);

  // returns
  return (
    <View style={[styles.absolute, styles[type]]}>
      <SVG
        source={
          ["top", "bottom"].includes(type)
            ? gameBgShadowSVG
            : gameBgShadowVerticalSVG
        }
        height={shadowHeight}
        width={shadowWidth}
      />
    </View>
  );
};

const absolute: ViewStyle = { position: "absolute" };
const top: ViewStyle = {
  top: 0,
};
const bottom: ViewStyle = {
  bottom: 0,
  transform: [{ rotate: "180deg" }],
};
const left: ViewStyle = {
  left: 0,
  top: 0,
};
const right: ViewStyle = {
  right: 0,
  top: 0,
  transform: [{ rotate: "180deg" }],
};

const styles = {
  absolute,
  top,
  bottom,
  left,
  right,
};
