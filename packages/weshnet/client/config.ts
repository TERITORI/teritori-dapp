import { ServiceGetConfiguration_Reply } from "../protocoltypes";

class WeshConfig {
  private _config: ServiceGetConfiguration_Reply;
  private _shareLink: string = "";

  get config(): ServiceGetConfiguration_Reply {
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

const weshConfig = new WeshConfig();

export { weshConfig };
