import { useEffect, useState } from "react";

import useSelectedWallet from "../useSelectedWallet";
import { useFetchMultisigList } from "./useFetchMultisigList";

export const useMultisigValidator = (multisigAddress: string) => {
  const wallet = useSelectedWallet();
  const { data, isLoading, isFetching } = useFetchMultisigList(
    wallet?.address || ""
  );
  const [isUserMultisig, setIsUserMultisig] = useState<undefined | boolean>();

  useEffect(() => {
    if (data?.length && !isLoading && !isFetching) {
      const userHasMultisig = data.some((mu) => mu.address === multisigAddress);
      setIsUserMultisig(userHasMultisig);
    }
  }, [isLoading, isFetching, data]);

  return { isUserMultisig };
};
