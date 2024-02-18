import { Platform } from "react-native";

import {
  GrpcWebImpl,
  ProtocolServiceClientImpl,
} from "./../api/weshnet/protocoltypes";
import { weshConfig } from "./config";
import { afterWeshnetConnectionAction } from "./services";

const createWeshClient = (url: string) => {
  const rpc = new GrpcWebImpl(url, { debug: false });
  const client = new ProtocolServiceClientImpl(rpc);
  return client;
};

export const getWeshnetAddress = (port: number) => {
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
    new GrpcWebImpl("", {}),
  );
  private _port: number = 0;
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
      this.port = port;

      const address = getWeshnetAddress(port);
      const client = createWeshClient(address);
      const config = await client.ServiceGetConfiguration({});
      weshConfig.config = config;
      this._client = client;
      await afterWeshnetConnectionAction();
    } catch (err) {
      console.error("create Client err", err);
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
  }

  watchPort() {
    this._intervalId = setInterval(() => {
      this.checkPortAndStart();
    }, 5000);
  }
}

const weshClient = new WeshClient();

export { weshClient };
