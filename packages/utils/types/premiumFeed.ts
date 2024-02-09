import { MembershipConfig } from "@/contracts-clients/cw721-membership";

export type LocalMembershipConfig = Partial<MembershipConfig>;

interface SubscriptionFormElem {
  title: string;
  price: string;
  duration: string;
  description: string;
}

export type SubscriptionFormValues = SubscriptionFormElem[];
