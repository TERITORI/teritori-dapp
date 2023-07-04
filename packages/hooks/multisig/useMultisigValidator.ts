import { useEffect, useState } from "react";

import { useFetchMultisigList } from "./useFetchMultisigList";
import useSelectedWallet from "../useSelectedWallet";

export const useMultisigValidator = (multisigAddress: string) => {
  const { selectedWallet: wallet } = useSelectedWallet();
  const { data, isLoading, isFetching } = useFetchMultisigList(
    wallet?.address || ""
  );
  const [isUserMultisig, setIsUserMultisig] = useState<undefined | boolean>();

  useEffect(() => {
    if (data?.length && !isLoading && !isFetching) {
      const userHasMultisig = data.some((mu) => mu.address === multisigAddress);
      setIsUserMultisig(userHasMultisig);
    }
  }, [isLoading, isFetching, data, multisigAddress]);

  return { isUserMultisig };
};
