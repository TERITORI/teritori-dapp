import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { LoaderFullSize } from "@/components/loaders/LoaderFullScreen";
import { useRakkiInfo } from "@/hooks/rakki/useRakkiInfo";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { GameBox } from "@/screens/Rakki/components/GameBox";
import { Help } from "@/screens/Rakki/components/Help";
import { PrizeInfo } from "@/screens/Rakki/components/PrizeInfo";
import { RakkiHistory } from "@/screens/Rakki/components/RakkiHistory";
import { RakkiLogo } from "@/screens/Rakki/components/RakkiLogo";
import { TicketsRemaining } from "@/screens/Rakki/components/TicketsRamaining";
import { sectionLabelCStyle } from "@/screens/Rakki/styles";
import { ScreenFC } from "@/utils/navigation";
import { layout } from "@/utils/style/layout";

export const RakkiScreen: ScreenFC<"Rakki"> = () => {
  const networkId = useSelectedNetworkId();
  const { height } = useMaxResolution();
  const { rakkiInfo } = useRakkiInfo(networkId);
  let content;
  if (rakkiInfo === undefined) {
    content = (
      <View style={{ height }}>
        <LoaderFullSize />
      </View>
    );
  } else if (rakkiInfo === null) {
    content = (
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 100,
        }}
      >
        <BrandText style={sectionLabelCStyle}>
          RAKKi is not deployed on this network
        </BrandText>
      </View>
    );
  } else {
    content = (
      <>
        <RakkiLogo style={{ marginTop: 100 }} />
        <PrizeInfo
          info={rakkiInfo}
          networkId={networkId}
          style={{ marginTop: 50 }}
        />
        <TicketsRemaining
          info={rakkiInfo}
          style={{ marginTop: layout.spacing_x4 }}
        />
        <GameBox
          info={rakkiInfo}
          networkId={networkId}
          style={{ marginTop: layout.spacing_x4 }}
        />
        <Help style={{ marginTop: 60 }} />
        <RakkiHistory
          info={rakkiInfo}
          networkId={networkId}
          style={{ marginTop: 60 }}
        />
      </>
    );
  }
  return (
    <ScreenContainer
      footerChildren={rakkiInfo === undefined ? <></> : undefined}
    >
      <View style={{ width: "100%", maxWidth: 664, alignSelf: "center" }}>
        {content}
      </View>
    </ScreenContainer>
  );
};
