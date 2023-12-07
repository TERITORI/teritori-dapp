import React from "react";
import { View, useWindowDimensions } from "react-native";

import { useMakeRequestState } from "./useMakeRequestHook";
import FlexRow from "../../../components/FlexRow";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { Separator } from "../../../components/separators/Separator";
import { layout } from "../../../utils/style/layout";

export const MakeRequestFooter: React.FC<{
  onSubmit: () => void;
  disableNext: boolean;
}> = (props) => {
  const { width } = useWindowDimensions();
  const {
    actions: { goPrevStep },
  } = useMakeRequestState();

  return (
    <View>
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
          onPress={goPrevStep}
          text="Back"
          size="SM"
          width={120}
        />
        <PrimaryButton
          onPress={props.onSubmit}
          text="Next"
          size="SM"
          width={120}
          disabled={props.disableNext}
        />
      </FlexRow>
    </View>
  );
};
