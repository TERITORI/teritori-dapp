import React, { memo, SetStateAction, useCallback } from "react";
import { StyleSheet, View, Image } from "react-native";

import DragAndDropNftInReceiverView from "./DragAndDropNftInReceiverView";
import NftDragResizerCorner from "./NftDragResizerCorner";
import teritorriSvg from "../../../assets/icons/networks/teritori.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { neutral33 } from "../../utils/style/colors";
import { NFTDropedAdjustmentType, FooterNftData } from "../../utils/types/nft";
import { SVG } from "../SVG";

const DraxViewReceiverContent: React.FC<{
  oldNftPositions: FooterNftData[];
  nftDroped: NFT | undefined;
  nftDropedAdjustment: NFTDropedAdjustmentType | undefined;
  setNftDropedAdjustment: (
    nftDropedAdjustment: SetStateAction<NFTDropedAdjustmentType | undefined>,
  ) => void;
}> = memo(
  ({
    oldNftPositions,
    nftDroped,
    nftDropedAdjustment,
    setNftDropedAdjustment,
  }) => {
    const handleResize = useCallback(
      (adjustment: {
        x?: number | undefined;
        y?: number | undefined;
        width: number;
        height: number;
      }) => {
        setNftDropedAdjustment(
          (nftDropedAdjustment) =>
            nftDropedAdjustment && {
              ...nftDropedAdjustment,
              ...adjustment,
            },
        );
      },
      [setNftDropedAdjustment],
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
            <DragAndDropNftInReceiverView
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
              onResize={handleResize}
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
              onResize={handleResize}
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
              onResize={handleResize}
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
              onResize={handleResize}
            />
          </>
        )}
      </View>
    );
  },
);

export default DraxViewReceiverContent;

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  oldNftPositions: {
    position: "absolute",
    borderColor: neutral33,
    borderWidth: 1,
    padding: 4,
  },
});
