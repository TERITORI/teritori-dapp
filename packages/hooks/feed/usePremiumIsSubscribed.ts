import { usePremiumSubscription } from "./usePremiumSubscription";

export const usePremiumIsSubscribed = (
  channelUserId: string | undefined,
  subUserId: string | undefined,
) => {
  const { data, ...other } = usePremiumSubscription(channelUserId, subUserId);
  return {
    data: data === undefined ? undefined : !!data?.subscription,
    ...other,
  };
};
