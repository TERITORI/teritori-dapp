import React, { memo } from "react";
import { Image } from "react-native";
import { DraxView } from "react-native-drax";

import { nftDropedAdjustmentType } from "../../screens/RiotersFooter/RiotersFooterScreen.types";
import { primaryColor } from "../../utils/style/colors";

const DragAndDropNftInReceiverView: React.FC<{
  nftDroped: any;
  nftDropedAdjustment: nftDropedAdjustmentType;
  oldNftPositionsWithZIndexOrder: any;
}> = memo(
  ({ nftDroped, nftDropedAdjustment, oldNftPositionsWithZIndexOrder }) => {
    const width =
      nftDropedAdjustment.width <= 10
        ? 10
        : nftDropedAdjustment.width >= 200
        ? 200
        : nftDropedAdjustment.width;
    const height =
      nftDropedAdjustment.height <= 10
        ? 10
        : nftDropedAdjustment.height >= 200
        ? 200
        : nftDropedAdjustment.height;

    let borderRadius = 0;

    if (nftDropedAdjustment.borderRadius) {
      borderRadius =
        (nftDropedAdjustment.borderRadius *
          (nftDropedAdjustment.width > nftDropedAdjustment.height
            ? nftDropedAdjustment.width
            : nftDropedAdjustment.height)) /
        200;
    }

    return (
      <DraxView
        onDragStart={() => {
          console.log("start drag id", nftDroped.id);
        }}
        animateSnapback={false}
        dragPayload={nftDroped.id}
        style={{
          position: "absolute",
          left: nftDropedAdjustment.x,
          top: nftDropedAdjustment.y,
          zIndex: oldNftPositionsWithZIndexOrder.length,
          padding: 4,
          borderColor: primaryColor,
          borderWidth: 1,
        }}
        draggingStyle={{ opacity: 0.5 }}
      >
        <Image
          style={{
            width,
            height,
            borderRadius,
          }}
          source={nftDroped.svg}
        />
      </DraxView>
    );
  }
);

export default DragAndDropNftInReceiverView;
