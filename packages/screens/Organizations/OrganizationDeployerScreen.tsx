import React, { useState } from "react";
import { View } from "react-native";

import { CreateDAOSection } from "./components/CreateDAOSection";
import { MembershipDeployerSteps } from "./components/MembershipOrg/MembershipDeployerSteps";
import { RightSection } from "./components/RightSection";
import { RolesDeployerSteps } from "./components/RolesOrg/RolesDeployerSteps";
import { TokenDeployerSteps } from "./components/TokenOrg/TokenDeployerSteps";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
  CreateDaoFormType,
  DaoType,
  MEMBERSHIP_ORGANIZATION_DEPLOYER_STEPS,
  ROLES_BASED_ORGANIZATION_STEPS,
  TOKEN_ORGANIZATION_DEPLOYER_STEPS,
} from "@/utils/types/organizations";

export const OrganizationDeployerScreen = () => {
  const [steps, setSteps] = useState(MEMBERSHIP_ORGANIZATION_DEPLOYER_STEPS);
  const [currentStep, setCurrentStep] = useState(0);
  const [daoInfoFormData, setdaoInfoFormData] = useState<CreateDaoFormType>();
  const [launchingStep, setLaunchingStep] = useState(0);
  const [unlockedSteps, setUnlockedSteps] = useState<number[]>([0]);

  // functions
  const onStructureChange = (structure: DaoType) => {
    if (structure === DaoType.MEMBER_BASED) {
      setSteps(MEMBERSHIP_ORGANIZATION_DEPLOYER_STEPS);
    }
    if (structure === DaoType.ROLES_BASED) {
      setSteps(ROLES_BASED_ORGANIZATION_STEPS);
    }
    if (structure === DaoType.TOKEN_BASED) {
      setSteps(TOKEN_ORGANIZATION_DEPLOYER_STEPS);
    }
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
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View
            style={
              currentStep === 0
                ? { display: "flex", flex: 1 }
                : { display: "none" }
            }
          >
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
            <TokenDeployerSteps
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              launchingStep={launchingStep}
              setLaunchingStep={setLaunchingStep}
              organizationData={daoInfoFormData}
              setOrganizationData={setdaoInfoFormData}
            />
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
