export const primaryColor = "#16BBFF";
export const primaryTextColor = "#2B0945";

export const secondaryColor = "#FFFFFF";
export const successColor = "#C8FFAE";
export const errorColor = "#F46F76";
export const toastRed = "#F34242";
export const toastGreen = "#52DB68";
export const toastOrange = "#F6851B";

export const yellowDefault = "#FFE768";
export const yellowPremium = "#F5C900";
export const pinkDefault = "#F46FBF";
export const purpleDark = "#5C26F5";
export const purpleDefault = "#9058EC";
export const purpleLight = "#9990F5";
export const orangeDefault = "#EAA54B";
export const redDefault = errorColor;
export const blueDefault = "#007AFF";
export const codGrayColor = "#1C1C1C";
export const mineShaftColor = "#3D3D3D";
export const reefColor = "#D2FFAE";

export const gameHighlight = "#FCEE4F";
export const yankeesBlue = "#16283C";
export const eggWhite = "#F0EAD6";

export const neutral00 = "#000000";
export const neutral09 = "#090909";
export const neutral17 = "#171717";
export const neutral11 = "#111111";
export const neutral15 = "#151515";
export const neutral1A = "#1A1B26";
export const neutral22 = "#222222";
export const neutral30 = "#2B2B33";
export const neutral33 = "#333333";
export const neutral39 = "#393939";
export const neutral44 = "#444444";
export const neutral55 = "#555555";
export const neutral67 = "#676767";
export const neutral76 = "#767680";
export const neutral77 = "#777777";
export const neutral88 = "#888888";
export const neutral99 = "#999999";
export const neutralA3 = "#A3A3A3";
export const transparentColor = "transparent";

export const additionalRed = "#FFAEAE";
export const additionalGreen = successColor;
export const additionalSuccess = "#3EBE7B";
export const azureBlue = "#0A84FF";
export const azureBlue20 = "rgba(10, 132, 255, 0.3)";

export const dangerColor = "#E44C39";

export const trashBackground = "rgba(244, 111, 118, 0.1)";

export const orangeLight = "#EAA54B";

export const gradientColorTurquoise = "#A5FECB";
export const gradientColorLightLavender = "#C3CFE2";
export const gradientColorLavender = "#AEB1FF";
export const gradientColorLightBlue = "#00C6FB";
export const gradientColorBlue = "#20BDFF";
export const gradientColorDarkBlue = "#005BEA";
export const gradientColorDarkerBlue = "#5433FF";
export const gradientColorPurple = "#DBAEFF";
export const gradientColorSalmon = "#FFAEAE";
export const gradientColorPink = "#F46FBF";
export const gradientColorGray = "#676767";
export const gradientColorLightGray = "#B7B7B7";
export const gradientColorLighterGray = "#F5F7FA";

export const currencyTORIcolor = primaryColor;
export const currencyETHcolor = "#232731";
export const currencyATOMcolor = "#5C26F5";
export const currencyOSMOcolor = "#A401D4";
export const currencyGNOcolor = "#232800";

export const lightblue = "#D2DEFC";

// Returns hexa color modified with alpha
export const withAlpha = (color: string, opacity: number) => {
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
};
