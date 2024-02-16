export interface SubscriptionFormElem {
  title: string;
  amount: string;
  denom: string;
  durationDays: string;
  description: string;
  imageURI: string;
  open: boolean;
}

export type SubscriptionFormValues = { tiers: SubscriptionFormElem[] };
