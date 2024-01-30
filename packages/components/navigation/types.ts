import { SvgProps } from "react-native-svg";

import { NetworkKind } from "../../networks";

import { Routes } from "@/utils/router";

export type SidebarType = {
  title: string;
  id: string;
  route: keyof Routes;
  icon: React.FC<SvgProps>;
  nested?: Record<string, Omit<SidebarType, "nested">>;
};

export type SidebarRecordType = Record<
  string,
  {
    title: string;
    id: string;
    route: keyof Routes;
    icon: React.FC<SvgProps>;
    nested?: Record<string, SidebarType>;
    disabledOn?: NetworkKind[];
  }
>;
