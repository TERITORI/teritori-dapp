import { ProtocolServiceClientImpl, GrpcWebImpl } from "./protocoltypes";

export * from "./protocoltypes";

export const createWeshClient = (url: string) => {
  const rpc = new GrpcWebImpl(url, {
    debug: true,
  });
  return new ProtocolServiceClientImpl(rpc);
};
