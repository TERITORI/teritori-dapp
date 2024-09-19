import { useNSNameInfo } from "./useNSNameInfo";
import { useNSPrimaryAlias } from "./useNSPrimaryAlias";

import { parseUserId } from "@/networks";

export const useNSUserInfo = (userId: string | undefined) => {
  const [network, address] = parseUserId(userId);
  const {
    primaryAlias,
    isSuccess,
    isLoading: isLoadingPrimaryAlias,
  } = useNSPrimaryAlias(userId);

  const {
    nsInfo,
    isLoading: isLoadingNameInfo,
    isError,
  } = useNSNameInfo(network?.id, primaryAlias, isSuccess && !!address, address);

  return {
    loading: isLoadingPrimaryAlias || (isSuccess ? isLoadingNameInfo : false),
    metadata: {
      tokenId: primaryAlias,
      tokenURI: nsInfo?.token_uri,
      ...nsInfo?.extension,
    },
    notFound: isError,
  };
};
