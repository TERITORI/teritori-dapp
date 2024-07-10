import React, {useMemo} from "react";
import { View } from "react-native";

import { ApplicationDetail } from "./component/ApplicationDetail";
import { CreatorInformation } from "./component/CreatorInformation";
import { InvestmentInformation } from "./component/InvestmentInformation";
import { ProjectInformation } from "./component/ProjectInformation";
import { TeamInformation } from "./component/TeamInformation";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { NetworkFeature } from "@/networks";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {ScreenFC} from "@/utils/navigation";
import {useLaunchpadProjectById} from "@/hooks/launchpad/useLaunchpadProjectById";
import {useSelectedNetworkId} from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {NotFound} from "@/components/NotFound";
import {collectionData} from "@/utils/launchpad";
export const LaunchpadApplicationReviewScreen: ScreenFC<"LaunchpadApplicationReview">  = ({
                                                              route,
                                                            }) => {
  const { id: projectId } = route.params;
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { launchpadProject } = useLaunchpadProjectById({
    projectId,
    networkId,
    userAddress: selectedWallet?.address || ""
  });
  const collection = useMemo(() => launchpadProject ? collectionData(launchpadProject) : null, [launchpadProject] )

  if (!launchpadProject || !collection) {
    return (
      <ScreenContainer
        footerChildren={<></>}
        headerChildren={
          <BrandText style={fontSemibold20}>Application Review</BrandText>
        }
        responsive
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("LaunchpadAdministrationOverview")}
        forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      >
        <NotFound label="Application"/>
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
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("LaunchpadAdministrationOverview")}
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
    >
      <View style={{ marginTop: layout.spacing_x4 }}>
        <ApplicationDetail collection={collection}/>
        <View>
          <CreatorInformation collection={collection}/>
          <ProjectInformation collection={collection}/>
          <TeamInformation collection={collection}/>
          <InvestmentInformation collection={collection}/>
        </View>
      </View>
    </ScreenContainer>
  );
};
