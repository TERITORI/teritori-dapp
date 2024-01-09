import React from "react";
import { Text } from "react-native";

import { ScreenFC } from "../../../utils/navigation";
import { SettingBase } from "../Settings/components/SettingBase";

export const ManageTokensScreen: ScreenFC<"MiniManageTokens"> = ({}) => {
  return (
    <SettingBase>
      <Text>ManageTokensScreen</Text>
    </SettingBase>
  );
};
