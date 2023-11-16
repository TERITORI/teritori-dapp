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
  deliveryTime: string;
  contents: ContentInfo[];
  price: string;
}
export interface ContentInfo {
  id: string;
  active: boolean;
  edit_type: EditType;
  title: string;
  data_value: string | null;
  data_options: DataOptions[] | null;
}
export interface DataOptions {
  value: number;
  text: string;
  val: number;
}
export enum EditType {
  DROPDOWN = "dropdown",
  CHECKBOX = "checkbox",
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
export enum PriceContentType {
  basic,
  standard,
  premium,
}

export interface GigInfo {
  id?: string;
  address: string;
  //
  profileHash: string;
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
  additionalRevision: ExtraFast | null;
  //description & faq
  description: string;
  faq: Faq[];
  //requirement
  questions: Question[];
  includeSourceCode: string | null;

  //gallery
  images: string[]; //ipfs_hash
  video: string; //ipfs_hash
  documents: string[]; //ipfs_hash
  approveLicense: boolean;
}
export const emptyPackageInfo: PackageInfo = {
  title: "",
  desc: "",
  deliveryTime: "",
  contents: [
    {
      id: "number_of_pages",
      active: false,
      edit_type: EditType.DROPDOWN,
      title: "Number of pages",
      data_value: null,
      data_options: [
        { value: 1, text: "1", val: 1 },
        { value: 2, text: "2", val: 2 },
        { value: 3, text: "3", val: 3 },
        { value: 4, text: "4", val: 4 },
        { value: 5, text: "5", val: 5 },
        { value: 6, text: "6", val: 6 },
        { value: 7, text: "7", val: 7 },
        { value: 8, text: "8", val: 8 },
        { value: 9, text: "9", val: 9 },
      ],
    } as ContentInfo,
    {
      id: "design_customization",
      active: false,
      edit_type: EditType.CHECKBOX,
      title: "Design customization",
      data_value: null,
      data_options: null,
    } as ContentInfo,
    {
      id: "content_upload",
      active: false,
      edit_type: EditType.CHECKBOX,
      title: "Content upload",
      data_value: null,
      data_options: null,
    } as ContentInfo,
    {
      id: "responsive_design",
      active: false,
      edit_type: EditType.CHECKBOX,
      title: "Responsive design",
      data_value: null,
      data_options: null,
    } as ContentInfo,
    {
      id: "include_source_code",
      active: false,
      edit_type: EditType.CHECKBOX,
      title: "Include Source code",
      data_value: null,
      data_options: null,
    } as ContentInfo,
    {
      id: "revisions",
      active: false,
      edit_type: EditType.DROPDOWN,
      title: "Revisions",
      data_value: null,
      data_options: [
        { value: 0, text: "0", val: 0 },
        { value: 1, text: "1", val: 1 },
        { value: 2, text: "2", val: 2 },
        { value: 3, text: "3", val: 3 },
        { value: 4, text: "4", val: 4 },
        { value: 5, text: "5", val: 5 },
        { value: 6, text: "6", val: 6 },
        { value: 7, text: "7", val: 7 },
        { value: 8, text: "8", val: 8 },
        { value: 9, text: "9", val: 9 },
      ],
    } as ContentInfo,
  ],

  price: "0", //number
};

export const emptyGigInfo: GigInfo = {
  address: "",
  profileHash: "",
  title: "",
  category: "",
  subCategory: "",
  serviceType: "",
  websiteType: [],
  platformToolType: [],
  positiveKeywords: ["Landing Page", "Product Design"],
  //pricing
  basicPackage: {
    title: "",
    desc: "",
    deliveryTime: "",
    contents: [
      {
        id: "number_of_pages",
        active: false,
        edit_type: EditType.DROPDOWN,
        title: "Number of pages",
        data_value: null,
        data_options: [
          { value: 1, text: "1", val: 1 },
          { value: 2, text: "2", val: 2 },
          { value: 3, text: "3", val: 3 },
          { value: 4, text: "4", val: 4 },
          { value: 5, text: "5", val: 5 },
          { value: 6, text: "6", val: 6 },
          { value: 7, text: "7", val: 7 },
          { value: 8, text: "8", val: 8 },
          { value: 9, text: "9", val: 9 },
        ],
      } as ContentInfo,
      {
        id: "design_customization",
        active: false,
        edit_type: EditType.CHECKBOX,
        title: "Design customization",
        data_value: null,
        data_options: null,
      } as ContentInfo,
      {
        id: "content_upload",
        active: false,
        edit_type: EditType.CHECKBOX,
        title: "Content upload",
        data_value: null,
        data_options: null,
      } as ContentInfo,
      {
        id: "responsive_design",
        active: false,
        edit_type: EditType.CHECKBOX,
        title: "Responsive design",
        data_value: null,
        data_options: null,
      } as ContentInfo,
      {
        id: "include_source_code",
        active: false,
        edit_type: EditType.CHECKBOX,
        title: "Include Source code",
        data_value: null,
        data_options: null,
      } as ContentInfo,
      {
        id: "revisions",
        active: false,
        edit_type: EditType.DROPDOWN,
        title: "Revisions",
        data_value: null,
        data_options: [
          { value: 0, text: "0", val: 0 },
          { value: 1, text: "1", val: 1 },
          { value: 2, text: "2", val: 2 },
          { value: 3, text: "3", val: 3 },
          { value: 4, text: "4", val: 4 },
          { value: 5, text: "5", val: 5 },
          { value: 6, text: "6", val: 6 },
          { value: 7, text: "7", val: 7 },
          { value: 8, text: "8", val: 8 },
          { value: 9, text: "9", val: 9 },
        ],
      } as ContentInfo,
    ],
    price: "0", //number
  },
  standardPackage: {
    title: "",
    desc: "",
    deliveryTime: "",
    contents: [
      {
        id: "number_of_pages",
        active: false,
        edit_type: EditType.DROPDOWN,
        title: "Number of pages",
        data_value: null,
        data_options: [
          { value: 1, text: "1", val: 1 },
          { value: 2, text: "2", val: 2 },
          { value: 3, text: "3", val: 3 },
          { value: 4, text: "4", val: 4 },
          { value: 5, text: "5", val: 5 },
          { value: 6, text: "6", val: 6 },
          { value: 7, text: "7", val: 7 },
          { value: 8, text: "8", val: 8 },
          { value: 9, text: "9", val: 9 },
        ],
      } as ContentInfo,
      {
        id: "design_customization",
        active: false,
        edit_type: EditType.CHECKBOX,
        title: "Design customization",
        data_value: null,
        data_options: null,
      } as ContentInfo,
      {
        id: "content_upload",
        active: false,
        edit_type: EditType.CHECKBOX,
        title: "Content upload",
        data_value: null,
        data_options: null,
      } as ContentInfo,
      {
        id: "responsive_design",
        active: false,
        edit_type: EditType.CHECKBOX,
        title: "Responsive design",
        data_value: null,
        data_options: null,
      } as ContentInfo,
      {
        id: "include_source_code",
        active: false,
        edit_type: EditType.CHECKBOX,
        title: "Include Source code",
        data_value: null,
        data_options: null,
      } as ContentInfo,
      {
        id: "revisions",
        active: false,
        edit_type: EditType.DROPDOWN,
        title: "Revisions",
        data_value: null,
        data_options: [
          { value: 0, text: "0", val: 0 },
          { value: 1, text: "1", val: 1 },
          { value: 2, text: "2", val: 2 },
          { value: 3, text: "3", val: 3 },
          { value: 4, text: "4", val: 4 },
          { value: 5, text: "5", val: 5 },
          { value: 6, text: "6", val: 6 },
          { value: 7, text: "7", val: 7 },
          { value: 8, text: "8", val: 8 },
          { value: 9, text: "9", val: 9 },
        ],
      } as ContentInfo,
    ],

    price: "0", //number
  },
  premiumPackage: {
    title: "",
    desc: "",
    deliveryTime: "",
    contents: [
      {
        id: "number_of_pages",
        active: false,
        edit_type: EditType.DROPDOWN,
        title: "Number of pages",
        data_value: null,
        data_options: [
          { value: 1, text: "1", val: 1 },
          { value: 2, text: "2", val: 2 },
          { value: 3, text: "3", val: 3 },
          { value: 4, text: "4", val: 4 },
          { value: 5, text: "5", val: 5 },
          { value: 6, text: "6", val: 6 },
          { value: 7, text: "7", val: 7 },
          { value: 8, text: "8", val: 8 },
          { value: 9, text: "9", val: 9 },
        ],
      } as ContentInfo,
      {
        id: "design_customization",
        active: false,
        edit_type: EditType.CHECKBOX,
        title: "Design customization",
        data_value: null,
        data_options: null,
      } as ContentInfo,
      {
        id: "content_upload",
        active: false,
        edit_type: EditType.CHECKBOX,
        title: "Content upload",
        data_value: null,
        data_options: null,
      } as ContentInfo,
      {
        id: "responsive_design",
        active: false,
        edit_type: EditType.CHECKBOX,
        title: "Responsive design",
        data_value: null,
        data_options: null,
      } as ContentInfo,
      {
        id: "include_source_code",
        active: false,
        edit_type: EditType.CHECKBOX,
        title: "Include Source code",
        data_value: null,
        data_options: null,
      } as ContentInfo,
      {
        id: "revisions",
        active: false,
        edit_type: EditType.DROPDOWN,
        title: "Revisions",
        data_value: null,
        data_options: [
          { value: 0, text: "0", val: 0 },
          { value: 1, text: "1", val: 1 },
          { value: 2, text: "2", val: 2 },
          { value: 3, text: "3", val: 3 },
          { value: 4, text: "4", val: 4 },
          { value: 5, text: "5", val: 5 },
          { value: 6, text: "6", val: 6 },
          { value: 7, text: "7", val: 7 },
          { value: 8, text: "8", val: 8 },
          { value: 9, text: "9", val: 9 },
        ],
      } as ContentInfo,
    ],
    price: "0", //number
  },
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
  additionalRevision: null,
  //description & faq
  description: "",
  faq: [],
  questions: [],
  includeSourceCode: null,
  //gallery
  images: [], //ipfs_hash
  video: "", //ipfs_hash
  documents: [], //ipfs_hash
  approveLicense: false,
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

export interface SellerUser {
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
  skills: SkillInfo[];
  education: EducationInfo[];
  certifications: CertificationInfo[];
}

export interface GigData {
  id: string;
  sellerAddress: string;
  sellerUser: SellerUser;
  title: string;
  description: string;
  pricePreText: string;
  isFavorite: boolean;
  price: FreelanceServicePriceType;
  reviews?: ReviewFields;
  tags?: string[];
  serviceLevels: ServiceLevel[];
}

export interface ReviewType {
  id: string;
  sellerUser: SellerUser;
  rating: number;
  date: string; // TODO: decide if string or date (for momentJS type of dates
  text: string;
}

export interface ServiceLevelExtra {
  text: string;
  description: string;
  price: FreelanceServicePriceType;
}

export interface ServiceLevel {
  text: string;
  description: string;
  price: FreelanceServicePriceType;
  daysToDelivery: string;
  maximumRevisions: string;
  included: string[];
  extras: ServiceLevelExtra[];
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
