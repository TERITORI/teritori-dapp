import { useQuery } from "@tanstack/react-query";

import {
  GigListRequest,
  GigInfo,
  GigCountRequest,
} from "../../api/freelance/v1/freelance";
import { mustGetFreelanceClient } from "../../utils/backend";
import { useSelectedNetworkId } from "../useSelectedNetwork";
export const useFetchGigs = (req: GigListRequest) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { data } = useQuery(
    ["gigs", selectedNetworkId, { ...req }],
    async ({ pageParam = req.offset }) => {
      try {
        const gigsCount = await getGigCount(selectedNetworkId, {
          category: req.category,
          subcategory: req.subcategory,
        });
        const gigsRequest: GigListRequest = { ...req, offset: pageParam || 0 };
        const list = await getGigs(selectedNetworkId, gigsRequest);

        return { list, totalCount: gigsCount };
      } catch {
        return { list: [], totalCount: 0 };
      }
    }
  );
  return { data };
};
const getGigs = async (networkId: string, req: GigListRequest) => {
  try {
    // ===== We use FeedService to be able to fetch filtered posts
    const feedClient = mustGetFreelanceClient(networkId);
    const response = await feedClient.GigList(req);
    // ---- We sort by creation date
    return response.gigs.sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.log("initData err", err);
    return [] as GigInfo[];
  }
};

const getGigCount = async (
  networkId: string,
  req: GigCountRequest
): Promise<number> => {
  try {
    // ===== We use FeedService to be able to fetch filtered posts
    const feedClient = mustGetFreelanceClient(networkId);
    const response = await feedClient.GigCount(req);
    // ---- We sort by creation date
    return response.count;
  } catch {
    return 0;
  }
};
