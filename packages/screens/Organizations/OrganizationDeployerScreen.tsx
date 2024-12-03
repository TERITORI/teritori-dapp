import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { CreateDAOSection } from "./components/CreateDAOSection";
import { MembershipDeployerSteps } from "./components/MembershipOrg/MembershipDeployerSteps";
import { RightSection } from "./components/RightSection";
import { RolesDeployerSteps } from "./components/RolesOrg/RolesDeployerSteps";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
  CreateDaoFormType,
  DaoType,
  ORGANIZATION_DEPLOYER_STEPS,
  ROLES_BASED_ORGANIZATION_STEPS,
} from "@/utils/types/organizations";

export const OrganizationDeployerScreen = () => {
  const [steps, setSteps] = useState(ORGANIZATION_DEPLOYER_STEPS);
  const [currentStep, setCurrentStep] = useState(0);
  const [daoInfoFormData, setdaoInfoFormData] = useState<CreateDaoFormType>();
  const [launchingStep, setLaunchingStep] = useState(0);
  const [unlockedSteps, setUnlockedSteps] = useState<number[]>([0]);

  // functions
  const onStructureChange = (structure: DaoType) => {
    setSteps(
      structure === DaoType.ROLES_BASED
        ? ROLES_BASED_ORGANIZATION_STEPS
        : ORGANIZATION_DEPLOYER_STEPS,
    );
    setCurrentStep(0);
    setUnlockedSteps([0]);
  };

  const onSubmitDAO = (data: CreateDaoFormType) => {
    setdaoInfoFormData(data);
    setCurrentStep(1);
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
            <CreateDAOSection
              onSubmit={onSubmitDAO}
              onStructureChange={onStructureChange}
            />
          </View>

          {daoInfoFormData?.structure === DaoType.MEMBER_BASED && (
            <MembershipDeployerSteps
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              launchingStep={launchingStep}
              setLaunchingStep={setLaunchingStep}
              organizationData={daoInfoFormData}
              setOrganizationData={setdaoInfoFormData}
            />
          )}

          {daoInfoFormData?.structure === DaoType.ROLES_BASED && (
            <RolesDeployerSteps
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              launchingStep={launchingStep}
              setLaunchingStep={setLaunchingStep}
              organizationData={daoInfoFormData}
              setOrganizationData={setdaoInfoFormData}
            />
          )}

          {daoInfoFormData?.structure === DaoType.TOKEN_BASED && (
            <BrandText>Token based organization, coming soon...</BrandText>
          )}
        </View>

        <RightSection
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          isLaunching={currentStep === steps.length - 1}
          launchingCompleteStep={launchingStep}
          unlockedSteps={unlockedSteps}
          setUnlockedSteps={setUnlockedSteps}
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
