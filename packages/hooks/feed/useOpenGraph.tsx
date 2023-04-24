import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

import { OpenGraphType } from "./types";
import { EXTRACT_DOMAIN_REGEX } from "../../utils/regex";

export const request = axios.create({
  baseURL: "https://opengraph.io/api/1.1/site",
  method: "GET",
});

export const useOpenGraph = () => {
  const result = useMutation<OpenGraphType | undefined, null, { url: string }>(
    ["open-graph-fetch"],
    async ({ url }) => {
      try {
        const response: AxiosResponse = await request({
          url: `/${encodeURIComponent(url)}?app_id=${
            process.env.PUBLIC_OPENGRAPH_APP_ID
          }`,
        });

        const domainMatch = [
          ...url.matchAll(new RegExp(EXTRACT_DOMAIN_REGEX, "gi")),
        ];
        const domain = domainMatch && (domainMatch[0][1] || domainMatch[0][0]);
        if (response.data.openGraph.error) {
          return null;
        }
        return { ...response.data, domain };
      } catch (error) {
        console.log("error", error);
        return null;
      }
    }
  );

  return result;
};
