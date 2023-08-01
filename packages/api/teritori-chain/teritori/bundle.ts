// @ts-nocheck
import * as _11 from "./airdrop/v1beta1/allocation";
import * as _12 from "./airdrop/v1beta1/genesis";
import * as _13 from "./airdrop/v1beta1/params";
import * as _14 from "./airdrop/v1beta1/query";
import * as _15 from "./airdrop/v1beta1/tx";
import * as _16 from "./mint/v1beta1/genesis";
import * as _17 from "./mint/v1beta1/mint";
import * as _18 from "./mint/v1beta1/query";
import * as _19 from "./mint/v1beta1/tx";
import * as _20 from "./airdrop/v1beta1/tx.amino";
import * as _21 from "./mint/v1beta1/tx.amino";
import * as _22 from "./airdrop/v1beta1/tx.registry";
import * as _23 from "./mint/v1beta1/tx.registry";
import * as _24 from "./airdrop/v1beta1/query.lcd";
import * as _25 from "./mint/v1beta1/query.lcd";
import * as _26 from "./airdrop/v1beta1/query.rpc.Query";
import * as _27 from "./mint/v1beta1/query.rpc.Query";
import * as _28 from "./airdrop/v1beta1/tx.rpc.msg";
import * as _29 from "./mint/v1beta1/tx.rpc.msg";
import * as _30 from "./lcd";
import * as _31 from "./rpc.query";
import * as _32 from "./rpc.tx";
export namespace teritori {
  export namespace airdrop {
    export const v1beta1 = {
      ..._11,
      ..._12,
      ..._13,
      ..._14,
      ..._15,
      ..._20,
      ..._22,
      ..._24,
      ..._26,
      ..._28
    };
  }
  export namespace mint {
    export const v1beta1 = {
      ..._16,
      ..._17,
      ..._18,
      ..._19,
      ..._21,
      ..._23,
      ..._25,
      ..._27,
      ..._29
    };
  }
  export const ClientFactory = {
    ..._30,
    ..._31,
    ..._32
  };
}
