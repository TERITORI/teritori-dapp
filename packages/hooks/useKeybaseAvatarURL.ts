import { useQuery } from "@tanstack/react-query";

export const useKeybaseAvatarURL = (identity: string) => {
  const { data } = useQuery(
    ["keybaseAvatarURL", identity],
    async () => {
      if (!identity) {
        return "";
      }
      const keybaseData = await (
        await fetch(
          `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${encodeURIComponent(
            identity,
          )}&fields=pictures`,
        )
      ).json();
      if (!Array.isArray(keybaseData.them) || !keybaseData.them.length) {
        return "";
      }
      return (keybaseData.them[0].pictures.primary.url as string) || "";
    },
    {
      staleTime: Infinity,
    },
  );
  return data;
};
