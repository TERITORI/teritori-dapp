import React from "react";
import { View } from "react-native";

import { useMakeRequestState } from "../hooks/useMakeRequestHook";
import FlexRow from "../../../components/FlexRow";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { Separator } from "../../../components/separators/Separator";
import { layout } from "../../../utils/style/layout";

export const MakeRequestFooter: React.FC<{
  onSubmit: () => void;
  disableNext: boolean;
}> = (props) => {
  const {
    actions: { goPrevStep },
  } = useMakeRequestState();

  return (
    <View>
      <Separator
        style={{
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
