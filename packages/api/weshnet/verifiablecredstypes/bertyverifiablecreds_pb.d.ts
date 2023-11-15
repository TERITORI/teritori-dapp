import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../gogoproto/gogo_pb'; // proto import: "gogoproto/gogo.proto"


export class StateChallenge extends jspb.Message {
  getTimestamp(): Uint8Array | string;
  getTimestamp_asU8(): Uint8Array;
  getTimestamp_asB64(): string;
  setTimestamp(value: Uint8Array | string): StateChallenge;

  getNonce(): Uint8Array | string;
  getNonce_asU8(): Uint8Array;
  getNonce_asB64(): string;
  setNonce(value: Uint8Array | string): StateChallenge;

  getBertyLink(): string;
  setBertyLink(value: string): StateChallenge;

  getRedirectUri(): string;
  setRedirectUri(value: string): StateChallenge;

  getState(): string;
  setState(value: string): StateChallenge;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StateChallenge.AsObject;
  static toObject(includeInstance: boolean, msg: StateChallenge): StateChallenge.AsObject;
  static serializeBinaryToWriter(message: StateChallenge, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StateChallenge;
  static deserializeBinaryFromReader(message: StateChallenge, reader: jspb.BinaryReader): StateChallenge;
}

export namespace StateChallenge {
  export type AsObject = {
    timestamp: Uint8Array | string,
    nonce: Uint8Array | string,
    bertyLink: string,
    redirectUri: string,
    state: string,
  }
}

export class StateCode extends jspb.Message {
  getTimestamp(): Uint8Array | string;
  getTimestamp_asU8(): Uint8Array;
  getTimestamp_asB64(): string;
  setTimestamp(value: Uint8Array | string): StateCode;

  getBertyLink(): string;
  setBertyLink(value: string): StateCode;

  getCodeStrategy(): CodeStrategy;
  setCodeStrategy(value: CodeStrategy): StateCode;

  getIdentifier(): string;
  setIdentifier(value: string): StateCode;

  getCode(): string;
  setCode(value: string): StateCode;

  getRedirectUri(): string;
  setRedirectUri(value: string): StateCode;

  getState(): string;
  setState(value: string): StateCode;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StateCode.AsObject;
  static toObject(includeInstance: boolean, msg: StateCode): StateCode.AsObject;
  static serializeBinaryToWriter(message: StateCode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StateCode;
  static deserializeBinaryFromReader(message: StateCode, reader: jspb.BinaryReader): StateCode;
}

export namespace StateCode {
  export type AsObject = {
    timestamp: Uint8Array | string,
    bertyLink: string,
    codeStrategy: CodeStrategy,
    identifier: string,
    code: string,
    redirectUri: string,
    state: string,
  }
}

export class AccountCryptoChallenge extends jspb.Message {
  getChallenge(): string;
  setChallenge(value: string): AccountCryptoChallenge;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountCryptoChallenge.AsObject;
  static toObject(includeInstance: boolean, msg: AccountCryptoChallenge): AccountCryptoChallenge.AsObject;
  static serializeBinaryToWriter(message: AccountCryptoChallenge, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountCryptoChallenge;
  static deserializeBinaryFromReader(message: AccountCryptoChallenge, reader: jspb.BinaryReader): AccountCryptoChallenge;
}

export namespace AccountCryptoChallenge {
  export type AsObject = {
    challenge: string,
  }
}

export enum FlowType { 
  FLOWTYPEUNDEFINED = 0,
  FLOWTYPECODE = 1,
  FLOWTYPEAUTH = 2,
  FLOWTYPEPROOF = 3,
}
export enum CodeStrategy { 
  CODESTRATEGYUNDEFINED = 0,
  CODESTRATEGY6DIGITS = 1,
  CODESTRATEGY10CHARS = 2,
  CODESTRATEGYMOCKED6ZEROES = 999,
}
