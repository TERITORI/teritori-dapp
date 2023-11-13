import React, { memo } from "react";
import { View, ViewStyle } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useAnimatedGestureHandler } from "react-native-reanimated";
import { clamp } from "react-native-redash";

import { primaryColor } from "../../utils/style/colors";
import { NFTDropedAdjustmentType, FooterNftData } from "../../utils/types/nft";

const NftDragResizerCorner: React.FC<{
  nftDropedAdjustment: NFTDropedAdjustmentType;
  oldNftPositions: FooterNftData[];
  style: ViewStyle | ViewStyle[];
  onResize: (adjustment: {
    x?: number;
    y?: number;
    width: number;
    height: number;
  }) => void;
  cornerPosition: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}> = memo(
  ({
    nftDropedAdjustment,
    oldNftPositions,
    style,
    onResize,
    cornerPosition,
  }) => {
    const onGestureEvent = useAnimatedGestureHandler({
      onStart: (_, ctx: any) => {
        ctx.offsetX = nftDropedAdjustment.x;
        ctx.offsetY = nftDropedAdjustment.y;
        ctx.width = nftDropedAdjustment.width;
        ctx.height = nftDropedAdjustment.height;
      },
      onActive: (event, ctx) => {
        const positions: {
          x?: number;
          y?: number;
          width: number;
          height: number;
        } = {
          width: 0,
          height: 0,
        };
        let x = null;
        let y = null;

        switch (cornerPosition) {
          case "topLeft":
            x =
              ctx.width - event.translationX <= 10 ||
              ctx.width - event.translationX >= 200
                ? null
                : ctx.offsetX + event.translationX;
            y =
              ctx.height - event.translationY <= 10 ||
              ctx.height - event.translationY >= 200
                ? null
                : ctx.offsetY + event.translationY;
            positions.width = clamp(ctx.width - event.translationX, 10, 200);
            positions.height = clamp(ctx.height - event.translationY, 10, 200);
            x && (positions.x = x);
            y && (positions.y = y);
            break;
          case "topRight":
            y =
              ctx.height - event.translationY <= 10 ||
              ctx.height - event.translationY >= 200
                ? null
                : ctx.offsetY + event.translationY;
            positions.width = clamp(ctx.width + event.translationX, 10, 200);
            positions.height = clamp(ctx.height - event.translationY, 10, 200);
            y && (positions.y = y);
            break;
          case "bottomLeft":
            x =
              ctx.width - event.translationX <= 10 ||
              ctx.width - event.translationX >= 200
                ? null
                : ctx.offsetX + event.translationX;
            positions.width = clamp(ctx.width - event.translationX, 10, 200);
            positions.height = clamp(ctx.height + event.translationY, 10, 200);
            x && (positions.x = x);
            break;
          case "bottomRight":
            positions.width = clamp(ctx.width + event.translationX, 10, 200);
            positions.height = clamp(ctx.height + event.translationY, 10, 200);
            break;
        }
        onResize(positions);
      },
    });

    return (
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <View
          style={[
            {
              width: 7,
              height: 7,
              position: "absolute",
              backgroundColor: "black",
              borderWidth: 1,
              borderColor: primaryColor,
              zIndex: oldNftPositions.length + 2,
            },
            style,
          ]}
        />
      </PanGestureHandler>
    );
  },
);

export default NftDragResizerCorner;
