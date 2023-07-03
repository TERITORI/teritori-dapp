import { useNSNameInfo } from "./useNSNameInfo";

export const useNSNameAvailability = (
  networkId: string | undefined,
  tokenId: string | undefined
) => {
  const { nsInfo, notFound, isLoading, error } = useNSNameInfo(
    networkId,
    tokenId
  );
  console.log("----");
  console.log(nsInfo);
  return {
    nameAvailable: notFound === true,
    nameError: !!error,
    loading: isLoading,
  };
};
