import React, { useState } from "react";

import { CheckList } from "./components/CheckList";
import { SettingBase } from "./components/SettingBase";
import { ShowSeedPhrase } from "./components/ShowSeedPhrase";
import { ScreenFC } from "../../../utils/navigation";

type ScreenType = "visible" | "hidden";

export const RevealSeedPhraseScreen: ScreenFC<"MiniRevealSeedPhrase"> = ({
  navigation,
}) => {
  const [visibleScreen, setVisibleScreen] = useState<ScreenType>("hidden");

  const gotoSecurityAndPrivacy = () =>
    navigation.replace("MiniSecurityAndPrivacy");

  const changeVisibleScreen = (key: ScreenType) => setVisibleScreen(key);

  return (
    <SettingBase
      title="Reveal Seed Phrase"
      onGoBack={gotoSecurityAndPrivacy}
      reverseView={false}
      background="transparent"
    >
      {
        {
          hidden: (
            <CheckList
              gotoVisibleScreen={() => changeVisibleScreen("visible")}
              type="seed-phrase"
            />
          ),
          visible: <ShowSeedPhrase />,
        }[visibleScreen]
      }
    </SettingBase>
  );
};
