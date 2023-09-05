import { useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { Breadcrumb } from "../components/Breadcrumb";
import { HeaderBackButton } from "../components/HeaderBackButton";

export const GrantsProgramMakeRequestScreen: ScreenFC<
  "GrantsProgramMakeRequest"
> = () => {
  const { width } = useWindowDimensions();
  const route = useRoute();
  const { step } = route.params as any;
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

      <BrandText>Test</BrandText>

      <Separator
        style={{
          // NOTE: trick to get full width on responsible/large ScreenContainer
          marginLeft: -140,
          width: width + 140,
          marginVertical: layout.spacing_x2,
        }}
      />

      <FlexRow style={{ justifyContent: "space-between" }}>
        <SecondaryButton text="Back" size="SM" width={120} />
        <PrimaryButton text="Next" size="SM" width={120} />
      </FlexRow>
    </ScreenContainer>
  );
};
