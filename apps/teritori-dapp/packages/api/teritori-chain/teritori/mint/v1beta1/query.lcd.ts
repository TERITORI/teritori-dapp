// @ts-nocheck
import { LCDClient } from "@osmonauts/lcd";
import { QueryParamsRequest, QueryParamsResponseSDKType, QueryBlockProvisionsRequest, QueryBlockProvisionsResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.params = this.params.bind(this);
    this.blockProvisions = this.blockProvisions.bind(this);
  }
  /* Params returns the total set of minting parameters. */
  async params(_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> {
    const endpoint = `teritori/mint/v1beta1/params`;
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  }
  /* BlockProvisions current minting epoch provisions value. */
  async blockProvisions(_params: QueryBlockProvisionsRequest = {}): Promise<QueryBlockProvisionsResponseSDKType> {
    const endpoint = `teritori/mint/v1beta1/block_provisions`;
    return await this.req.get<QueryBlockProvisionsResponseSDKType>(endpoint);
  }
}
