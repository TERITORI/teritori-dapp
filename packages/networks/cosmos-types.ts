import {
  createWasmAminoConverters,
  wasmTypes,
} from "@cosmjs/cosmwasm-stargate/build/modules";
import { Registry } from "@cosmjs/proto-signing";
import {
  AminoTypes,
  createDefaultAminoConverters,
  defaultRegistryTypes,
} from "@cosmjs/stargate";

import {
  teritoriAminoConverters,
  teritoriProtoRegistry,
} from "@/api/teritori-chain";

export const cosmosTypesRegistry = new Registry([
  ...defaultRegistryTypes,
  ...wasmTypes,
  ...teritoriProtoRegistry,
]);

export const cosmosAminoTypes = new AminoTypes({
  ...createDefaultAminoConverters(),
  ...createWasmAminoConverters(),
  ...teritoriAminoConverters,
});
