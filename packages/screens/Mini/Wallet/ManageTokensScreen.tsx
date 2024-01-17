import React, { useState } from "react";
import { View } from "react-native";

import { ManageToken } from "./components/ManageToken";
import AddNewSvg from "../../../../assets/icons/add-circle-filled.svg";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import { Separator } from "../../../components/separators/Separator";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import ListView from "../components/ListView";

export const ManageTokensScreen: ScreenFC<"MiniManageTokens"> = ({
  navigation,
}) => {
  const [enabledToken, setEnabledToken] = useState(false);

  const toggleTokenStatus = () => setEnabledToken((prev) => !prev);

  const onPressAddToken = () => {
    navigation.replace("MiniAddCustomToken");
  };

  return (
    <BlurScreenContainer title="Manage Tokens">
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <ManageToken
          icon={teritoriSVG}
          title="Teritori"
          tori={62424}
          showSwitch={false}
        />
        <ManageToken
          icon=""
          title="Token"
          tori={2345}
          showSwitch
          suffix="TKN"
          isEnabled={enabledToken}
          onToggleSwitch={toggleTokenStatus}
        />
        <Separator />
        <ListView
          onPress={onPressAddToken}
          style={{
            paddingVertical: layout.spacing_x4,
          }}
          options={{
            label: "Add Token",
            leftIconEnabled: true,
            iconEnabled: true,
            leftIconOptions: {
              icon: AddNewSvg,
              fill: "#fff",
            },
          }}
        />
      </View>
    </BlurScreenContainer>
  );
};
