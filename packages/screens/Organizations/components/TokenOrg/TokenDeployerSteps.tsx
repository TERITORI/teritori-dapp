import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";

import { TokenReviewInformationSection } from "./TokenReviewInformationSection";
import { TokenSettingsSection } from "./TokenSettingsSection";
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
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { createDaoTokenBased } from "@/utils/dao";
import { adenaDeployGnoDAO } from "@/utils/gnodao/deploy";
import { getDuration, getPercent } from "@/utils/gnodao/helpers";
import {
  ConfigureVotingFormType,
  CreateDaoFormType,
  DaoType,
  LAUNCHING_PROCESS_STEPS,
  TOKEN_ORGANIZATION_DEPLOYER_STEPS,
  TokenSettingFormType,
} from "@/utils/types/organizations";

export const TokenDeployerSteps: React.FC<{
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
  const [tokenSettingFormData, setTokenSettingFormData] =
    useState<TokenSettingFormType>();

  const createDaoContract = async (): Promise<boolean> => {
    try {
      switch (network?.kind) {
        case NetworkKind.Gno: {
          const name = organizationData?.associatedHandle!;
          const pkgPath = await adenaDeployGnoDAO(
            network.id,
            selectedWallet?.address!,
            DaoType.TOKEN_BASED,
            {
              name,
              maxVotingPeriodSeconds:
                parseInt(configureVotingFormData?.days!, 10) * 24 * 60 * 60,
              roles: undefined,
              initialMembers: [],
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
          const signingClient = await getKeplrSigningCosmWasmClient(networkId);

          if (!tokenSettingFormData) return false;
          const createDaoRes = await createDaoTokenBased(
            {
              client: signingClient,
              sender: walletAddress,
              contractAddress: cwAdminFactoryContractAddress,
              daoPreProposeSingleCodeId: network.daoPreProposeSingleCodeId!,
              daoProposalSingleCodeId: network.daoProposalSingleCodeId!,
              daoCw20CodeId: network.daoCw20CodeId!,
              daoCw20StakeCodeId: network.daoCw20StakeCodeId!,
              daoVotingCw20StakedCodeId: network.daoVotingCw20StakedCodeId!,
              daoCoreCodeId: network.daoCoreCodeId!,
              name: organizationData.organizationName,
              description: organizationData.organizationDescription,
              tns: organizationData.associatedHandle,
              imageUrl: organizationData.imageUrl,
              tokenName: tokenSettingFormData.tokenName,
              tokenSymbol: tokenSettingFormData.tokenSymbol,
              tokenHolders: tokenSettingFormData.tokenHolders.map((item) => {
                return { address: item.address, amount: item.balance };
              }),
              quorum: getPercent(configureVotingFormData.supportPercent),
              threshold: getPercent(
                configureVotingFormData.minimumApprovalPercent,
              ),
              maxVotingPeriod: getDuration(
                configureVotingFormData.days,
                configureVotingFormData.hours,
                configureVotingFormData.minutes,
              ),
            },
            "auto",
          );
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

  const onSubmitTokenSettings = (data: TokenSettingFormType) => {
    setTokenSettingFormData(data);
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
    setTokenSettingFormData(undefined);
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
          steps={TOKEN_ORGANIZATION_DEPLOYER_STEPS}
          onSubmit={onSubmitConfigureVoting}
        />
      </View>
      <View
        style={
          currentStep === 2 ? { display: "flex", flex: 1 } : { display: "none" }
        }
      >
        <TokenSettingsSection onSubmit={onSubmitTokenSettings} />
      </View>
      <View
        style={
          currentStep === 3 ? { display: "flex", flex: 1 } : { display: "none" }
        }
      >
        <TokenReviewInformationSection
          organizationData={organizationData}
          votingSettingData={configureVotingFormData}
          tokenSettingData={tokenSettingFormData}
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
