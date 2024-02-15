import React, { FC, useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import chevronDownSVG from "./../../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "./../../../../../assets/icons/chevron-up.svg";
import selectIcon from "./../../../../../assets/icons/select-Icon.svg";
import unselectIcon from "./../../../../../assets/icons/unselect-icon.svg";
import defaultTierImage from "../../../../../assets/default-images/default-tier-thumbnail.png";
import { layout } from "../../../../utils/style/layout";

import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { MembershipConfig } from "@/contracts-clients/cw721-membership";
import { prettyPrice } from "@/utils/coins";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral77,
  secondaryColor,
} from "@/utils/style/colors";
import { fontSemibold13, fontSemibold16 } from "@/utils/style/fonts";

interface AccordionProps {
  item: MembershipConfig;
  networkId: string;
  selectedItem: MembershipConfig | undefined;
  onItemSelect: (item: MembershipConfig) => void;
}

export const AccordionSelectComponent: FC<AccordionProps> = ({
  item,
  networkId,
  selectedItem,
  onItemSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <PrimaryBox
      style={{
        borderColor: neutral33,
        backgroundColor: isOpen ? neutral22 : neutral00,
        borderWidth: 1,
        margin: layout.spacing_x1,
        padding: layout.spacing_x1,
      }}
    >
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                onItemSelect(item);
              }}
            >
              <SVG
                source={selectedItem === item ? selectIcon : unselectIcon}
                width={20}
                height={20}
                color={secondaryColor}
              />
            </TouchableOpacity>

            <OptimizedImage
              sourceURI={item?.nft_image_uri}
              fallbackURI={defaultTierImage}
              style={{
                backgroundColor: "black",
                height: 48,
                width: 48,
                borderRadius: 8,
              }}
              height={48}
              width={48}
            />
            <View>
              <BrandText
                style={[
                  fontSemibold16,
                  { color: secondaryColor, marginLeft: layout.spacing_x1 },
                ]}
              >
                {item?.display_name || "Tier name"}
              </BrandText>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: layout.spacing_x1_5,
            }}
          >
            <BrandText
              style={[
                fontSemibold16,
                { color: neutral77, marginLeft: layout.spacing_x1 },
              ]}
            >
              {prettyPrice(networkId, item?.price.amount, item?.price.denom)}
            </BrandText>
            <TouchableOpacity
              onPress={() => {
                setIsOpen(!isOpen);
              }}
            >
              <SVG
                source={isOpen ? chevronUpSVG : chevronDownSVG}
                width={16}
                height={16}
                color={secondaryColor}
              />
            </TouchableOpacity>
          </View>
        </View>
        {isOpen && (
          <View style={{ marginVertical: layout.spacing_x2 }}>
            <BrandText style={fontSemibold13}>{item?.description}</BrandText>
          </View>
        )}
      </View>
    </PrimaryBox>
  );
};
