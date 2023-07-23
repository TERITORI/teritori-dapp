import { Platform } from "react-native";

import { weshConfig } from "./config";
import { bootWeshnet } from "./services";
import { createWeshClient } from "../index";

let urlDefinedPort = 0;

if (Platform.OS === "web") {
  const params = new URL(window?.location?.href || "");
  urlDefinedPort = Number(params?.searchParams?.get("weshPort") || 0);
}

const getAddress = (port = 4248) => {
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
  private _client = createWeshClient(getAddress());
  private intervalId: any;

  public isClientCreated = false;

  get client() {
    return this._client;
  }
  async createClient(port = urlDefinedPort) {
    if (this.isClientCreated) {
      return clearInterval(this.intervalId);
    }
    const client = createWeshClient(getAddress(port));
    const config = await client.ServiceGetConfiguration({});
    weshConfig.config = config;
    this._client = client;
    this.isClientCreated = true;
    await bootWeshnet();
  }

  startClientCreation() {
    this.intervalId = setInterval(() => {
      this.createClient();
    }, 2500);
  }
}

const weshClient = new WeshClient();
weshClient.startClientCreation();

export { weshClient };
