import { usePremiumSubscription } from "./usePremiumSubscription";

export const useCanViewPost = (
  premiumLevel: number,
  channelId?: string,
  viewerId?: string,
) => {
  const { data: subsciption } = usePremiumSubscription(channelId, viewerId);
  if (premiumLevel <= 0) {
    // not premium content
    return true;
  }
  if (!!channelId && !!viewerId && channelId === viewerId) {
    // viewer is channel owner
    return true;
  }
  if (!subsciption) {
    // viewer has no subscription to this channel
    return false;
  }
  // check subscription level
  return subsciption.level >= premiumLevel;
};
