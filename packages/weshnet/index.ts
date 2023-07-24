import { grpc } from "@improbable-eng/grpc-web";
import { Platform } from "react-native";

import { ProtocolServiceClientImpl, GrpcWebImpl } from "./protocoltypes";
export * from "./protocoltypes";

export const createWeshClient = (url: string) => {
  const rpc = new GrpcWebImpl(url, {
    debug: true,
    transport:
      Platform.OS === "web"
        ? grpc.CrossBrowserHttpTransport({ withCredentials: false })
        : grpc.WebsocketTransport(),
  });
  return new ProtocolServiceClientImpl(rpc);
};
