import { ImageSourcePropType } from "react-native";

import { CountryType } from "../../../utils/allCountries";

export interface FreelanceServicePriceType {
  value: number;
  currency: "TORI";
}

export interface SellerInfo {
  id: string;
  avatar: string; //ipfs id
  firstName: string;
  lastName: string;
  description: string;
  profilePicture: string; //ipfs id
  occupations: Occupation[];
  languages: LangInfo[];
  skills: SkillInfo[];
  educations: EducationInfo[];
  certifications: CertificationInfo[]
  personalSite: string;
}

export const emptySeller:SellerInfo = {
  id: "",
  avatar: "",
  firstName: "",
  lastName: "",
  description: "",
  profilePicture: "",
  occupations: [],
  languages: [],
  skills: [],
  educations: [],
  certifications: [],
  personalSite: ""
} as SellerInfo;

export interface User {
  id: string;
  backgroundPic: ImageSourcePropType;
  profilePic: string;
  username: string;
  levelText: string;
  intro: string;
  isFavorite: boolean;
  rating: number;
  totalQueue: number;
  totalReviews: number;
  country: CountryType;
  onlineStatus: "online" | "offline";
  createDate: Date;
  tagline: string;
  portfolios: string[];
  times: {
    avgResponseTime: string;
    lastDelivery: string;
  };
  languages: LangInfo[];
  linkedAccounts: [
    {
      type: "twitter" | "github";
      url: string;
    }
  ];
  skills: string[];
  education: [
    {
      country: string;
      universityName: string;
      title: string;
      major: string;
      year: number;
    }
  ];
  certifications: [
    {
      name: string;
      from: string;
      year: number;
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
  serviceLevels: ServiceLevels[];
}

export interface ReviewType {
  id: string;
  user: User;
  rating: number;
  date: string; // TODO: decide if string or date (for momentJS type of dates
  text: string;
}

export interface ServiceLevelsExtra {
  text: string;
  description: string;
  price: FreelanceServicePriceType;
}

export interface ServiceLevels {
  text: string;
  description: string;
  price: FreelanceServicePriceType;
  daysToDelivery: number;
  maximumRevisions: number;
  included: string[];
  extras: ServiceLevelsExtra[];
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

export interface FilterOptionType {
  text: string;
  checkables: CheckableType[];
}

export interface CheckableType {
  text: string;
  checked: boolean;
  count: number;
}

export interface Occupation {
  occupationId: string;
  occupationNames: string[];
  from: number;
  to: number;
}

export interface LangInfo {
  name: string;
  level: string;
}
export interface SkillInfo{
  name: string;
  level: string;
}

export interface EducationInfo {
  country: string;
  universityName: string;
  title: string;
  major: string;
  year: number;
}

export interface CertificationInfo {
  name: string;
  from: string;
  year: number;
}
