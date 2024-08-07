import { SvgProps } from "react-native-svg";

import { RootStackParamList } from "../navigation";

export interface dAppType {
  id: string;
  title: string;
  description: string;
  icon: React.FC<SvgProps> | string;
  route: "External" | "ComingSoon" | keyof RootStackParamList;
  url?: string;
  groupKey: string;
  selectedByDefault: boolean;
  alwaysOn: boolean;
  order?: number;
  devOnly?: boolean;
}

export interface dAppGroup {
  [key: string]: {
    id: string;
    groupName: string;
    icon: React.FC<SvgProps> | string;
    active: boolean;
    options: {
      [key: string]: dAppType;
    };
  };
}
