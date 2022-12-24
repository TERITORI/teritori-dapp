import {grpc} from "@improbable-eng/grpc-web";

import {GrpcWebImpl, MarketplaceServiceClientImpl,} from "../api/marketplace/v1/marketplace";
import {useSelector} from "react-redux";
import {selectSelectedNetworkId} from "../store/slices/settings";
import {isNetworkTestnet, isTestMode} from "../networks";

export const useBackendClient = () => {
  const selectedNetworkId = useSelector(selectSelectedNetworkId);

  const isForceBackendMainnet = () => isTestMode() && !isNetworkTestnet(selectedNetworkId)

  let backendEndpoint = process.env.TERITORI_BACKEND_ENDPOINT;
  if (!backendEndpoint) {
    throw new Error("missing TERITORI_BACKEND_ENDPOINT in env");
  }
  // Forcing backend mainnet on test mode if the selected network is not testnet
  if(isForceBackendMainnet()) {
    backendEndpoint = backendEndpoint.replace("testnet", "mainnet")
  }

  const rpc = new GrpcWebImpl(backendEndpoint, {
    transport: grpc.WebsocketTransport(),
    debug: false,
    // metadata: new grpc.Metadata({ SomeHeader: "bar" }),
  });
  return {backendClient: new MarketplaceServiceClientImpl(rpc), isForceBackendMainnet}
}
