/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";

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
  createdAt: number;
  chainId: string;
  address: string;
  joined: boolean;
  name: string;
}

export interface Transaction {
  createdAt: number;
  finalHash: string;
  multisigAddress: string;
  chainId: string;
  msgsJson: string;
  feeJson: string;
  accountNumber: number;
  sequence: number;
  creatorAddress: string;
}

export interface Signature {
  createdAt: number;
}

export interface Token {
  nonce: string;
  createdAt: number;
  duration: number;
}

export interface MultisigsRequest {
  authToken: Token | undefined;
  limit: number;
  startAfter: number;
  chainId: string;
  joinState: JoinState;
}

export interface MultisigsResponse {
  multisigs: Multisig[];
}

export interface TransactionsRequest {
  authToken: Token | undefined;
  limit: number;
  startAfter: number;
  executionState: ExecutionState;
  /** if unspecified, return transactions for all multisigs of this user */
  multisigAddress: string;
  chainId: string;
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
}

export interface LeaveMultisigRequest {
  multisigAddress: string;
  authToken: Token | undefined;
  chainId: string;
}

export interface LeaveMultisigResponse {
  left: boolean;
  found: boolean;
}

export interface CreateTransactionRequest {
  authToken: Token | undefined;
  multisigAddress: string;
  accountNumber: number;
  sequence: number;
  msgsJson: string;
  feeJson: string;
  chainId: string;
}

export interface CreateTransactionResponse {
}

export interface SignTransactionRequest {
  authToken: Token | undefined;
}

export interface SignTransactionResponse {
}

export interface GetChallengeRequest {
}

export interface GetChallengeResponse {
  challenge: string;
}

export interface GetTokenRequest {
  challenge: string;
  challengeSignature: string;
  userBech32Prefix: string;
  userPubkeyJson: string;
}

export interface GetTokenResponse {
  authToken: Token | undefined;
}

export interface TransactionsCountsRequest {
  authToken: Token | undefined;
  multisigAddress: string;
}

export interface TransactionsCountsResponse {
  total: number;
  pending: number;
  executed: number;
}

function createBaseMultisig(): Multisig {
  return { createdAt: 0, chainId: "", address: "", joined: false, name: "" };
}

