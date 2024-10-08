import React, { FC } from "react";
import { View, ViewStyle } from "react-native";

import { Collection } from "@/api/marketplace/v1/marketplace";
import checkBadgeSVG from "@/assets/icons/certified.svg";
import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVG } from "@/components/SVG";
import { StateBadge } from "@/components/badges/StateBadge";
import { getNetwork } from "@/networks";
import { errorColor, neutral77 } from "@/utils/style/colors";
import { fontSemibold12, fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const SelectableCollectionTooltip: FC<{
  collection: Collection;
}> = ({ collection }) => {
  const collectionNetwork = getNetwork(collection.networkId);
  return (
    <>
      <View style={flexRowCenter}>
        <View>
          <View>
            <BrandText
              style={[
                fontSemibold12,
                { color: neutral77, marginBottom: layout.spacing_x1 },
              ]}
            >
              Collection name
            </BrandText>
            <View style={listToggle}>
              <OptimizedImage
                style={{
                  width: 28,
                  height: 28,
                }}
                width={28}
                height={28}
                sourceURI={collection.imageUri}
              />
              <BrandText
                style={[
                  fontSemibold16,
                  {
                    marginLeft: layout.spacing_x1_5,
                    marginRight: layout.spacing_x1,
                  },
                ]}
              >
                {collection.collectionName}
              </BrandText>
              <SVG source={checkBadgeSVG} width={18} height={18} />
            </View>
          </View>

          <View style={{ marginTop: layout.spacing_x1_5 }}>
            <BrandText
              style={[
                fontSemibold12,
                { color: neutral77, marginBottom: layout.spacing_x1 },
              ]}
            >
              Project Readiness for Mint
            </BrandText>
            <StateBadge text="TODO" />
          </View>
        </View>

        <View>
          <View>
            <BrandText
              style={[
                fontSemibold12,
                { color: neutral77, marginBottom: layout.spacing_x1 },
              ]}
            >
              Collection network
            </BrandText>
            {collectionNetwork ? (
              <View style={listToggle}>
                {collectionNetwork.icon && (
                  <SVG
                    width={28}
                    height={28}
                    source={collectionNetwork.icon}
                    color="white"
                  />
                )}
                <BrandText
                  style={[fontSemibold16, { marginLeft: layout.spacing_x1 }]}
                >
                  {collectionNetwork.displayName}
                </BrandText>
              </View>
            ) : (
              <BrandText style={[fontSemibold16, { color: errorColor }]}>
                Not found
              </BrandText>
            )}
          </View>

          <View style={{ marginTop: layout.spacing_x1_5 }}>
            <BrandText
              style={[
                fontSemibold12,
                { color: neutral77, marginBottom: layout.spacing_x1 },
              ]}
            >
              Basic marketing package
            </BrandText>
            <StateBadge text="TODO" />
          </View>
        </View>
      </View>
    </>
  );
};

const listToggle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};

const flexRowCenter: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};
