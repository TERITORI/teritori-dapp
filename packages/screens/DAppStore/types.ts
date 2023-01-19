import { SvgProps } from "react-native-svg";

export interface dAppType {
  id: string;
  title: string;
  description: string;
  icon: React.FC<SvgProps> | string;
  route: string;
  defaultIsChecked: boolean;
  groupKey: string;
}

export interface dAppGroup {
  [key: string]: {
    id: string;
    groupName: string;
    icon: React.FC<SvgProps>;
    active: boolean;
    options: {
      [key: string]: dAppType;
    };
  };
}
