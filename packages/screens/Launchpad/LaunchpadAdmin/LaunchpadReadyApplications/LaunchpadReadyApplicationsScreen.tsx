import React from "react";
import { View } from "react-native";

import { LaunchpadReadyApplicationsTable } from "./components/LaunchpadReadyApplicationsTable";

import { Sort, SortDirection, Status } from "@/api/launchpad/v1/launchpad";
import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { useIsUserLaunchpadAdmin } from "@/hooks/launchpad/useIsUserLaunchpadAdmin";
import { useLaunchpadProjects } from "@/hooks/launchpad/useLaunchpadProjects";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { errorColor } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold20,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const LaunchpadReadyApplicationsScreen: React.FC = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const navigation = useAppNavigation();
  const userId = useSelectedWallet()?.userId;
  const { isUserLaunchpadAdmin, isLoading: isUserAdminLoading } =
    useIsUserLaunchpadAdmin(userId);
  const { launchpadProjects = [] } = useLaunchpadProjects({
    networkId: selectedNetworkId,
    offset: 0,
    limit: 100, // TODO: Pagination
    sort: Sort.SORT_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
    status: Status.STATUS_COMPLETE, // TODO: Or STATUS_CONFIRMED ?
  });

  if (!isUserLaunchpadAdmin) {
    return (
      <ScreenContainer
        isLarge
        footerChildren={<></>}
        headerChildren={
          <BrandText style={fontSemibold20}>
            {isUserAdminLoading ? "Loading..." : "Unauthorized"}
          </BrandText>
        }
        responsive
        onBackPress={() =>
          navigation.navigate("LaunchpadAdministrationOverview")
        }
        forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      >
        <BrandText
          style={[
            { marginTop: layout.spacing_x4 },
            !isUserAdminLoading && { color: errorColor },
          ]}
        >
          {isUserAdminLoading ? "Loading..." : "Unauthorized"}
        </BrandText>
      </ScreenContainer>
    );
  }

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
          {launchpadProjects?.length ? (
            <LaunchpadReadyApplicationsTable rows={launchpadProjects} />
          ) : (
            <BrandText style={fontSemibold13}>
              There is no application ready to launch
            </BrandText>
          )}
        </View>

        <SpacerColumn size={16} />
      </View>
    </ScreenContainer>
  );
};
