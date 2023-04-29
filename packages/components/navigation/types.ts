import { SvgProps } from "react-native-svg";

import { RouteName } from "../../utils/navigation";

export type SidebarType = {
  title: string;
  id: string;
  route: RouteName;
  icon: React.FC<SvgProps>;
  nested?: Record<string, Omit<SidebarType, "nested">>;
};

export type SidebarRecordType = Record<
  string,
  {
    title: string;
    id: string;
    route: RouteName;
    icon: React.FC<SvgProps>;
    nested?: Record<string, SidebarType>;
  }
>;
