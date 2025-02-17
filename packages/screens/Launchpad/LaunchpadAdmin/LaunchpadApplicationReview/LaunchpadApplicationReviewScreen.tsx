import React, { useMemo } from "react";
import { View } from "react-native";

import { Separator } from "./../../../../components/separators/Separator";
import { ApplicationDetail } from "./components/ApplicationDetail";
import { CreatorInformation } from "./components/CreatorInformation";
import { InvestmentInformation } from "./components/InvestmentInformation";
import { MintingInformation } from "./components/MintingInformation";
import { ProjectInformation } from "./components/ProjectInformation";
import { TeamInformation } from "./components/TeamInformation";
import { Status } from "../../../../api/launchpad/v1/launchpad";
import { ProposalRow } from "../../../../components/dao/DAOProposals";
import { useDAOProposalById } from "../../../../hooks/dao/useDAOProposalById";

import { BrandText } from "@/components/BrandText";
import { NotFound } from "@/components/NotFound";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { useIsUserLaunchpadAdmin } from "@/hooks/launchpad/useIsUserLaunchpadAdmin";
import { useLaunchpadProjectById } from "@/hooks/launchpad/useLaunchpadProjectById";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { parseCollectionData } from "@/utils/launchpad";
import { ScreenFC } from "@/utils/navigation";
import { errorColor } from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {useGetLaunchpadAdmin} from "@/hooks/launchpad/useGetLaunchpadAdmin";

// =====> TODO: SHOW ALL DATA, MINT PERIODS, ASSETS, ETC

export const launchpadReviewBreakpointM = 800;
export const launchpadReviewBreakpointS = 600;
export const launchpadReviewBreakpointSM = 400;

export const LaunchpadApplicationReviewScreen: ScreenFC<
  "LaunchpadApplicationReview"
> = ({ route }) => {
  const { id: projectId } = route.params;
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const userId = useSelectedWallet()?.userId;
  const { launchpadAdminId } = useGetLaunchpadAdmin(); // It's a DAO
  const { isUserLaunchpadAdmin, isLoading: isUserAdminLoading } =
    useIsUserLaunchpadAdmin(userId);
  const { launchpadProject, isLoading: isProjectsLoading } =
    useLaunchpadProjectById({
      projectId,
      networkId: selectedNetworkId,
    });
  const collectionData =
    launchpadProject && parseCollectionData(launchpadProject);
  const { daoProposal } = useDAOProposalById(
    launchpadAdminId,
    launchpadProject?.proposalId
      ? parseInt(launchpadProject.proposalId, 10)
      : undefined,
  );
  const isLoading = useMemo(
    () => isUserAdminLoading || isProjectsLoading,
    [isUserAdminLoading, isProjectsLoading],
  );
  const isUserOwner =
    launchpadProject?.creatorId && launchpadProject.creatorId === userId;

  const onBackPress = () => {
    const routes = navigation.getState().routes;
    const previousScreen = routes[routes.length - 2];
    if (
      previousScreen &&
      previousScreen.name !== "LaunchpadComplete" &&
      previousScreen.name !== "LaunchpadCreate" &&
      navigation.canGoBack()
    ) {
      navigation.goBack();
    } else if (isUserLaunchpadAdmin) {
      navigation.navigate("LaunchpadAdministrationOverview");
    } else {
      navigation.navigate("LaunchpadMyCollections");
    }
  };

  if (!isUserLaunchpadAdmin || !isUserOwner) {
    return (
      <ScreenContainer
        footerChildren={<></>}
        headerChildren={
          <BrandText style={fontSemibold20}>
            {isLoading ? "Loading..." : "Unauthorized"}
          </BrandText>
        }
        responsive
        onBackPress={onBackPress}
        forceNetworkFeatures={[NetworkFeature.CosmWasmNFTLaunchpad]}
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
        onBackPress={onBackPress}
        forceNetworkFeatures={[NetworkFeature.CosmWasmNFTLaunchpad]}
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
      onBackPress={onBackPress}
      forceNetworkFeatures={[NetworkFeature.CosmWasmNFTLaunchpad]}
    >
      {selectedNetworkId !== launchpadProject.networkId ? (
        <BrandText style={{ alignSelf: "center" }}>Wrong network</BrandText>
      ) : (
        <View style={{ marginVertical: layout.spacing_x4 }}>
          <ApplicationDetail
            collectionData={collectionData}
            projectStatus={launchpadProject.status}
          />

          <SpacerColumn size={3} />
          {(daoProposal &&
          isUserLaunchpadAdmin &&
          launchpadProject.status !== Status.STATUS_INCOMPLETE) && (
            <>
              <ProposalRow
                daoId={launchpadAdminId}
                proposal={daoProposal}
                style={{ borderBottomWidth: 0 }}
              />
              <SpacerColumn size={3} />
            </>
          )}
          <Separator />

          <CreatorInformation
            collectionData={collectionData}
            creatorId={launchpadProject.creatorId}
          />
          <ProjectInformation collectionData={collectionData} />
          <TeamInformation collectionData={collectionData} />
          <InvestmentInformation collectionData={collectionData} />
          <MintingInformation collectionData={collectionData} />
        </View>
      )}
    </ScreenContainer>
  );
};
