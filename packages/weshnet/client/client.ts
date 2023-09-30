import { Platform } from "react-native";

import { weshConfig } from "./config";
import { bootWeshnet } from "./services";
import { isElectron } from "../../utils/isElectron";
import {
  GrpcWebImpl,
  ProtocolServiceClientImpl,
  createWeshClient,
} from "../index";

const getAddress = (port: number) => {
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
  private _client: ProtocolServiceClientImpl = new ProtocolServiceClientImpl(
    new GrpcWebImpl("", {})
  );
  private _port: number = 4242;
  private _intervalId: null | ReturnType<typeof setInterval> = null;

  get client() {
    return this._client;
  }

  get port() {
    return this._port;
  }

  set port(port) {
    this._port = port;
  }
  async createClient(port: number) {
    try {
      if (port === 0) {
        return false;
      }

      const address = getAddress(port);
      const client = createWeshClient(address);
      const config = await client.ServiceGetConfiguration({});
      weshConfig.config = config;
      this._client = client;
      await bootWeshnet();
    } catch (err) {
      console.log("create Client er", err);
    }
    return true;
  }

  checkPortAndStart() {
    if (this._port) {
      if (this._intervalId) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
      this.createClient(this._port);
    }
    return false;
  }

  watchPort() {
    this._intervalId = setInterval(() => {
      this.checkPortAndStart();
    }, 5000);
  }
}

const weshClient = new WeshClient();

if (Platform.OS === "web" && !isElectron()) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const port = urlParams.get("weshPort");
  console.log("weshport", port);
  setTimeout(() => {
    weshClient.createClient(Number(port) || 4242);
  }, 5 * 1000);
}

export { weshClient };
