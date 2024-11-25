import React from "react";
import { View } from "react-native";

import FlexRow from "../../../components/FlexRow";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { Separator } from "../../../components/separators/Separator";
import { layout } from "../../../utils/style/layout";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";

const DEFAULT_WIDTH = 120;

export const MakeRequestFooter: React.FC<{
  onSubmit: () => void;
  disableNext: boolean;
  nextText?: string;
  backText?: string;
  width?: number;
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
          width={props?.width || DEFAULT_WIDTH}
        />
        <PrimaryButton
          onPress={props.onSubmit}
          text={props.nextText || "Next"}
          size="SM"
          width={props?.width || DEFAULT_WIDTH}
          disabled={props.disableNext}
        />
      </FlexRow>
    </View>
  );
};
