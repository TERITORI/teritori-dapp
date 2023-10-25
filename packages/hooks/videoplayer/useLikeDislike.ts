import { LikeRequest, DislikeRequest } from "../../api/video/v1/video";
import { mustGetVideoClient } from "../../utils/backend";
export const increaseLike = async (
  req: LikeRequest,
  networkId: string
): Promise<number> => {
  const videoClient = mustGetVideoClient(networkId);
  const response = await videoClient.Like(req);
  return response.res;
};

export const increaseDislike = async (
  req: DislikeRequest,
  networkId: string
): Promise<number> => {
  const videoClient = mustGetVideoClient(networkId);
  const response = await videoClient.Dislike(req);
  return response.res;
};
