import React from "react";
import { View } from "react-native";

import { Sort, SortDirection } from "@/api/launchpad/v1/launchpad";
import infoSVG from "@/assets/icons/info.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Box } from "@/components/boxes/Box";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useLaunchpadProjectsByCreator } from "@/hooks/launchpad/useLaunchpadProjectsByCreator";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { LaunchpadMyCollectionsTable } from "@/screens/Launchpad/LaunchpadApply/LaunchpadMyCollections/components/LaunchpadMyCollectionsTable";
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
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { launchpadProjects = [] } = useLaunchpadProjectsByCreator({
    networkId: selectedNetworkId,
    creatorId: selectedWallet?.userId || "",
    offset: 0,
    limit: 100, // TODO: Pagination
    sort: Sort.SORT_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
  });

  return (
    <ScreenContainer
      isLarge
      responsive
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      headerChildren={<BrandText>Apply to Launchpad</BrandText>}
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

        {launchpadProjects?.length ? (
          <LaunchpadMyCollectionsTable rows={launchpadProjects} />
        ) : (
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
              <SVG
                source={infoSVG}
                width={16}
                height={16}
                color={primaryColor}
              />
            </View>
            <SpacerRow size={2.5} />
            <BrandText style={fontSemibold13}>
              You haven’t created any collections so far
            </BrandText>
          </Box>
        )}
      </View>
    </ScreenContainer>
  );
};
