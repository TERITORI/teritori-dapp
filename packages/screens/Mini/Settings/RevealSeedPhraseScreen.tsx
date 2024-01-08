import React, { useState } from "react";

import { AfterShowingSeedPhrase } from "./components/AfterShowingSeedPhrase";
import { BeforeShowingSeedPhrase } from "./components/BeforeShowingSeedPhrase";
import { SettingBase } from "./components/SettingBase";
import { ScreenFC } from "../../../utils/navigation";

type ScreenType = "visible" | "hidden";

export const RevealSeedPhraseScreen: ScreenFC<"MiniRevealSeedPhrase"> = ({
  navigation,
}) => {
  const [visibleScreen, setVisibleScreen] = useState<ScreenType>("hidden");
  //   const [isPhraseRevealed, setIsPhraseRevealed] = useState(false);

  const gotoSecurityAndPrivacy = () =>
    navigation.replace("MiniSecurityAndPrivacy");

  const changeVisibleScreen = (key: ScreenType) => setVisibleScreen(key);

  return (
    <SettingBase title="Reveal Seed Phrase" onGoBack={gotoSecurityAndPrivacy}>
      {
        {
          hidden: (
            <BeforeShowingSeedPhrase
              gotoVisibleScreen={() => changeVisibleScreen("visible")}
            />
          ),
          visible: <AfterShowingSeedPhrase />,
        }[visibleScreen]
      }
    </SettingBase>
  );
};
