import { ProtocolServiceClientImpl, GrpcWebImpl } from "./protocoltypes";

export * from "./protocoltypes";

export const createWeshClient = () => {
  const rpc = new GrpcWebImpl("http://localhost:4242", {
    debug: true,
  });
  return new ProtocolServiceClientImpl(rpc);
};
