import { useState } from "react";
import { TextInput, View, ViewStyle } from "react-native";

import { CircleButton } from "./CircleButton";
import { LowerSectionProps } from "./types";
import minusSVG from "../../../../../../assets/icons/minus.svg";
import plusSVG from "../../../../../../assets/icons/plus.svg";
import FlexRow from "../../../../../components/FlexRow";
import { PrimaryButton } from "../../../../../components/buttons/PrimaryButton";
import { SpacerRow } from "../../../../../components/spacer";
import { useTheme } from "../../../../../hooks/useTheme";
import { fontSemibold14 } from "../../../../../utils/style/fonts";
import { layout } from "../../../../../utils/style/layout";

export const LowerSection: React.FC<LowerSectionProps> = ({
  isMintable,
  onPressMint,
  disabledMintButton,
}) => {
  const [totalBulkMint, setTotalBulkMint] = useState(1);
  const updateTotalBulkMint = (newTotalBulkMint: number | string) => {
    const numOnlyRegexp = new RegExp(/^\d+$/);
    if (!numOnlyRegexp.test("" + newTotalBulkMint)) {
      return;
    }

    const MAX_BULK = 99;

    let totalBulkMint = +newTotalBulkMint;
    if (+newTotalBulkMint < 1) {
      totalBulkMint = 1;
    } else if (totalBulkMint > MAX_BULK) {
      totalBulkMint = MAX_BULK;
    }

    setTotalBulkMint(totalBulkMint);
  };

  const theme = useTheme();

  return (
    <FlexRow style={flexRowCStyle}>
      {isMintable && (
        <View style={inputContainerCStyle}>
          <CircleButton
            icon={minusSVG}
            onPress={() => updateTotalBulkMint(totalBulkMint - 1)}
          />
          <SpacerRow size={1} />
          <TextInput
            value={"" + totalBulkMint}
            onChangeText={(val) => updateTotalBulkMint(+val)}
            style={[
              { color: theme.textColor, width: 20, textAlign: "center" },
              fontSemibold14,
            ]}
          />
          <SpacerRow size={1} />
          <CircleButton
            icon={plusSVG}
            onPress={() => updateTotalBulkMint(totalBulkMint + 1)}
          />
        </View>
      )}

      {/* Separator */}
      <View
        style={[separatorCStyle, { borderRightColor: theme.borderColor }]}
      />

      {/* Mint Button */}
      <View style={{ flexDirection: "row", marginVertical: layout.spacing_x2 }}>
        <SpacerRow size={2} />
        {isMintable && (
          <PrimaryButton
            size="M"
            text="Mint"
            squaresBackgroundColor={theme.backgroundColor}
            color={theme.primaryButtonColor}
            width={232}
            disabled={disabledMintButton}
            loader
            onPress={onPressMint}
          />
        )}
      </View>
    </FlexRow>
  );
};

const flexRowCStyle: ViewStyle = {
  width: "100%",
  paddingHorizontal: layout.spacing_x2,
  alignItems: "center",
  justifyContent: "space-between",
};

const inputContainerCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: layout.spacing_x2,
};

const separatorCStyle: ViewStyle = {
  borderRightWidth: 1,
  height: layout.spacing_x4,
  marginLeft: layout.spacing_x1_5,
};
