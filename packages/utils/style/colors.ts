export const primaryColor = "#16BBFF";
export const primaryTextColor = "#2B0945";

export const secondaryColor = "#FFFFFF";
export const successColor = "#C8FFAE";
export const errorColor = "#F46F76";

export const yellowDefault = "#FFE768";
export const pinkDefault = "#F46FBF";

// others
export const codGrayColor = "#1C1C1C";
export const mineShaftColor = "#3D3D3D";

export const neutral17 = "#171717";
export const neutral11 = "#111111";
export const neutral22 = "#222222";
export const neutral30 = "#2B2B33";
export const neutral33 = "#333333";
export const neutral44 = "#444444";
export const neutral77 = "#777777";

// Returns hexa color modified with alpha
export const withAlpha = (color: string, opacity: number) => {
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
};
