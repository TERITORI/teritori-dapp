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
  certifications: CertificationInfo[];
  personalSite: string;
}
export interface PackageInfo {
  title: string;
  desc: string;
  deliveryTime: string; //index
  delivery: string;
  numberOfPages: string;
  designCustomization: boolean;
  contentUpload: boolean;
  responsiveDesign: boolean;
  includeSourceCode: boolean;
  revisions: string; //number | index
  price: string;
}
export interface ExtraFast {
  expectedDuration: string;
  price: string;
}
export interface Faq {
  question: string;
  answer: string;
}
export interface Question {
  question: string;
  required: boolean;
  questionForm: string;
}
export interface GigInfo {
  //overview
  title: string;
  category: string;
  subCategory: string;
  serviceType: string;
  websiteType: string[];
  platformToolType: string[];
  positiveKeywords: string[];
  //pricing
  basicPackage: PackageInfo;
  standardPackage: PackageInfo;
  premiumPackage: PackageInfo;
  //pricing - extraservices
  extraFastBasic: ExtraFast;
  extraFastStandard: ExtraFast;
  extraFastPremium: ExtraFast;
  additionalPage: ExtraFast | null;
  responsiveDesign: ExtraFast | null;
  includeSourceCode: string | null;
  additionalRevision: ExtraFast | null;
  //description & faq
  description: string;
  faq: Faq[];
  //requirement
  questions: Question[];

  //gallery
  images: string[]; //ipfs_hash
  video: string; //ipfs_hash
  documents: string[]; //ipfs_hash
}
export const emptyPackageInfo: PackageInfo = {
  title: "",
  desc: "",
  deliveryTime: "",
  delivery: "",
  numberOfPages: "",
  designCustomization: false,
  contentUpload: false,
  responsiveDesign: false,
  includeSourceCode: false,
  revisions: "", //number | index
  price: "0", //number
};

export const emptyGigInfo: GigInfo = {
  title: "",
  category: "",
  subCategory: "",
  serviceType: "",
  websiteType: [],
  platformToolType: [],
  positiveKeywords: ["Landing Page", "Product Design"],
  //pricing
  basicPackage: emptyPackageInfo,
  standardPackage: emptyPackageInfo,
  premiumPackage: emptyPackageInfo,
  //pricing - extraservices
  extraFastBasic: {
    price: "0",
    expectedDuration: "",
  },
  extraFastStandard: {
    price: "0",
    expectedDuration: "",
  },
  extraFastPremium: {
    price: "0",
    expectedDuration: "",
  },
  additionalPage: null,
  responsiveDesign: null,
  includeSourceCode: null,
  additionalRevision: null,
  //description & faq
  description: "",
  faq: [],
  questions: [],
  //gallery
  images: [], //ipfs_hash
  video: "", //ipfs_hash
  documents: [], //ipfs_hash
};

export const emptySeller: SellerInfo = {
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
  personalSite: "",
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
export interface SkillInfo {
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
