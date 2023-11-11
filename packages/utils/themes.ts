import {
  neutral00,
  neutral33,
  neutral55,
  primaryColor,
  primaryTextColor,
  secondaryColor,
} from "./style/colors";

export interface Theme {
  textColor: string;
  secondaryTextColor: string;
  backgroundColor: string;
  headerBackgroundColor: string;
  borderColor: string;

  // buttons
  primaryButtonColor: string;
  secondaryButtonColor: string;
  tertiaryButtonColor: string;

  // chevron icon in sidebar
  chevronIconColor: string;

  // boxes
  headerSquaresBackgroundColor: string;
  squaresBackgroundColor: string;

  // tags
  tagsBackgroundColor: string;
}

export const lightTheme: Theme = {
  textColor: neutral00,
  secondaryTextColor: secondaryColor,
  backgroundColor: "#FDFDFF",
  headerBackgroundColor: secondaryColor,
  borderColor: "#EBEBF0",

  // buttons
  primaryButtonColor: "#3063D3",
  secondaryButtonColor: "#E5E5E8",
  tertiaryButtonColor: neutral00,

  // chevron icon in sidebar
  chevronIconColor: neutral00,

  // boxes
  headerSquaresBackgroundColor: secondaryColor,
  squaresBackgroundColor: "#FDFDFF",

  // tags
  tagsBackgroundColor: "#F5F5F7",
};

export const darkTheme: Theme = {
  textColor: secondaryColor,
  secondaryTextColor: primaryTextColor,
  backgroundColor: neutral00,
  headerBackgroundColor: neutral00,
  borderColor: neutral33,

  // buttons
  primaryButtonColor: primaryColor,
  secondaryButtonColor: neutral00,
  tertiaryButtonColor: neutral00,

  // chevron icon in sidebar
  chevronIconColor: secondaryColor,

  // boxes
  headerSquaresBackgroundColor: neutral00,
  squaresBackgroundColor: neutral00,

  // tags
  tagsBackgroundColor: neutral55,
};
