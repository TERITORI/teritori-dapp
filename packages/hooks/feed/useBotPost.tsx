import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const botRequest = axios.create({
  baseURL: "https://social-feed-backend.vercel.app/",
});

export const useBotPost = () => {
  //  request
  const request = useMutation<
    boolean | null,
    null,
    { identifier: string; category: number }
  >([], async ({ identifier, category }) => {
    try {
      await botRequest.post("api/postByBot", {
        identifier,
        category,
      });

      return true;
    } catch (error: any) {
      console.log("error", error);
      return null;
    }
  });

  // returns
  return request;
};
