import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";

import { MembershipMemberSettingsSection } from "./MembershipMemberSettingsSection";
import { MembershipReviewInformationSection } from "./MembershipReviewInformationSection";
import { LaunchingOrganizationSection } from "../LaunchingOrganizationSection";

import { ConfigureVotingSection } from "@/components/dao/ConfigureVotingSection";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { nsNameInfoQueryKey } from "@/hooks/useNSNameInfo";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  getNetwork,
  getUserId,
  mustGetCosmosNetwork,
  NetworkKind,
} from "@/networks";
import { createDaoMemberBased, CreateDaoMemberBasedParams } from "@/utils/dao";
import { adenaDeployGnoDAO } from "@/utils/gnodao/deploy";
import { getDuration, getPercent } from "@/utils/gnodao/helpers";
import {
  ConfigureVotingFormType,
  CreateDaoFormType,
  LAUNCHING_PROCESS_STEPS,
  MEMBERSHIP_ORGANIZATION_DEPLOYER_STEPS,
  MembershipMemberSettingFormType,
} from "@/utils/types/organizations";

export const MembershipDeployerSteps: React.FC<{
  currentStep: number;
  setCurrentStep: (step: number) => void;
  launchingStep: number;
  setLaunchingStep: (step: number) => void;
  organizationData: CreateDaoFormType | undefined;
  setOrganizationData: (data: CreateDaoFormType | undefined) => void;
}> = ({
  currentStep,
  setCurrentStep,
  launchingStep,
  setLaunchingStep,
  organizationData,
  setOrganizationData,
}) => {
  const selectedWallet = useSelectedWallet();
  const [daoAddress, setDAOAddress] = useState("");
  const network = getNetwork(selectedWallet?.networkId);
  const queryClient = useQueryClient();
  const { setToast } = useFeedbacks();
  const [configureVotingFormData, setConfigureVotingFormData] =
    useState<ConfigureVotingFormType>();
  const [memberSettingsFormData, setMemberSettingsFormData] =
    useState<MembershipMemberSettingFormType>();

  const createDaoContract = async (): Promise<boolean> => {
    try {
      switch (network?.kind) {
        case NetworkKind.Gno: {
          const name = organizationData?.associatedHandle!;
          const pkgPath = await adenaDeployGnoDAO(
            network.id,
            selectedWallet?.address!,
            organizationData?.structure!,
            {
              name,
              maxVotingPeriodSeconds:
                parseInt(configureVotingFormData?.days!, 10) * 24 * 60 * 60,
              roles: undefined,
              initialMembers: (memberSettingsFormData?.members || []).map(
                (member) => ({
                  address: member.addr,
                  weight: parseInt(member.weight, 10),
                  roles: [],
                }),
              ),
              thresholdPercent:
                configureVotingFormData?.minimumApprovalPercent!,
              quorumPercent: configureVotingFormData?.supportPercent!,
              displayName: organizationData?.organizationName!,
              description: organizationData?.organizationDescription!,
              imageURI: organizationData?.imageUrl!,
            },
          );
          setLaunchingStep(1);
          setDAOAddress(pkgPath);
          return true;
        }
        case NetworkKind.Cosmos: {
          if (
            !selectedWallet ||
            !organizationData ||
            !configureVotingFormData
          ) {
            return false;
          }

          const networkId = selectedWallet.networkId;
          const network = mustGetCosmosNetwork(networkId);
          const cwAdminFactoryContractAddress =
            network.cwAdminFactoryContractAddress!;
          const walletAddress = selectedWallet.address;

          if (!memberSettingsFormData) return false;
          const params: CreateDaoMemberBasedParams = {
            networkId,
            sender: walletAddress,
            contractAddress: cwAdminFactoryContractAddress,
            daoCoreCodeId: network.daoCoreCodeId!,
            daoPreProposeSingleCodeId: network.daoPreProposeSingleCodeId!,
            daoProposalSingleCodeId: network.daoProposalSingleCodeId!,
            cw4GroupCodeId: network.cw4GroupCodeId!,
            daoVotingCw4CodeId: network.daoVotingCw4CodeId!,
            name: organizationData.organizationName,
            description: organizationData.organizationDescription,
            tns: organizationData.associatedHandle,
            imageUrl: organizationData.imageUrl,
            members: memberSettingsFormData.members.map((value) => ({
              addr: value.addr,
              weight: parseInt(value.weight, 10),
            })),
            quorum: getPercent(configureVotingFormData.supportPercent),
            threshold: getPercent(
              configureVotingFormData.minimumApprovalPercent,
            ),
            maxVotingPeriod: getDuration(
              configureVotingFormData.days,
              configureVotingFormData.hours,
              configureVotingFormData.minutes,
            ),
            onStepChange: setLaunchingStep,
          };
          const { daoAddress, executeResult } = await createDaoMemberBased(
            params,
            "auto",
          );
          const createDaoRes = executeResult;
          setDAOAddress(daoAddress);
          if (createDaoRes) {
            return true;
          } else {
            console.error("Failed to create DAO");
            setToast({
              title: "Failed to create DAO",
              mode: "normal",
              type: "error",
            });
            return false;
          }
        }
        default: {
          throw new Error("Network not supported " + selectedWallet?.networkId);
        }
      }
    } catch (err: unknown) {
      console.error("Failed to create DAO: ", err);
      if (err instanceof Error) {
        setToast({
          title: "Failed to create DAO",
          message: err.message,
          mode: "normal",
          type: "error",
        });
      }
      return false;
    }
  };

  // functions
  const onSubmitConfigureVoting = (data: ConfigureVotingFormType) => {
    setConfigureVotingFormData(data);
    setCurrentStep(2);
  };

  const onSubmitMemberSettings = (data: MembershipMemberSettingFormType) => {
    setMemberSettingsFormData(data);
    setCurrentStep(3);
  };

  const onStartLaunchingProcess = async () => {
    setCurrentStep(4);
    if (!(await createDaoContract())) {
      setCurrentStep(3);
    }
  };

  const resetForm = async () => {
    let tokenId = organizationData?.associatedHandle;
    const network = getNetwork(selectedWallet?.networkId);
    if (network?.kind === NetworkKind.Gno) {
      tokenId += ".gno";
    } else if (network?.kind === NetworkKind.Cosmos) {
      tokenId += network.nameServiceTLD || "";
    }
    await queryClient.invalidateQueries(
      nsNameInfoQueryKey(selectedWallet?.networkId, tokenId),
    );
    setOrganizationData(undefined);
    setConfigureVotingFormData(undefined);
    setMemberSettingsFormData(undefined);
    setCurrentStep(0);
    setDAOAddress("");
    setLaunchingStep(0);
  };

  return (
    <>
      <View
        style={
          currentStep === 1 ? { display: "flex", flex: 1 } : { display: "none" }
        }
      >
        <ConfigureVotingSection
          steps={MEMBERSHIP_ORGANIZATION_DEPLOYER_STEPS}
          onSubmit={onSubmitConfigureVoting}
        />
      </View>
      <View
        style={
          currentStep === 2 ? { display: "flex", flex: 1 } : { display: "none" }
        }
      >
        <MembershipMemberSettingsSection onSubmit={onSubmitMemberSettings} />
      </View>
      <View
        style={
          currentStep === 3 ? { display: "flex", flex: 1 } : { display: "none" }
        }
      >
        <MembershipReviewInformationSection
          organizationData={organizationData}
          votingSettingData={configureVotingFormData}
          memberSettingData={memberSettingsFormData}
          onSubmit={onStartLaunchingProcess}
        />
      </View>
      <View
        style={
          currentStep === 4 ? { display: "flex", flex: 1 } : { display: "none" }
        }
      >
        <LaunchingOrganizationSection
          id={getUserId(selectedWallet?.networkId, daoAddress)}
          isLaunched={launchingStep === LAUNCHING_PROCESS_STEPS.length}
          resetForm={resetForm}
        />
      </View>
    </>
  );
};
