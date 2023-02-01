import { ImageSourcePropType } from "react-native";

import { CountryType } from "../../../utils/allCountries";

export interface FreelanceServicePriceType {
  value: number;
  currency: "TORI";
}

export interface User {
  backgroundPic: ImageSourcePropType;
  profilePic: ImageSourcePropType;
  username: string;
  description: string;
  intro: string;
  isFavorite: boolean;
  rating: number;
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
  description: string;
  pricePreText: string;
  price: FreelanceServicePriceType;
  reviews?: ReviewFields[];
  tags?: string[];
}

export interface ReviewFields {
  id: string;
  user: User;
  rating: number;
  date: Date;
  text: string;
}
