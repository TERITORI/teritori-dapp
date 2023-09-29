import { useEffect, useState } from "react";

import { useUserMultisigs } from "./useUserMultisigs";
import useSelectedWallet from "../useSelectedWallet";

export const useMultisigValidator = (multisigAddress: string | undefined) => {
  const wallet = useSelectedWallet();
  const {
    multisigs: data,
    isLoading,
    isFetching,
  } = useUserMultisigs(wallet?.userId);
  const [isUserMultisig, setIsUserMultisig] = useState<undefined | boolean>();

  useEffect(() => {
    if (data?.length && !isLoading && !isFetching) {
      const userHasMultisig = data.some((mu) => mu.address === multisigAddress);
      setIsUserMultisig(userHasMultisig);
    }
  }, [isLoading, isFetching, data, multisigAddress]);

  return { isUserMultisig };
};
