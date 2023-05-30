import React from "react";
import { View } from "react-native";

import { AccountSecurityPanel } from "./AccountSecurityPanel";
import { LinkedAccountsPanel } from "./LinkedAccountsPanel";
import { PersonalInfoPanel } from "./PersonalInfoPanel";
import { ProfessionalInfoPanel } from "./ProfessionalInfoPanel";
import { SellerInfo } from "../../../screens/FreelanceServices/types/fields";
import { ProfileStep } from "../../../utils/types/freelance";

export const ProfileBody: React.FC<{
  step: ProfileStep;
  seller: SellerInfo;
  setSeller: React.Dispatch<React.SetStateAction<SellerInfo>>;
}> = ({ step, seller, setSeller }) => {
  return (
    <View>
      {step === ProfileStep.PersonalInfo && (
        <PersonalInfoPanel seller={seller} setSeller={setSeller} />
      )}
      {step === ProfileStep.ProfessionalInfo && (
        <ProfessionalInfoPanel seller={seller} setSeller={setSeller} />
      )}
      {step === ProfileStep.LinkedAccounts && (
        <LinkedAccountsPanel seller={seller} setSeller={setSeller} />
      )}
      {step === ProfileStep.AccountSecurity && (
        <AccountSecurityPanel seller={seller} setSeller={setSeller} />
      )}
    </View>
  );
};
