import React from "react";
import { SvgProps } from "react-native-svg";

export interface FreelancerServiceRouteTypes {
  name: string;
  icon: React.FC<SvgProps>;
  iconChangePage: React.FC<SvgProps>;
  category: string;
}
