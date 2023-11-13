import { useNSNameInfo } from "./useNSNameInfo";

export const useNSNameAvailability = (
  networkId: string | undefined,
  tokenId: string | undefined,
) => {
  const { notFound, isLoading, error } = useNSNameInfo(networkId, tokenId);
  return {
    nameAvailable: notFound,
    nameError: !!error,
    loading: isLoading,
  };
};
