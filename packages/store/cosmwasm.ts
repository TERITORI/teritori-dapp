import {
  SigningCosmWasmClient,
  CosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import * as R from "ramda";
import create, { GetState, SetState } from "zustand";
import { StoreApiWithPersist, devtools } from "zustand/middleware";

import { Metadata } from "../utils/types/tns";

type SCWClientOrNull = SigningCosmWasmClient | null;
type CWClientOrNull = CosmWasmClient | null;

interface State {
  // fields
  signingClient: SCWClientOrNull;
  nonSigningClient: CWClientOrNull;
  primaryAlias: string | null;
  walletAddress: string | null;
  token: Metadata | null;
  tokenIds: string[];
  tokens: Metadata[];
  pathIds: string[];
  paths: Metadata[];

  // functions
  setSigningClient: (c: SCWClientOrNull) => void;
  setNonSigningClient: (c: CWClientOrNull) => void;
  setPrimaryAlias: (alias: string | null) => void;
  setWalletAddress: (address: string) => void;
  setToken: (t: Metadata | null) => void;
  appendTokenId: (tid: string) => void;
  setTokenIds: (tids: string[]) => void;
  appendToken: (t: Metadata) => void;
  setTokens: (ts: Metadata[]) => void;
  appendPathId: (pid: string) => void;
  setPathIds: (pids: string[]) => void;
  appendPath: (p: Metadata) => void;
  setPaths: (ps: Metadata[]) => void;
}

const useStore = create<
  State,
  SetState<State>,
  GetState<State>,
  StoreApiWithPersist<State>
>(
  devtools(
    // persist(
    (set) =>
      ({
        signingClient: null,
        setSigningClient: (client: SCWClientOrNull) =>
          set((state) => ({ signingClient: client })),

        nonSigningClient: null,
        setNonSigningClient: (client: CWClientOrNull) =>
          set((state) => ({ nonSigningClient: client })),

        primaryAlias: null,
        setPrimaryAlias: (alias: string | null) =>
          set((state) => ({ primaryAlias: alias })),

        walletAddress: null,
        setWalletAddress: (address: string | null) =>
          set((state) => ({ walletAddress: address })),

        token: null,
        setToken: (token: Metadata | null) => set((state) => ({ token })),

        tokenIds: [],
        appendTokenId: (tokenId: string) =>
          set((state) => ({ tokenIds: R.append(tokenId, state.tokenIds) })),

        setTokenIds: (tokenIds: string[]) => set((state) => ({ tokenIds })),

        tokens: [],
        appendToken: (token: Metadata) =>
          set((state) => ({ tokens: R.append(token, state.tokens) })),

        setTokens: (tokens: Metadata[]) => set((state) => ({ tokens })),

        pathIds: [],
        appendPathId: (pathId: string) =>
          set((state) => ({ pathIds: R.append(pathId, state.pathIds) })),

        setPathIds: (pathIds: string[]) => set((state) => ({ pathIds })),

        paths: [],
        appendPath: (path: Metadata) =>
          set((state) => ({ paths: R.append(path, state.paths) })),

        setPaths: (paths: Metadata[]) => set((state) => ({ paths })),
      } as State) //,
    //   {
    //     name: 'dens-storage',
    //     getStorage: () => localStorage,
    //   }
    // )
  )
);

export { useStore };
