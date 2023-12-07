import { useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { View } from "react-native";

import { Milestones } from "./Milestones";
import { Preview } from "./Preview";
import { ShortPresentation } from "./ShortPresentation";
import { TeamAndLinks } from "./TeamAndLinks";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { Breadcrumb } from "../components/Breadcrumb";
import { HeaderBackButton } from "../components/HeaderBackButton";

export const GrantsProgramMakeRequestScreen: ScreenFC<
  "GrantsProgramMakeRequest"
> = () => {
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
        {stepIndice === 4 && <Preview />}
      </View>
    </ScreenContainer>
  );
};
