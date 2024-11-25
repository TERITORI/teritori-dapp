// @ts-nocheck
import { Rpc } from "../../../helpers";
import * as _m0 from "protobufjs/minimal";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { QueryParamsRequest, QueryParamsResponse, QueryBlockProvisionsRequest, QueryBlockProvisionsResponse } from "./query";
/** Query provides defines the gRPC querier service. */
export interface Query {
  /** Params returns the total set of minting parameters. */
  params(request?: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** BlockProvisions current minting epoch provisions value. */
  blockProvisions(request?: QueryBlockProvisionsRequest): Promise<QueryBlockProvisionsResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.params = this.params.bind(this);
    this.blockProvisions = this.blockProvisions.bind(this);
  }
  params(request: QueryParamsRequest = {}): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("teritori.mint.v1beta1.Query", "Params", data);
    return promise.then(data => QueryParamsResponse.decode(new _m0.Reader(data)));
  }
  blockProvisions(request: QueryBlockProvisionsRequest = {}): Promise<QueryBlockProvisionsResponse> {
    const data = QueryBlockProvisionsRequest.encode(request).finish();
    const promise = this.rpc.request("teritori.mint.v1beta1.Query", "BlockProvisions", data);
    return promise.then(data => QueryBlockProvisionsResponse.decode(new _m0.Reader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    params(request?: QueryParamsRequest): Promise<QueryParamsResponse> {
      return queryService.params(request);
    },
    blockProvisions(request?: QueryBlockProvisionsRequest): Promise<QueryBlockProvisionsResponse> {
      return queryService.blockProvisions(request);
    }
  };
};
