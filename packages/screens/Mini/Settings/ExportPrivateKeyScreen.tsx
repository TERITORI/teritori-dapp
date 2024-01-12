import React, { useState } from "react";

import { CheckList } from "./components/CheckList";
import { SettingBase } from "../components/SettingBase";
import { ShowPrivateKey } from "./components/ShowPrivateKey";
import { ScreenFC } from "../../../utils/navigation";

type ScreenType = "visible" | "hidden";

export const ExportPrivateKeyScreen: ScreenFC<"MiniExportPrivateKey"> = ({
  navigation,
}) => {
  const [visibleScreen, setVisibleScreen] = useState<ScreenType>("hidden");

  const gotoSecurityAndPrivacy = () =>
    navigation.replace("MiniSecurityAndPrivacy");

  const changeVisibleScreen = (key: ScreenType) => setVisibleScreen(key);
  return (
    <SettingBase
      title="Export Private Key"
      onGoBack={gotoSecurityAndPrivacy}
      reverseView={false}
      background="transparent"
    >
      {
        {
          hidden: (
            <CheckList
              gotoVisibleScreen={() => changeVisibleScreen("visible")}
              type="private-key"
            />
          ),
          visible: <ShowPrivateKey />,
        }[visibleScreen]
      }
    </SettingBase>
  );
};
