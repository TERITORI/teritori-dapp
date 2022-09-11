import React, { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";

import teritorriSvg from "../../../assets/icons/teritori.svg";
import { nftDropedAdjustmentType } from "../../screens/RiotersFooter/RiotersFooterScreen.types";
import { neutral33 } from "../../utils/style/colors";
import { SVG } from "../SVG";
import DragAndDropNftInReceiverView from "./DragAndDropNftInReceiverView";
import NftDragResizerCorner from "./NftDragResizerCorner";

const DraxViewReceiverContent: React.FC<{
  oldNftPositionsWithZIndexOrder: any;
  nftDroped: any;
  nftDropedAdjustment: nftDropedAdjustmentType;
  setNftDropedAdjustment: (
    nftDropedAdjustment: nftDropedAdjustmentType
  ) => void;
}> = memo(
  ({
    oldNftPositionsWithZIndexOrder,
    nftDroped,
    nftDropedAdjustment,
    setNftDropedAdjustment,
  }) => {
    const NtfDragAndDropInReceiverViewCallback = useCallback(
      ({ nftDroped, nftDropedAdjustment, oldNftPositionsWithZIndexOrder }) => (
        <DragAndDropNftInReceiverView
          nftDroped={nftDroped}
          nftDropedAdjustment={nftDropedAdjustment}
          oldNftPositionsWithZIndexOrder={oldNftPositionsWithZIndexOrder}
        />
      ),
      [nftDropedAdjustment?.x, nftDropedAdjustment?.y]
    );

    const OnResize = useCallback(
      (adjustment) => {
        setNftDropedAdjustment({
          ...nftDropedAdjustment,
          ...adjustment,
        });
      },
      [nftDropedAdjustment]
    );

    return (
      <View style={{ flex: 1 }}>
        <SVG
          width={94}
          height={102}
          source={teritorriSvg}
          style={{
            alignSelf: "center",
            marginTop: 43,
            zIndex: oldNftPositionsWithZIndexOrder.length + 3,
          }}
        />
        {oldNftPositionsWithZIndexOrder &&
          oldNftPositionsWithZIndexOrder.map((nft: any, index: number) => (
            <SVG
              key={nft.id}
              width={nft.width}
              height={nft.height}
              source={nft.svg}
              style={[
                styles.oldNftPositions,
                {
                  left: nft.left,
                  top: nft.top,
                  zIndex: index,
                },
              ]}
            />
          ))}
        {nftDroped && nftDropedAdjustment && (
          <>
            <NtfDragAndDropInReceiverViewCallback
              nftDroped={nftDroped}
              nftDropedAdjustment={nftDropedAdjustment}
              oldNftPositionsWithZIndexOrder={oldNftPositionsWithZIndexOrder}
            />
            <NftDragResizerCorner
              nftDropedAdjustment={nftDropedAdjustment}
              style={{
                top: nftDropedAdjustment.y - 3.5,
                left: nftDropedAdjustment.x - 3.5,
              }}
              oldNftPositionsWithZIndexOrder={oldNftPositionsWithZIndexOrder}
              cornerPosition="topLeft"
              onResize={OnResize}
            />
            <NftDragResizerCorner
              nftDropedAdjustment={nftDropedAdjustment}
              style={{
                top: nftDropedAdjustment.y - 3.5,
                left:
                  nftDropedAdjustment.x + nftDropedAdjustment.width + 3.5 + 2,
              }}
              oldNftPositionsWithZIndexOrder={oldNftPositionsWithZIndexOrder}
              cornerPosition="topRight"
              onResize={OnResize}
            />
            <NftDragResizerCorner
              nftDropedAdjustment={nftDropedAdjustment}
              style={{
                top:
                  nftDropedAdjustment.y + nftDropedAdjustment.height + 3.5 + 2,
                left: nftDropedAdjustment.x - 3.5,
              }}
              oldNftPositionsWithZIndexOrder={oldNftPositionsWithZIndexOrder}
              cornerPosition="bottomLeft"
              onResize={OnResize}
            />
            <NftDragResizerCorner
              nftDropedAdjustment={nftDropedAdjustment}
              style={{
                top:
                  nftDropedAdjustment.y + nftDropedAdjustment.height + 3.5 + 2,
                left:
                  nftDropedAdjustment.x + nftDropedAdjustment.width + 3.5 + 2,
              }}
              oldNftPositionsWithZIndexOrder={oldNftPositionsWithZIndexOrder}
              cornerPosition="bottomRight"
              onResize={OnResize}
            />
          </>
        )}
      </View>
    );
  }
);

export default DraxViewReceiverContent;

const styles = StyleSheet.create({
  oldNftPositions: {
    position: "absolute",
    borderColor: neutral33,
    borderWidth: 1,
    padding: 4,
  },
});
