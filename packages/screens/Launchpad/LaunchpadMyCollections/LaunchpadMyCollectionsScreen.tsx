import React from "react";
import { View } from "react-native";

import infoSVG from "@/assets/icons/info.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Box } from "@/components/boxes/Box";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { NetworkFeature } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import {
  neutral17,
  neutral77,
  primaryColor,
  withAlpha,
} from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const LaunchpadMyCollectionsScreen: ScreenFC<
  "LaunchpadMyCollections"
> = () => {
  const navigation = useAppNavigation();

  return (
    <ScreenContainer
      isLarge
      responsive
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      headerChildren={<BrandText>My Collections</BrandText>}
      onBackPress={() => navigation.navigate("LaunchpadApply")}
    >
      <View
        style={{
          marginTop: layout.spacing_x4,
        }}
      >
        <BrandText style={fontSemibold28}>My collections</BrandText>

        <SpacerColumn size={2} />

        <BrandText
          style={[
            fontSemibold14,
            {
              color: neutral77,
            },
          ]}
        >
          A list of your created collections. Learn more in the{" "}
          <BrandText
            style={[
              fontSemibold14,
              {
                color: primaryColor,
              },
            ]}
          >
            documentation.
          </BrandText>
        </BrandText>

        <SpacerColumn size={3} />

        <Box
          style={{
            borderWidth: 1,
            borderColor: primaryColor,
            backgroundColor: neutral17,
            flexDirection: "row",
            alignItems: "center",
            height: 72,
            paddingHorizontal: layout.spacing_x2_5,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: withAlpha(primaryColor, 0.1),
            }}
          >
            <SVG source={infoSVG} width={16} height={16} color={primaryColor} />
          </View>
          <SpacerRow size={2.5} />
          <BrandText style={fontSemibold13}>
            You haven’t created any collections so far
          </BrandText>
        </Box>
      </View>
    </ScreenContainer>
  );
};
