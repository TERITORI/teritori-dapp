import { useEffect, useState } from "react";
import { View } from "react-native";

import { RedAlert } from "./RedAlert";
import BlurViewWrapper from "../../components/BlurViewWrapper";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { getMnemonic } from "@/utils/wallet/getNativeWallet";

export const ShowSeedPhrase = () => {
  const selectedWallet = useSelectedNativeWallet();
  const [phrase, setPhrase] = useState<string | null>();

  useEffect(() => {
    (async () => {
      const _phrase = await getMnemonic(selectedWallet?.index || 0);
      setPhrase(_phrase);
    })();
  }, [selectedWallet?.index]);

  return (
    <View
      style={{
        paddingHorizontal: layout.spacing_x2,
        position: "relative",
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <View>
        <SpacerColumn size={2} />
        <RedAlert description="Your seed phrase is the only way to recover your wallet. Keep it somewhere safe and secret." />
        <SpacerColumn size={1.5} />

        <BlurViewWrapper
          wrapperStyle={{ flexDirection: "row", rowGap: 12, flexWrap: "wrap" }}
          copy={phrase}
        >
          {phrase?.split(" ").map((seed) => (
            <BrandText
              key={seed}
              style={[fontSemibold14, { textAlign: "center", width: "25%" }]}
            >
              {seed}
            </BrandText>
          ))}
        </BlurViewWrapper>
      </View>
    </View>
  );
};
