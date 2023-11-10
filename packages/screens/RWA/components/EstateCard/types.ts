import { ViewStyle } from "react-native";

export type EstateCardTagsProps = {
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

export type EstateCardProps = EstateCardTagsProps & EstateCardInformationsProps;

export type EstateCardImageProps = {
  sourceURI: string;
};

export type EstateCardInformationBoxProps = {
  label: string;
  value: string;
  secondary?: boolean;
  style?: ViewStyle;
};

export type EstateCardListProps = {
  cards: EstateCardProps[];
  title: string;
};
