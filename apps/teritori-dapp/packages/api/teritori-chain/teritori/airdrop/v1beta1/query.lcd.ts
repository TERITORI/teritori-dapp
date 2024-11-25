// @ts-nocheck
import { LCDClient } from "@osmonauts/lcd";
import { QueryAllocationRequest, QueryAllocationResponseSDKType, QueryParamsRequest, QueryParamsResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.allocation = this.allocation.bind(this);
    this.params = this.params.bind(this);
  }
  /* Allocation */
  async allocation(params: QueryAllocationRequest): Promise<QueryAllocationResponseSDKType> {
    const endpoint = `teritori/airdrop/v1beta1/allocation/${params.address}`;
    return await this.req.get<QueryAllocationResponseSDKType>(endpoint);
  }
  /* Params */
  async params(_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> {
    const endpoint = `teritori/airdrop/v1beta1/params`;
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  }
}
