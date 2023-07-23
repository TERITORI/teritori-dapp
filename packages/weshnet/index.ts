import { grpc } from "@improbable-eng/grpc-web";
import { ReactNativeTransport } from "@improbable-eng/grpc-web-react-native-transport";
import { Platform } from "react-native";

import { ProtocolServiceClientImpl, GrpcWebImpl } from "./protocoltypes";
export * from "./protocoltypes";

export const createWeshClient = (url: string) => {
  const rpc = new GrpcWebImpl(url, {
    debug: true,

    transport:
      Platform.OS === "web"
        ? grpc.CrossBrowserHttpTransport({ withCredentials: false })
        : ReactNativeTransport({ withCredentials: false }),
  });
  return new ProtocolServiceClientImpl(rpc);
};
