import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { useAppNavigation } from "../../utils/navigation";
import { ConfigureVotingSection } from "./components/ConfigureVotingSection";
import { CreateDAOSection } from "./components/CreateDAOSection";
import { LaunchingOrganizationSection } from "./components/LaunchingOrganizationSection";
import { ReviewInformationSection } from "./components/ReviewInformationSection";
import { RightSection } from "./components/RightSection";
import { TokenSettingsSection } from "./components/TokenSettingsSection";
import {
  ConfigureVotingFormType,
  CreateDaoFormType,
  LaunchingProcessStepType,
  TokenSettingFormType,
} from "./types";

export const ORGANIZER_DEPLOYER_STEPS = [
  "Create a DAO",
  "Configure voting",
  "Set tokens",
  "Review information",
  "Launch organization",
];

export const LAUNCHING_PROCESS_STEPS: LaunchingProcessStepType[] = [
  { title: "Create token", completeText: "Signature successful" },
  { title: "Create organization", completeText: "Signature successful" },
  { title: "Organization TNS", completeText: "Registred successfully" },
];

export const OrganizerDeployerScreen = () => {
  const selectedWallet = useSelectedWallet();
  const navigation = useAppNavigation();
  // variables
  const [currentStep, setCurrentStep] = useState(0);
  const [step1FormData, setStep1FormData] = useState<CreateDaoFormType>();
  const [step2FormData, setStep2FormData] = useState<ConfigureVotingFormType>();
  const [step3FormData, setStep3FormData] = useState<TokenSettingFormType>();
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
  const getCreateDaoMsg = (): any => {
    const dao_pre_propose_single_msg = {
      deposit_info: null,
      extension: {},
      open_proposal_submission: false,
    };
    const dao_proposal_single_msg = {
      threshold: {
        threshold_quorum: {
          quorum: { percent: getPercent(step2FormData?.supportPercent) },
          threshold: {
            percent: getPercent(step2FormData?.minimumApprovalPercent),
          },
        },
      },
      max_voting_period: {
        time: getDuration(
          step2FormData?.days,
          step2FormData?.hours,
          step2FormData?.minutes
        ),
      },
      min_voting_period: null,
      only_members_execute: true, // need to fix
      allow_revoting: false,
      close_proposal_on_execution_failure: true,
      pre_propose_info: {
        module_may_propose: {
          info: {
            code_id: parseInt(process.env.DAO_PRE_PROPOSE_SINGLE!, 10),
            msg: Buffer.from(
              JSON.stringify(dao_pre_propose_single_msg)
            ).toString("base64"),
            admin: { core_module: {} },
            label: `DAO_${step1FormData?.organizationName}_pre-propose-DaoProposalSingle`,
          },
        },
      },
    };
    const proposal_modules_instantiate_info = [
      {
        admin: { core_module: {} },
        code_id: parseInt(process.env.DAO_PROPOSAL_SINGLE!, 10),
        label: `DAO_${step1FormData?.organizationName}_DAOProposalSingle`,
        msg: Buffer.from(JSON.stringify(dao_proposal_single_msg)).toString(
          "base64"
        ),
      },
    ];

    const dao_voting_cw20_staked_msg = {
      token_info: {
        new: {
          code_id: parseInt(process.env.DAO_CW20_CODE_ID!, 10),
          decimals: 6,
          initial_balances: step3FormData?.tokenHolders.map((item) => {
            return { address: item.address, amount: item.balance };
          }),
          initial_dao_balance: null,
          label: step3FormData?.tokenName,
          name: step3FormData?.tokenName,
          symbol: step3FormData?.tokenSymbol,
          staking_code_id: parseInt(process.env.DAO_CW20_STAKE!, 10),
          unstaking_duration: null,
        },
      },
    };

    const voting_module_instantiate_info = {
      admin: { core_module: {} },
      code_id: parseInt(process.env.DAO_VOTING_CW20_STAKED!, 10),
      label: `DAO_${step1FormData?.organizationName}_DaoVotingCw20Staked`,
      msg: Buffer.from(JSON.stringify(dao_voting_cw20_staked_msg)).toString(
        "base64"
      ),
    };

    const dao_core_instantiate_msg = {
      admin: null,
      automatically_add_cw20s: true,
      automatically_add_cw721s: true,
      name: step1FormData?.organizationName,
      description: step1FormData?.organizationDescription,
      tns: step1FormData?.associatedTeritoriNameService,
      image_url: step1FormData?.imageUrl,
      proposal_modules_instantiate_info,
      voting_module_instantiate_info,
    };
    const instantiate_msg = Buffer.from(
      JSON.stringify(dao_core_instantiate_msg)
    ).toString("base64");
    return {
      instantiate_contract_with_self_admin: {
        code_id: parseInt(process.env.DAO_CORE!, 10),
        instantiate_msg,
        label: step1FormData?.organizationName,
      },
    };
  };
  const createDaoContract = async (): Promise<boolean> => {
    try {
      if (!selectedWallet) return false;
      const contractAddress = process.env
        .TERITORI_DAO_FACTORY_CONTRACT_ADDRESS as string;
      const walletAddress = selectedWallet.address;
      const signingClient = await getSigningCosmWasmClient();
      const msg = getCreateDaoMsg();
      const createDaoRes = await signingClient.execute(
        walletAddress,
        contractAddress,
        msg,
        "auto"
      );
      return createDaoRes && createDaoRes.transactionHash !== "";
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  // functions
  const onSubmitDAO = (data: CreateDaoFormType) => {
    setStep1FormData(data);
    setCurrentStep(1);
  };

  const onSubmitConfigureVoting = (data: ConfigureVotingFormType) => {
    setStep2FormData(data);
    setCurrentStep(2);
  };

  const onSubmitTokenSettings = (data: TokenSettingFormType) => {
    setStep3FormData(data);
    setCurrentStep(3);
  };

  const onStartLaunchingProcess = async () => {
    if (!(await createDaoContract())) {
      console.log("error");
      return;
    }

    // setCurrentStep(4);
    setTimeout(() => {
      setLaunchingStep(1);
    }, 2000);

    setTimeout(() => {
      setLaunchingStep(2);
    }, 3000);

    setTimeout(() => {
      setLaunchingStep(3);
    }, 4000);
    setTimeout(() => {
      navigation.navigate("OrganizationDaoList");
    }, 6000);
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

          <View style={currentStep === 2 ? styles.show : styles.hidden}>
            <TokenSettingsSection onSubmit={onSubmitTokenSettings} />
          </View>

          <View style={currentStep === 3 ? styles.show : styles.hidden}>
            <ReviewInformationSection
              organizationData={step1FormData}
              votingSettingData={step2FormData}
              tokenSettingData={step3FormData}
              onSubmit={onStartLaunchingProcess}
            />
          </View>

          <View style={currentStep === 4 ? styles.show : styles.hidden}>
            <LaunchingOrganizationSection
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
