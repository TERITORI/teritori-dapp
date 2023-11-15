import { LowerSection } from "./LowerSection";
import { UpperSection } from "./UpperSection";
import { MintableBoxProps } from "./types";
import { TertiaryBox } from "../../../../../components/boxes/TertiaryBox";
import { useTheme } from "../../../../../hooks/useTheme";

export const MintableBox: React.FC<MintableBoxProps> = ({
  isMintable,
  totalPrice,
  availableBalance,
  onPressMint,
  disabledMintButton = false,
}) => {
  const theme = useTheme();

  return (
    <TertiaryBox
      mainContainerStyle={{
        backgroundColor: theme.headerBackgroundColor,
        borderColor: theme.borderColor,
      }}
      noBrokenCorners
      fullWidth
    >
      {/* Upper section */}
      <UpperSection
        totalPrice={totalPrice}
        availableBalance={availableBalance}
      />

      {/* Lower section */}
      <LowerSection
        isMintable={isMintable}
        onPressMint={onPressMint}
        disabledMintButton={disabledMintButton}
      />
    </TertiaryBox>
  );
};
