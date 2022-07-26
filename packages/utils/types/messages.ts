import { OptionString } from "./base";

export const defaultMetaData: Metadata = {
  image: "",
  image_data: "",
  email: "",
  external_url: "",
  public_name: "",
  public_bio: "",
  twitter_id: "",
  discord_id: "",
  telegram_id: "",
  keybase_id: "",
  validator_operator_address: "",
};

export interface Metadata {
  contract_address?: OptionString
  image: OptionString;
  image_data: OptionString;
  email: OptionString;
  external_url: OptionString;
  public_name: OptionString;
  public_bio: OptionString;
  twitter_id: OptionString;
  discord_id: OptionString;
  telegram_id: OptionString;
  keybase_id: OptionString;
  validator_operator_address: OptionString;
}

interface MintMsg {
  owner: string;
  token_id: string;
  token_uri: OptionString;
  extension: Metadata | null;
}

export interface MetadataWithTokenId extends Metadata {
  token_id: string;
}
