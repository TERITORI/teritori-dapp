import axios from "axios";

import serviceBackground from "../../../../assets/banners/freelance-service/service-card-background.png";
import {
  CheckableType,
  ContentInfo,
  FilterOptionType,
  FreelanceServicePriceType,
  GigInfo,
  SellerInfo,
  GigData,
  ServiceLevel,
  SellerUser,
} from "../../../components/freelanceServices/types/fields";
import { allCountries } from "../../../utils/allCountries";
import { ipfsURLToHTTPURL } from "../../../utils/ipfs";

// export function getServiceListing(): ServiceFields[] {
//   return [
//     {
//       user: getUser("id123"),
//       id: "id123",
//       title: "I will do modern timeless logo design",
//       description: "description: I will do modern timeless logo design",
//       pricePreText: "Starting at",
//       isFavorite: false,
//       price: {
//         value: 50.0,
//         currency: "TORI",
//       },
//       tags: ["minimalist", "logo", "business", "vector"],
//       serviceLevels: [],
//     },
//   ];
// }
// export function getService(id: string): ServiceFields {
//   return {
//     user: getUser(id),
//     id,
//     title: "I will do modern timeless logo design",
//     description: "Lorem ",
//     pricePreText: "Starting at",
//     price: {
//       value: 50.0,
//       currency: "TORI",
//     },
//     isFavorite: true, // this is meant to be resolved as: does the current logged user liked this service
//     tags: ["minimalist", "logo", "business", "vector"],
//     serviceLevels,
//     reviews: {
//       stats: {
//         total: 100,
//         starsCount: [1, 9, 10, 40, 50],
//         avgRating: {
//           total: 4.9,
//           communication: 4.5,
//           recommendToFriend: 4.4,
//           serviceAsDescribed: 4,
//         },
//       },
//       items: [
//         {
//           id: "aoeu",
//           user: getUser(id),
//           date: new Date().toLocaleDateString(),
//           rating: 2,
//           text: "Pretty bad..",
//         },
//         {
//           id: "aoeu",
//           user: getUser(id),
//           date: new Date().toLocaleDateString(),
//           rating: 5,
//           text: "Great",
//         },
//       ],
//     },
//   };
// }

export const getSellerUser = async (ipfsHash: string): Promise<SellerUser> => {
  const profile_json_res = await axios.get(ipfsURLToHTTPURL(ipfsHash));
  const sellerProfile = profile_json_res.data as SellerInfo;
  return {
    id: ipfsHash,
    backgroundPic: serviceBackground,
    profilePic: sellerProfile.profilePicture,
    username: `${sellerProfile.firstName} ${sellerProfile.lastName}`,
    levelText: "Level 2 Seller",
    isFavorite: false,
    intro: sellerProfile.description,
    tagline: "Tag line here",
    rating: 4.9,
    times: {
      avgResponseTime: "2 hours",
      lastDelivery: "about 11 minutes",
    },
    totalReviews: 666,
    country: {
      name: "Argentina",
      alpha: "ar",
      "country-code": "54",
    },
    onlineStatus: "online",
    portfolios: [],
    createDate: new Date(),
    totalQueue: 5,
    languages: sellerProfile.languages,
    linkedAccounts: [
      {
        type: "twitter",
        url: "https://twitter.com",
      },
    ],
    skills: sellerProfile.skills,
    education: sellerProfile.educations,
    certifications: sellerProfile.certifications,
  };
};

