import React, { useState } from "react";
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
import { NetworkFeature } from "@/networks";
import { launchpadProjectStatus, parseCollectionData } from "@/utils/launchpad";
import { ScreenFC } from "@/utils/navigation";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { useDeployCollection } from './../../../../hooks/launchpad/useDeployCollection';
import { useFeedbacks } from "@/context/FeedbacksProvider";

export const launchpadReviewBreakpointM = 800;

export const LaunchpadApplicationReviewScreen: ScreenFC<
  "LaunchpadApplicationReview"
> = ({ route }) => {
  const { id: projectId } = route.params;
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const [isLoading, setLoading] = useState(false);
  const { setLoadingFullScreen } = useFeedbacks();
  const { deployCollection } = useDeployCollection();
  const { launchpadProject } = useLaunchpadProjectById({
    projectId,
    networkId: selectedNetworkId,
    // userAddress: selectedWallet?.address || "",
  });
  const collectionData =
    launchpadProject && parseCollectionData(launchpadProject);

  const onPressApprove = async () => {
    setLoading(true);
    setLoadingFullScreen(true);

    try {
      await deployCollection(projectId)
    } catch (e) {
      console.error("Error deploying the NFT collection", e);
      setLoading(false);
      setLoadingFullScreen(false);
    }
    setTimeout(() => {
      setLoading(false);
      setLoadingFullScreen(false);
    }, 1000);
  }

  if (!launchpadProject || !collectionData) {
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
      {!launchpadProject || !collectionData ? (
        <NotFound label="Application" />
      ) : selectedNetworkId !== launchpadProject.networkId ? (
        <BrandText style={{ alignSelf: "center" }}>Wrong network</BrandText>
      ) : (
        <View style={{ marginTop: layout.spacing_x4 }}>
          <ApplicationDetail
            collectionData={collectionData}
            projectStatus={launchpadProjectStatus(launchpadProject)}
            onPressApprove={onPressApprove}
            isApproveLoading={isLoading}
          />
          <SpacerColumn size={5} />
          <View style={{ borderTopColor: neutral33, borderTopWidth: 1 }}>
            <CreatorInformation
              collectionData={collectionData}
              creatorId={launchpadProject.creatorId}
            />
            <ProjectInformation collectionData={collectionData} />
            <TeamInformation collectionData={collectionData} />
            <InvestmentInformation collectionData={collectionData} />
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};
