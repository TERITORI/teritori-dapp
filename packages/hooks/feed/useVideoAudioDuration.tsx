import { useQuery } from "@tanstack/react-query";

import { getVideoDurationFromURL } from "@/utils/video";

export const useVideoAudioDuration = (url: string, duration: number) => {
  const { data, isLoading } = useQuery(
    ["getVideoDuration", url],
    async () => {
      if (duration) return duration;

      try {
        const duration = await getVideoDurationFromURL(url);
        console.log(duration);
        return duration;
      } catch (error) {
        console.log(error);
        return 0;
      }
    },
    { staleTime: Infinity },
  );

  return { duration: data || 0, isLoading };
};
