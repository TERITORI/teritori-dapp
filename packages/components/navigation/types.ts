import { SvgProps } from "react-native-svg";

import { NetworkKind } from "../../networks";
import { RouteName } from "../../utils/navigation";
export type SidebarType = {
  title: string;
  route: RouteName;
  icon: React.FC<SvgProps>;
  nested?: Record<string, Omit<SidebarType, "nested">>;
};

export type SidebarRecordType = Record<
  string,
  {
    title: string;
    route: RouteName;
    icon: React.FC<SvgProps>;
    nested?: Record<string, SidebarType>;
    disabledOn?: NetworkKind[];
  }
>;