// const serviceLevels: ServiceLevels[] = [
//   {
//     text: "Basic",
//     price: {
//       value: 500,
//       currency: "TORI",
//     },
//     description: "Basic baby",
//     daysToDelivery: 5,
//     maximumRevisions: 3,
//     included: ["4 concepts included", "Logo transparency"],
//     extras: [
//       {
//         text: "Additional revision",
//         description:
//           "Add an additional revision your seller will provide after the delivery.",
//         price: {
//           value: 500,
//           currency: "TORI",
//         },
//       },
//     ],
//   },
//   {
//     text: "Standard",
//     price: {
//       value: 1500,
//       currency: "TORI",
//     },
//     description:
//       "4 HQ UltraQuality Logos + AI EPS Vector Source File + 3D Mockup + VIP Support + 5 Social Media Covers",
//     daysToDelivery: 3,
//     maximumRevisions: 5,
//     included: [
//       "4 concepts included",
//       "Logo transparency",
//       "Vector file",
//       "Printable file",
//       "Include 3D Mockup",
//       "Include source file",
//       "Include social media kit",
//     ],
//     extras: [
//       {
//         text: "Extra Fast 2 Days Delivery",
//         description: "",
//         price: {
//           value: 1500,
//           currency: "TORI",
//         },
//       },
//       {
//         text: "Additional revision",
//         description:
//           "Add an additional revision your seller will provide after the delivery.",
//         price: {
//           value: 500,
//           currency: "TORI",
//         },
//       },
//       {
//         text: "Include social media kit",
//         description:
//           "You'll get graphics showing your logo that you can use on social media platforms. Ex. Facebook and Instagram.",
//         price: {
//           value: 500,
//           currency: "TORI",
//         },
//       },
//       {
//         text: "Stationery designs",
//         description:
//           "You'll get a template with your logo to use for stationary—letterhead, envelopes, business cards, etc.",
//         price: {
//           value: 500,
//           currency: "TORI",
//         },
//       },
//       {
//         text: "Additional logo",
//         description: "Add another (1) logo concept.",
//         price: {
//           value: 500,
//           currency: "TORI",
//         },
//       },
//       {
//         text: "Full Vector Package",
//         description:
//           "I will provide full HQ resolution logo files in 5000 X 5000 Vector AI EPS PDF JPG PNG on transparent BG",
//         price: {
//           value: 500,
//           currency: "TORI",
//         },
//       },
//       {
//         text: "Favicon Design",
//         description: "I will design favicon for your Website",
//         price: {
//           value: 500,
//           currency: "TORI",
//         },
//       },
//       {
//         text: "E Mail Signature",
//         description: "I will design E-Mail signature for digital branding",
//         price: {
//           value: 500,
//           currency: "TORI",
//         },
//       },
//       {
//         text: "Full Color Codes",
//         description:
//           "I will provide color codes in HEX RGB and CMYK for the final logo",
//         price: {
//           value: 500,
//           currency: "TORI",
//         },
//       },
//       {
//         text: "Branding Design",
//         description:
//           "I will design double sided business card and letterhead design to build your brand",
//         price: {
//           value: 500,
//           currency: "TORI",
//         },
//       },
//       {
//         text: "Logo Guidelines",
//         description: "I will design an outstanding Logo Guidelines",
//         price: {
//           value: 500,
//           currency: "TORI",
//         },
//       },
//     ],
//   },
//   {
//     text: "Premium",
//     price: {
//       value: 5000,
//       currency: "TORI",
//     },
//     description: "TORI TORI bill yo",
//     daysToDelivery: 3,
//     maximumRevisions: 5,
//     included: [
//       "4 concepts included",
//       "Logo transparency",
//       "Vector file",
//       "Printable file",
//       "Include 3D Mockup",
//       "Include source file",
//       "Include social media kit",
//       "Keys to the Kingdom",
//     ],
//     extras: [],
//   },
// ];

