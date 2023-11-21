import { ViewStyle } from "react-native";

export type EstateCardTagsProps = {
  tags: string[];
};

export enum RentalStatusEnum {
  RENTED = "RENTED",
  NOT_RENTED = "NOT_RENTED",
}

type EstateInformations = {
  id: string;
  title: string;
  totalInvestment: string;
  estAPY: string;
  estAPYPerToken: string;
  rentalStartDate: string;

  totalTokens?: number;
  rentalStatus?: RentalStatusEnum;
  isComingSoon?: boolean;

  myTokens?: number;
  myTargetROI?: string;
  myCollectedROI?: string;
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

export type PortfolioEstateCardProps = { cards: EstateCardProps[] };

// TODO: refracto after contract integration, types will probably be wrong
