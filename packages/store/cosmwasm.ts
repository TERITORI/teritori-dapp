import create, { GetState, SetState } from 'zustand'
import { persist, StoreApiWithPersist, devtools } from 'zustand/middleware'
import {
		SigningCosmWasmClient,
		CosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { Metadata } from '../utils/types/messages'
import { OptionString } from '../utils/types/base'
import * as R from 'ramda'

type SCWClientOrNull = SigningCosmWasmClient | null
type CWClientOrNull = CosmWasmClient | null

interface State {
		// fields
		signingClient: SCWClientOrNull
		nonSigningClient: CWClientOrNull
		primaryAlias: OptionString
		walletAddress: OptionString
		token: Metadata | null
		tokenIds: string[]
		tokens: Metadata[]
		pathIds: string[]
		paths: Metadata[]

		// functions
		setSigningClient: (c: SCWClientOrNull) => void
		setNonSigningClient: (c: CWClientOrNull) => void
		setPrimaryAlias: (alias: OptionString) => void
		setWalletAddress: (address: string) => void
		setToken: (t: Metadata | null) => void
		appendTokenId: (tid: string) => void
		setTokenIds: (tids: string[]) => void
		appendToken: (t: Metadata) => void
		setTokens: (ts: Metadata[]) => void
		appendPathId: (pid: string) => void
		setPathIds: (pids: string[]) => void
		appendPath: (p: Metadata) => void
		setPaths: (ps: Metadata[]) => void
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
								setPrimaryAlias: (alias: OptionString) =>
										set((state) => ({ primaryAlias: alias })),

								walletAddress: null,
								setWalletAddress: (address: OptionString) =>
										set((state) => ({ walletAddress: address })),

								token: null,
								setToken: (token: Metadata | null) =>
										set((state) => ({ token: token })),

								tokenIds: [],
								appendTokenId: (tokenId: string) =>
										set((state) => ({ tokenIds: R.append(tokenId, state.tokenIds) })),

								setTokenIds: (tokenIds: string[]) =>
										set((state) => ({ tokenIds: tokenIds })),

								tokens: [],
								appendToken: (token: Metadata) =>
										set((state) => ({ tokens: R.append(token, state.tokens) })),

								setTokens: (tokens: Metadata[]) => set((state) => ({ tokens: tokens })),

								pathIds: [],
								appendPathId: (pathId: string) =>
										set((state) => ({ pathIds: R.append(pathId, state.pathIds) })),

								setPathIds: (pathIds: string[]) =>
										set((state) => ({ pathIds: pathIds })),

								paths: [],
								appendPath: (path: Metadata) =>
										set((state) => ({ paths: R.append(path, state.paths) })),

								setPaths: (paths: Metadata[]) => set((state) => ({ paths: paths })),
						} as State) //,
				//   {
				//     name: 'dens-storage',
				//     getStorage: () => localStorage,
				//   }
				// )
		)
)

export { useStore }