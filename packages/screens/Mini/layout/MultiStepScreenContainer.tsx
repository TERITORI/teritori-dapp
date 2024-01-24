import { PropsWithChildren } from "react";
import { View, SafeAreaView } from "react-native";

import chevronLeftSVG from "../../../../assets/icons/chevron-left.svg";
import teritoriSVG from "../../../../assets/icons/teritori-white.svg";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn } from "../../../components/spacer";
import { useAppNavigation } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { ProgressLine2 } from "../components/ProgressLine2";

interface MultiStepScreenProps extends PropsWithChildren {
  screenPercentage: number;
  enableBack?: boolean;
}

export default function MultiStepScreenContainer({
  screenPercentage,
  enableBack = false,
  children,
}: MultiStepScreenProps) {
  const navigation = useAppNavigation();

  const navigateBack = () => navigation.canGoBack() && navigation.goBack();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#000000",
      }}
    >
      <View>
        {enableBack ? (
          <View style={{ paddingHorizontal: layout.spacing_x2 }}>
            <CustomPressable
              onPress={navigateBack}
              style={{ height: 24, width: 24 }}
            >
              <SVG source={chevronLeftSVG} height={24} width={24} />
            </CustomPressable>
          </View>
        ) : (
          <SVG
            source={teritoriSVG}
            height={40}
            width={40}
            style={{ alignSelf: "center" }}
          />
        )}
        <SpacerColumn size={2} />
        <ProgressLine2 percent={screenPercentage} />
      </View>
      {children}
    </SafeAreaView>
  );
}
