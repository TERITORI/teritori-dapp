declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
                              
declare module "*.png" {
  const value: any;

  export = value;
}

declare module "*.jpg" {
  const value: any;

  export = value;
}

declare module "react-native-smooth-slider";
