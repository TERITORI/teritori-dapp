import { useInfiniteQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

import { TenorFetchResponse, TenorItemType, TenorResponse } from "./types";
import { env } from "../../utils/env";

export const tenorRequest = axios.create({
  baseURL: "https://tenor.googleapis.com/v2",
  method: "GET",
  params: {
    key: env.PUBLIC_TENOR_KEY,
  },
});

export const combineTenorFetchPages = (pages: TenorFetchResponse[]) =>
  pages.reduce(
    (acc: TenorItemType[], page) => [...acc, ...(page?.list || [])],
    []
  );

export const useTenorFetchFeatured = () => {
  //  request
  const request = useInfiniteQuery<TenorFetchResponse>(
    ["tenor-fetch-featured"],
    async ({ pageParam }) => {
      try {
        const data: AxiosResponse<TenorResponse<TenorItemType[]>> =
          await tenorRequest({
            url: "/featured",
            params: {
              pos: pageParam,
              limit: 32,
            },
          });

        return {
          list: data.data.results,
          after: data.data.next,
        };
      } catch (error: any) {
        console.log("error", { ...error });
        return null;
      }
    },
    {
      getNextPageParam: (lastPage) => lastPage?.after,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  return request;
};
