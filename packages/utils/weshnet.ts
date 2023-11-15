import {
  GrpcWebImpl,
  ProtocolServiceClientImpl,
} from "../api/weshnet/protocoltypes";

export const createWeshClient = (url: string) => {
  const rpc = new GrpcWebImpl(url, { debug: false });
  const client = new ProtocolServiceClientImpl(rpc);
  return client;
};
