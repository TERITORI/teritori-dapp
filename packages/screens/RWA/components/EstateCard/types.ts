import { StyleProp, ViewStyle } from "react-native";

import { BoxStyle } from "../../../../components/boxes/Box";

export type EstateCardBadgesProps = {
  tags: string[];
};

type EstateInformations = {
  id: string;
  title: string;
  totalInvestment: string;
  estAPY: string;
  estAPYPerToken: string;
  rentalStartDate: string;

  isComingSoon?: boolean;
};
export type EstateCardInformationsProps = {
  card: EstateInformations;
};

export type EstateCardProps = EstateCardBadgesProps &
  EstateCardInformationsProps & { style?: StyleProp<BoxStyle> };

export type EstateCardImageProps = {
  sourceURI: string;
};

export type EstateCardInformationBoxProps = {
  label: string;
  value: string;
  style?: StyleProp<BoxStyle>;
};

export type EstateCardListProps = {
  cards: EstateCardProps[];
  title: string;
  style?: StyleProp<ViewStyle>;
};