export const getFilterOptions = (type: string): FilterOptionType[] => {
  if (type === "logo") {
    // placeholder
    return [
      {
        text: "File Format",
        checkables: [
          {
            text: "PNG",
            checked: false,
            count: 123,
          },
          {
            text: "JPG",
            checked: false,
            count: 123,
          },
          {
            text: "PDF",
            checked: false,
            count: 123,
          },
          {
            text: "ALL",
            checked: false,
            count: 123,
          },
        ],
      },
      {
        text: "Service includes",
        checkables: [
          {
            text: "Logo transparency",
            checked: false,
            count: 123,
          },
          {
            text: "Printable file",
            checked: false,
            count: 123,
          },
          {
            text: "Vector file",
            checked: false,
            count: 123,
          },
          {
            text: "Source file",
            checked: false,
            count: 123,
          },
        ],
      },
    ];
  } else {
    return [
      {
        text: "Seller Level",
        checkables: [
          {
            text: "Top Rated Seller",
            checked: false,
            count: 123,
          },
          {
            text: "Lever Two",
            checked: false,
            count: 123,
          },
          {
            text: "Level One",
            checked: false,
            count: 123,
          },
          {
            text: "New Seller",
            checked: false,
            count: 123,
          },
        ],
      },
      {
        text: "Seller speaks",
        checkables: [
          {
            text: "English",
            checked: false,
            count: 123,
          },
          {
            text: "Spanish",
            checked: false,
            count: 123,
          },
          {
            text: "French",
            checked: false,
            count: 123,
          },
          {
            text: "German",
            checked: false,
            count: 123,
          },
        ],
      },
      {
        text: "Seller lives in",
        checkables: allCountries
          .map((country): CheckableType => {
            return {
              text: country.name,
              checked: false,
              count: Math.floor(Math.random() * 10),
            };
          })
          .sort((a, b) => {
            return b.count - a.count;
          })
          .slice(0, 10),
      },
    ];
  }
};

export const getGigData = async (
  gigId: string,
  gigInfo: GigInfo,
  sellerAddress: string
): Promise<GigData> => {
  return {
    id: gigId,
    sellerAddress,
    sellerUser: await getSellerUser(gigInfo.profileHash),
    title: gigInfo.title,
    description: gigInfo.description,
    pricePreText: "Starting at",
    isFavorite: false,
    price: {
      value: Math.ceil(parseFloat(gigInfo.basicPackage.price)),
      currency: "TORI",
    } as FreelanceServicePriceType,
    tags: gigInfo.positiveKeywords,
    serviceLevels: [
      {
        text: "Basic",
        description: gigInfo.basicPackage.desc,
        price: {
          value: Math.ceil(parseFloat(gigInfo.basicPackage.price)),
          currency: "TORI",
        } as FreelanceServicePriceType,
        daysToDelivery: gigInfo.basicPackage.deliveryTime,
        maximumRevisions: maxiumRevisions(gigInfo.basicPackage.contents),
        included: gigInfo.basicPackage.contents.map((item: any) => item.title),
        extras: [],
      } as ServiceLevel,
      {
        text: "Standard",
        description: gigInfo.standardPackage.desc,
        price: {
          value: Math.ceil(parseFloat(gigInfo.standardPackage.price)),
          currency: "TORI",
        } as FreelanceServicePriceType,
        daysToDelivery: gigInfo.standardPackage.deliveryTime,
        maximumRevisions: maxiumRevisions(gigInfo.standardPackage.contents),
        included: gigInfo.standardPackage.contents.map(
          (item: any) => item.title
        ),
        extras: [],
      } as ServiceLevel,
      {
        text: "Premium",
        description: gigInfo.premiumPackage.desc,
        price: {
          value: Math.ceil(parseFloat(gigInfo.premiumPackage.price)),
          currency: "TORI",
        } as FreelanceServicePriceType,
        daysToDelivery: gigInfo.premiumPackage.deliveryTime,
        maximumRevisions: maxiumRevisions(gigInfo.premiumPackage.contents),
        included: gigInfo.premiumPackage.contents.map((item) => item.title),
        extras: [],
      } as ServiceLevel,
    ],
  } as GigData;
};

const maxiumRevisions = (contentInfos: ContentInfo[]): string => {
  let maxRevisions = -1;
  contentInfos.map((contentInfo) => {
    if (contentInfo.id === "revisions" && contentInfo.data_value !== null) {
      maxRevisions = parseInt(contentInfo.data_value, 10);
    }
  });

  return maxRevisions.toString(10);
};

