import React, { FC } from "react";
import { TouchableOpacity, View } from "react-native";

import chevronDownSVG from "@/assets/icons/chevron-down.svg";
import chevronUpSVG from "@/assets/icons/chevron-up.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { LaunchpadWhitelistsAccordionFormProps } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadMinting/mintWhitelistsForm/LaunchpadMintWhitelistAccordionForm";
import { secondaryColor } from "@/utils/style/colors";
import { fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type Props = Omit<
  LaunchpadWhitelistsAccordionFormProps,
  "remove" | "update" | "closeOtherElems" | "collectionForm"
> & { setIsOpen: (item: boolean) => void };

export const LaunchpadMintWhitelistAccordionFormTop: FC<Props> = ({
  setIsOpen,
  elem: whitelist,
  elemIndex: whitelistIndex,
}) => {
  if (whitelist.isOpen) {
    return (
      <TouchableOpacity
        onPress={() => setIsOpen(false)}
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
            {`Whitelist #${whitelistIndex}`}
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
        onPress={() => setIsOpen(true)}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BrandText
            style={[
              fontSemibold16,
              { color: secondaryColor, marginLeft: layout.spacing_x1 },
            ]}
          >
            {`Whitelist #${whitelistIndex}`}
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
