import { NetworkFeature, NetworkKind, UserKind } from "@/networks";

export interface TabDefinition {
  name: string;
  badgeCount?: number;
  disabled?: boolean;
  scrollTo?: string;
  iconSVG?: any;
  iconColor?: string;
  networkKinds?: NetworkKind[];
  networkFeatures?: NetworkFeature[];
  userKinds?: UserKind[];
}
