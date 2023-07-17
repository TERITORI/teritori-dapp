export interface Empty {
    [k: string]: unknown;
  }

export interface Extension {
    name?: string | null;
    description?: string | null;
    image?: string | null;
    attributes?: Empty[] | null;
}

export interface OrderParams{
  cw20Addr?: string | null;
  amount?: string | null;
  seller?: string | null;
  expireAt?: string | null;
}