import { FC, memo, useEffect } from "react";

import { useMultisigAuthToken } from "../../hooks/multisig/useMultisigAuthToken";
import { useMultisigClient } from "../../hooks/multisig/useMultisigClient";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { setMultisigToken } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";

// this is not ideal, we should check the token on all calls, I tried with a Proxy around the multisig client but it acted weird
export const MultisigDeauth: FC = memo(() => {
  const wallet = useSelectedWallet();
  const authToken = useMultisigAuthToken(wallet?.userId);
  const dispatch = useAppDispatch();
  const client = useMultisigClient(wallet?.networkId);
  useEffect(() => {
    const effect = async () => {
      const addr = wallet?.address;
      if (!addr || !authToken) {
        return;
      }
      try {
        await client.ValidateToken({ authToken });
      } catch {
        dispatch(setMultisigToken({ userAddress: addr, token: undefined }));
      }
    };
    effect();
  }, [authToken, client, dispatch, wallet?.address]);
  return null;
});
