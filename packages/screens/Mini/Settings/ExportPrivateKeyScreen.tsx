import React, { useState } from "react";

import { CheckList } from "./components/CheckList";
import { ShowPrivateKey } from "./components/ShowPrivateKey";
import { ScreenFC } from "../../../utils/navigation";
import { BlurScreenContainer } from "../components/BlurScreenContainer";

type ScreenType = "visible" | "hidden";

export const ExportPrivateKeyScreen: ScreenFC<"MiniExportPrivateKey"> = ({
  navigation,
}) => {
  const [visibleScreen, setVisibleScreen] = useState<ScreenType>("hidden");

  const gotoSecurityAndPrivacy = () =>
    navigation.replace("MiniSecurityAndPrivacy");

  const changeVisibleScreen = (key: ScreenType) => setVisibleScreen(key);
  return (
    <BlurScreenContainer
      title="Export Private Key"
      onGoBack={gotoSecurityAndPrivacy}
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
    </BlurScreenContainer>
  );
};
