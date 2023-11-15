import { ProtocolServiceClient } from "../api/weshnet/ProtocoltypesServiceClientPb";

export const createWeshClient = (url: string) => {
  const client = new ProtocolServiceClient("http://localhost:8080");
  return client;
};
