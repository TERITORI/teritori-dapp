import React, { memo, useCallback } from "react";
import { StyleSheet, View, Image } from "react-native";

import teritorriSvg from "../../../assets/icons/networks/teritori.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { neutral33 } from "../../utils/style/colors";
import { nftDropedAdjustmentType, FooterNftData } from "../../utils/types/nft";
import { SVG } from "../SVG";
import DragAndDropNftInReceiverView from "./DragAndDropNftInReceiverView";
import NftDragResizerCorner from "./NftDragResizerCorner";

const DraxViewReceiverContent: React.FC<{
  oldNftPositions: FooterNftData[];
  nftDroped: NFT | undefined;
  nftDropedAdjustment: nftDropedAdjustmentType | undefined;
  setNftDropedAdjustment: (
    nftDropedAdjustment: nftDropedAdjustmentType
  ) => void;
}> = memo(
  ({
    oldNftPositions,
    nftDroped,
    nftDropedAdjustment,
    setNftDropedAdjustment,
  }) => {
    const NtfDragAndDropInReceiverViewCallback = useCallback(
      ({ nftDroped, nftDropedAdjustment, oldNftPositions }) => (
        <DragAndDropNftInReceiverView
          nftDroped={nftDroped}
          nftDropedAdjustment={nftDropedAdjustment}
          oldNftPositions={oldNftPositions}
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
            zIndex: oldNftPositions.length + 3,
          }}
        />
        {oldNftPositions &&
          oldNftPositions.map((nft: FooterNftData, index: number) => {
            return (
              <Image
                key={nft.token_id}
                source={{ uri: nft.imageUri }}
                style={[
                  styles.oldNftPositions,
                  {
                    width: parseInt(nft.position.width, 10),
                    height: parseInt(nft.position.height, 10),
                    left: parseInt(nft.position.x, 10),
                    top: parseInt(nft.position.y, 10),
                    borderRadius: nft.borderRadius,
                    zIndex: index,
                  },
                ]}
              />
            );
          })}
        {nftDroped && nftDropedAdjustment && (
          <>
            <NtfDragAndDropInReceiverViewCallback
              nftDroped={nftDroped}
              nftDropedAdjustment={nftDropedAdjustment}
              oldNftPositions={oldNftPositions}
            />
            <NftDragResizerCorner
              nftDropedAdjustment={nftDropedAdjustment}
              style={{
                top: nftDropedAdjustment.y - 3.5,
                left: nftDropedAdjustment.x - 3.5,
              }}
              oldNftPositions={oldNftPositions}
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
              oldNftPositions={oldNftPositions}
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
              oldNftPositions={oldNftPositions}
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
              oldNftPositions={oldNftPositions}
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
