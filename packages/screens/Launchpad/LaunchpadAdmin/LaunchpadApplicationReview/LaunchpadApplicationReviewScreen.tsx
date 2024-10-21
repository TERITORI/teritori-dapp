import React, { useState } from "react";
import { View } from "react-native";

import { ApplicationDetail } from "./component/ApplicationDetail";
import { CreatorInformation } from "./component/CreatorInformation";
import { InvestmentInformation } from "./component/InvestmentInformation";
import { ProjectInformation } from "./component/ProjectInformation";
import { TeamInformation } from "./component/TeamInformation";
import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { ProposalRow } from "../../../../components/dao/DAOProposals";
import { useProposeApproveProject } from "../../../../hooks/launchpad/useProposeApproveProject";

import { BrandText } from "@/components/BrandText";
import { NotFound } from "@/components/NotFound";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import {
  AppProposalResponse,
  useDAOProposals,
  useInvalidateDAOProposals,
} from "@/hooks/dao/useDAOProposals";
import { useIsUserLaunchpadAdmin } from "@/hooks/launchpad/useIsUserLaunchpadAdmin";
import { useLaunchpadProjectById } from "@/hooks/launchpad/useLaunchpadProjectById";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import {
  DEPLOY_PROPOSAL_TITLE_PREFIX,
  launchpadProjectStatus,
  parseCollectionData,
} from "@/utils/launchpad";
import { ScreenFC } from "@/utils/navigation";
import { errorColor, neutral33 } from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const launchpadReviewBreakpointM = 800;

export const LaunchpadApplicationReviewScreen: ScreenFC<
  "LaunchpadApplicationReview"
> = ({ route }) => {
  const { id: projectId } = route.params;
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const [isLoading, setLoading] = useState(false);
  const userId = useSelectedWallet()?.userId;
  const { isUserLaunchpadAdmin } = useIsUserLaunchpadAdmin(userId);
  const { proposeApproveDeployCollection, launchpadAdminId } =
    useProposeApproveProject();
  const invalidateDAOProposals = useInvalidateDAOProposals(launchpadAdminId);
  const { daoProposals } = useDAOProposals(launchpadAdminId);

  // We find the deploy proposal by searching projectId into the proposal's description
  const proposal = daoProposals?.find(
    (appProposalResponse: AppProposalResponse) =>
      appProposalResponse.proposal.title ===
      DEPLOY_PROPOSAL_TITLE_PREFIX + projectId,
  );

  const { launchpadProject } = useLaunchpadProjectById({
    projectId,
    networkId: selectedNetworkId,
  });
  const collectionData =
    launchpadProject && parseCollectionData(launchpadProject);

  const onPressApprove = async () => {
    setLoading(true);
    try {
      await proposeApproveDeployCollection(projectId);
    } catch (e) {
      console.error("Error approving the collection", e);
      setLoading(false);
    } finally {
      invalidateDAOProposals();
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (!isUserLaunchpadAdmin) {
    return (
      <ScreenContainer
        footerChildren={<></>}
        headerChildren={
          <BrandText style={fontSemibold20}>Unauthorized</BrandText>
        }
        responsive
        onBackPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate("LaunchpadAdministrationOverview")
        }
        forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      >
        <BrandText style={{ color: errorColor, marginTop: layout.spacing_x4 }}>
          Unauthorized
        </BrandText>
      </ScreenContainer>
    );
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
          />

          <SpacerColumn size={3} />
          {proposal ? (
            <ProposalRow
              daoId={launchpadAdminId}
              proposal={proposal}
              style={{ borderBottomWidth: 0 }}
            />
          ) : (
            <View style={{ flexDirection: "row" }}>
              <PrimaryButton
                text="Approve"
                boxStyle={{ width: 146 }}
                onPress={onPressApprove}
                loader
                isLoading={isLoading}
                disabled={isLoading}
              />
            </View>
          )}
          <SpacerColumn size={3} />

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
