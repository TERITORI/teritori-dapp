import { usePremiumSubscription } from "./usePremiumSubscription";

export const useCanViewPost = (
  premiumLevel: number,
  channelId?: string,
  viewerId?: string,
) => {
  const { data: subsciption } = usePremiumSubscription(channelId, viewerId);
  if (!!channelId && !!viewerId && channelId === viewerId) {
    return true;
  }
  if (premiumLevel <= 0) {
    return true;
  }
  if (!subsciption || subsciption.level <= 0) {
    return false;
  }
  return subsciption.level >= premiumLevel;
};
