import { useQuery } from "@tanstack/react-query";

import { GigDataRequest } from "../../api/freelance/v1/freelance";
import { mustGetFreelanceClient } from "../../utils/backend";
import { useSelectedNetworkId } from "../useSelectedNetwork";
export const useFetchGig = (req: GigDataRequest) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { data } = useQuery(
    ["gig", selectedNetworkId, { ...req }],
    async () => {
      try {
        const data = await getGig(selectedNetworkId, req);
        return data;
      } catch {
        return null;
      }
    }
  );
  return { data };
};
const getGig = async (networkId: string, req: GigDataRequest) => {
  try {
    // ===== We use FeedService to be able to fetch filtered posts
    const feedClient = mustGetFreelanceClient(networkId);
    const response = await feedClient.GigData(req);
    // ---- We sort by creation date
    return response.gig;
  } catch {
    return null;
  }
};
