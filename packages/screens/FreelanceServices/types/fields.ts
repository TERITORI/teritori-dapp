import { ImageSourcePropType } from "react-native";

import { CountryType } from "../../../utils/allCountries";

export interface FreelanceServicePriceType {
  value: number;
  currency: "TORI";
}

export interface User {
  id: string;
  backgroundPic: ImageSourcePropType;
  profilePic: ImageSourcePropType;
  username: string;
  levelText: string;
  intro: string;
  isFavorite: boolean;
  rating: number;
  totalQueue: number;
  totalReviews: number;
  country: CountryType["name"];
  onlineStatus: "online" | "offline";
  createDate: Date;
  tagline: string;
  languages: [
    {
      title: string;
      description: string;
    }
  ];
  linkedAccounts: [
    {
      type: "twitter" | "github";
      url: string;
    }
  ];
  skills: string[];
  education: [
    {
      title: string;
      description: string;
    }
  ];
  certifications: [
    {
      title: string;
      description: string;
    }
  ];
}

export interface ServiceFields {
  id: string;
  user: User;
  title: string;
  description: string;
  pricePreText: string;
  isFavorite: boolean;
  price: FreelanceServicePriceType;
  reviews?: ReviewFields;
  tags?: string[];
  serviceLevels?: ServiceLevels[];
}

export interface ReviewType {
  id: string;
  user: User;
  rating: number;
  date: string; // TODO: decide if string or date (for momentJS type of dates
  text: string;
}

export interface ServiceLevels {
  text: string;
  description: string;
  price: FreelanceServicePriceType;
  daysToDelivery: number;
  maximumRevisions: number;
  included: string[];
}

export interface ReviewFields {
  stats: {
    starsCount: number[];
    total: number;
    avgRating: {
      total: number;
      communication: number;
      recommendToFriend: number;
      serviceAsDescribed: number;
    };
  };
  items: ReviewType[];
}
