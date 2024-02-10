import React, { useState } from "react";

import { CheckList } from "./components/CheckList";
import { ShowSeedPhrase } from "./components/ShowSeedPhrase";
import { ScreenFC } from "../../../utils/navigation";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

type ScreenType = "visible" | "hidden";

export const RevealSeedPhraseScreen: ScreenFC<"MiniRevealSeedPhrase"> = ({
  navigation,
}) => {
  const [visibleScreen, setVisibleScreen] = useState<ScreenType>("hidden");

  const gotoSecurityAndPrivacy = () =>
    navigation.replace("MiniSecurityAndPrivacy");

  const changeVisibleScreen = (key: ScreenType) => setVisibleScreen(key);

  return (
    <BlurScreenContainer
      title="Reveal Seed Phrase"
      onGoBack={gotoSecurityAndPrivacy}
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
    </BlurScreenContainer>
  );
};
