import React from "react";
import { View } from "react-native";

import { Sort, SortDirection, Status } from "@/api/launchpad/v1/launchpad";
import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { useLaunchpadProjects } from "@/hooks/launchpad/useLaunchpadProjects";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { LaunchpadReadyApplicationsTable } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadReadyApplications/component/LaunchpadReadyApplicationsTable";
import { collectionsData } from "@/utils/launchpad";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const LaunchpadReadyApplicationsScreen: React.FC = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const navigation = useAppNavigation();
  const { launchpadProjects = [] } = useLaunchpadProjects({
    networkId: selectedNetworkId,
    userAddress: selectedWallet?.address || "",
    offset: 0,
    limit: 100, // TODO: Pagination
    sort: Sort.SORT_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
    //TODO: STATUS_INCOMPLETE here is just for tests ==> Use STATUS_COMPLETE finally.
    status: Status.STATUS_INCOMPLETE, // TODO: Or STATUS_CONFIRMED ?
  });

  return (
    <ScreenContainer
      isLarge
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>Administration Dashboard</BrandText>
      }
      responsive
      onBackPress={() => navigation.navigate("LaunchpadAdministrationOverview")}
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
    >
      <View
        style={{
          marginTop: layout.spacing_x4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BrandText style={fontSemibold28}>Ready to Launch</BrandText>
        </View>

        <View
          style={{
            flexDirection: "row",
            flex: 12,
            flexWrap: "nowrap",
            justifyContent: "space-between",
            marginTop: layout.spacing_x4,
          }}
        >
          <LaunchpadReadyApplicationsTable
            rows={collectionsData(launchpadProjects)}
          />
        </View>

        <SpacerColumn size={16} />
      </View>
    </ScreenContainer>
  );
};
