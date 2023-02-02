import profilePic from "../../../../assets/banners/freelance-service/profile-pic.png";
import serviceBackground from "../../../../assets/banners/freelance-service/service-card-background.png";
import { ServiceFields, ServiceLevels, User } from "../types/fields";

export function getServiceListing(): ServiceFields[] {
  return [
    {
      user: getUser("id123"),
      id: "id123",
      title: "I will do modern timeless logo design",
      description: "description: I will do modern timeless logo design",
      pricePreText: "Starting at",
      isFavorite: false,
      price: {
        value: 50.0,
        currency: "TORI",
      },
      tags: ["minimalist", "logo", "business", "vector"],
    },
  ];
}
export function getService(id: string): ServiceFields {
  return {
    user: getUser(id),
    id,
    title: "I will do modern timeless logo design",
    description: "Lorem ",
    pricePreText: "Starting at",
    price: {
      value: 50.0,
      currency: "TORI",
    },
    isFavorite: true, // this is meant to be resolved as: does the current logged user liked this service
    tags: ["minimalist", "logo", "business", "vector"],
    serviceLevels,
    reviews: {
      stats: {
        total: 100,
        starsCount: [1, 9, 10, 40, 50],
        avgRating: {
          total: 4.9,
          communication: 4.5,
          recommendToFriend: 4.4,
          serviceAsDescribed: 4,
        },
      },
      items: [
        {
          id: "aoeu",
          user: getUser(id),
          date: new Date().toLocaleDateString(),
          rating: 2,
          text: "Pretty bad..",
        },
        {
          id: "aoeu",
          user: getUser(id),
          date: new Date().toLocaleDateString(),
          rating: 5,
          text: "Great",
        },
      ],
    },
  };
}

export function getUser(id: string): User {
  return {
    id,
    backgroundPic: serviceBackground,
    profilePic,
    username: "freelancerUser100",
    levelText: "Level 2 Seller",
    isFavorite: false,
    intro:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    tagline: "Tag line here",
    rating: 4.9,
    totalReviews: 666,
    country: "Argentina",
    onlineStatus: "online",
    createDate: new Date(),
    totalQueue: 5,
    languages: [
      {
        title: "English",
        description: "Native",
      },
    ],
    linkedAccounts: [
      {
        type: "twitter",
        url: "https://twitter.com",
      },
    ],
    skills: [
      "minimalist",
      "logo",
      "business",
      "vector",
      "text logo",
      "logo-with-effect",
    ],
    education: [
      {
        title: "Some School",
        description: "BSc",
      },
    ],
    certifications: [
      {
        title: "MOTU",
        description: "Ubuntu cert",
      },
    ],
  };
}

const serviceLevels: ServiceLevels[] = [
  {
    text: "Basic",
    price: {
      value: 500,
      currency: "TORI",
    },
    description: "Basic baby",
    daysToDelivery: 5,
    maximumRevisions: 3,
    included: ["4 concepts included", "Logo transparency"],
  },
  {
    text: "Standard",
    price: {
      value: 1500,
      currency: "TORI",
    },
    description:
      "4 HQ UltraQuality Logos + AI EPS Vector Source File + 3D Mockup + VIP Support + 5 Social Media Covers",
    daysToDelivery: 3,
    maximumRevisions: 5,
    included: [
      "4 concepts included",
      "Logo transparency",
      "Vector file",
      "Printable file",
      "Include 3D Mockup",
      "Include source file",
      "Include social media kit",
    ],
  },
  {
    text: "Premium",
    price: {
      value: 5000,
      currency: "TORI",
    },
    description: "TORI TORI bill yo",
    daysToDelivery: 3,
    maximumRevisions: 5,
    included: [
      "4 concepts included",
      "Logo transparency",
      "Vector file",
      "Printable file",
      "Include 3D Mockup",
      "Include source file",
      "Include social media kit",
      "Keys to the Kingdom",
    ],
  },
];
