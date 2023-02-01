import profilePic from "../../../../assets/banners/freelance-service/profile-pic.png";
import serviceBackground from "../../../../assets/banners/freelance-service/service-card-background.png";
import { ServiceFields, User } from "../types/fields";

export function getServiceListing(): ServiceFields[] {
  return [
    {
      user: getUser("id123"),
      id: "id123",
      description: "I will do modern timeless logo design",
      pricePreText: "Starting at",
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
    description: "I will do modern timeless logo design",
    pricePreText: "Starting at",
    price: {
      value: 50.0,
      currency: "TORI",
    },
    tags: ["minimalist", "logo", "business", "vector"],
  };
}

export function getUser(id: string): User {
  return {
    backgroundPic: serviceBackground,
    profilePic,
    username: "username",
    description: "Level 2 Seller",
    isFavorite: false,
    intro:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    tagline: "Tag line here",
    rating: 4.9,
    totalReviews: 666,
    country: "Argentina",
    onlineStatus: "online",
    createDate: new Date(),
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
