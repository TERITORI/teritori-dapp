import { PropsWithChildren } from "react";
import { View, SafeAreaView } from "react-native";

import teritoriSVG from "../../../../assets/icons/teritori-white.svg";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import { ProgressLine2 } from "../components/ProgressLine2";

interface MultiStepScreenProps extends PropsWithChildren {
  screenPercentage: number;
}

export default function MultiStepScreenContainer({
  screenPercentage,
  children,
}: MultiStepScreenProps) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#000000",
      }}
    >
      <View>
        <SVG
          source={teritoriSVG}
          height={40}
          width={40}
          style={{ alignSelf: "center" }}
        />
        <SpacerColumn size={2} />
        <ProgressLine2 percent={screenPercentage} />
      </View>
      {children}
    </SafeAreaView>
  );
}
