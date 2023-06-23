import { SvgProps } from "react-native-svg";

export interface dAppType {
  id: string;
  title: string;
  description: string;
  icon: React.FC<SvgProps> | string;
  route: string;
  groupKey: string;
  selectedByDefault: boolean;
  alwaysOn: boolean;
  order?: number;
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
