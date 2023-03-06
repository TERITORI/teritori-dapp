import React from "react";

import { ScreenFC } from "../../utils/navigation";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
import {ProfileHeader} from "../../components/freelanceServices/Profile/ProfileHeader";
import { View } from "react-native";
import {ProfileBody} from "../../components/freelanceServices/Profile/ProfileBody";
import {ProfileFooter} from "../../components/freelanceServices/Profile/ProfileFooter";

export const FreelanceServicesProfileSeller: ScreenFC<"FreelanceServicesProfileSeller"> = () => {
  return (
    <FreelanceServicesScreenWrapper>
      <View style={{marginLeft: 35, zIndex: 1}}>
        <ProfileHeader />
        <ProfileBody />
      </View>
      <ProfileFooter />
    </FreelanceServicesScreenWrapper>
  );
};
