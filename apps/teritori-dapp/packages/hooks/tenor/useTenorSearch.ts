import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { TenorFetchResponse, TenorItemType, TenorResponse } from "./types";
import { tenorRequest } from "./useTenorFetchFeatured";

export const useTenorSearch = ({
  searchText,
  enabled,
}: {
  searchText: string;
  enabled?: boolean;
}) => {
  //  request
  const request = useInfiniteQuery<TenorFetchResponse>(
    ["tenor-search", searchText],
    async ({ pageParam }) => {
      try {
        const data: AxiosResponse<TenorResponse<TenorItemType[]>> =
          await tenorRequest({
            url: "/search",
            params: {
              pos: pageParam,
              limit: 32,
              q: searchText,
            },
          });

        return {
          list: data.data.results,
          after: data.data.next,
        };
      } catch (error: any) {
        console.log("error", error);
        return null;
      }
    },
    {
      getNextPageParam: (lastPage) => lastPage?.after,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      enabled,
    },
  );

  return request;
};
