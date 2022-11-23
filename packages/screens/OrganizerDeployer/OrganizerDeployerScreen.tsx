import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
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
  // variables
  const [currentStep, setCurrentStep] = useState(0);
  const [step1FormData, setStep1FormData] = useState<CreateDaoFormType>();
  const [step2FormData, setStep2FormData] = useState<ConfigureVotingFormType>();
  const [step3FormData, setStep3FormData] = useState<TokenSettingFormType>();
  const [launchingStep, setLaunchingStep] = useState(0);

  // functions
  const onSubmitDAO = (data: CreateDaoFormType) => {
    setStep1FormData(data);
    setCurrentStep(1);
  };

  const onSubmitConfiureVoting = (data: ConfigureVotingFormType) => {
    setStep2FormData(data);
    setCurrentStep(2);
  };

  const onSubmitTokenSettings = (data: TokenSettingFormType) => {
    setStep3FormData(data);
    setCurrentStep(3);
  };

  const onStartLauchingProcess = () => {
    setCurrentStep(4);
    setTimeout(() => {
      setLaunchingStep(1);
    }, 2000);

    setTimeout(() => {
      setLaunchingStep(2);
    }, 3000);

    setTimeout(() => {
      setLaunchingStep(3);
    }, 4000);
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
            <ConfigureVotingSection onSubmit={onSubmitConfiureVoting} />
          </View>

          <View style={currentStep === 2 ? styles.show : styles.hidden}>
            <TokenSettingsSection onSubmit={onSubmitTokenSettings} />
          </View>

          <View style={currentStep === 3 ? styles.show : styles.hidden}>
            <ReviewInformationSection
              organizationData={step1FormData}
              votingSettingData={step2FormData}
              tokenSettingData={step3FormData}
              onSubmit={onStartLauchingProcess}
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
