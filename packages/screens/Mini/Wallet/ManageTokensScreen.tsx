import React, { useState } from "react";
import { View } from "react-native";

import { ManageToken } from "./components/ManageToken";
import plusSVG from "../../../../assets/icons/add-solid-white.svg";
import chevronRightSVG from "../../../../assets/icons/chevron-right-gray.svg";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { ScreenFC } from "../../../utils/navigation";
import { fontSemibold22 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { SettingBase } from "../components/SettingBase";

export const ManageTokensScreen: ScreenFC<"MiniManageTokens"> = ({
  navigation,
}) => {
  const [enabledToken, setEnabledToken] = useState(false);

  const toggleTokenStatus = () => setEnabledToken((prev) => !prev);

  const onPressAddToken = () => {
    navigation.replace("MiniAddCustomToken");
  };

  return (
    <SettingBase title="Manage Tokens">
      <View
        style={{
          paddingHorizontal: layout.spacing_x0_75,
          paddingVertical: layout.spacing_x1,
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
        <CustomPressable
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: layout.spacing_x1_5,
            marginVertical: layout.spacing_x1,
          }}
          onPress={onPressAddToken}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: layout.spacing_x1_5,
            }}
          >
            <SVG source={plusSVG} height={24} width={24} />
            <BrandText style={[fontSemibold22, {}]}>Add Token</BrandText>
          </View>
          <SVG source={chevronRightSVG} height={24} width={24} />
        </CustomPressable>
      </View>
    </SettingBase>
  );
};
