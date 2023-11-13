import React, { memo } from "react";
import { Image } from "react-native";
import { DraxView } from "react-native-drax";

import { NFT } from "../../api/marketplace/v1/marketplace";
import { primaryColor } from "../../utils/style/colors";
import { NFTDropedAdjustmentType, FooterNftData } from "../../utils/types/nft";

const DragAndDropNftInReceiverView: React.FC<{
  nftDroped: NFT;
  nftDropedAdjustment: NFTDropedAdjustmentType;
  oldNftPositions: FooterNftData[];
}> = memo(({ nftDroped, nftDropedAdjustment, oldNftPositions }) => {
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
        console.log("start drag id", JSON.stringify(nftDroped));
      }}
      animateSnapback={false}
      dragPayload={JSON.stringify(nftDroped)}
      style={{
        position: "absolute",
        left: nftDropedAdjustment.x,
        top: nftDropedAdjustment.y,
        zIndex: oldNftPositions.length,
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
        source={{ uri: nftDroped.imageUri }}
      />
    </DraxView>
  );
});

export default DragAndDropNftInReceiverView;
