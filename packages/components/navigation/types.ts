import { SvgProps } from "react-native-svg";

import { RootStackParamList } from "../../utils/navigation";
import { PickByValue } from "../../utils/types/helper";

export type SidebarType = Record<
  string,
  {
    title: string;
    route: keyof PickByValue<RootStackParamList, undefined>;
    icon: React.FC<SvgProps>;
  }
>;
