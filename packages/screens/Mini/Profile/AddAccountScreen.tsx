import React from "react";

import { BrandText } from "../../../components/BrandText";
import { ScreenFC } from "../../../utils/navigation";
import { SettingBase } from "../Settings/components/SettingBase";

export const AddAccountScreen: ScreenFC<"MiniAddAccount"> = ({
  navigation,
}) => {
  const goToProfile = () => navigation.replace("MiniProfile");
  return (
    <SettingBase title="Add Account" onGoBack={goToProfile}>
      <BrandText>AddAccountScreen</BrandText>
    </SettingBase>
  );
};
