import React, { memo, useCallback } from "react";
import { StyleSheet, View, Image } from "react-native";

import teritorriSvg from "../../../assets/icons/teritori.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { NftData } from "../../contracts-clients/rioter-footer-nft/RioterFooterNft.types";
import { nftDropedAdjustmentType } from "../../screens/RiotersFooter/RiotersFooterScreen.types";
import { neutral33 } from "../../utils/style/colors";
import { SVG } from "../SVG";
import DragAndDropNftInReceiverView from "./DragAndDropNftInReceiverView";
import NftDragResizerCorner from "./NftDragResizerCorner";

const DraxViewReceiverContent: React.FC<{
  oldNftPositionsWithZIndexOrder: NftData[];
  nftDroped: NFT | undefined;
  nftDropedAdjustment: nftDropedAdjustmentType | undefined;
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
          oldNftPositionsWithZIndexOrder.map((nft: NftData, index: number) => (
            <Image
              key={nft.token_id}
              source={{ uri: nftDroped?.imageUri }}
              style={[
                styles.oldNftPositions,
                {
                  width: nft.position.width,
                  height: nft.position.height,
                  left: nft.position.x,
                  top: nft.position.y,
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
