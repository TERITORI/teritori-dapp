import React, { FC, useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import Popover from "react-native-popover-view";

import { SelectableCollectionTooltip } from "./SelectableCollectionTooltip";

import { Collection } from "@/api/marketplace/v1/marketplace";
import checkBadgeSVG from "@/assets/icons/certified.svg";
import infoSVG from "@/assets/icons/info.svg";
import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVG } from "@/components/SVG";
import { SpacerRow } from "@/components/spacer";
import { neutral44, neutral11, neutralA3 } from "@/utils/style/colors";
import { fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const SelectableCollection: FC<{
  collection: Collection;
  index: number;
  onPress: () => void;
}> = ({ collection, index, onPress }) => {
  const [viewPopover, setViewPopover] = useState<number>(-1);

  const setViewPopoverHandler = (index: number) => {
    setViewPopover((old) => (old === index ? -1 : index));
  };

  return (
    <>
      <TouchableOpacity onPress={onPress} style={listToggle}>
        <OptimizedImage
          width={28}
          height={28}
          style={{
            borderRadius: 999,
            width: 28,
            height: 28,
          }}
          sourceURI={collection.imageUri}
        />
        <View style={{ flex: 1 }}>
          <BrandText
            // isTicker FIXME: It's not the first time I see isTicker not working
            style={[fontSemibold16, { marginLeft: 15, marginRight: 10 }]}
          >
            {collection.collectionName}
          </BrandText>
        </View>

        <SVG source={checkBadgeSVG} width={18} height={18} />
        <SpacerRow size={0.75} />

        <Popover
          isVisible={viewPopover === index + 1}
          from={
            <TouchableOpacity onPress={() => setViewPopoverHandler(index + 1)}>
              <SVG source={infoSVG} width={18} height={18} color={neutralA3} />
            </TouchableOpacity>
          }
          onRequestClose={() => setViewPopover(-1)}
          popoverStyle={popoverStyle}
          backgroundStyle={{ opacity: 0 }}
        >
          <SelectableCollectionTooltip collection={collection} />
        </Popover>
      </TouchableOpacity>
    </>
  );
};

const listToggle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 5,
};

const popoverStyle = {
  backgroundColor: neutral11,
  width: 425,
  padding: layout.spacing_x2,
  borderWidth: 2,
  borderColor: neutral44,
  borderRadius: 12,
};
