import React from "react";
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
import {useCollectionById} from "@/hooks/launchpad/useCollectionById";
import {useLaunchpadProjectById} from "@/hooks/launchpad/useLaunchpadProjectById";
import {useSelectedNetworkId} from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";

export const LaunchpadApplicationReviewScreen: ScreenFC<"LaunchpadApplicationReview">  = ({
                                                              route,
                                                            }) => {
  const { id: projectId } = route.params;
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { data: launchpadProject } = useLaunchpadProjectById({
    projectId,
    networkId,
    userAddress: selectedWallet?.address || ""
  });

  console.log('launchpadProjectlaunchpadProjectlaunchpadProject', launchpadProject)

  return (
    <ScreenContainer
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>Application Review</BrandText>
      }
      responsive
      onBackPress={() => navigation.goBack()}
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
    >
      <View style={{ marginTop: layout.spacing_x4 }}>
        <ApplicationDetail />
        <View>
          <CreatorInformation />
          <ProjectInformation />
          <TeamInformation />
          <InvestmentInformation />
        </View>
      </View>
    </ScreenContainer>
  );
};
