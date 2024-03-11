import { useQuery } from "@tanstack/react-query";

export const SearchAddress = (address: string | undefined) => {
  return useQuery(
    ["searchAddress", address],
    async () => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${address}&format=json`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data;
    },
    {
      staleTime: 3000, // Set a timeout of 3 seconds
    },
  );
};
