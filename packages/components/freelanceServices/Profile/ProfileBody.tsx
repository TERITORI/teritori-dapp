import React, { useState } from "react";
import { View } from "react-native";

import { PersonalInfoPanel } from "./PersonalInfoPanel";
import { ProfessionalInfoPanel } from "./ProfessionalInfoPanel";
import { LinkedAccountsPanel } from "./LinkedAccountsPanel";
import { AccountSecurityPanel } from "./AccountSecurityPanel";

export const ProfileBody: React.FC = () => {

  const [step, setStep] = useState<number>(4);

  return (
    <View>
      {step == 1 && <PersonalInfoPanel />}
      {step == 2 && <ProfessionalInfoPanel />}
      {step == 3 && <LinkedAccountsPanel />}
      {step == 4 && <AccountSecurityPanel />}
    </View>
  )
}
