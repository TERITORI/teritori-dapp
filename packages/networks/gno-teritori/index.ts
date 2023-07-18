import { gnoCurrencies } from "./currencies";
import { GnoNetworkInfo, NetworkFeature, NetworkKind } from "../types";

export const gnoTeritoriNetwork: GnoNetworkInfo = {
  id: "gno-teritori",
  kind: NetworkKind.Gno,
  displayName: "Gno Teritori",
  icon: "icons/networks/gno.svg",
  features: [NetworkFeature.Organizations],
  currencies: gnoCurrencies,
  stakeCurrency: "ugnot",
  idPrefix: "gnotori",
  chainId: "teritori-1",
  endpoint: "https://4cb7-2001-bc8-47b0-1505-00-1.ngrok-free.app",
  txExplorer: "https://etherscan.io/tx/$hash",
  accountExplorer: "https://etherscan.io/address/$address",
  contractExplorer: "https://etherscan.io/address/$address",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  vaultContractAddress: "",
  nameServiceContractAddress: "gno.land/r/demo/users",
  nameServiceDefaultImage:
    "ipfs://bafkreignptjimiu7wuux6mk6uh4hb4odb6ff62ny4bvdokrhes7g67huse",
  gnowebURL: "https://568e-2001-bc8-47b0-1505-00-1.ngrok-free.app",
};
