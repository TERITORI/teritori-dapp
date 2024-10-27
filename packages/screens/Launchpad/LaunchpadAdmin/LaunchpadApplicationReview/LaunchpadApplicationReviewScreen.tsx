import React, { useMemo, useState } from "react";
import { View } from "react-native";

import { ApplicationDetail } from "./components/ApplicationDetail";
import { CreatorInformation } from "./components/CreatorInformation";
import { InvestmentInformation } from "./components/InvestmentInformation";
import { ProjectInformation } from "./components/ProjectInformation";
import { TeamInformation } from "./components/TeamInformation";
import { Status } from "../../../../api/launchpad/v1/launchpad";
import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { ProposalRow } from "../../../../components/dao/DAOProposals";
import { useDAOProposalById } from "../../../../hooks/dao/useDAOProposalById";
import { useProposeApproveProject } from "../../../../hooks/launchpad/useProposeApproveProject";

import { BrandText } from "@/components/BrandText";
import { NotFound } from "@/components/NotFound";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { useInvalidateDAOProposals } from "@/hooks/dao/useDAOProposals";
import { useIsUserLaunchpadAdmin } from "@/hooks/launchpad/useIsUserLaunchpadAdmin";
import { useLaunchpadProjectById } from "@/hooks/launchpad/useLaunchpadProjectById";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { launchpadProjectStatus, parseCollectionData } from "@/utils/launchpad";
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
  const [isApproveLoading, setApproveLoading] = useState(false);
  const userId = useSelectedWallet()?.userId;
  const { isUserLaunchpadAdmin, isLoading: isUserAdminLoading } =
    useIsUserLaunchpadAdmin(userId);
  const { proposeApproveProject, launchpadAdminId } =
    useProposeApproveProject();
  const invalidateDAOProposals = useInvalidateDAOProposals(launchpadAdminId);
  const { launchpadProject, isLoading: isProjectsLoading } =
    useLaunchpadProjectById({
      projectId,
      networkId: selectedNetworkId,
    });
  const collectionData =
    launchpadProject && parseCollectionData(launchpadProject);
  const { daoProposal } = useDAOProposalById(
    launchpadAdminId,
    launchpadProject?.proposalId,
  );
  const isLoading = useMemo(
    () => isUserAdminLoading || isProjectsLoading,
    [isUserAdminLoading, isProjectsLoading],
  );

  const onPressApprove = async () => {
    setApproveLoading(true);
    try {
      await proposeApproveProject(projectId);
    } catch (e) {
      console.error("Error approving the collection", e);
      setApproveLoading(false);
    } finally {
      invalidateDAOProposals();
    }
    setTimeout(() => {
      setApproveLoading(false);
    }, 1000);
  };

  if (!isUserLaunchpadAdmin) {
    return (
      <ScreenContainer
        footerChildren={<></>}
        headerChildren={
          <BrandText style={fontSemibold20}>
            {isLoading ? "Loading..." : "Unauthorized"}
          </BrandText>
        }
        responsive
        onBackPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate("LaunchpadAdministrationOverview")
        }
        forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      >
        <BrandText
          style={[
            { marginTop: layout.spacing_x4 },
            !isLoading && { color: errorColor },
          ]}
        >
          {isLoading ? "Loading..." : "Unauthorized"}
        </BrandText>
      </ScreenContainer>
    );
  }

  if (!launchpadProject || !collectionData) {
    return (
      <ScreenContainer
        footerChildren={<></>}
        headerChildren={
          <BrandText style={fontSemibold20}>
            {isLoading ? "Loading..." : "Application not found"}
          </BrandText>
        }
        responsive
        onBackPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate("LaunchpadAdministrationOverview")
        }
        forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      >
        {isLoading ? (
          <BrandText style={{ marginTop: layout.spacing_x4 }}>
            Loading...
          </BrandText>
        ) : (
          <NotFound label="Application" />
        )}
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
      {selectedNetworkId !== launchpadProject.networkId ? (
        <BrandText style={{ alignSelf: "center" }}>Wrong network</BrandText>
      ) : (
        <View style={{ marginTop: layout.spacing_x4 }}>
          <ApplicationDetail
            collectionData={collectionData}
            projectStatus={launchpadProjectStatus(launchpadProject.status)}
          />

          <SpacerColumn size={3} />
          {daoProposal &&
          launchpadProject.status !== Status.STATUS_INCOMPLETE ? (
            <ProposalRow
              daoId={launchpadAdminId}
              proposal={daoProposal}
              style={{ borderBottomWidth: 0 }}
            />
          ) : launchpadProject.status !== Status.STATUS_INCOMPLETE ? (
            <View style={{ flexDirection: "row" }}>
              <PrimaryButton
                text="Approve"
                boxStyle={{ width: 146 }}
                onPress={onPressApprove}
                loader
                isLoading={isApproveLoading}
                disabled={isApproveLoading}
              />
            </View>
          ) : null}
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