export interface Card {
  name: string;
  title: string;
  icon: string;
  sub_category?: string;
}
export const getCards = (id: string): Card[] => {
  const values = {
    explore_marketplace: [
      {
        name: "graphics_design",
        title: "Graphics & design",
        icon: "Feather.svg",
      },
      {
        name: "digital_marketing",
        title: "Digital Marketing",
        icon: "Computer.svg",
      },
      {
        name: "writing_translation",
        title: "Writing & Translation",
        icon: "Pen.svg",
      },
      {
        name: "video_animation",
        title: "Video & Animation",
        icon: "BallBounce.svg",
      },
      {
        name: "music_audio",
        title: "Music & Audio",
        icon: "Music.svg",
      },
      {
        name: "programming_tech",
        title: "Programming & Tech",
        icon: "Code.svg",
      },
    ],
    popular_professional_services: [
      {
        title: "Logo Design",
        name: "graphics_design",
        sub_category: "logo_design",
        icon: "logo-design.png",
      },
      {
        title: "WebApp Design",
        name: "graphics_design",
        sub_category: "webapp_design",
        icon: "illustration.png",
      },
      {
        title: "Programming & Tech",
        name: "programming_tech",
        sub_category: "website_development",
        icon: "wordPress.png",
      },
    ],
    freelance_community: [
      {
        name: "designer",
        title: "I am a Designer",
        icon: "Feather.svg",
      },
      {
        name: "",
        title: "I am a Marketer",
        icon: "Computer.svg",
      },
      {
        name: "",
        title: "I am a Writer",
        icon: "Pen.svg",
      },
      {
        name: "",
        title: "I am a Video Editor",
        icon: "BallBounce.svg",
      },
      { name: "", title: "I am a Musician", icon: "Music.svg" },
      {
        name: "",
        title: "I am a developer",
        icon: "Code.svg",
      },
      {
        name: "",
        title: "I am  a Entrepreneur",
        icon: "Suitcase.svg",
      },
    ],
  };
  // @ts-ignore

  console.log(values[id], id);
  // @ts-ignore

  return Object.values(values[id]);
};

export const getSubCategoryCards = (id: string): Card[] => {
  const values = {
    graphics_design: [
      {
        name: "logo_design",
        title: "Logo Design",
        icon: "diamond.svg",
      },
      {
        name: "webapp_design",
        title: "WebApp Design",
        icon: "glasses.svg",
      },
      {
        name: "art_illustration",
        title: "Art & Illustration",
        icon: "image-editing.svg",
      },
      {
        name: "architecture_building_design",
        title: "Architecture & Building Design",
        icon: "house.svg",
      },
    ],
    digital_marketing: [
      {
        name: "seo",
        title: "SEO",
        icon: "",
      },
      {
        name: "social",
        title: "Social",
        icon: "",
      },
      {
        name: "method_techniques",
        title: "Method & Techniques",
        icon: "",
      },
      {
        name: "analytics_strategy",
        title: "Analytics & Strategy",
        icon: "",
      },
    ],
    writing_translation: [
      {
        name: "content_writing",
        title: "Content Writing",
        icon: "",
      },
      {
        name: "editing_critique",
        title: "Editing & Critique",
        icon: "",
      },
      {
        name: "translation_transcription",
        title: "Translation & Transcription",
        icon: "",
      },
      {
        name: "business_marketing_copy",
        title: "Business & Marketing Copy",
        icon: "",
      },
    ],
    video_animation: [
      {
        name: "editing_post_production",
        title: "Editing & Post-Production",
        icon: "",
      },
      {
        name: "animation",
        title: "Animation",
        icon: "",
      },
      {
        name: "social_marketing_videos",
        title: "Social & Marketing Videos",
        icon: "",
      },
      {
        name: "product_explainer_videos",
        title: "Product & Explainer Videos",
        icon: "",
      },
    ],
    music_audio: [
      {
        name: "music_production_writing",
        title: "Music Production & Writing",
        icon: "",
      },
      {
        name: "audio_engineering_post_production",
        title: "Audio Engineering & Post Production",
        icon: "",
      },
      {
        name: "voice_over_streaming",
        title: "Voice Over & Streaming",
        icon: "",
      },
      {
        name: "lessons_transcription",
        title: "Lessons & Transcription",
        icon: "",
      },
    ],
    programming_tech: [
      {
        name: "website_development",
        title: "Website Development",
        icon: "",
      },
      {
        name: "software_development",
        title: "Software Development",
        icon: "",
      },
      {
        name: "mobile_app_development",
        title: "Mobile App Development",
        icon: "",
      },
    ],
  };

  // @ts-ignore

  console.log(values[id], id);
  // @ts-ignore

  return Object.values(values[id]);
};
