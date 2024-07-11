import React, { useMemo } from "react";
import { View } from "react-native";

import { ApplicationDetail } from "./component/ApplicationDetail";
import { CreatorInformation } from "./component/CreatorInformation";
import { InvestmentInformation } from "./component/InvestmentInformation";
import { ProjectInformation } from "./component/ProjectInformation";
import { TeamInformation } from "./component/TeamInformation";

import { BrandText } from "@/components/BrandText";
import { NotFound } from "@/components/NotFound";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { useLaunchpadProjectById } from "@/hooks/launchpad/useLaunchpadProjectById";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { collectionData } from "@/utils/launchpad";
import { ScreenFC } from "@/utils/navigation";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const launchpadReviewBreakpointM = 800;

export const LaunchpadApplicationReviewScreen: ScreenFC<
  "LaunchpadApplicationReview"
> = ({ route }) => {
  const { id: projectId } = route.params;
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { launchpadProject } = useLaunchpadProjectById({
    projectId,
    networkId,
    userAddress: selectedWallet?.address || "",
  });
  const collection = useMemo(
    () => (launchpadProject ? collectionData(launchpadProject) : null),
    [launchpadProject],
  );

  if (!launchpadProject || !collection) {
    return (
      <ScreenContainer
        footerChildren={<></>}
        headerChildren={
          <BrandText style={fontSemibold20}>Application Review</BrandText>
        }
        responsive
        onBackPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate("LaunchpadAdministrationOverview")
        }
        forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      >
        <NotFound label="Application" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>Application Review</BrandText>
      }
      responsive
      onBackPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("LaunchpadAdministrationOverview")
      }
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
    >
      <View style={{ marginTop: layout.spacing_x4 }}>
        <ApplicationDetail collection={collection} />
        <SpacerColumn size={5} />
        <View style={{ borderTopColor: neutral33, borderTopWidth: 1 }}>
          <CreatorInformation
            collection={collection}
            creatorId={launchpadProject.creatorId}
          />
          <ProjectInformation collection={collection} />
          <TeamInformation collection={collection} />
          <InvestmentInformation collection={collection} />
        </View>
      </View>
    </ScreenContainer>
  );
};
