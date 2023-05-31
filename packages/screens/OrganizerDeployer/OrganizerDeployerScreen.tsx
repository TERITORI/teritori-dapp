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
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getKeplrSigningCosmWasmClient,
  getUserId,
  mustGetCosmosNetwork,
} from "../../networks";
import { createDaoTokenBased, createDaoMemberBased } from "../../utils/dao";

export const ORGANIZER_DEPLOYER_STEPS = [
  "Create a DAO",
  "Configure voting",
  "Set tokens or members",
  "Review information",
  "Launch organization",
];

export const LAUNCHING_PROCESS_STEPS: LaunchingProcessStepType[] = [
  { title: "Book name", completeText: "Transaction finalized" },
  { title: "Create organization", completeText: "Transaction finalized" },
  {
    title: "Transfer name to organization",
    completeText: "Transaction finalized",
  },
];

export const OrganizerDeployerScreen = () => {
  const selectedWallet = useSelectedWallet();
  const { setToastError } = useFeedbacks();
  const [daoAddress, setDAOAddress] = useState("");
  // variables
  const [currentStep, setCurrentStep] = useState(0);
  const [step1DaoInfoFormData, setStep1DaoInfoFormData] =
    useState<CreateDaoFormType>();
  const [step2ConfigureVotingFormData, setStep2ConfigureVotingFormData] =
    useState<ConfigureVotingFormType>();
  const [step3TokenSettingFormData, setStep3TokenSettingFormData] =
    useState<TokenSettingFormType>();
  const [step3MemberSettingFormData, setStep3MemberSettingFormData] =
    useState<MemberSettingFormType>();
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
    minutes: string | undefined
  ): number => {
    const num_days = !days ? 0 : parseInt(days, 10);
    const num_hours = !hours ? 0 : parseInt(hours, 10);
    const num_minutes = !minutes ? 0 : parseInt(minutes, 10);
    return num_days * 3600 * 24 + num_hours * 3600 + num_minutes * 60;
  };

  const createDaoContract = async (): Promise<boolean> => {
    try {
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
            tns: step1DaoInfoFormData.associatedTeritoriNameService,
            imageUrl: step1DaoInfoFormData.imageUrl,
            tokenName: step3TokenSettingFormData.tokenName,
            tokenSymbol: step3TokenSettingFormData.tokenSymbol,
            tokenHolders: step3TokenSettingFormData.tokenHolders.map((item) => {
              return { address: item.address, amount: item.balance };
            }),
            quorum: getPercent(step2ConfigureVotingFormData.supportPercent),
            threshold: getPercent(
              step2ConfigureVotingFormData.minimumApprovalPercent
            ),
            maxVotingPeriod: getDuration(
              step2ConfigureVotingFormData.days,
              step2ConfigureVotingFormData.hours,
              step2ConfigureVotingFormData.minutes
            ),
          },
          "auto"
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
            tns: step1DaoInfoFormData.associatedTeritoriNameService,
            imageUrl: step1DaoInfoFormData.imageUrl,
            members: step3MemberSettingFormData.members.map((value) => ({
              addr: value.addr,
              weight: parseInt(value.weight, 10),
            })),
            quorum: getPercent(step2ConfigureVotingFormData.supportPercent),
            threshold: getPercent(
              step2ConfigureVotingFormData.minimumApprovalPercent
            ),
            maxVotingPeriod: getDuration(
              step2ConfigureVotingFormData.days,
              step2ConfigureVotingFormData.hours,
              step2ConfigureVotingFormData.minutes
            ),
            onStepChange: setLaunchingStep,
          },
          "auto"
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
    } catch (err: any) {
      console.log(err.message);
      setToastError({
        title: "Failed to create DAO",
        message: err.message,
      });
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

  // returns
  return (
    <ScreenContainer
      headerChildren={<BrandText>Organization Deployer</BrandText>}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      isHeaderSmallMargin
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
            />
          </View>
        </View>

        <RightSection
          steps={ORGANIZER_DEPLOYER_STEPS}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          isLaunching={currentStep === 4}
          launchingCompleteStep={launchingStep}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", flex: 1 },
  fill: { flex: 1 },
  hidden: { display: "none" },
  show: { display: "flex", flex: 1 },
});
