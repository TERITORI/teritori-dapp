import { ServiceGetConfiguration_Reply } from "../api/weshnet/protocoltypes";

class WeshConfig {
  private _config: ServiceGetConfiguration_Reply | undefined;
  private _shareLink: string = "";
  private _metadata = {
    rdvSeed: new Uint8Array(),
    tokenId: "",
  };

  get metadata() {
    return this._metadata;
  }
  set metadata(data) {
    this._metadata = data;
  }

  get config(): ServiceGetConfiguration_Reply | undefined {
    return this._config;
  }
  set config(config) {
    this._config = config;
  }

  get shareLink(): string {
    return this._shareLink;
  }
  set shareLink(shareLink) {
    this._shareLink = shareLink;
  }
}

export const weshConfig = new WeshConfig();
