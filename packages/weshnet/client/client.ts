import { Platform } from "react-native";

import { weshConfig } from "./config";
import { bootWeshnet } from "./services";
import { ProtocolServiceClientImpl, createWeshClient } from "../index";

let urlDefinedPort = 0;

if (Platform.OS === "web") {
  // const params = new URL(window?.location?.href || "");
  // urlDefinedPort = Number(params?.searchParams?.get("weshPort") || 0);
  urlDefinedPort = 4242;
}

const getAddress = (port) => {
  switch (Platform.OS) {
    case "android":
      return `10.0.2.2:${port}`;
    case "ios":
      return `http://127.0.0.1:${port}`;
    default:
      return `http://localhost:${port}`;
  }
};

class WeshClient {
  private _client: ProtocolServiceClientImpl;

  get client() {
    return this._client;
  }
  async createClient(port) {
    try {
      if (port === 0) {
        return;
      }

      const address = getAddress(port);
      console.log("url defined port", port, address);

      const client = createWeshClient(address);
      const config = await client.ServiceGetConfiguration({});
      weshConfig.config = config;
      this._client = client;
      console.log("done -->");
      await bootWeshnet();
    } catch (err) {
      console.log("create Client er", err);
    }
  }
}

const weshClient = new WeshClient();

if (Platform.OS === "web") {
  weshClient.createClient(urlDefinedPort);
}

export { weshClient };
