export const defaultMetaData: Metadata = {
  image: "",
  user_header_image: "",
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
  contract_address?: string | null;
  image: string | null;
  image_data: string | null;
  user_header_image: string | null;
  email: string | null;
  external_url: string | null;
  public_name: string | null;
  public_bio: string | null;
  twitter_id: string | null;
  discord_id: string | null;
  telegram_id: string | null;
  keybase_id: string | null;
  validator_operator_address: string | null;
}

// interface MintMsg {
//   owner: string;
//   token_id: string;
//   token_uri: string | null;
//   extension: Metadata | null;
// }

export interface MetadataWithTokenId extends Metadata {
  token_id: string;
}

export type SendFundFormType = {
  comment: string;
  amount: string;
};

export type NameFinderFormType = {
  name: string;
};