export const Multisig = {
  encode(message: Multisig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.createdAt !== 0) {
      writer.uint32(8).uint32(message.createdAt);
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
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Multisig {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultisig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.createdAt = reader.uint32();
          break;
        case 2:
          message.chainId = reader.string();
          break;
        case 4:
          message.address = reader.string();
          break;
        case 5:
          message.joined = reader.bool();
          break;
        case 6:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Multisig {
    return {
      createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
      chainId: isSet(object.chainId) ? String(object.chainId) : "",
      address: isSet(object.address) ? String(object.address) : "",
      joined: isSet(object.joined) ? Boolean(object.joined) : false,
      name: isSet(object.name) ? String(object.name) : "",
    };
  },

  toJSON(message: Multisig): unknown {
    const obj: any = {};
    message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
    message.chainId !== undefined && (obj.chainId = message.chainId);
    message.address !== undefined && (obj.address = message.address);
    message.joined !== undefined && (obj.joined = message.joined);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Multisig>, I>>(object: I): Multisig {
    const message = createBaseMultisig();
    message.createdAt = object.createdAt ?? 0;
    message.chainId = object.chainId ?? "";
    message.address = object.address ?? "";
    message.joined = object.joined ?? false;
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseTransaction(): Transaction {
  return {
    createdAt: 0,
    finalHash: "",
    multisigAddress: "",
    chainId: "",
    msgsJson: "",
    feeJson: "",
    accountNumber: 0,
    sequence: 0,
    creatorAddress: "",
  };
}

export const Transaction = {
  encode(message: Transaction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.createdAt !== 0) {
      writer.uint32(8).uint32(message.createdAt);
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
    if (message.msgsJson !== "") {
      writer.uint32(42).string(message.msgsJson);
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
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Transaction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransaction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.createdAt = reader.uint32();
          break;
        case 2:
          message.finalHash = reader.string();
          break;
        case 3:
          message.multisigAddress = reader.string();
          break;
        case 4:
          message.chainId = reader.string();
          break;
        case 5:
          message.msgsJson = reader.string();
          break;
        case 6:
          message.feeJson = reader.string();
          break;
        case 7:
          message.accountNumber = reader.uint32();
          break;
        case 8:
          message.sequence = reader.uint32();
          break;
        case 9:
          message.creatorAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Transaction {
    return {
      createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
      finalHash: isSet(object.finalHash) ? String(object.finalHash) : "",
      multisigAddress: isSet(object.multisigAddress) ? String(object.multisigAddress) : "",
      chainId: isSet(object.chainId) ? String(object.chainId) : "",
      msgsJson: isSet(object.msgsJson) ? String(object.msgsJson) : "",
      feeJson: isSet(object.feeJson) ? String(object.feeJson) : "",
      accountNumber: isSet(object.accountNumber) ? Number(object.accountNumber) : 0,
      sequence: isSet(object.sequence) ? Number(object.sequence) : 0,
      creatorAddress: isSet(object.creatorAddress) ? String(object.creatorAddress) : "",
    };
  },

  toJSON(message: Transaction): unknown {
    const obj: any = {};
    message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
    message.finalHash !== undefined && (obj.finalHash = message.finalHash);
    message.multisigAddress !== undefined && (obj.multisigAddress = message.multisigAddress);
    message.chainId !== undefined && (obj.chainId = message.chainId);
    message.msgsJson !== undefined && (obj.msgsJson = message.msgsJson);
    message.feeJson !== undefined && (obj.feeJson = message.feeJson);
    message.accountNumber !== undefined && (obj.accountNumber = Math.round(message.accountNumber));
    message.sequence !== undefined && (obj.sequence = Math.round(message.sequence));
    message.creatorAddress !== undefined && (obj.creatorAddress = message.creatorAddress);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Transaction>, I>>(object: I): Transaction {
    const message = createBaseTransaction();
    message.createdAt = object.createdAt ?? 0;
    message.finalHash = object.finalHash ?? "";
    message.multisigAddress = object.multisigAddress ?? "";
    message.chainId = object.chainId ?? "";
    message.msgsJson = object.msgsJson ?? "";
    message.feeJson = object.feeJson ?? "";
    message.accountNumber = object.accountNumber ?? 0;
    message.sequence = object.sequence ?? 0;
    message.creatorAddress = object.creatorAddress ?? "";
    return message;
  },
};

function createBaseSignature(): Signature {
  return { createdAt: 0 };
}

export const Signature = {
  encode(message: Signature, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.createdAt !== 0) {
      writer.uint32(8).uint32(message.createdAt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Signature {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignature();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.createdAt = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Signature {
    return { createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0 };
  },

  toJSON(message: Signature): unknown {
    const obj: any = {};
    message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Signature>, I>>(object: I): Signature {
    const message = createBaseSignature();
    message.createdAt = object.createdAt ?? 0;
    return message;
  },
};

function createBaseToken(): Token {
  return { nonce: "", createdAt: 0, duration: 0 };
}

export const Token = {
  encode(message: Token, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nonce !== "") {
      writer.uint32(10).string(message.nonce);
    }
    if (message.createdAt !== 0) {
      writer.uint32(16).uint32(message.createdAt);
    }
    if (message.duration !== 0) {
      writer.uint32(24).uint32(message.duration);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Token {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseToken();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nonce = reader.string();
          break;
        case 2:
          message.createdAt = reader.uint32();
          break;
        case 3:
          message.duration = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Token {
    return {
      nonce: isSet(object.nonce) ? String(object.nonce) : "",
      createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
      duration: isSet(object.duration) ? Number(object.duration) : 0,
    };
  },

  toJSON(message: Token): unknown {
    const obj: any = {};
    message.nonce !== undefined && (obj.nonce = message.nonce);
    message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
    message.duration !== undefined && (obj.duration = Math.round(message.duration));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Token>, I>>(object: I): Token {
    const message = createBaseToken();
    message.nonce = object.nonce ?? "";
    message.createdAt = object.createdAt ?? 0;
    message.duration = object.duration ?? 0;
    return message;
  },
};

function createBaseMultisigsRequest(): MultisigsRequest {
  return { authToken: undefined, limit: 0, startAfter: 0, chainId: "", joinState: 0 };
}

export const MultisigsRequest = {
  encode(message: MultisigsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.limit !== 0) {
      writer.uint32(16).uint32(message.limit);
    }
    if (message.startAfter !== 0) {
      writer.uint32(24).uint32(message.startAfter);
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultisigsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authToken = Token.decode(reader, reader.uint32());
          break;
        case 2:
          message.limit = reader.uint32();
          break;
        case 3:
          message.startAfter = reader.uint32();
          break;
        case 4:
          message.chainId = reader.string();
          break;
        case 5:
          message.joinState = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MultisigsRequest {
    return {
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      startAfter: isSet(object.startAfter) ? Number(object.startAfter) : 0,
      chainId: isSet(object.chainId) ? String(object.chainId) : "",
      joinState: isSet(object.joinState) ? joinStateFromJSON(object.joinState) : 0,
    };
  },

  toJSON(message: MultisigsRequest): unknown {
    const obj: any = {};
    message.authToken !== undefined &&
      (obj.authToken = message.authToken ? Token.toJSON(message.authToken) : undefined);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.startAfter !== undefined && (obj.startAfter = Math.round(message.startAfter));
    message.chainId !== undefined && (obj.chainId = message.chainId);
    message.joinState !== undefined && (obj.joinState = joinStateToJSON(message.joinState));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MultisigsRequest>, I>>(object: I): MultisigsRequest {
    const message = createBaseMultisigsRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.limit = object.limit ?? 0;
    message.startAfter = object.startAfter ?? 0;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultisigsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.multisigs.push(Multisig.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MultisigsResponse {
    return {
      multisigs: Array.isArray(object?.multisigs) ? object.multisigs.map((e: any) => Multisig.fromJSON(e)) : [],
    };
  },

  toJSON(message: MultisigsResponse): unknown {
    const obj: any = {};
    if (message.multisigs) {
      obj.multisigs = message.multisigs.map((e) => e ? Multisig.toJSON(e) : undefined);
    } else {
      obj.multisigs = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MultisigsResponse>, I>>(object: I): MultisigsResponse {
    const message = createBaseMultisigsResponse();
    message.multisigs = object.multisigs?.map((e) => Multisig.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTransactionsRequest(): TransactionsRequest {
  return { authToken: undefined, limit: 0, startAfter: 0, executionState: 0, multisigAddress: "", chainId: "" };
}

export const TransactionsRequest = {
  encode(message: TransactionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.limit !== 0) {
      writer.uint32(16).uint32(message.limit);
    }
    if (message.startAfter !== 0) {
      writer.uint32(24).uint32(message.startAfter);
    }
    if (message.executionState !== 0) {
      writer.uint32(32).int32(message.executionState);
    }
    if (message.multisigAddress !== "") {
      writer.uint32(50).string(message.multisigAddress);
    }
    if (message.chainId !== "") {
      writer.uint32(58).string(message.chainId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authToken = Token.decode(reader, reader.uint32());
          break;
        case 2:
          message.limit = reader.uint32();
          break;
        case 3:
          message.startAfter = reader.uint32();
          break;
        case 4:
          message.executionState = reader.int32() as any;
          break;
        case 6:
          message.multisigAddress = reader.string();
          break;
        case 7:
          message.chainId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionsRequest {
    return {
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      startAfter: isSet(object.startAfter) ? Number(object.startAfter) : 0,
      executionState: isSet(object.executionState) ? executionStateFromJSON(object.executionState) : 0,
      multisigAddress: isSet(object.multisigAddress) ? String(object.multisigAddress) : "",
      chainId: isSet(object.chainId) ? String(object.chainId) : "",
    };
  },

  toJSON(message: TransactionsRequest): unknown {
    const obj: any = {};
    message.authToken !== undefined &&
      (obj.authToken = message.authToken ? Token.toJSON(message.authToken) : undefined);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.startAfter !== undefined && (obj.startAfter = Math.round(message.startAfter));
    message.executionState !== undefined && (obj.executionState = executionStateToJSON(message.executionState));
    message.multisigAddress !== undefined && (obj.multisigAddress = message.multisigAddress);
    message.chainId !== undefined && (obj.chainId = message.chainId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TransactionsRequest>, I>>(object: I): TransactionsRequest {
    const message = createBaseTransactionsRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.limit = object.limit ?? 0;
    message.startAfter = object.startAfter ?? 0;
    message.executionState = object.executionState ?? 0;
    message.multisigAddress = object.multisigAddress ?? "";
    message.chainId = object.chainId ?? "";
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactions.push(Transaction.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionsResponse {
    return {
      transactions: Array.isArray(object?.transactions)
        ? object.transactions.map((e: any) => Transaction.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TransactionsResponse): unknown {
    const obj: any = {};
    if (message.transactions) {
      obj.transactions = message.transactions.map((e) => e ? Transaction.toJSON(e) : undefined);
    } else {
      obj.transactions = [];
    }
    return obj;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateOrJoinMultisigRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chainId = reader.string();
          break;
        case 2:
          message.multisigPubkeyJson = reader.string();
          break;
        case 3:
          message.authToken = Token.decode(reader, reader.uint32());
          break;
        case 4:
          message.name = reader.string();
          break;
        case 5:
          message.bech32Prefix = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateOrJoinMultisigRequest {
    return {
      chainId: isSet(object.chainId) ? String(object.chainId) : "",
      multisigPubkeyJson: isSet(object.multisigPubkeyJson) ? String(object.multisigPubkeyJson) : "",
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      name: isSet(object.name) ? String(object.name) : "",
      bech32Prefix: isSet(object.bech32Prefix) ? String(object.bech32Prefix) : "",
    };
  },

  toJSON(message: CreateOrJoinMultisigRequest): unknown {
    const obj: any = {};
    message.chainId !== undefined && (obj.chainId = message.chainId);
    message.multisigPubkeyJson !== undefined && (obj.multisigPubkeyJson = message.multisigPubkeyJson);
    message.authToken !== undefined &&
      (obj.authToken = message.authToken ? Token.toJSON(message.authToken) : undefined);
    message.name !== undefined && (obj.name = message.name);
    message.bech32Prefix !== undefined && (obj.bech32Prefix = message.bech32Prefix);
    return obj;
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
  return { created: false, joined: false };
}

export const CreateOrJoinMultisigResponse = {
  encode(message: CreateOrJoinMultisigResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.created === true) {
      writer.uint32(8).bool(message.created);
    }
    if (message.joined === true) {
      writer.uint32(16).bool(message.joined);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateOrJoinMultisigResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateOrJoinMultisigResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.created = reader.bool();
          break;
        case 2:
          message.joined = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateOrJoinMultisigResponse {
    return {
      created: isSet(object.created) ? Boolean(object.created) : false,
      joined: isSet(object.joined) ? Boolean(object.joined) : false,
    };
  },

  toJSON(message: CreateOrJoinMultisigResponse): unknown {
    const obj: any = {};
    message.created !== undefined && (obj.created = message.created);
    message.joined !== undefined && (obj.joined = message.joined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreateOrJoinMultisigResponse>, I>>(object: I): CreateOrJoinMultisigResponse {
    const message = createBaseCreateOrJoinMultisigResponse();
    message.created = object.created ?? false;
    message.joined = object.joined ?? false;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveMultisigRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.multisigAddress = reader.string();
          break;
        case 2:
          message.authToken = Token.decode(reader, reader.uint32());
          break;
        case 3:
          message.chainId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeaveMultisigRequest {
    return {
      multisigAddress: isSet(object.multisigAddress) ? String(object.multisigAddress) : "",
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      chainId: isSet(object.chainId) ? String(object.chainId) : "",
    };
  },

  toJSON(message: LeaveMultisigRequest): unknown {
    const obj: any = {};
    message.multisigAddress !== undefined && (obj.multisigAddress = message.multisigAddress);
    message.authToken !== undefined &&
      (obj.authToken = message.authToken ? Token.toJSON(message.authToken) : undefined);
    message.chainId !== undefined && (obj.chainId = message.chainId);
    return obj;
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
  return { left: false, found: false };
}

export const LeaveMultisigResponse = {
  encode(message: LeaveMultisigResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.left === true) {
      writer.uint32(8).bool(message.left);
    }
    if (message.found === true) {
      writer.uint32(16).bool(message.found);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveMultisigResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveMultisigResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.left = reader.bool();
          break;
        case 2:
          message.found = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeaveMultisigResponse {
    return {
      left: isSet(object.left) ? Boolean(object.left) : false,
      found: isSet(object.found) ? Boolean(object.found) : false,
    };
  },

  toJSON(message: LeaveMultisigResponse): unknown {
    const obj: any = {};
    message.left !== undefined && (obj.left = message.left);
    message.found !== undefined && (obj.found = message.found);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LeaveMultisigResponse>, I>>(object: I): LeaveMultisigResponse {
    const message = createBaseLeaveMultisigResponse();
    message.left = object.left ?? false;
    message.found = object.found ?? false;
    return message;
  },
};

function createBaseCreateTransactionRequest(): CreateTransactionRequest {
  return {
    authToken: undefined,
    multisigAddress: "",
    accountNumber: 0,
    sequence: 0,
    msgsJson: "",
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
    if (message.msgsJson !== "") {
      writer.uint32(50).string(message.msgsJson);
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTransactionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authToken = Token.decode(reader, reader.uint32());
          break;
        case 3:
          message.multisigAddress = reader.string();
          break;
        case 4:
          message.accountNumber = reader.uint32();
          break;
        case 5:
          message.sequence = reader.uint32();
          break;
        case 6:
          message.msgsJson = reader.string();
          break;
        case 7:
          message.feeJson = reader.string();
          break;
        case 8:
          message.chainId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateTransactionRequest {
    return {
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      multisigAddress: isSet(object.multisigAddress) ? String(object.multisigAddress) : "",
      accountNumber: isSet(object.accountNumber) ? Number(object.accountNumber) : 0,
      sequence: isSet(object.sequence) ? Number(object.sequence) : 0,
      msgsJson: isSet(object.msgsJson) ? String(object.msgsJson) : "",
      feeJson: isSet(object.feeJson) ? String(object.feeJson) : "",
      chainId: isSet(object.chainId) ? String(object.chainId) : "",
    };
  },

  toJSON(message: CreateTransactionRequest): unknown {
    const obj: any = {};
    message.authToken !== undefined &&
      (obj.authToken = message.authToken ? Token.toJSON(message.authToken) : undefined);
    message.multisigAddress !== undefined && (obj.multisigAddress = message.multisigAddress);
    message.accountNumber !== undefined && (obj.accountNumber = Math.round(message.accountNumber));
    message.sequence !== undefined && (obj.sequence = Math.round(message.sequence));
    message.msgsJson !== undefined && (obj.msgsJson = message.msgsJson);
    message.feeJson !== undefined && (obj.feeJson = message.feeJson);
    message.chainId !== undefined && (obj.chainId = message.chainId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreateTransactionRequest>, I>>(object: I): CreateTransactionRequest {
    const message = createBaseCreateTransactionRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.multisigAddress = object.multisigAddress ?? "";
    message.accountNumber = object.accountNumber ?? 0;
    message.sequence = object.sequence ?? 0;
    message.msgsJson = object.msgsJson ?? "";
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTransactionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
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

  fromPartial<I extends Exact<DeepPartial<CreateTransactionResponse>, I>>(_: I): CreateTransactionResponse {
    const message = createBaseCreateTransactionResponse();
    return message;
  },
};

function createBaseSignTransactionRequest(): SignTransactionRequest {
  return { authToken: undefined };
}

export const SignTransactionRequest = {
  encode(message: SignTransactionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignTransactionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignTransactionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authToken = Token.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignTransactionRequest {
    return { authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined };
  },

  toJSON(message: SignTransactionRequest): unknown {
    const obj: any = {};
    message.authToken !== undefined &&
      (obj.authToken = message.authToken ? Token.toJSON(message.authToken) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SignTransactionRequest>, I>>(object: I): SignTransactionRequest {
    const message = createBaseSignTransactionRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignTransactionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
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

  fromPartial<I extends Exact<DeepPartial<SignTransactionResponse>, I>>(_: I): SignTransactionResponse {
    const message = createBaseSignTransactionResponse();
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetChallengeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
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

  fromPartial<I extends Exact<DeepPartial<GetChallengeRequest>, I>>(_: I): GetChallengeRequest {
    const message = createBaseGetChallengeRequest();
    return message;
  },
};

function createBaseGetChallengeResponse(): GetChallengeResponse {
  return { challenge: "" };
}

export const GetChallengeResponse = {
  encode(message: GetChallengeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.challenge !== "") {
      writer.uint32(10).string(message.challenge);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetChallengeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetChallengeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.challenge = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetChallengeResponse {
    return { challenge: isSet(object.challenge) ? String(object.challenge) : "" };
  },

  toJSON(message: GetChallengeResponse): unknown {
    const obj: any = {};
    message.challenge !== undefined && (obj.challenge = message.challenge);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetChallengeResponse>, I>>(object: I): GetChallengeResponse {
    const message = createBaseGetChallengeResponse();
    message.challenge = object.challenge ?? "";
    return message;
  },
};

function createBaseGetTokenRequest(): GetTokenRequest {
  return { challenge: "", challengeSignature: "", userBech32Prefix: "", userPubkeyJson: "" };
}

export const GetTokenRequest = {
  encode(message: GetTokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.challenge !== "") {
      writer.uint32(10).string(message.challenge);
    }
    if (message.challengeSignature !== "") {
      writer.uint32(18).string(message.challengeSignature);
    }
    if (message.userBech32Prefix !== "") {
      writer.uint32(34).string(message.userBech32Prefix);
    }
    if (message.userPubkeyJson !== "") {
      writer.uint32(42).string(message.userPubkeyJson);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTokenRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.challenge = reader.string();
          break;
        case 2:
          message.challengeSignature = reader.string();
          break;
        case 4:
          message.userBech32Prefix = reader.string();
          break;
        case 5:
          message.userPubkeyJson = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTokenRequest {
    return {
      challenge: isSet(object.challenge) ? String(object.challenge) : "",
      challengeSignature: isSet(object.challengeSignature) ? String(object.challengeSignature) : "",
      userBech32Prefix: isSet(object.userBech32Prefix) ? String(object.userBech32Prefix) : "",
      userPubkeyJson: isSet(object.userPubkeyJson) ? String(object.userPubkeyJson) : "",
    };
  },

  toJSON(message: GetTokenRequest): unknown {
    const obj: any = {};
    message.challenge !== undefined && (obj.challenge = message.challenge);
    message.challengeSignature !== undefined && (obj.challengeSignature = message.challengeSignature);
    message.userBech32Prefix !== undefined && (obj.userBech32Prefix = message.userBech32Prefix);
    message.userPubkeyJson !== undefined && (obj.userPubkeyJson = message.userPubkeyJson);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetTokenRequest>, I>>(object: I): GetTokenRequest {
    const message = createBaseGetTokenRequest();
    message.challenge = object.challenge ?? "";
    message.challengeSignature = object.challengeSignature ?? "";
    message.userBech32Prefix = object.userBech32Prefix ?? "";
    message.userPubkeyJson = object.userPubkeyJson ?? "";
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTokenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authToken = Token.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTokenResponse {
    return { authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined };
  },

  toJSON(message: GetTokenResponse): unknown {
    const obj: any = {};
    message.authToken !== undefined &&
      (obj.authToken = message.authToken ? Token.toJSON(message.authToken) : undefined);
    return obj;
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
  return { authToken: undefined, multisigAddress: "" };
}

export const TransactionsCountsRequest = {
  encode(message: TransactionsCountsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authToken !== undefined) {
      Token.encode(message.authToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.multisigAddress !== "") {
      writer.uint32(18).string(message.multisigAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionsCountsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionsCountsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authToken = Token.decode(reader, reader.uint32());
          break;
        case 2:
          message.multisigAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionsCountsRequest {
    return {
      authToken: isSet(object.authToken) ? Token.fromJSON(object.authToken) : undefined,
      multisigAddress: isSet(object.multisigAddress) ? String(object.multisigAddress) : "",
    };
  },

  toJSON(message: TransactionsCountsRequest): unknown {
    const obj: any = {};
    message.authToken !== undefined &&
      (obj.authToken = message.authToken ? Token.toJSON(message.authToken) : undefined);
    message.multisigAddress !== undefined && (obj.multisigAddress = message.multisigAddress);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TransactionsCountsRequest>, I>>(object: I): TransactionsCountsRequest {
    const message = createBaseTransactionsCountsRequest();
    message.authToken = (object.authToken !== undefined && object.authToken !== null)
      ? Token.fromPartial(object.authToken)
      : undefined;
    message.multisigAddress = object.multisigAddress ?? "";
    return message;
  },
};

function createBaseTransactionsCountsResponse(): TransactionsCountsResponse {
  return { total: 0, pending: 0, executed: 0 };
}

export const TransactionsCountsResponse = {
  encode(message: TransactionsCountsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.total !== 0) {
      writer.uint32(8).uint32(message.total);
    }
    if (message.pending !== 0) {
      writer.uint32(16).uint32(message.pending);
    }
    if (message.executed !== 0) {
      writer.uint32(24).uint32(message.executed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionsCountsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionsCountsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.total = reader.uint32();
          break;
        case 2:
          message.pending = reader.uint32();
          break;
        case 3:
          message.executed = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionsCountsResponse {
    return {
      total: isSet(object.total) ? Number(object.total) : 0,
      pending: isSet(object.pending) ? Number(object.pending) : 0,
      executed: isSet(object.executed) ? Number(object.executed) : 0,
    };
  },

  toJSON(message: TransactionsCountsResponse): unknown {
    const obj: any = {};
    message.total !== undefined && (obj.total = Math.round(message.total));
    message.pending !== undefined && (obj.pending = Math.round(message.pending));
    message.executed !== undefined && (obj.executed = Math.round(message.executed));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TransactionsCountsResponse>, I>>(object: I): TransactionsCountsResponse {
    const message = createBaseTransactionsCountsResponse();
    message.total = object.total ?? 0;
    message.pending = object.pending ?? 0;
    message.executed = object.executed ?? 0;
    return message;
  },
};

export interface MultisigService {
  /** Read */
  Multisigs(request: DeepPartial<MultisigsRequest>, metadata?: grpc.Metadata): Promise<MultisigsResponse>;
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
  /** Auth */
  GetChallenge(request: DeepPartial<GetChallengeRequest>, metadata?: grpc.Metadata): Promise<GetChallengeResponse>;
  GetToken(request: DeepPartial<GetTokenRequest>, metadata?: grpc.Metadata): Promise<GetTokenResponse>;
}

export class MultisigServiceClientImpl implements MultisigService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Multisigs = this.Multisigs.bind(this);
    this.Transactions = this.Transactions.bind(this);
    this.TransactionsCounts = this.TransactionsCounts.bind(this);
    this.CreateOrJoinMultisig = this.CreateOrJoinMultisig.bind(this);
    this.LeaveMultisig = this.LeaveMultisig.bind(this);
    this.CreateTransaction = this.CreateTransaction.bind(this);
    this.SignTransaction = this.SignTransaction.bind(this);
    this.GetChallenge = this.GetChallenge.bind(this);
    this.GetToken = this.GetToken.bind(this);
  }

  Multisigs(request: DeepPartial<MultisigsRequest>, metadata?: grpc.Metadata): Promise<MultisigsResponse> {
    return this.rpc.unary(MultisigServiceMultisigsDesc, MultisigsRequest.fromPartial(request), metadata);
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

  GetChallenge(request: DeepPartial<GetChallengeRequest>, metadata?: grpc.Metadata): Promise<GetChallengeResponse> {
    return this.rpc.unary(MultisigServiceGetChallengeDesc, GetChallengeRequest.fromPartial(request), metadata);
  }

  GetToken(request: DeepPartial<GetTokenRequest>, metadata?: grpc.Metadata): Promise<GetTokenResponse> {
    return this.rpc.unary(MultisigServiceGetTokenDesc, GetTokenRequest.fromPartial(request), metadata);
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
      return {
        ...MultisigsResponse.decode(data),
        toObject() {
          return this;
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
      return {
        ...TransactionsResponse.decode(data),
        toObject() {
          return this;
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
      return {
        ...TransactionsCountsResponse.decode(data),
        toObject() {
          return this;
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
      return {
        ...CreateOrJoinMultisigResponse.decode(data),
        toObject() {
          return this;
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
      return {
        ...LeaveMultisigResponse.decode(data),
        toObject() {
          return this;
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
      return {
        ...CreateTransactionResponse.decode(data),
        toObject() {
          return this;
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
      return {
        ...SignTransactionResponse.decode(data),
        toObject() {
          return this;
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
      return {
        ...GetChallengeResponse.decode(data),
        toObject() {
          return this;
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
      return {
        ...GetTokenResponse.decode(data),
        toObject() {
          return this;
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
      : metadata || this.options.metadata;
    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function (response) {
          if (response.status === grpc.Code.OK) {
            resolve(response.message);
          } else {
            const err = new GrpcWebError(response.statusMessage, response.status, response.trailers);
            reject(err);
          }
        },
      });
    });
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export class GrpcWebError extends Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
