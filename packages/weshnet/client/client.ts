import { createWeshClient } from "../index";
import { ProtocolServiceClientImpl } from "../protocoltypes";

const params = new URL(window.location.href);
const weshPort = Number(params.searchParams.get("weshPort"));

let client: ProtocolServiceClientImpl;
let lastPort = 0;

export const weshClient = (port = weshPort || 0) => {
  if (port && !lastPort) {
    lastPort = port;
    client = createWeshClient(`http://localhost:${port}`);
  }
  return client;
};
