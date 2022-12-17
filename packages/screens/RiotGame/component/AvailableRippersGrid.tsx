import React from "react";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { NFT } from "../../../api/marketplace/v1/marketplace";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { getRipperRarity } from "../../../utils/game";
import { white } from "../../../utils/style/colors";
import { RipperAvatar } from "./RipperAvatar";

interface AvailableRippersGridProps {
  selectedRipper: NFT | undefined;
  availableRippers: NFT[];
  selectRipper(ripper: NFT): void;
}

const THUMB_CONTAINER_WIDTH = 120;
const THUMB_CONTAINER_HEIGHT = 120;

const THUMB_SIZE = 100;

export const AvailableRippersGrid: React.FC<AvailableRippersGridProps> = ({
  availableRippers,
  selectedRipper,
  selectRipper,
}) => {
  return (
    <FlatList
      data={availableRippers}
      numColumns={3}
      scrollEnabled
      style={{ height: 329 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item: ripper, index }) => {
        const isSelected = ripper.id === selectedRipper?.id;

        return (
          <TouchableOpacity
            key={ripper.id}
            activeOpacity={0.6}
            onPress={() => selectRipper(ripper)}
          >
            <TertiaryBox
              style={{ margin: 10 }}
              width={THUMB_CONTAINER_WIDTH}
              height={THUMB_CONTAINER_HEIGHT}
              mainContainerStyle={[
                isSelected && {
                  borderColor: white,
                  borderWidth: 1,
                },
              ]}
            >
              <RipperAvatar
                size={THUMB_SIZE}
                source={ripper.imageUri}
                rarity={getRipperRarity(ripper)}
              />
            </TertiaryBox>
          </TouchableOpacity>
        );
      }}
    />
  );
};
