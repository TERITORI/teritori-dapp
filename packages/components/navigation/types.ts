import { SvgProps } from "react-native-svg";

import { RootStackParamList } from "../../utils/navigation";
import { PickByValue } from "../../utils/types/helper";
import { Network } from "./../../utils/network";

export type SidebarType = {
  title: string;
  id: string;
  route: keyof PickByValue<RootStackParamList, undefined> | "TNSHome";
  icon: React.FC<SvgProps>;
  nested?: Record<string, Omit<SidebarType, "nested">>;
};

export type SidebarRecordType = Record<
  string,
  {
    title: string;
    id: string;
    route: keyof PickByValue<RootStackParamList, undefined> | "TNSHome";
    icon: React.FC<SvgProps>;
    nested?: Record<string, SidebarType>;
    disabledOn?: Network[];
  }
>;
