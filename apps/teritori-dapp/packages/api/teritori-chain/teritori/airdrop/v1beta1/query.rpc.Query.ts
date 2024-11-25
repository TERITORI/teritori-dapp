// @ts-nocheck
import { Rpc } from "../../../helpers";
import * as _m0 from "protobufjs/minimal";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { QueryAllocationRequest, QueryAllocationResponse, QueryParamsRequest, QueryParamsResponse } from "./query";
/** Query defines the gRPC querier service. */
export interface Query {
  allocation(request: QueryAllocationRequest): Promise<QueryAllocationResponse>;
  params(request?: QueryParamsRequest): Promise<QueryParamsResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.allocation = this.allocation.bind(this);
    this.params = this.params.bind(this);
  }
  allocation(request: QueryAllocationRequest): Promise<QueryAllocationResponse> {
    const data = QueryAllocationRequest.encode(request).finish();
    const promise = this.rpc.request("teritori.airdrop.v1beta1.Query", "Allocation", data);
    return promise.then(data => QueryAllocationResponse.decode(new _m0.Reader(data)));
  }
  params(request: QueryParamsRequest = {}): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("teritori.airdrop.v1beta1.Query", "Params", data);
    return promise.then(data => QueryParamsResponse.decode(new _m0.Reader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    allocation(request: QueryAllocationRequest): Promise<QueryAllocationResponse> {
      return queryService.allocation(request);
    },
    params(request?: QueryParamsRequest): Promise<QueryParamsResponse> {
      return queryService.params(request);
    }
  };
};
