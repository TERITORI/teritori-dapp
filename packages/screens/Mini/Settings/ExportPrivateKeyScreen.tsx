import { mnemonicToSeedSync } from "bip39";
import React, { useState } from "react";

import { CheckList } from "./components/CheckList";
import { ShowPrivateKey } from "./components/ShowPrivateKey";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { ScreenFC } from "@/utils/navigation";
import { getMnemonic } from "@/utils/wallet/getNativeWallet";

type ScreenType = "visible" | "hidden";

export const ExportPrivateKeyScreen: ScreenFC<"MiniExportPrivateKey"> = ({
  navigation,
}) => {
  const selectedWallet = useSelectedNativeWallet();
  const [visibleScreen, setVisibleScreen] = useState<ScreenType>("hidden");
  const [privateKey, setPrivateKey] = useState<string>("");
  const gotoSecurityAndPrivacy = () =>
    navigation.replace("MiniSecurityAndPrivacy");

  const changeVisibleScreen = async (key: ScreenType) => {
    setVisibleScreen(key);
    const mnemonicValue = await getMnemonic(selectedWallet?.index || 0);
    if (mnemonicValue)
      setPrivateKey(mnemonicToSeedSync(mnemonicValue).toString("hex"));
  };
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
          visible: <ShowPrivateKey privateKey={privateKey} />,
        }[visibleScreen]
      }
    </BlurScreenContainer>
  );
};
