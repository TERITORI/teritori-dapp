import React, { FC } from "react";
import { UseFieldArrayUpdate } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import chevronDownSVG from "@/assets/icons/chevron-down.svg";
import chevronUpSVG from "@/assets/icons/chevron-up.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import {
  CollectionFormValues,
  WhitelistAccordionElem,
} from "@/screens/Launchpad/CreateCollection.type";
import { secondaryColor } from "@/utils/style/colors";
import { fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const LaunchpadMintWhitelistAccordionFormTop: FC<{
  elem: WhitelistAccordionElem;
  elemIndex: number;
  update: UseFieldArrayUpdate<CollectionFormValues>;
  closeAll: () => void;
}> = ({ elem, elemIndex, update, closeAll }) => {
  if (elem.isOpen) {
    return (
      <TouchableOpacity
        onPress={() => update(elemIndex, { ...elem, isOpen: false })}
        style={{
          paddingTop: layout.spacing_x1,
          paddingHorizontal: layout.spacing_x1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <BrandText
            style={[
              fontSemibold16,
              { color: secondaryColor, marginLeft: layout.spacing_x1 },
            ]}
          >
            {`Whitelist #${elemIndex}`}
          </BrandText>
          <SVG
            source={chevronUpSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </View>

        <SpacerColumn size={1} />

        <Separator />
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: layout.spacing_x1,
        }}
        onPress={() => {
          closeAll();
          update(elemIndex, { ...elem, isOpen: true });
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BrandText
            style={[
              fontSemibold16,
              { color: secondaryColor, marginLeft: layout.spacing_x1 },
            ]}
          >
            {`Whitelist #${elemIndex}`}
          </BrandText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SVG
            source={chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </View>
      </TouchableOpacity>
    );
  }
};
