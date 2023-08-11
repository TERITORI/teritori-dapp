import { useQuery } from "@tanstack/react-query";

import { IncreaseViewCountRequest } from "../../api/video/v1/video";
import { mustGetVideoClient } from "../../utils/backend";
import { useSelectedNetworkId } from "../useSelectedNetwork";
export const useIncreaseViewCount = (req: IncreaseViewCountRequest) => {
  console.log("--------useIncreaseViewCount:", req);
  const selectedNetworkId = useSelectedNetworkId();
  const { data, isFetching, isLoading } = useQuery(
    ["increase_view_count", selectedNetworkId, { ...req }],
    async () => {
      if (!req.user) return null;
      const videoClient = mustGetVideoClient(selectedNetworkId);
      const response = await videoClient.IncreaseViewCount(req);
      return {
        res: response.res,
      };
    }
  );
  return { data, isFetching, isLoading };
};
