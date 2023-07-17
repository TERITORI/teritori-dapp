import {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

import ava from "../../../../assets/banners/freelance-service/ava.png";
import bookDesignBackground from "../../../../assets/banners/freelance-service/book-design.png";
import brandBackground from "../../../../assets/banners/freelance-service/brand.png";
import cameraBackground from "../../../../assets/banners/freelance-service/cameraBackground.png";
import architectureBackground from "../../../../assets/banners/freelance-service/graphics-and-design/architecture.png";
import artBackground from "../../../../assets/banners/freelance-service/graphics-and-design/art.png";
import fashionBackground from "../../../../assets/banners/freelance-service/graphics-and-design/fashion.png";
import gamingBackground from "../../../../assets/banners/freelance-service/graphics-and-design/gaming.png";
import logoAndBrandBackground from "../../../../assets/banners/freelance-service/graphics-and-design/logo-and-brand.png";
import marketingBackground from "../../../../assets/banners/freelance-service/graphics-and-design/marketing-design.png";
import miscellaneousBackground from "../../../../assets/banners/freelance-service/graphics-and-design/miscellaneous.png";
import packagingBackground from "../../../../assets/banners/freelance-service/graphics-and-design/packaging.png";
import printDesignBackground from "../../../../assets/banners/freelance-service/graphics-and-design/print-design.png";
import productDesignBackground from "../../../../assets/banners/freelance-service/graphics-and-design/product-design.png";
import visualDesignBackground from "../../../../assets/banners/freelance-service/graphics-and-design/visual-design.png";
import webAndAppDevBackground from "../../../../assets/banners/freelance-service/graphics-and-design/web-and-app-dev.png";
import illustrationBackground from "../../../../assets/banners/freelance-service/illustration.png";
import logoDesignBackground from "../../../../assets/banners/freelance-service/logo-design.png";
import marketingVideoBackground from "../../../../assets/banners/freelance-service/marketing-video.png";
import micBackground from "../../../../assets/banners/freelance-service/micBackground.png";
import packageDesignBackground from "../../../../assets/banners/freelance-service/package-design.png";
import phoneBackground from "../../../../assets/banners/freelance-service/phoneBackground.png";
import wordPressBackground from "../../../../assets/banners/freelance-service/wordPress.png";

export interface GalleryCardTProps extends GalleryCardType {
  width: number;
  height?: number;
  mainContainerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
}

export interface GalleryCardType {
  title?: string;
  subtitle?: string;
  imageBackground: ImageSourcePropType;
  profilePic?: ImageSourcePropType;
  titleStyle?: TextStyle;
  descriptionTitle?: string;
  descriptionList?: string[];
}

export interface Gallery {
  header: string;
  cardsToShow: number;
  cards: GalleryCardType[];
}

// @ts-ignore
export function getGallery(type: string): Gallery {
  if (type === "freelancer-featured") {
    return {
      header: "Get Inspired with Projects Made by our Freelancers",
      cardsToShow: 5,
      cards: [
        {
          title: "By @username",
          subtitle: "Book Design",
          imageBackground: bookDesignBackground,
          profilePic: ava,
        },
        {
          title: "By @username",
          subtitle: "Logo Design",
          imageBackground: logoDesignBackground,
          profilePic: ava,
        },
        {
          title: "By @username",
          subtitle: "Marketing Video",
          imageBackground: marketingVideoBackground,
          profilePic: ava,
        },
        {
          title: "By @username",
          subtitle: "Package Design",
          imageBackground: packageDesignBackground,
          profilePic: ava,
        },
        {
          title: "By @username",
          subtitle: "Illustrations",
          imageBackground: illustrationBackground,
          profilePic: ava,
        },
      ],
    };
  }
  if (type === "popular-services") {
    return {
      header: "Popular Professional Services",
      cardsToShow: 5,
      cards: [
        {
          title: "Build your brand",
          subtitle: "Logo Design",
          imageBackground: brandBackground,
        },
        {
          title: "Customize your site",
          subtitle: "WordPress",
          imageBackground: wordPressBackground,
        },
        {
          title: "Share your message",
          subtitle: "Voice Over",
          imageBackground: micBackground,
        },
        {
          title: "Engage your audience",
          subtitle: "Video Explainer",
          imageBackground: cameraBackground,
        },
        {
          title: "Reach more customers",
          subtitle: "Social Media",
          imageBackground: phoneBackground,
        },
      ],
    };
  }
  if (type === "graphic-and-design-page") {
    return {
      header: "Explore Graphics & Design",
      cardsToShow: 12,
      cards: [
        {
          descriptionTitle: "Logo & Brand Identity",
          descriptionList: [
            "Logo Design",
            "Brand Style Guides",
            "Fonts & Typography",
            "Business Cards & Stationery",
          ],
          imageBackground: logoAndBrandBackground,
        },
        {
          descriptionTitle: "Web & App Design",
          descriptionList: [
            "Website Design",
            "App Design",
            "UX Design",
            "Landing Page Design",
            "Icon Design",
          ],
          imageBackground: webAndAppDevBackground,
        },
        {
          descriptionTitle: "Art & Illustration",
          descriptionList: [
            "Illustration",
            "NFT Art",
            "Pattern Design",
            "Cartoons & Comics",
            "Storyboards",
          ],
          imageBackground: artBackground,
        },
        {
          descriptionTitle: "Marketing Design",
          descriptionList: [
            "Social Media Design",
            "Email Design",
            "Web Banners",
            "Signage Design",
          ],
          imageBackground: marketingBackground,
        },
        {
          descriptionTitle: "Gaming",
          descriptionList: [
            "Game Art",
            "Graphics for Streamers",
            "Twitch Store",
          ],
          imageBackground: gamingBackground,
        },
        {
          descriptionTitle: "Visual Design",
          descriptionList: [
            "Image Editing",
            "Presentation Design",
            "Infographic Design",
            "Vector Tracing",
            "CV Design",
          ],
          imageBackground: visualDesignBackground,
        },
        {
          descriptionTitle: "Print Design",
          descriptionList: [
            "Merch Design",
            "Flyer & Brochure Design",
            "Poster Design",
            "Catalog Design",
            "Menu & Invitation Design",
          ],
          imageBackground: printDesignBackground,
        },
        {
          descriptionTitle: "Packaging & Covers",
          descriptionList: [
            "Packaging & Label Design",
            "Book Design",
            "Album Cover Design",
            "Prodast Cover Design",
            "Car Wraps",
          ],
          imageBackground: packagingBackground,
        },
        {
          descriptionTitle: "Architecture & Building Design",
          descriptionList: [
            "Architecture & Interior Design",
            "Landscape Design",
            "Building Engineering",
            "Building Information Modeling",
          ],
          imageBackground: architectureBackground,
        },
        {
          descriptionTitle: "Product & Characters Design",
          descriptionList: [
            "Industrial & Product Design",
            "Character Modeling",
            "Trade Booth Design",
          ],
          imageBackground: productDesignBackground,
        },
        {
          descriptionTitle: "Fashion & Jewelry",
          descriptionList: ["Fashion Design", "Jewelry Design"],
          imageBackground: fashionBackground,
        },
        {
          descriptionTitle: "Miscellaneous",
          descriptionList: ["Logo Maker Tool", "Design Advice", "Other"],
          imageBackground: miscellaneousBackground,
        },
      ],
    };
  }
}
