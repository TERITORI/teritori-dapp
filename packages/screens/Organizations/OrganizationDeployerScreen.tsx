import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ConfigureVotingSection } from "./components/ConfigureVotingSection";
import { CreateDAOSection } from "./components/CreateDAOSection";
import { LaunchingOrganizationSection } from "./components/LaunchingOrganizationSection";
import { MemberSettingsSection } from "./components/MemberSettingsSection";
import { ReviewInformationSection } from "./components/ReviewInformationSection";
import { RightSection } from "./components/RightSection";
import { TokenSettingsSection } from "./components/TokenSettingsSection";
import {
  ConfigureVotingFormType,
  CreateDaoFormType,
  LaunchingProcessStepType,
  TokenSettingFormType,
  MemberSettingFormType,
  DaoType,
} from "./types";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { nsNameInfoQueryKey } from "../../hooks/useNSNameInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  NetworkKind,
  getKeplrSigningCosmWasmClient,
  getNetwork,
  getUserId,
  mustGetCosmosNetwork,
} from "../../networks";
import { createDaoTokenBased, createDaoMemberBased } from "../../utils/dao";
import { adenaDeployGnoDAO } from "../../utils/gnodao/deploy";

export const ORGANIZATION_DEPLOYER_STEPS = [
  "Create a DAO",
  "Configure voting",
  "Set tokens or members",
  "Review information",
  "Launch organization",
];

export const LAUNCHING_PROCESS_STEPS: LaunchingProcessStepType[] = [
  { title: "Create organization", completeText: "Transaction finalized" },
];

