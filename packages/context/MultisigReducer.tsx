import React, { createContext, useContext, useReducer } from "react";

// FIXME: remove this

interface ChainInfo {
  nodeAddress?: string;
  denom?: string;
  displayDenom?: string;
  displayDenomExponent?: number;
  gasPrice?: string;
  chainId?: string;
  chainDisplayName?: string;
  registryName?: string;
  addressPrefix?: string;
  validatorPrefix?: string;
  explorerLink?: string;
}
interface MultisigContextType {
  chain: ChainInfo;
}

const initialState: MultisigContextType = {
  chain: {
    nodeAddress: process.env.PUBLIC_CHAIN_RPC_ENDPOINT,
    denom: process.env.PUBLIC_STAKING_DENOM,
    displayDenom: process.env.PUBLIC_STAKING_DENOM_DISPLAY_NAME,
    displayDenomExponent: parseInt(
      process.env.PUBLIC_DISPLAY_DENOM_EXPONENT || "",
      10
    ),
    gasPrice: process.env.PUBLIC_GAS_PRICE,
    chainId: process.env.PUBLIC_CHAIN_ID,
    chainDisplayName: process.env.STAKING_DENOM_DISPLAY_NAME,
    registryName: process.env.PUBLIC_CHAIN_NAME,
    addressPrefix: process.env.PUBLIC_CHAIN_BECH32_PREFIX,
    explorerLink: process.env.PUBLIC_EXPLORER_LINK_TX,
    validatorPrefix: process.env.PUBLIC_CHAIN_VALIDATOR_PREFIX,
  },
};

const MultisigContext = createContext<{
  state: MultisigContextType;
  dispatch: React.Dispatch<ChangeChainAction>;
}>({ state: initialState, dispatch: () => {} });

interface ChangeChainAction {
  type: "changeChain";
  value: ChainInfo;
}

const MultisigReducer = (
  state: MultisigContextType,
  action: ChangeChainAction
) => {
  switch (action.type) {
    case "changeChain": {
      return {
        ...state,
        chain: action.value,
      };
    }
  }
};

export const MultisigContextProvider: React.FC = ({ children }) => {
  let existingState;
  if (typeof window !== "undefined") {
    const storedState = localStorage.getItem("state");
    if (storedState) {
      existingState = JSON.parse(storedState);
    }
  }

  const [state, dispatch] = useReducer(
    MultisigReducer,
    existingState ? existingState : initialState
  );

  const contextValue = { state, dispatch };

  return (
    <MultisigContext.Provider value={contextValue}>
      {children}
    </MultisigContext.Provider>
  );
};

export function useMultisigContext() {
  return useContext(MultisigContext);
}
