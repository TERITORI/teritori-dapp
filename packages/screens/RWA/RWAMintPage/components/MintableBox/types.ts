export type UpperSectionProps = {
  totalPrice: string;
  availableBalance: string;
};

export type LowerSectionProps = {
  isMintable: boolean;
  onPressMint: () => void;
  disabledMintButton?: boolean;
};

export type MintableBoxProps = UpperSectionProps & LowerSectionProps;
