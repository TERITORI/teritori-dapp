/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";
import { Any } from "../../google/protobuf/any";

export const protobufPackage = "multisig.v1";

export enum JoinState {
  JOIN_STATE_UNSPECIFIED = 0,
  JOIN_STATE_IN = 1,
  JOIN_STATE_OUT = 2,
  UNRECOGNIZED = -1,
}

export function joinStateFromJSON(object: any): JoinState {
  switch (object) {
    case 0:
    case "JOIN_STATE_UNSPECIFIED":
      return JoinState.JOIN_STATE_UNSPECIFIED;
    case 1:
    case "JOIN_STATE_IN":
      return JoinState.JOIN_STATE_IN;
    case 2:
    case "JOIN_STATE_OUT":
      return JoinState.JOIN_STATE_OUT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return JoinState.UNRECOGNIZED;
  }
}

export function joinStateToJSON(object: JoinState): string {
  switch (object) {
    case JoinState.JOIN_STATE_UNSPECIFIED:
      return "JOIN_STATE_UNSPECIFIED";
    case JoinState.JOIN_STATE_IN:
      return "JOIN_STATE_IN";
    case JoinState.JOIN_STATE_OUT:
      return "JOIN_STATE_OUT";
    case JoinState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum ExecutionState {
  EXECUTION_STATE_UNSPECIFIED = 0,
  EXECUTION_STATE_PENDING = 1,
  EXECUTION_STATE_EXECUTED = 2,
  UNRECOGNIZED = -1,
}

export function executionStateFromJSON(object: any): ExecutionState {
  switch (object) {
    case 0:
    case "EXECUTION_STATE_UNSPECIFIED":
      return ExecutionState.EXECUTION_STATE_UNSPECIFIED;
    case 1:
    case "EXECUTION_STATE_PENDING":
      return ExecutionState.EXECUTION_STATE_PENDING;
    case 2:
    case "EXECUTION_STATE_EXECUTED":
      return ExecutionState.EXECUTION_STATE_EXECUTED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ExecutionState.UNRECOGNIZED;
  }
}

export function executionStateToJSON(object: ExecutionState): string {
  switch (object) {
    case ExecutionState.EXECUTION_STATE_UNSPECIFIED:
      return "EXECUTION_STATE_UNSPECIFIED";
    case ExecutionState.EXECUTION_STATE_PENDING:
      return "EXECUTION_STATE_PENDING";
    case ExecutionState.EXECUTION_STATE_EXECUTED:
      return "EXECUTION_STATE_EXECUTED";
    case ExecutionState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Multisig {
  createdAt: string;
  chainId: string;
  address: string;
  joined: boolean;
  name: string;
  pubkeyJson: string;
  usersAddresses: string[];
  threshold: number;
}

export interface Signature {
  value: string;
  userAddress: string;
  bodyBytes: Uint8Array;
}

export interface Transaction {
  createdAt: string;
  finalHash: string;
  multisigAddress: string;
  chainId: string;
  msgs: Any[];
  feeJson: string;
  accountNumber: number;
  sequence: number;
  creatorAddress: string;
  threshold: number;
  membersCount: number;
  memo: string;
  signatures: Signature[];
  multisigPubkeyJson: string;
  id: number;
}

/** we use string here because browser storage poorly supports bytes */
export interface Token {
  /** base64 */
  nonce: string;
  expiration: string;
  userAddress: string;
  /** base64 signature by server of protobuf encoding of Token with server_signature field zeroed out */
  serverSignature: string;
}

export interface Challenge {
  nonce: Uint8Array;
  expiration: string;
  /** signature by server of protobuf encoding of Challenge with server_signature field zeroed out */
  serverSignature: Uint8Array;
}

export interface MultisigsRequest {
  authToken: Token | undefined;
  limit: number;
  startAfter: string;
  chainId: string;
  joinState: JoinState;
}

export interface MultisigsResponse {
  multisigs: Multisig[];
}

export interface MultisigInfoRequest {
  authToken: Token | undefined;
  multisigAddress: string;
  chainId: string;
}

export interface MultisigInfoResponse {
  multisig: Multisig | undefined;
}

export interface TransactionsRequest {
  authToken: Token | undefined;
  limit: number;
  startAfter: string;
  /** if unspecified, return transactions for all multisigs of this user */
  multisigAddress: string;
  chainId: string;
  types: string[];
  executionState: ExecutionState;
}

export interface TransactionsResponse {
  transactions: Transaction[];
}

export interface CreateOrJoinMultisigRequest {
  chainId: string;
  multisigPubkeyJson: string;
  authToken: Token | undefined;
  name: string;
  bech32Prefix: string;
}

export interface CreateOrJoinMultisigResponse {
  created: boolean;
  joined: boolean;
  multisigAddress: string;
}

export interface LeaveMultisigRequest {
  multisigAddress: string;
  authToken: Token | undefined;
  chainId: string;
}

export interface LeaveMultisigResponse {
  left: boolean;
}

export interface CreateTransactionRequest {
  authToken: Token | undefined;
  multisigAddress: string;
  accountNumber: number;
  sequence: number;
  msgs: Any[];
  feeJson: string;
  chainId: string;
}

export interface CreateTransactionResponse {
}

export interface SignTransactionRequest {
  authToken: Token | undefined;
  signature: string;
  transactionId: number;
  bodyBytes: Uint8Array;
}

export interface SignTransactionResponse {
}

export interface CompleteTransactionRequest {
  authToken: Token | undefined;
  transactionId: number;
  finalHash: string;
}

export interface CompleteTransactionResponse {
}

export interface ClearSignaturesRequest {
  authToken: Token | undefined;
  multisigChainId: string;
  multisigAddress: string;
  sequence: number;
}

export interface ClearSignaturesResponse {
}

export interface GetChallengeRequest {
}

export interface GetChallengeResponse {
  challenge: Challenge | undefined;
}

export interface TokenRequestInfo {
  kind: string;
  challenge: Challenge | undefined;
  userBech32Prefix: string;
  userPubkeyJson: string;
}

export interface GetTokenRequest {
  /** protojson encoding of TokenRequestInfo */
  infoJson: string;
  /** signature by client of info_json */
  userSignature: string;
}

export interface GetTokenResponse {
  authToken: Token | undefined;
}

export interface TransactionsCountsRequest {
  authToken:
    | Token
    | undefined;
  /** if unspecified, return transactions for all multisigs of this user */
  multisigAddress: string;
  chainId: string;
}

export interface TransactionsCount {
  total: number;
  pending: number;
  executed: number;
  type: string;
}

export interface TransactionsCountsResponse {
  all: TransactionsCount | undefined;
  byType: TransactionsCount[];
}

export interface ValidateTokenRequest {
  authToken: Token | undefined;
}

export interface ValidateTokenResponse {
}

function createBaseMultisig(): Multisig {
  return {
    createdAt: "",
    chainId: "",
    address: "",
    joined: false,
    name: "",
    pubkeyJson: "",
    usersAddresses: [],
    threshold: 0,
  };
}

export const Multisig = {
  encode(message: Multisig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.createdAt !== "") {
      writer.uint32(10).string(message.createdAt);
    }
    if (message.chainId !== "") {
      writer.uint32(18).string(message.chainId);
    }
    if (message.address !== "") {
      writer.uint32(34).string(message.address);
    }
    if (message.joined === true) {
      writer.uint32(40).bool(message.joined);
    }
    if (message.name !== "") {
      writer.uint32(50).string(message.name);
    }
    if (message.pubkeyJson !== "") {
      writer.uint32(58).string(message.pubkeyJson);
    }
    for (const v of message.usersAddresses) {
      writer.uint32(66).string(v!);
    }
    if (message.threshold !== 0) {
      writer.uint32(72).uint32(message.threshold);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Multisig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultisig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.createdAt = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.chainId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.address = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.joined = reader.bool();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.name = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.pubkeyJson = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.usersAddresses.push(reader.string());
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.threshold = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Multisig {
    return {
      createdAt: isSet(object.createdAt) ? globalThis.String(object.createdAt) : "",
      chainId: isSet(object.chainId) ? globalThis.String(object.chainId) : "",
      address: isSet(object.address) ? globalThis.String(object.address) : "",
      joined: isSet(object.joined) ? globalThis.Boolean(object.joined) : false,
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      pubkeyJson: isSet(object.pubkeyJson) ? globalThis.String(object.pubkeyJson) : "",
      usersAddresses: globalThis.Array.isArray(object?.usersAddresses)
        ? object.usersAddresses.map((e: any) => globalThis.String(e))
        : [],
      threshold: isSet(object.threshold) ? globalThis.Number(object.threshold) : 0,
    };
  },

  toJSON(message: Multisig): unknown {
    const obj: any = {};
    if (message.createdAt !== "") {
      obj.createdAt = message.createdAt;
    }
    if (message.chainId !== "") {
      obj.chainId = message.chainId;
    }
    if (message.address !== "") {
      obj.address = message.address;
    }
    if (message.joined === true) {
      obj.joined = message.joined;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.pubkeyJson !== "") {
      obj.pubkeyJson = message.pubkeyJson;
    }
    if (message.usersAddresses?.length) {
      obj.usersAddresses = message.usersAddresses;
    }
    if (message.threshold !== 0) {
      obj.threshold = Math.round(message.threshold);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Multisig>, I>>(base?: I): Multisig {
    return Multisig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Multisig>, I>>(object: I): Multisig {
    const message = createBaseMultisig();
    message.createdAt = object.createdAt ?? "";
    message.chainId = object.chainId ?? "";
    message.address = object.address ?? "";
    message.joined = object.joined ?? false;
    message.name = object.name ?? "";
    message.pubkeyJson = object.pubkeyJson ?? "";
    message.usersAddresses = object.usersAddresses?.map((e) => e) || [];
    message.threshold = object.threshold ?? 0;
    return message;
  },
};

function createBaseSignature(): Signature {
  return { value: "", userAddress: "", bodyBytes: new Uint8Array(0) };
}

export const Signature = {
  encode(message: Signature, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value !== "") {
      writer.uint32(10).string(message.value);
    }
    if (message.userAddress !== "") {
      writer.uint32(18).string(message.userAddress);
    }
    if (message.bodyBytes.length !== 0) {
      writer.uint32(26).bytes(message.bodyBytes);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Signature {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignature();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.value = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.userAddress = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.bodyBytes = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Signature {
    return {
      value: isSet(object.value) ? globalThis.String(object.value) : "",
      userAddress: isSet(object.userAddress) ? globalThis.String(object.userAddress) : "",
      bodyBytes: isSet(object.bodyBytes) ? bytesFromBase64(object.bodyBytes) : new Uint8Array(0),
    };
  },

  toJSON(message: Signature): unknown {
    const obj: any = {};
    if (message.value !== "") {
      obj.value = message.value;
    }
    if (message.userAddress !== "") {
      obj.userAddress = message.userAddress;
    }
    if (message.bodyBytes.length !== 0) {
      obj.bodyBytes = base64FromBytes(message.bodyBytes);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Signature>, I>>(base?: I): Signature {
    return Signature.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Signature>, I>>(object: I): Signature {
    const message = createBaseSignature();
    message.value = object.value ?? "";
    message.userAddress = object.userAddress ?? "";
    message.bodyBytes = object.bodyBytes ?? new Uint8Array(0);
    return message;
  },
};

function createBaseTransaction(): Transaction {
  return {
    createdAt: "",
    finalHash: "",
    multisigAddress: "",
    chainId: "",
    msgs: [],
    feeJson: "",
    accountNumber: 0,
    sequence: 0,
    creatorAddress: "",
    threshold: 0,
    membersCount: 0,
    memo: "",
    signatures: [],
    multisigPubkeyJson: "",
    id: 0,
  };
}

export const Transaction = {
  encode(message: Transaction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.createdAt !== "") {
      writer.uint32(10).string(message.createdAt);
    }
    if (message.finalHash !== "") {
      writer.uint32(18).string(message.finalHash);
    }
    if (message.multisigAddress !== "") {
      writer.uint32(26).string(message.multisigAddress);
    }
    if (message.chainId !== "") {
      writer.uint32(34).string(message.chainId);
    }
    for (const v of message.msgs) {
      Any.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (message.feeJson !== "") {
      writer.uint32(50).string(message.feeJson);
    }
    if (message.accountNumber !== 0) {
      writer.uint32(56).uint32(message.accountNumber);
    }
    if (message.sequence !== 0) {
      writer.uint32(64).uint32(message.sequence);
    }
    if (message.creatorAddress !== "") {
      writer.uint32(74).string(message.creatorAddress);
    }
    if (message.threshold !== 0) {
      writer.uint32(80).uint32(message.threshold);
    }
    if (message.membersCount !== 0) {
      writer.uint32(88).uint32(message.membersCount);
    }
    if (message.memo !== "") {
      writer.uint32(98).string(message.memo);
    }
    for (const v of message.signatures) {
      Signature.encode(v!, writer.uint32(106).fork()).ldelim();
    }
    if (message.multisigPubkeyJson !== "") {
      writer.uint32(114).string(message.multisigPubkeyJson);
    }
    if (message.id !== 0) {
      writer.uint32(120).uint32(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Transaction {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransaction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.createdAt = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.finalHash = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.multisigAddress = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.chainId = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.msgs.push(Any.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.feeJson = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.accountNumber = reader.uint32();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.sequence = reader.uint32();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.creatorAddress = reader.string();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.threshold = reader.uint32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.membersCount = reader.uint32();
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.memo = reader.string();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.signatures.push(Signature.decode(reader, reader.uint32()));
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.multisigPubkeyJson = reader.string();
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }

          message.id = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Transaction {
    return {
      createdAt: isSet(object.createdAt) ? globalThis.String(object.createdAt) : "",
      finalHash: isSet(object.finalHash) ? globalThis.String(object.finalHash) : "",
      multisigAddress: isSet(object.multisigAddress) ? globalThis.String(object.multisigAddress) : "",
      chainId: isSet(object.chainId) ? globalThis.String(object.chainId) : "",
      msgs: globalThis.Array.isArray(object?.msgs) ? object.msgs.map((e: any) => Any.fromJSON(e)) : [],
      feeJson: isSet(object.feeJson) ? globalThis.String(object.feeJson) : "",
      accountNumber: isSet(object.accountNumber) ? globalThis.Number(object.accountNumber) : 0,
      sequence: isSet(object.sequence) ? globalThis.Number(object.sequence) : 0,
      creatorAddress: isSet(object.creatorAddress) ? globalThis.String(object.creatorAddress) : "",
      threshold: isSet(object.threshold) ? globalThis.Number(object.threshold) : 0,
      membersCount: isSet(object.membersCount) ? globalThis.Number(object.membersCount) : 0,
      memo: isSet(object.memo) ? globalThis.String(object.memo) : "",
      signatures: globalThis.Array.isArray(object?.signatures)
        ? object.signatures.map((e: any) => Signature.fromJSON(e))
        : [],
      multisigPubkeyJson: isSet(object.multisigPubkeyJson) ? globalThis.String(object.multisigPubkeyJson) : "",
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
    };
  },

  toJSON(message: Transaction): unknown {
    const obj: any = {};
    if (message.createdAt !== "") {
      obj.createdAt = message.createdAt;
    }
    if (message.finalHash !== "") {
      obj.finalHash = message.finalHash;
    }
    if (message.multisigAddress !== "") {
      obj.multisigAddress = message.multisigAddress;
    }
    if (message.chainId !== "") {
      obj.chainId = message.chainId;
    }
    if (message.msgs?.length) {
      obj.msgs = message.msgs.map((e) => Any.toJSON(e));
    }
    if (message.feeJson !== "") {
      obj.feeJson = message.feeJson;
    }
    if (message.accountNumber !== 0) {
      obj.accountNumber = Math.round(message.accountNumber);
    }
    if (message.sequence !== 0) {
      obj.sequence = Math.round(message.sequence);
    }
    if (message.creatorAddress !== "") {
      obj.creatorAddress = message.creatorAddress;
    }
    if (message.threshold !== 0) {
      obj.threshold = Math.round(message.threshold);
    }
    if (message.membersCount !== 0) {
      obj.membersCount = Math.round(message.membersCount);
    }
    if (message.memo !== "") {
      obj.memo = message.memo;
    }
    if (message.signatures?.length) {
      obj.signatures = message.signatures.map((e) => Signature.toJSON(e));
    }
    if (message.multisigPubkeyJson !== "") {
      obj.multisigPubkeyJson = message.multisigPubkeyJson;
    }
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Transaction>, I>>(base?: I): Transaction {
    return Transaction.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Transaction>, I>>(object: I): Transaction {
    const message = createBaseTransaction();
    message.createdAt = object.createdAt ?? "";
    message.finalHash = object.finalHash ?? "";
    message.multisigAddress = object.multisigAddress ?? "";
    message.chainId = object.chainId ?? "";
    message.msgs = object.msgs?.map((e) => Any.fromPartial(e)) || [];
    message.feeJson = object.feeJson ?? "";
    message.accountNumber = object.accountNumber ?? 0;
    message.sequence = object.sequence ?? 0;
    message.creatorAddress = object.creatorAddress ?? "";
    message.threshold = object.threshold ?? 0;
    message.membersCount = object.membersCount ?? 0;
    message.memo = object.memo ?? "";
    message.signatures = object.signatures?.map((e) => Signature.fromPartial(e)) || [];
    message.multisigPubkeyJson = object.multisigPubkeyJson ?? "";
    message.id = object.id ?? 0;
    return message;
  },
};

function createBaseToken(): Token {
  return { nonce: "", expiration: "", userAddress: "", serverSignature: "" };
}

export const Token = {
  encode(message: Token, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nonce !== "") {
      writer.uint32(10).string(message.nonce);
    }
    if (message.expiration !== "") {
      writer.uint32(18).string(message.expiration);
    }
    if (message.userAddress !== "") {
      writer.uint32(34).string(message.userAddress);
    }
    if (message.serverSignature !== "") {
      writer.uint32(42).string(message.serverSignature);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Token {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseToken();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.nonce = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.expiration = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.userAddress = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.serverSignature = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Token {
    return {
      nonce: isSet(object.nonce) ? globalThis.String(object.nonce) : "",
      expiration: isSet(object.expiration) ? globalThis.String(object.expiration) : "",
      userAddress: isSet(object.userAddress) ? globalThis.String(object.userAddress) : "",
      serverSignature: isSet(object.serverSignature) ? globalThis.String(object.serverSignature) : "",
    };
  },

  toJSON(message: Token): unknown {
    const obj: any = {};
    if (message.nonce !== "") {
      obj.nonce = message.nonce;
    }
    if (message.expiration !== "") {
      obj.expiration = message.expiration;
    }
    if (message.userAddress !== "") {
      obj.userAddress = message.userAddress;
    }
    if (message.serverSignature !== "") {
      obj.serverSignature = message.serverSignature;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Token>, I>>(base?: I): Token {
    return Token.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Token>, I>>(object: I): Token {
    const message = createBaseToken();
    message.nonce = object.nonce ?? "";
    message.expiration = object.expiration ?? "";
    message.userAddress = object.userAddress ?? "";
    message.serverSignature = object.serverSignature ?? "";
    return message;
  },
};

function createBaseChallenge(): Challenge {
  return { nonce: new Uint8Array(0), expiration: "", serverSignature: new Uint8Array(0) };
}

export const Challenge = {
  encode(message: Challenge, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nonce.length !== 0) {
      writer.uint32(10).bytes(message.nonce);
    }
    if (message.expiration !== "") {
      writer.uint32(18).string(message.expiration);
    }
    if (message.serverSignature.length !== 0) {
      writer.uint32(26).bytes(message.serverSignature);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Challenge {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChallenge();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.nonce = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.expiration = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.serverSignature = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Challenge {
    return {
      nonce: isSet(object.nonce) ? bytesFromBase64(object.nonce) : new Uint8Array(0),
      expiration: isSet(object.expiration) ? globalThis.String(object.expiration) : "",
      serverSignature: isSet(object.serverSignature) ? bytesFromBase64(object.serverSignature) : new Uint8Array(0),
    };
  },

  toJSON(message: Challenge): unknown {
    const obj: any = {};
    if (message.nonce.length !== 0) {
      obj.nonce = base64FromBytes(message.nonce);
    }
    if (message.expiration !== "") {
      obj.expiration = message.expiration;
    }
    if (message.serverSignature.length !== 0) {
      obj.serverSignature = base64FromBytes(message.serverSignature);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Challenge>, I>>(base?: I): Challenge {
    return Challenge.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Challenge>, I>>(object: I): Challenge {
    const message = createBaseChallenge();
    message.nonce = object.nonce ?? new Uint8Array(0);
    message.expiration = object.expiration ?? "";
    message.serverSignature = object.serverSignature ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMultisigsRequest(): MultisigsRequest {
  return { authToken: undefined, limit: 0, startAfter: "", chainId: "", joinState: 0 };
}

export const MultisigsRequest = {
  encode(message: MultisigsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.limit !== 0) {
      writer.uint32(16).uint32(message.limit);
    }
    if (message.startAfter !== "") {
      writer.uint32(26).string(message.startAfter);
    }
    if (message.chainId !== "") {
      writer.uint32(34).string(message.chainId);
    }
    if (message.joinState !== 0) {
      writer.uint32(40).int32(message.joinState);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultisigsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultisigsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authToken = Token.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.limit = reader.uint32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.startAfter = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.chainId = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.joinState = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultisigsRequest {
    return {
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      startAfter: isSet(object.startAfter) ? globalThis.String(object.startAfter) : "",
      chainId: isSet(object.chainId) ? globalThis.String(object.chainId) : "",
      joinState: isSet(object.joinState) ? joinStateFromJSON(object.joinState) : 0,
    };
  },

  toJSON(message: MultisigsRequest): unknown {
    const obj: any = {};
    if (message.authToken !== undefined) {
      obj.authToken = Token.toJSON(message.authToken);
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.startAfter !== "") {
      obj.startAfter = message.startAfter;
    }
    if (message.chainId !== "") {
      obj.chainId = message.chainId;
    }
    if (message.joinState !== 0) {
      obj.joinState = joinStateToJSON(message.joinState);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultisigsRequest>, I>>(base?: I): MultisigsRequest {
    return MultisigsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultisigsRequest>, I>>(object: I): MultisigsRequest {
    const message = createBaseMultisigsRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.limit = object.limit ?? 0;
    message.startAfter = object.startAfter ?? "";
    message.chainId = object.chainId ?? "";
    message.joinState = object.joinState ?? 0;
    return message;
  },
};

function createBaseMultisigsResponse(): MultisigsResponse {
  return { multisigs: [] };
}

export const MultisigsResponse = {
  encode(message: MultisigsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.multisigs) {
      Multisig.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultisigsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultisigsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.multisigs.push(Multisig.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultisigsResponse {
    return {
      multisigs: globalThis.Array.isArray(object?.multisigs)
        ? object.multisigs.map((e: any) => Multisig.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MultisigsResponse): unknown {
    const obj: any = {};
    if (message.multisigs?.length) {
      obj.multisigs = message.multisigs.map((e) => Multisig.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultisigsResponse>, I>>(base?: I): MultisigsResponse {
    return MultisigsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultisigsResponse>, I>>(object: I): MultisigsResponse {
    const message = createBaseMultisigsResponse();
    message.multisigs = object.multisigs?.map((e) => Multisig.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMultisigInfoRequest(): MultisigInfoRequest {
  return { authToken: undefined, multisigAddress: "", chainId: "" };
}

export const MultisigInfoRequest = {
  encode(message: MultisigInfoRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.multisigAddress !== "") {
      writer.uint32(18).string(message.multisigAddress);
    }
    if (message.chainId !== "") {
      writer.uint32(26).string(message.chainId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultisigInfoRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultisigInfoRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authToken = Token.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.multisigAddress = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.chainId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultisigInfoRequest {
    return {
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      multisigAddress: isSet(object.multisigAddress) ? globalThis.String(object.multisigAddress) : "",
      chainId: isSet(object.chainId) ? globalThis.String(object.chainId) : "",
    };
  },

  toJSON(message: MultisigInfoRequest): unknown {
    const obj: any = {};
    if (message.authToken !== undefined) {
      obj.authToken = Token.toJSON(message.authToken);
    }
    if (message.multisigAddress !== "") {
      obj.multisigAddress = message.multisigAddress;
    }
    if (message.chainId !== "") {
      obj.chainId = message.chainId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultisigInfoRequest>, I>>(base?: I): MultisigInfoRequest {
    return MultisigInfoRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultisigInfoRequest>, I>>(object: I): MultisigInfoRequest {
    const message = createBaseMultisigInfoRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.multisigAddress = object.multisigAddress ?? "";
    message.chainId = object.chainId ?? "";
    return message;
  },
};

function createBaseMultisigInfoResponse(): MultisigInfoResponse {
  return { multisig: undefined };
}

export const MultisigInfoResponse = {
  encode(message: MultisigInfoResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.multisig !== undefined) {
      Multisig.encode(message.multisig, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultisigInfoResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultisigInfoResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.multisig = Multisig.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultisigInfoResponse {
    return { multisig: isSet(object.multisig) ? Multisig.fromJSON(object.multisig) : undefined };
  },

  toJSON(message: MultisigInfoResponse): unknown {
    const obj: any = {};
    if (message.multisig !== undefined) {
      obj.multisig = Multisig.toJSON(message.multisig);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultisigInfoResponse>, I>>(base?: I): MultisigInfoResponse {
    return MultisigInfoResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultisigInfoResponse>, I>>(object: I): MultisigInfoResponse {
    const message = createBaseMultisigInfoResponse();
    message.multisig = (object.multisig !== undefined && object.multisig !== null)
      ? Multisig.fromPartial(object.multisig)
      : undefined;
    return message;
  },
};

function createBaseTransactionsRequest(): TransactionsRequest {
  return {
    authToken: undefined,
    limit: 0,
    startAfter: "",
    multisigAddress: "",
    chainId: "",
    types: [],
    executionState: 0,
  };
}

export const TransactionsRequest = {
  encode(message: TransactionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.limit !== 0) {
      writer.uint32(16).uint32(message.limit);
    }
    if (message.startAfter !== "") {
      writer.uint32(26).string(message.startAfter);
    }
    if (message.multisigAddress !== "") {
      writer.uint32(34).string(message.multisigAddress);
    }
    if (message.chainId !== "") {
      writer.uint32(42).string(message.chainId);
    }
    for (const v of message.types) {
      writer.uint32(50).string(v!);
    }
    if (message.executionState !== 0) {
      writer.uint32(56).int32(message.executionState);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authToken = Token.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.limit = reader.uint32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.startAfter = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.multisigAddress = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.chainId = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.types.push(reader.string());
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.executionState = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransactionsRequest {
    return {
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      startAfter: isSet(object.startAfter) ? globalThis.String(object.startAfter) : "",
      multisigAddress: isSet(object.multisigAddress) ? globalThis.String(object.multisigAddress) : "",
      chainId: isSet(object.chainId) ? globalThis.String(object.chainId) : "",
      types: globalThis.Array.isArray(object?.types) ? object.types.map((e: any) => globalThis.String(e)) : [],
      executionState: isSet(object.executionState) ? executionStateFromJSON(object.executionState) : 0,
    };
  },

  toJSON(message: TransactionsRequest): unknown {
    const obj: any = {};
    if (message.authToken !== undefined) {
      obj.authToken = Token.toJSON(message.authToken);
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.startAfter !== "") {
      obj.startAfter = message.startAfter;
    }
    if (message.multisigAddress !== "") {
      obj.multisigAddress = message.multisigAddress;
    }
    if (message.chainId !== "") {
      obj.chainId = message.chainId;
    }
    if (message.types?.length) {
      obj.types = message.types;
    }
    if (message.executionState !== 0) {
      obj.executionState = executionStateToJSON(message.executionState);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionsRequest>, I>>(base?: I): TransactionsRequest {
    return TransactionsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransactionsRequest>, I>>(object: I): TransactionsRequest {
    const message = createBaseTransactionsRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.limit = object.limit ?? 0;
    message.startAfter = object.startAfter ?? "";
    message.multisigAddress = object.multisigAddress ?? "";
    message.chainId = object.chainId ?? "";
    message.types = object.types?.map((e) => e) || [];
    message.executionState = object.executionState ?? 0;
    return message;
  },
};

function createBaseTransactionsResponse(): TransactionsResponse {
  return { transactions: [] };
}

export const TransactionsResponse = {
  encode(message: TransactionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.transactions) {
      Transaction.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.transactions.push(Transaction.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransactionsResponse {
    return {
      transactions: globalThis.Array.isArray(object?.transactions)
        ? object.transactions.map((e: any) => Transaction.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TransactionsResponse): unknown {
    const obj: any = {};
    if (message.transactions?.length) {
      obj.transactions = message.transactions.map((e) => Transaction.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionsResponse>, I>>(base?: I): TransactionsResponse {
    return TransactionsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransactionsResponse>, I>>(object: I): TransactionsResponse {
    const message = createBaseTransactionsResponse();
    message.transactions = object.transactions?.map((e) => Transaction.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCreateOrJoinMultisigRequest(): CreateOrJoinMultisigRequest {
  return { chainId: "", multisigPubkeyJson: "", authToken: undefined, name: "", bech32Prefix: "" };
}

export const CreateOrJoinMultisigRequest = {
  encode(message: CreateOrJoinMultisigRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.chainId !== "") {
      writer.uint32(10).string(message.chainId);
    }
    if (message.multisigPubkeyJson !== "") {
      writer.uint32(18).string(message.multisigPubkeyJson);
    }
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(26).fork()).ldelim();
    }
    if (message.name !== "") {
      writer.uint32(34).string(message.name);
    }
    if (message.bech32Prefix !== "") {
      writer.uint32(42).string(message.bech32Prefix);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateOrJoinMultisigRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateOrJoinMultisigRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.chainId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.multisigPubkeyJson = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.authToken = Token.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.name = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.bech32Prefix = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateOrJoinMultisigRequest {
    return {
      chainId: isSet(object.chainId) ? globalThis.String(object.chainId) : "",
      multisigPubkeyJson: isSet(object.multisigPubkeyJson) ? globalThis.String(object.multisigPubkeyJson) : "",
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      bech32Prefix: isSet(object.bech32Prefix) ? globalThis.String(object.bech32Prefix) : "",
    };
  },

  toJSON(message: CreateOrJoinMultisigRequest): unknown {
    const obj: any = {};
    if (message.chainId !== "") {
      obj.chainId = message.chainId;
    }
    if (message.multisigPubkeyJson !== "") {
      obj.multisigPubkeyJson = message.multisigPubkeyJson;
    }
    if (message.authToken !== undefined) {
      obj.authToken = Token.toJSON(message.authToken);
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.bech32Prefix !== "") {
      obj.bech32Prefix = message.bech32Prefix;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateOrJoinMultisigRequest>, I>>(base?: I): CreateOrJoinMultisigRequest {
    return CreateOrJoinMultisigRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateOrJoinMultisigRequest>, I>>(object: I): CreateOrJoinMultisigRequest {
    const message = createBaseCreateOrJoinMultisigRequest();
    message.chainId = object.chainId ?? "";
    message.multisigPubkeyJson = object.multisigPubkeyJson ?? "";
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.name = object.name ?? "";
    message.bech32Prefix = object.bech32Prefix ?? "";
    return message;
  },
};

function createBaseCreateOrJoinMultisigResponse(): CreateOrJoinMultisigResponse {
  return { created: false, joined: false, multisigAddress: "" };
}

export const CreateOrJoinMultisigResponse = {
  encode(message: CreateOrJoinMultisigResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.created === true) {
      writer.uint32(8).bool(message.created);
    }
    if (message.joined === true) {
      writer.uint32(16).bool(message.joined);
    }
    if (message.multisigAddress !== "") {
      writer.uint32(26).string(message.multisigAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateOrJoinMultisigResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateOrJoinMultisigResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.created = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.joined = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.multisigAddress = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateOrJoinMultisigResponse {
    return {
      created: isSet(object.created) ? globalThis.Boolean(object.created) : false,
      joined: isSet(object.joined) ? globalThis.Boolean(object.joined) : false,
      multisigAddress: isSet(object.multisigAddress) ? globalThis.String(object.multisigAddress) : "",
    };
  },

  toJSON(message: CreateOrJoinMultisigResponse): unknown {
    const obj: any = {};
    if (message.created === true) {
      obj.created = message.created;
    }
    if (message.joined === true) {
      obj.joined = message.joined;
    }
    if (message.multisigAddress !== "") {
      obj.multisigAddress = message.multisigAddress;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateOrJoinMultisigResponse>, I>>(base?: I): CreateOrJoinMultisigResponse {
    return CreateOrJoinMultisigResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateOrJoinMultisigResponse>, I>>(object: I): CreateOrJoinMultisigResponse {
    const message = createBaseCreateOrJoinMultisigResponse();
    message.created = object.created ?? false;
    message.joined = object.joined ?? false;
    message.multisigAddress = object.multisigAddress ?? "";
    return message;
  },
};

function createBaseLeaveMultisigRequest(): LeaveMultisigRequest {
  return { multisigAddress: "", authToken: undefined, chainId: "" };
}

export const LeaveMultisigRequest = {
  encode(message: LeaveMultisigRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.multisigAddress !== "") {
      writer.uint32(10).string(message.multisigAddress);
    }
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(18).fork()).ldelim();
    }
    if (message.chainId !== "") {
      writer.uint32(26).string(message.chainId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveMultisigRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveMultisigRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.multisigAddress = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.authToken = Token.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.chainId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LeaveMultisigRequest {
    return {
      multisigAddress: isSet(object.multisigAddress) ? globalThis.String(object.multisigAddress) : "",
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      chainId: isSet(object.chainId) ? globalThis.String(object.chainId) : "",
    };
  },

  toJSON(message: LeaveMultisigRequest): unknown {
    const obj: any = {};
    if (message.multisigAddress !== "") {
      obj.multisigAddress = message.multisigAddress;
    }
    if (message.authToken !== undefined) {
      obj.authToken = Token.toJSON(message.authToken);
    }
    if (message.chainId !== "") {
      obj.chainId = message.chainId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LeaveMultisigRequest>, I>>(base?: I): LeaveMultisigRequest {
    return LeaveMultisigRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LeaveMultisigRequest>, I>>(object: I): LeaveMultisigRequest {
    const message = createBaseLeaveMultisigRequest();
    message.multisigAddress = object.multisigAddress ?? "";
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.chainId = object.chainId ?? "";
    return message;
  },
};

function createBaseLeaveMultisigResponse(): LeaveMultisigResponse {
  return { left: false };
}

export const LeaveMultisigResponse = {
  encode(message: LeaveMultisigResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.left === true) {
      writer.uint32(8).bool(message.left);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveMultisigResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveMultisigResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.left = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LeaveMultisigResponse {
    return { left: isSet(object.left) ? globalThis.Boolean(object.left) : false };
  },

  toJSON(message: LeaveMultisigResponse): unknown {
    const obj: any = {};
    if (message.left === true) {
      obj.left = message.left;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LeaveMultisigResponse>, I>>(base?: I): LeaveMultisigResponse {
    return LeaveMultisigResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LeaveMultisigResponse>, I>>(object: I): LeaveMultisigResponse {
    const message = createBaseLeaveMultisigResponse();
    message.left = object.left ?? false;
    return message;
  },
};

function createBaseCreateTransactionRequest(): CreateTransactionRequest {
  return {
    authToken: undefined,
    multisigAddress: "",
    accountNumber: 0,
    sequence: 0,
    msgs: [],
    feeJson: "",
    chainId: "",
  };
}

export const CreateTransactionRequest = {
  encode(message: CreateTransactionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.multisigAddress !== "") {
      writer.uint32(26).string(message.multisigAddress);
    }
    if (message.accountNumber !== 0) {
      writer.uint32(32).uint32(message.accountNumber);
    }
    if (message.sequence !== 0) {
      writer.uint32(40).uint32(message.sequence);
    }
    for (const v of message.msgs) {
      Any.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.feeJson !== "") {
      writer.uint32(58).string(message.feeJson);
    }
    if (message.chainId !== "") {
      writer.uint32(66).string(message.chainId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateTransactionRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTransactionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authToken = Token.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.multisigAddress = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.accountNumber = reader.uint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.sequence = reader.uint32();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.msgs.push(Any.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.feeJson = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.chainId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateTransactionRequest {
    return {
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      multisigAddress: isSet(object.multisigAddress) ? globalThis.String(object.multisigAddress) : "",
      accountNumber: isSet(object.accountNumber) ? globalThis.Number(object.accountNumber) : 0,
      sequence: isSet(object.sequence) ? globalThis.Number(object.sequence) : 0,
      msgs: globalThis.Array.isArray(object?.msgs) ? object.msgs.map((e: any) => Any.fromJSON(e)) : [],
      feeJson: isSet(object.feeJson) ? globalThis.String(object.feeJson) : "",
      chainId: isSet(object.chainId) ? globalThis.String(object.chainId) : "",
    };
  },

  toJSON(message: CreateTransactionRequest): unknown {
    const obj: any = {};
    if (message.authToken !== undefined) {
      obj.authToken = Token.toJSON(message.authToken);
    }
    if (message.multisigAddress !== "") {
      obj.multisigAddress = message.multisigAddress;
    }
    if (message.accountNumber !== 0) {
      obj.accountNumber = Math.round(message.accountNumber);
    }
    if (message.sequence !== 0) {
      obj.sequence = Math.round(message.sequence);
    }
    if (message.msgs?.length) {
      obj.msgs = message.msgs.map((e) => Any.toJSON(e));
    }
    if (message.feeJson !== "") {
      obj.feeJson = message.feeJson;
    }
    if (message.chainId !== "") {
      obj.chainId = message.chainId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateTransactionRequest>, I>>(base?: I): CreateTransactionRequest {
    return CreateTransactionRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateTransactionRequest>, I>>(object: I): CreateTransactionRequest {
    const message = createBaseCreateTransactionRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.multisigAddress = object.multisigAddress ?? "";
    message.accountNumber = object.accountNumber ?? 0;
    message.sequence = object.sequence ?? 0;
    message.msgs = object.msgs?.map((e) => Any.fromPartial(e)) || [];
    message.feeJson = object.feeJson ?? "";
    message.chainId = object.chainId ?? "";
    return message;
  },
};

function createBaseCreateTransactionResponse(): CreateTransactionResponse {
  return {};
}

export const CreateTransactionResponse = {
  encode(_: CreateTransactionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateTransactionResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTransactionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): CreateTransactionResponse {
    return {};
  },

  toJSON(_: CreateTransactionResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateTransactionResponse>, I>>(base?: I): CreateTransactionResponse {
    return CreateTransactionResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateTransactionResponse>, I>>(_: I): CreateTransactionResponse {
    const message = createBaseCreateTransactionResponse();
    return message;
  },
};

function createBaseSignTransactionRequest(): SignTransactionRequest {
  return { authToken: undefined, signature: "", transactionId: 0, bodyBytes: new Uint8Array(0) };
}

export const SignTransactionRequest = {
  encode(message: SignTransactionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.signature !== "") {
      writer.uint32(18).string(message.signature);
    }
    if (message.transactionId !== 0) {
      writer.uint32(24).uint32(message.transactionId);
    }
    if (message.bodyBytes.length !== 0) {
      writer.uint32(34).bytes(message.bodyBytes);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignTransactionRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignTransactionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authToken = Token.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.signature = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.transactionId = reader.uint32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.bodyBytes = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SignTransactionRequest {
    return {
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      signature: isSet(object.signature) ? globalThis.String(object.signature) : "",
      transactionId: isSet(object.transactionId) ? globalThis.Number(object.transactionId) : 0,
      bodyBytes: isSet(object.bodyBytes) ? bytesFromBase64(object.bodyBytes) : new Uint8Array(0),
    };
  },

  toJSON(message: SignTransactionRequest): unknown {
    const obj: any = {};
    if (message.authToken !== undefined) {
      obj.authToken = Token.toJSON(message.authToken);
    }
    if (message.signature !== "") {
      obj.signature = message.signature;
    }
    if (message.transactionId !== 0) {
      obj.transactionId = Math.round(message.transactionId);
    }
    if (message.bodyBytes.length !== 0) {
      obj.bodyBytes = base64FromBytes(message.bodyBytes);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SignTransactionRequest>, I>>(base?: I): SignTransactionRequest {
    return SignTransactionRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SignTransactionRequest>, I>>(object: I): SignTransactionRequest {
    const message = createBaseSignTransactionRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.signature = object.signature ?? "";
    message.transactionId = object.transactionId ?? 0;
    message.bodyBytes = object.bodyBytes ?? new Uint8Array(0);
    return message;
  },
};

function createBaseSignTransactionResponse(): SignTransactionResponse {
  return {};
}

export const SignTransactionResponse = {
  encode(_: SignTransactionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignTransactionResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignTransactionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): SignTransactionResponse {
    return {};
  },

  toJSON(_: SignTransactionResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SignTransactionResponse>, I>>(base?: I): SignTransactionResponse {
    return SignTransactionResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SignTransactionResponse>, I>>(_: I): SignTransactionResponse {
    const message = createBaseSignTransactionResponse();
    return message;
  },
};

function createBaseCompleteTransactionRequest(): CompleteTransactionRequest {
  return { authToken: undefined, transactionId: 0, finalHash: "" };
}

export const CompleteTransactionRequest = {
  encode(message: CompleteTransactionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.transactionId !== 0) {
      writer.uint32(16).uint32(message.transactionId);
    }
    if (message.finalHash !== "") {
      writer.uint32(26).string(message.finalHash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CompleteTransactionRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCompleteTransactionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authToken = Token.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.transactionId = reader.uint32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.finalHash = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CompleteTransactionRequest {
    return {
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      transactionId: isSet(object.transactionId) ? globalThis.Number(object.transactionId) : 0,
      finalHash: isSet(object.finalHash) ? globalThis.String(object.finalHash) : "",
    };
  },

  toJSON(message: CompleteTransactionRequest): unknown {
    const obj: any = {};
    if (message.authToken !== undefined) {
      obj.authToken = Token.toJSON(message.authToken);
    }
    if (message.transactionId !== 0) {
      obj.transactionId = Math.round(message.transactionId);
    }
    if (message.finalHash !== "") {
      obj.finalHash = message.finalHash;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CompleteTransactionRequest>, I>>(base?: I): CompleteTransactionRequest {
    return CompleteTransactionRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CompleteTransactionRequest>, I>>(object: I): CompleteTransactionRequest {
    const message = createBaseCompleteTransactionRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.transactionId = object.transactionId ?? 0;
    message.finalHash = object.finalHash ?? "";
    return message;
  },
};

function createBaseCompleteTransactionResponse(): CompleteTransactionResponse {
  return {};
}

export const CompleteTransactionResponse = {
  encode(_: CompleteTransactionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CompleteTransactionResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCompleteTransactionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): CompleteTransactionResponse {
    return {};
  },

  toJSON(_: CompleteTransactionResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CompleteTransactionResponse>, I>>(base?: I): CompleteTransactionResponse {
    return CompleteTransactionResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CompleteTransactionResponse>, I>>(_: I): CompleteTransactionResponse {
    const message = createBaseCompleteTransactionResponse();
    return message;
  },
};

function createBaseClearSignaturesRequest(): ClearSignaturesRequest {
  return { authToken: undefined, multisigChainId: "", multisigAddress: "", sequence: 0 };
}

export const ClearSignaturesRequest = {
  encode(message: ClearSignaturesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.multisigChainId !== "") {
      writer.uint32(18).string(message.multisigChainId);
    }
    if (message.multisigAddress !== "") {
      writer.uint32(26).string(message.multisigAddress);
    }
    if (message.sequence !== 0) {
      writer.uint32(32).uint32(message.sequence);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClearSignaturesRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClearSignaturesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authToken = Token.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.multisigChainId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.multisigAddress = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.sequence = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ClearSignaturesRequest {
    return {
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      multisigChainId: isSet(object.multisigChainId) ? globalThis.String(object.multisigChainId) : "",
      multisigAddress: isSet(object.multisigAddress) ? globalThis.String(object.multisigAddress) : "",
      sequence: isSet(object.sequence) ? globalThis.Number(object.sequence) : 0,
    };
  },

  toJSON(message: ClearSignaturesRequest): unknown {
    const obj: any = {};
    if (message.authToken !== undefined) {
      obj.authToken = Token.toJSON(message.authToken);
    }
    if (message.multisigChainId !== "") {
      obj.multisigChainId = message.multisigChainId;
    }
    if (message.multisigAddress !== "") {
      obj.multisigAddress = message.multisigAddress;
    }
    if (message.sequence !== 0) {
      obj.sequence = Math.round(message.sequence);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ClearSignaturesRequest>, I>>(base?: I): ClearSignaturesRequest {
    return ClearSignaturesRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ClearSignaturesRequest>, I>>(object: I): ClearSignaturesRequest {
    const message = createBaseClearSignaturesRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.multisigChainId = object.multisigChainId ?? "";
    message.multisigAddress = object.multisigAddress ?? "";
    message.sequence = object.sequence ?? 0;
    return message;
  },
};

function createBaseClearSignaturesResponse(): ClearSignaturesResponse {
  return {};
}

export const ClearSignaturesResponse = {
  encode(_: ClearSignaturesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClearSignaturesResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClearSignaturesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): ClearSignaturesResponse {
    return {};
  },

  toJSON(_: ClearSignaturesResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ClearSignaturesResponse>, I>>(base?: I): ClearSignaturesResponse {
    return ClearSignaturesResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ClearSignaturesResponse>, I>>(_: I): ClearSignaturesResponse {
    const message = createBaseClearSignaturesResponse();
    return message;
  },
};

function createBaseGetChallengeRequest(): GetChallengeRequest {
  return {};
}

export const GetChallengeRequest = {
  encode(_: GetChallengeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetChallengeRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetChallengeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): GetChallengeRequest {
    return {};
  },

  toJSON(_: GetChallengeRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetChallengeRequest>, I>>(base?: I): GetChallengeRequest {
    return GetChallengeRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetChallengeRequest>, I>>(_: I): GetChallengeRequest {
    const message = createBaseGetChallengeRequest();
    return message;
  },
};

function createBaseGetChallengeResponse(): GetChallengeResponse {
  return { challenge: undefined };
}

export const GetChallengeResponse = {
  encode(message: GetChallengeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.challenge !== undefined) {
      Challenge.encode(message.challenge, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetChallengeResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetChallengeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.challenge = Challenge.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetChallengeResponse {
    return { challenge: isSet(object.challenge) ? Challenge.fromJSON(object.challenge) : undefined };
  },

  toJSON(message: GetChallengeResponse): unknown {
    const obj: any = {};
    if (message.challenge !== undefined) {
      obj.challenge = Challenge.toJSON(message.challenge);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetChallengeResponse>, I>>(base?: I): GetChallengeResponse {
    return GetChallengeResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetChallengeResponse>, I>>(object: I): GetChallengeResponse {
    const message = createBaseGetChallengeResponse();
    message.challenge = (object.challenge !== undefined && object.challenge !== null)
      ? Challenge.fromPartial(object.challenge)
      : undefined;
    return message;
  },
};

function createBaseTokenRequestInfo(): TokenRequestInfo {
  return { kind: "", challenge: undefined, userBech32Prefix: "", userPubkeyJson: "" };
}

export const TokenRequestInfo = {
  encode(message: TokenRequestInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.kind !== "") {
      writer.uint32(10).string(message.kind);
    }
    if (message.challenge !== undefined) {
      Challenge.encode(message.challenge, writer.uint32(18).fork()).ldelim();
    }
    if (message.userBech32Prefix !== "") {
      writer.uint32(26).string(message.userBech32Prefix);
    }
    if (message.userPubkeyJson !== "") {
      writer.uint32(34).string(message.userPubkeyJson);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenRequestInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenRequestInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.kind = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.challenge = Challenge.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.userBech32Prefix = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.userPubkeyJson = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TokenRequestInfo {
    return {
      kind: isSet(object.kind) ? globalThis.String(object.kind) : "",
      challenge: isSet(object.challenge) ? Challenge.fromJSON(object.challenge) : undefined,
      userBech32Prefix: isSet(object.userBech32Prefix) ? globalThis.String(object.userBech32Prefix) : "",
      userPubkeyJson: isSet(object.userPubkeyJson) ? globalThis.String(object.userPubkeyJson) : "",
    };
  },

  toJSON(message: TokenRequestInfo): unknown {
    const obj: any = {};
    if (message.kind !== "") {
      obj.kind = message.kind;
    }
    if (message.challenge !== undefined) {
      obj.challenge = Challenge.toJSON(message.challenge);
    }
    if (message.userBech32Prefix !== "") {
      obj.userBech32Prefix = message.userBech32Prefix;
    }
    if (message.userPubkeyJson !== "") {
      obj.userPubkeyJson = message.userPubkeyJson;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TokenRequestInfo>, I>>(base?: I): TokenRequestInfo {
    return TokenRequestInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TokenRequestInfo>, I>>(object: I): TokenRequestInfo {
    const message = createBaseTokenRequestInfo();
    message.kind = object.kind ?? "";
    message.challenge = (object.challenge !== undefined && object.challenge !== null)
      ? Challenge.fromPartial(object.challenge)
      : undefined;
    message.userBech32Prefix = object.userBech32Prefix ?? "";
    message.userPubkeyJson = object.userPubkeyJson ?? "";
    return message;
  },
};

function createBaseGetTokenRequest(): GetTokenRequest {
  return { infoJson: "", userSignature: "" };
}

export const GetTokenRequest = {
  encode(message: GetTokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.infoJson !== "") {
      writer.uint32(10).string(message.infoJson);
    }
    if (message.userSignature !== "") {
      writer.uint32(18).string(message.userSignature);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTokenRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.infoJson = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.userSignature = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetTokenRequest {
    return {
      infoJson: isSet(object.infoJson) ? globalThis.String(object.infoJson) : "",
      userSignature: isSet(object.userSignature) ? globalThis.String(object.userSignature) : "",
    };
  },

  toJSON(message: GetTokenRequest): unknown {
    const obj: any = {};
    if (message.infoJson !== "") {
      obj.infoJson = message.infoJson;
    }
    if (message.userSignature !== "") {
      obj.userSignature = message.userSignature;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTokenRequest>, I>>(base?: I): GetTokenRequest {
    return GetTokenRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetTokenRequest>, I>>(object: I): GetTokenRequest {
    const message = createBaseGetTokenRequest();
    message.infoJson = object.infoJson ?? "";
    message.userSignature = object.userSignature ?? "";
    return message;
  },
};

function createBaseGetTokenResponse(): GetTokenResponse {
  return { authToken: undefined };
}

export const GetTokenResponse = {
  encode(message: GetTokenResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTokenResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTokenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authToken = Token.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetTokenResponse {
    return { authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined };
  },

  toJSON(message: GetTokenResponse): unknown {
    const obj: any = {};
    if (message.authToken !== undefined) {
      obj.authToken = Token.toJSON(message.authToken);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTokenResponse>, I>>(base?: I): GetTokenResponse {
    return GetTokenResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetTokenResponse>, I>>(object: I): GetTokenResponse {
    const message = createBaseGetTokenResponse();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    return message;
  },
};

function createBaseTransactionsCountsRequest(): TransactionsCountsRequest {
  return { authToken: undefined, multisigAddress: "", chainId: "" };
}

export const TransactionsCountsRequest = {
  encode(message: TransactionsCountsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.multisigAddress !== "") {
      writer.uint32(18).string(message.multisigAddress);
    }
    if (message.chainId !== "") {
      writer.uint32(26).string(message.chainId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionsCountsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionsCountsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authToken = Token.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.multisigAddress = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.chainId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransactionsCountsRequest {
    return {
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      multisigAddress: isSet(object.multisigAddress) ? globalThis.String(object.multisigAddress) : "",
      chainId: isSet(object.chainId) ? globalThis.String(object.chainId) : "",
    };
  },

  toJSON(message: TransactionsCountsRequest): unknown {
    const obj: any = {};
    if (message.authToken !== undefined) {
      obj.authToken = Token.toJSON(message.authToken);
    }
    if (message.multisigAddress !== "") {
      obj.multisigAddress = message.multisigAddress;
    }
    if (message.chainId !== "") {
      obj.chainId = message.chainId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionsCountsRequest>, I>>(base?: I): TransactionsCountsRequest {
    return TransactionsCountsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransactionsCountsRequest>, I>>(object: I): TransactionsCountsRequest {
    const message = createBaseTransactionsCountsRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.multisigAddress = object.multisigAddress ?? "";
    message.chainId = object.chainId ?? "";
    return message;
  },
};

function createBaseTransactionsCount(): TransactionsCount {
  return { total: 0, pending: 0, executed: 0, type: "" };
}

export const TransactionsCount = {
  encode(message: TransactionsCount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.total !== 0) {
      writer.uint32(8).uint32(message.total);
    }
    if (message.pending !== 0) {
      writer.uint32(16).uint32(message.pending);
    }
    if (message.executed !== 0) {
      writer.uint32(24).uint32(message.executed);
    }
    if (message.type !== "") {
      writer.uint32(34).string(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionsCount {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionsCount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.total = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.pending = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.executed = reader.uint32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.type = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransactionsCount {
    return {
      total: isSet(object.total) ? globalThis.Number(object.total) : 0,
      pending: isSet(object.pending) ? globalThis.Number(object.pending) : 0,
      executed: isSet(object.executed) ? globalThis.Number(object.executed) : 0,
      type: isSet(object.type) ? globalThis.String(object.type) : "",
    };
  },

  toJSON(message: TransactionsCount): unknown {
    const obj: any = {};
    if (message.total !== 0) {
      obj.total = Math.round(message.total);
    }
    if (message.pending !== 0) {
      obj.pending = Math.round(message.pending);
    }
    if (message.executed !== 0) {
      obj.executed = Math.round(message.executed);
    }
    if (message.type !== "") {
      obj.type = message.type;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionsCount>, I>>(base?: I): TransactionsCount {
    return TransactionsCount.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransactionsCount>, I>>(object: I): TransactionsCount {
    const message = createBaseTransactionsCount();
    message.total = object.total ?? 0;
    message.pending = object.pending ?? 0;
    message.executed = object.executed ?? 0;
    message.type = object.type ?? "";
    return message;
  },
};

function createBaseTransactionsCountsResponse(): TransactionsCountsResponse {
  return { all: undefined, byType: [] };
}

export const TransactionsCountsResponse = {
  encode(message: TransactionsCountsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.all !== undefined) {
      TransactionsCount.encode(message.all, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.byType) {
      TransactionsCount.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionsCountsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionsCountsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.all = TransactionsCount.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.byType.push(TransactionsCount.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransactionsCountsResponse {
    return {
      all: isSet(object.all) ? TransactionsCount.fromJSON(object.all) : undefined,
      byType: globalThis.Array.isArray(object?.byType)
        ? object.byType.map((e: any) => TransactionsCount.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TransactionsCountsResponse): unknown {
    const obj: any = {};
    if (message.all !== undefined) {
      obj.all = TransactionsCount.toJSON(message.all);
    }
    if (message.byType?.length) {
      obj.byType = message.byType.map((e) => TransactionsCount.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionsCountsResponse>, I>>(base?: I): TransactionsCountsResponse {
    return TransactionsCountsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransactionsCountsResponse>, I>>(object: I): TransactionsCountsResponse {
    const message = createBaseTransactionsCountsResponse();
    message.all = (object.all !== undefined && object.all !== null)
      ? TransactionsCount.fromPartial(object.all)
      : undefined;
    message.byType = object.byType?.map((e) => TransactionsCount.fromPartial(e)) || [];
    return message;
  },
};

function createBaseValidateTokenRequest(): ValidateTokenRequest {
  return { authToken: undefined };
}

export const ValidateTokenRequest = {
  encode(message: ValidateTokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidateTokenRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidateTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authToken = Token.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ValidateTokenRequest {
    return { authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined };
  },

  toJSON(message: ValidateTokenRequest): unknown {
    const obj: any = {};
    if (message.authToken !== undefined) {
      obj.authToken = Token.toJSON(message.authToken);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidateTokenRequest>, I>>(base?: I): ValidateTokenRequest {
    return ValidateTokenRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ValidateTokenRequest>, I>>(object: I): ValidateTokenRequest {
    const message = createBaseValidateTokenRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    return message;
  },
};

function createBaseValidateTokenResponse(): ValidateTokenResponse {
  return {};
}

export const ValidateTokenResponse = {
  encode(_: ValidateTokenResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidateTokenResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidateTokenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): ValidateTokenResponse {
    return {};
  },

  toJSON(_: ValidateTokenResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidateTokenResponse>, I>>(base?: I): ValidateTokenResponse {
    return ValidateTokenResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ValidateTokenResponse>, I>>(_: I): ValidateTokenResponse {
    const message = createBaseValidateTokenResponse();
    return message;
  },
};

export interface MultisigService {
  /** Read */
  Multisigs(request: DeepPartial<MultisigsRequest>, metadata?: grpc.Metadata): Promise<MultisigsResponse>;
  MultisigInfo(request: DeepPartial<MultisigInfoRequest>, metadata?: grpc.Metadata): Promise<MultisigInfoResponse>;
  Transactions(request: DeepPartial<TransactionsRequest>, metadata?: grpc.Metadata): Promise<TransactionsResponse>;
  TransactionsCounts(
    request: DeepPartial<TransactionsCountsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<TransactionsCountsResponse>;
  /** Write */
  CreateOrJoinMultisig(
    request: DeepPartial<CreateOrJoinMultisigRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CreateOrJoinMultisigResponse>;
  LeaveMultisig(request: DeepPartial<LeaveMultisigRequest>, metadata?: grpc.Metadata): Promise<LeaveMultisigResponse>;
  CreateTransaction(
    request: DeepPartial<CreateTransactionRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CreateTransactionResponse>;
  SignTransaction(
    request: DeepPartial<SignTransactionRequest>,
    metadata?: grpc.Metadata,
  ): Promise<SignTransactionResponse>;
  CompleteTransaction(
    request: DeepPartial<CompleteTransactionRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CompleteTransactionResponse>;
  ClearSignatures(
    request: DeepPartial<ClearSignaturesRequest>,
    metadata?: grpc.Metadata,
  ): Promise<ClearSignaturesResponse>;
  /** Auth */
  GetChallenge(request: DeepPartial<GetChallengeRequest>, metadata?: grpc.Metadata): Promise<GetChallengeResponse>;
  GetToken(request: DeepPartial<GetTokenRequest>, metadata?: grpc.Metadata): Promise<GetTokenResponse>;
  ValidateToken(request: DeepPartial<ValidateTokenRequest>, metadata?: grpc.Metadata): Promise<ValidateTokenResponse>;
}

export class MultisigServiceClientImpl implements MultisigService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Multisigs = this.Multisigs.bind(this);
    this.MultisigInfo = this.MultisigInfo.bind(this);
    this.Transactions = this.Transactions.bind(this);
    this.TransactionsCounts = this.TransactionsCounts.bind(this);
    this.CreateOrJoinMultisig = this.CreateOrJoinMultisig.bind(this);
    this.LeaveMultisig = this.LeaveMultisig.bind(this);
    this.CreateTransaction = this.CreateTransaction.bind(this);
    this.SignTransaction = this.SignTransaction.bind(this);
    this.CompleteTransaction = this.CompleteTransaction.bind(this);
    this.ClearSignatures = this.ClearSignatures.bind(this);
    this.GetChallenge = this.GetChallenge.bind(this);
    this.GetToken = this.GetToken.bind(this);
    this.ValidateToken = this.ValidateToken.bind(this);
  }

  Multisigs(request: DeepPartial<MultisigsRequest>, metadata?: grpc.Metadata): Promise<MultisigsResponse> {
    return this.rpc.unary(MultisigServiceMultisigsDesc, MultisigsRequest.fromPartial(request), metadata);
  }

  MultisigInfo(request: DeepPartial<MultisigInfoRequest>, metadata?: grpc.Metadata): Promise<MultisigInfoResponse> {
    return this.rpc.unary(MultisigServiceMultisigInfoDesc, MultisigInfoRequest.fromPartial(request), metadata);
  }

  Transactions(request: DeepPartial<TransactionsRequest>, metadata?: grpc.Metadata): Promise<TransactionsResponse> {
    return this.rpc.unary(MultisigServiceTransactionsDesc, TransactionsRequest.fromPartial(request), metadata);
  }

  TransactionsCounts(
    request: DeepPartial<TransactionsCountsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<TransactionsCountsResponse> {
    return this.rpc.unary(
      MultisigServiceTransactionsCountsDesc,
      TransactionsCountsRequest.fromPartial(request),
      metadata,
    );
  }

  CreateOrJoinMultisig(
    request: DeepPartial<CreateOrJoinMultisigRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CreateOrJoinMultisigResponse> {
    return this.rpc.unary(
      MultisigServiceCreateOrJoinMultisigDesc,
      CreateOrJoinMultisigRequest.fromPartial(request),
      metadata,
    );
  }

  LeaveMultisig(request: DeepPartial<LeaveMultisigRequest>, metadata?: grpc.Metadata): Promise<LeaveMultisigResponse> {
    return this.rpc.unary(MultisigServiceLeaveMultisigDesc, LeaveMultisigRequest.fromPartial(request), metadata);
  }

  CreateTransaction(
    request: DeepPartial<CreateTransactionRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CreateTransactionResponse> {
    return this.rpc.unary(
      MultisigServiceCreateTransactionDesc,
      CreateTransactionRequest.fromPartial(request),
      metadata,
    );
  }

  SignTransaction(
    request: DeepPartial<SignTransactionRequest>,
    metadata?: grpc.Metadata,
  ): Promise<SignTransactionResponse> {
    return this.rpc.unary(MultisigServiceSignTransactionDesc, SignTransactionRequest.fromPartial(request), metadata);
  }

  CompleteTransaction(
    request: DeepPartial<CompleteTransactionRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CompleteTransactionResponse> {
    return this.rpc.unary(
      MultisigServiceCompleteTransactionDesc,
      CompleteTransactionRequest.fromPartial(request),
      metadata,
    );
  }

  ClearSignatures(
    request: DeepPartial<ClearSignaturesRequest>,
    metadata?: grpc.Metadata,
  ): Promise<ClearSignaturesResponse> {
    return this.rpc.unary(MultisigServiceClearSignaturesDesc, ClearSignaturesRequest.fromPartial(request), metadata);
  }

  GetChallenge(request: DeepPartial<GetChallengeRequest>, metadata?: grpc.Metadata): Promise<GetChallengeResponse> {
    return this.rpc.unary(MultisigServiceGetChallengeDesc, GetChallengeRequest.fromPartial(request), metadata);
  }

  GetToken(request: DeepPartial<GetTokenRequest>, metadata?: grpc.Metadata): Promise<GetTokenResponse> {
    return this.rpc.unary(MultisigServiceGetTokenDesc, GetTokenRequest.fromPartial(request), metadata);
  }

  ValidateToken(request: DeepPartial<ValidateTokenRequest>, metadata?: grpc.Metadata): Promise<ValidateTokenResponse> {
    return this.rpc.unary(MultisigServiceValidateTokenDesc, ValidateTokenRequest.fromPartial(request), metadata);
  }
}

export const MultisigServiceDesc = { serviceName: "multisig.v1.MultisigService" };

export const MultisigServiceMultisigsDesc: UnaryMethodDefinitionish = {
  methodName: "Multisigs",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return MultisigsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = MultisigsResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MultisigServiceMultisigInfoDesc: UnaryMethodDefinitionish = {
  methodName: "MultisigInfo",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return MultisigInfoRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = MultisigInfoResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MultisigServiceTransactionsDesc: UnaryMethodDefinitionish = {
  methodName: "Transactions",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return TransactionsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = TransactionsResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MultisigServiceTransactionsCountsDesc: UnaryMethodDefinitionish = {
  methodName: "TransactionsCounts",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return TransactionsCountsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = TransactionsCountsResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MultisigServiceCreateOrJoinMultisigDesc: UnaryMethodDefinitionish = {
  methodName: "CreateOrJoinMultisig",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return CreateOrJoinMultisigRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = CreateOrJoinMultisigResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MultisigServiceLeaveMultisigDesc: UnaryMethodDefinitionish = {
  methodName: "LeaveMultisig",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return LeaveMultisigRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = LeaveMultisigResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MultisigServiceCreateTransactionDesc: UnaryMethodDefinitionish = {
  methodName: "CreateTransaction",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return CreateTransactionRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = CreateTransactionResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MultisigServiceSignTransactionDesc: UnaryMethodDefinitionish = {
  methodName: "SignTransaction",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return SignTransactionRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = SignTransactionResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MultisigServiceCompleteTransactionDesc: UnaryMethodDefinitionish = {
  methodName: "CompleteTransaction",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return CompleteTransactionRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = CompleteTransactionResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MultisigServiceClearSignaturesDesc: UnaryMethodDefinitionish = {
  methodName: "ClearSignatures",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ClearSignaturesRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ClearSignaturesResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MultisigServiceGetChallengeDesc: UnaryMethodDefinitionish = {
  methodName: "GetChallenge",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetChallengeRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GetChallengeResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MultisigServiceGetTokenDesc: UnaryMethodDefinitionish = {
  methodName: "GetToken",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetTokenRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GetTokenResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MultisigServiceValidateTokenDesc: UnaryMethodDefinitionish = {
  methodName: "ValidateToken",
  service: MultisigServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ValidateTokenRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ValidateTokenResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

interface UnaryMethodDefinitionishR extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any;
  responseStream: any;
}

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

interface Rpc {
  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined,
  ): Promise<any>;
}

export class GrpcWebImpl {
  private host: string;
  private options: {
    transport?: grpc.TransportFactory;

    debug?: boolean;
    metadata?: grpc.Metadata;
    upStreamRetryCodes?: number[];
  };

  constructor(
    host: string,
    options: {
      transport?: grpc.TransportFactory;

      debug?: boolean;
      metadata?: grpc.Metadata;
      upStreamRetryCodes?: number[];
    },
  ) {
    this.host = host;
    this.options = options;
  }

  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined,
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata = metadata && this.options.metadata
      ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
      : metadata ?? this.options.metadata;
    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata ?? {},
        ...(this.options.transport !== undefined ? { transport: this.options.transport } : {}),
        debug: this.options.debug ?? false,
        onEnd: function (response) {
          if (response.status === grpc.Code.OK) {
            resolve(response.message!.toObject());
          } else {
            const err = new GrpcWebError(response.statusMessage, response.status, response.trailers);
            reject(err);
          }
        },
      });
    });
  }
}

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export class GrpcWebError extends globalThis.Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
