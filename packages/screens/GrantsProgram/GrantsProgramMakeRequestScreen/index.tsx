import { useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { View, useWindowDimensions } from "react-native";

import { Milestones } from "./Milestones";
import { ShortPresentation } from "./ShortPresentation";
import { TeamAndLinks } from "./TeamAndLinks";
import FlexRow from "../../../components/FlexRow";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { Breadcrumb } from "../components/Breadcrumb";
import { HeaderBackButton } from "../components/HeaderBackButton";

export const GrantsProgramMakeRequestScreen: ScreenFC<
  "GrantsProgramMakeRequest"
> = () => {
  const navigation = useAppNavigation();
  const { width } = useWindowDimensions();
  const route = useRoute();
  const step = !route.params ? 1 : (route.params as any).step;
  const stepIndice = useMemo(() => {
    let res = step ? parseInt(step, 10) : 1;
    res = Number.isInteger(res) ? res : 1;
    res = res > 5 || res < 0 ? 1 : res;
    return res;
  }, [step]);

  return (
    <ScreenContainer isLarge responsive headerChildren={<HeaderBackButton />}>
      <Breadcrumb
        stepIndice={stepIndice}
        containerStyle={{ marginTop: layout.spacing_x2 }}
      />

      <SpacerColumn size={4} />

      {/* Main view============================================================ */}
      <View style={{ width: "100%" }}>
        {stepIndice === 1 && <ShortPresentation />}
        {stepIndice === 2 && <TeamAndLinks />}
        {stepIndice === 3 && <Milestones />}
      </View>

      <Separator
        style={{
          // NOTE: trick to get full width on responsible/large ScreenContainer
          marginLeft: -140,
          width: width + 140,
          marginVertical: layout.spacing_x2,
        }}
      />

      <FlexRow style={{ justifyContent: "space-between" }}>
        <SecondaryButton
          onPress={() =>
            navigation.navigate("GrantsProgramMakeRequest", {
              step: Math.max(stepIndice - 1, 1),
            })
          }
          text="Back"
          size="SM"
          width={120}
        />
        <PrimaryButton
          onPress={() =>
            navigation.navigate("GrantsProgramMakeRequest", {
              step: Math.min(stepIndice + 1, 5),
            })
          }
          text="Next"
          size="SM"
          width={120}
        />
      </FlexRow>
    </ScreenContainer>
  );
};
