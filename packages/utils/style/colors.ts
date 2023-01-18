export const primaryColor = "#16BBFF";
export const primaryTextColor = "#2B0945";

export const secondaryColor = "#FFFFFF";
export const successColor = "#C8FFAE";
export const errorColor = "#F46F76";

export const yellowDefault = "#FFE768";
export const pinkDefault = "#F46FBF";
export const purpleDefault = "#9058EC";
export const lavenderDefault = "#AEB1FF";

export const codGrayColor = "#1C1C1C";
export const mineShaftColor = "#3D3D3D";
export const reefColor = "#D2FFAE";

export const neutral00 = "#000000";
export const neutral17 = "#171717";
export const neutral11 = "#111111";
export const neutral1A = "#1A1B26";
export const neutral22 = "#222222";
export const neutral30 = "#2B2B33";
export const neutral2A = "#2A2B41";
export const neutral33 = "#333333";
export const neutral44 = "#444444";
export const neutral67 = "#676767";
export const neutral77 = "#777777";
export const neutralA3 = "#A3A3A3";
export const additionalRed = "#FFAEAE";

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
export const currencySOLcolor = "#22C78F";
export const currencyATOMcolor = "#5C26F5";
export const currencyOSMOcolor = "#A401D4";
export const currencyEVMOScolor = "#ED4E33";
export const currencyJUNOcolor = "#F0827D";

export const gradientBlue = "90deg, #00C6FB 0%, #005BEA 100%";
export const gradientBlueReversed = "90deg, #005BEA 0%, #00C6FB 100%";
export const gradientBlueExtended =
  "90deg, #5433FF 0%, #20BDFF 50%, #A5FECB 100%";
export const gradientPurple = "267deg, #AEB1FF 0%, #DBAEFF 100%";
export const gradientPink = "90deg, #FFAEAE 0%, #F46FBF 100%";
export const gradientGray = "90deg, #676767 0%, #B7B7B7 100%";
export const gradientGrayLight = "90deg, #F5F7FA 0%, #C3CFE2 100%";

// Returns hexa color modified with alpha
export const withAlpha = (color: string, opacity: number) => {
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
};