export const OrganizationDeployerScreen = () => {
  const selectedWallet = useSelectedWallet();
  const { setToastError } = useFeedbacks();
  const [daoAddress, setDAOAddress] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [step1DaoInfoFormData, setStep1DaoInfoFormData] =
    useState<CreateDaoFormType>();
  const [step2ConfigureVotingFormData, setStep2ConfigureVotingFormData] =
    useState<ConfigureVotingFormType>();
  const [step3TokenSettingFormData, setStep3TokenSettingFormData] =
    useState<TokenSettingFormType>();
  const [step3MemberSettingFormData, setStep3MemberSettingFormData] =
    useState<MemberSettingFormType>();
  const queryClient = useQueryClient();
  const [launchingStep, setLaunchingStep] = useState(0);
  const getPercent = (num: number | undefined): string => {
    let ret_num = 0;
    ret_num = num === undefined ? 0 : num;
    ret_num = ret_num < 0 ? 0 : ret_num;
    ret_num = ret_num > 100 ? 100 : ret_num;
    return (ret_num / 100).toFixed(2);
  };
  const getDuration = (
    days: string | undefined,
    hours: string | undefined,
    minutes: string | undefined,
  ): number => {
    const num_days = !days ? 0 : parseInt(days, 10);
    const num_hours = !hours ? 0 : parseInt(hours, 10);
    const num_minutes = !minutes ? 0 : parseInt(minutes, 10);
    return num_days * 3600 * 24 + num_hours * 3600 + num_minutes * 60;
  };

  const network = getNetwork(selectedWallet?.networkId);

  const createDaoContract = async (): Promise<boolean> => {
    try {
      switch (network?.kind) {
        case NetworkKind.Gno: {
          const name = step1DaoInfoFormData?.associatedHandle!;
          const pkgPath = await adenaDeployGnoDAO(
            network.id,
            selectedWallet?.address!,
            {
              name,
              maxVotingPeriodSeconds:
                parseInt(step2ConfigureVotingFormData?.days!, 10) *
                24 *
                60 *
                60,
              initialMembers: (step3MemberSettingFormData?.members || []).map(
                (member) => ({
                  address: member.addr,
                  weight: parseInt(member.weight, 10),
                }),
              ),
              thresholdPercent:
                step2ConfigureVotingFormData?.minimumApprovalPercent!,
              quorumPercent: step2ConfigureVotingFormData?.supportPercent!,
              displayName: step1DaoInfoFormData?.organizationName!,
              description: step1DaoInfoFormData?.organizationDescription!,
              imageURI: step1DaoInfoFormData?.imageUrl!,
            },
          );
          setLaunchingStep(1);
          setDAOAddress(pkgPath);
          return true;
        }
        case NetworkKind.Cosmos: {
          if (
            !selectedWallet ||
            !step1DaoInfoFormData ||
            !step2ConfigureVotingFormData
          ) {
            return false;
          }

          const networkId = selectedWallet.networkId;
          const network = mustGetCosmosNetwork(networkId);
          const daoFactoryContractAddress = network.daoFactoryContractAddress!;
          const walletAddress = selectedWallet.address;
          const signingClient = await getKeplrSigningCosmWasmClient(networkId);

          let createDaoRes = null;
          if (step1DaoInfoFormData.structure === DaoType.TOKEN_BASED) {
            if (!step3TokenSettingFormData) return false;
            createDaoRes = await createDaoTokenBased(
              {
                client: signingClient,
                sender: walletAddress,
                contractAddress: daoFactoryContractAddress,
                daoPreProposeSingleCodeId: network.daoPreProposeSingleCodeId!,
                daoProposalSingleCodeId: network.daoProposalSingleCodeId!,
                daoCw20CodeId: network.daoCw20CodeId!,
                daoCw20StakeCodeId: network.daoCw20StakeCodeId!,
                daoVotingCw20StakedCodeId: network.daoVotingCw20StakedCodeId!,
                daoCoreCodeId: network.daoCoreCodeId!,
                name: step1DaoInfoFormData.organizationName,
                description: step1DaoInfoFormData.organizationDescription,
                tns: step1DaoInfoFormData.associatedHandle,
                imageUrl: step1DaoInfoFormData.imageUrl,
                tokenName: step3TokenSettingFormData.tokenName,
                tokenSymbol: step3TokenSettingFormData.tokenSymbol,
                tokenHolders: step3TokenSettingFormData.tokenHolders.map(
                  (item) => {
                    return { address: item.address, amount: item.balance };
                  },
                ),
                quorum: getPercent(step2ConfigureVotingFormData.supportPercent),
                threshold: getPercent(
                  step2ConfigureVotingFormData.minimumApprovalPercent,
                ),
                maxVotingPeriod: getDuration(
                  step2ConfigureVotingFormData.days,
                  step2ConfigureVotingFormData.hours,
                  step2ConfigureVotingFormData.minutes,
                ),
              },
              "auto",
            );
          } else if (step1DaoInfoFormData.structure === DaoType.MEMBER_BASED) {
            if (!step3MemberSettingFormData) return false;
            const { daoAddress, executeResult } = await createDaoMemberBased(
              {
                networkId,
                sender: walletAddress,
                contractAddress: daoFactoryContractAddress,
                daoCoreCodeId: network.daoCoreCodeId!,
                daoPreProposeSingleCodeId: network.daoPreProposeSingleCodeId!,
                daoProposalSingleCodeId: network.daoProposalSingleCodeId!,
                daoCw4GroupCodeId: network.daoCw4GroupCodeId!,
                daoVotingCw4CodeId: network.daoVotingCw4CodeId!,
                name: step1DaoInfoFormData.organizationName,
                description: step1DaoInfoFormData.organizationDescription,
                tns: step1DaoInfoFormData.associatedHandle,
                imageUrl: step1DaoInfoFormData.imageUrl,
                members: step3MemberSettingFormData.members.map((value) => ({
                  addr: value.addr,
                  weight: parseInt(value.weight, 10),
                })),
                quorum: getPercent(step2ConfigureVotingFormData.supportPercent),
                threshold: getPercent(
                  step2ConfigureVotingFormData.minimumApprovalPercent,
                ),
                maxVotingPeriod: getDuration(
                  step2ConfigureVotingFormData.days,
                  step2ConfigureVotingFormData.hours,
                  step2ConfigureVotingFormData.minutes,
                ),
                onStepChange: setLaunchingStep,
              },
              "auto",
            );
            createDaoRes = executeResult;
            setDAOAddress(daoAddress);
          } else {
            return false;
          }
          console.log("res", createDaoRes);
          console.log(createDaoRes.transactionHash);
          if (createDaoRes) {
            return true;
          } else {
            setToastError({
              title: "Failed to create DAO",
              message: "Failed to create DAO",
            });
            return false;
          }
        }
        default: {
          throw new Error("Network not supported " + selectedWallet?.networkId);
        }
      }
    } catch (err: unknown) {
      console.log("failed to create DAO:", err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to create DAO",
          message: err.message,
        });
      }
      return false;
    }
  };
  // functions
  const onSubmitDAO = (data: CreateDaoFormType) => {
    setStep1DaoInfoFormData(data);
    setCurrentStep(1);
  };

  const onSubmitConfigureVoting = (data: ConfigureVotingFormType) => {
    setStep2ConfigureVotingFormData(data);
    setCurrentStep(2);
  };

  const onSubmitTokenSettings = (data: TokenSettingFormType) => {
    setStep3TokenSettingFormData(data);
    setCurrentStep(3);
  };

  const onSubmitMemberSettings = (data: MemberSettingFormType) => {
    const temp = data.members.filter((member) => member.addr !== undefined);
    const processedData: MemberSettingFormType = { members: temp };
    setStep3MemberSettingFormData(processedData);
    setCurrentStep(3);
  };

  const onStartLaunchingProcess = async () => {
    setCurrentStep(4);
    if (!(await createDaoContract())) {
      setCurrentStep(3);
    }
  };

  return (
    <ScreenContainer
      headerChildren={<BrandText>Organization Deployer</BrandText>}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
    >
      <View style={styles.row}>
        <View style={styles.fill}>
          <View style={currentStep === 0 ? styles.show : styles.hidden}>
            <CreateDAOSection onSubmit={onSubmitDAO} />
          </View>

          <View style={currentStep === 1 ? styles.show : styles.hidden}>
            <ConfigureVotingSection onSubmit={onSubmitConfigureVoting} />
          </View>

          <View
            style={
              currentStep === 2 &&
              step1DaoInfoFormData &&
              step1DaoInfoFormData.structure === DaoType.TOKEN_BASED
                ? styles.show
                : styles.hidden
            }
          >
            <TokenSettingsSection onSubmit={onSubmitTokenSettings} />
          </View>
          <View
            style={
              currentStep === 2 &&
              step1DaoInfoFormData &&
              step1DaoInfoFormData.structure === DaoType.MEMBER_BASED
                ? styles.show
                : styles.hidden
            }
          >
            <MemberSettingsSection onSubmit={onSubmitMemberSettings} />
          </View>

          <View style={currentStep === 3 ? styles.show : styles.hidden}>
            <ReviewInformationSection
              organizationData={step1DaoInfoFormData}
              votingSettingData={step2ConfigureVotingFormData}
              tokenSettingData={step3TokenSettingFormData}
              memberSettingData={step3MemberSettingFormData}
              onSubmit={onStartLaunchingProcess}
            />
          </View>

          <View style={currentStep === 4 ? styles.show : styles.hidden}>
            <LaunchingOrganizationSection
              id={getUserId(selectedWallet?.networkId, daoAddress)}
              isLaunched={launchingStep === LAUNCHING_PROCESS_STEPS.length}
              resetForm={async () => {
                let tokenId = step1DaoInfoFormData?.associatedHandle;
                const network = getNetwork(selectedWallet?.networkId);
                if (network?.kind === NetworkKind.Gno) {
                  tokenId += ".gno";
                } else if (network?.kind === NetworkKind.Cosmos) {
                  tokenId += network.nameServiceTLD || "";
                }
                await queryClient.invalidateQueries(
                  nsNameInfoQueryKey(selectedWallet?.networkId, tokenId),
                );
                setStep1DaoInfoFormData(undefined);
                setStep2ConfigureVotingFormData(undefined);
                setStep3MemberSettingFormData(undefined);
                setStep3TokenSettingFormData(undefined);
                setCurrentStep(0);
                setDAOAddress("");
                setLaunchingStep(0);
              }}
            />
          </View>
        </View>

        <RightSection
          steps={ORGANIZATION_DEPLOYER_STEPS}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          isLaunching={currentStep === 4}
          launchingCompleteStep={launchingStep}
        />
      </View>
    </ScreenContainer>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  row: { flexDirection: "row", flex: 1 },
  fill: { flex: 1 },
  hidden: { display: "none" },
  show: { display: "flex", flex: 1 },
});
