/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "weshnet.errcode";

/**
 * ----------------
 * Special errors
 * ----------------
 */
export enum ErrCode {
  /** Undefined - default value, should never be set manually */
  Undefined = 0,
  /** TODO - indicates that you plan to create an error later */
  TODO = 666,
  /** ErrNotImplemented - indicates that a method is not implemented yet */
  ErrNotImplemented = 777,
  /** ErrInternal - indicates an unknown error (without Code), i.e. in gRPC */
  ErrInternal = 888,
  ErrInvalidInput = 100,
  ErrInvalidRange = 101,
  ErrMissingInput = 102,
  ErrSerialization = 103,
  ErrDeserialization = 104,
  ErrStreamRead = 105,
  ErrStreamWrite = 106,
  ErrStreamTransform = 110,
  ErrStreamSendAndClose = 111,
  ErrStreamHeaderWrite = 112,
  ErrStreamHeaderRead = 115,
  ErrStreamSink = 113,
  ErrStreamCloseAndRecv = 114,
  ErrMissingMapKey = 107,
  ErrDBWrite = 108,
  ErrDBRead = 109,
  ErrDBDestroy = 120,
  ErrDBMigrate = 121,
  ErrDBReplay = 122,
  ErrDBRestore = 123,
  ErrDBOpen = 124,
  ErrDBClose = 125,
  ErrCryptoRandomGeneration = 200,
  ErrCryptoKeyGeneration = 201,
  ErrCryptoNonceGeneration = 202,
  ErrCryptoSignature = 203,
  ErrCryptoSignatureVerification = 204,
  ErrCryptoDecrypt = 205,
  ErrCryptoDecryptPayload = 206,
  ErrCryptoEncrypt = 207,
  ErrCryptoKeyConversion = 208,
  ErrCryptoCipherInit = 209,
  ErrCryptoKeyDerivation = 210,
  ErrMap = 300,
  ErrForEach = 301,
  ErrKeystoreGet = 400,
  ErrKeystorePut = 401,
  /** ErrNotFound - generic */
  ErrNotFound = 404,
  ErrOrbitDBInit = 1000,
  ErrOrbitDBOpen = 1001,
  ErrOrbitDBAppend = 1002,
  ErrOrbitDBDeserialization = 1003,
  ErrOrbitDBStoreCast = 1004,
  ErrHandshakeOwnEphemeralKeyGenSend = 1100,
  ErrHandshakePeerEphemeralKeyRecv = 1101,
  ErrHandshakeRequesterAuthenticateBoxKeyGen = 1102,
  ErrHandshakeResponderAcceptBoxKeyGen = 1103,
  ErrHandshakeRequesterHello = 1104,
  ErrHandshakeResponderHello = 1105,
  ErrHandshakeRequesterAuthenticate = 1106,
  ErrHandshakeResponderAccept = 1107,
  ErrHandshakeRequesterAcknowledge = 1108,
  ErrContactRequestSameAccount = 1200,
  ErrContactRequestContactAlreadyAdded = 1201,
  ErrContactRequestContactBlocked = 1202,
  ErrContactRequestContactUndefined = 1203,
  ErrContactRequestIncomingAlreadyReceived = 1204,
  ErrGroupMemberLogEventOpen = 1300,
  ErrGroupMemberLogEventSignature = 1301,
  ErrGroupMemberUnknownGroupID = 1302,
  ErrGroupSecretOtherDestMember = 1303,
  ErrGroupSecretAlreadySentToMember = 1304,
  ErrGroupInvalidType = 1305,
  ErrGroupMissing = 1306,
  ErrGroupActivate = 1307,
  ErrGroupDeactivate = 1308,
  ErrGroupInfo = 1309,
  ErrGroupUnknown = 1310,
  ErrGroupOpen = 1311,
  ErrMessageKeyPersistencePut = 1500,
  ErrMessageKeyPersistenceGet = 1501,
  ErrServiceReplication = 4100,
  ErrServiceReplicationServer = 4101,
  ErrServiceReplicationMissingEndpoint = 4102,
  ErrServicesDirectory = 4200,
  ErrServicesDirectoryInvalidVerifiedCredentialSubject = 4201,
  ErrServicesDirectoryExistingRecordNotFound = 4202,
  ErrServicesDirectoryRecordLockedAndCantBeReplaced = 4203,
  ErrServicesDirectoryExplicitReplaceFlagRequired = 4204,
  ErrServicesDirectoryInvalidVerifiedCredential = 4205,
  ErrServicesDirectoryExpiredVerifiedCredential = 4206,
  ErrServicesDirectoryInvalidVerifiedCredentialID = 4207,
  UNRECOGNIZED = -1,
}

export function errCodeFromJSON(object: any): ErrCode {
  switch (object) {
    case 0:
    case "Undefined":
      return ErrCode.Undefined;
    case 666:
    case "TODO":
      return ErrCode.TODO;
    case 777:
    case "ErrNotImplemented":
      return ErrCode.ErrNotImplemented;
    case 888:
    case "ErrInternal":
      return ErrCode.ErrInternal;
    case 100:
    case "ErrInvalidInput":
      return ErrCode.ErrInvalidInput;
    case 101:
    case "ErrInvalidRange":
      return ErrCode.ErrInvalidRange;
    case 102:
    case "ErrMissingInput":
      return ErrCode.ErrMissingInput;
    case 103:
    case "ErrSerialization":
      return ErrCode.ErrSerialization;
    case 104:
    case "ErrDeserialization":
      return ErrCode.ErrDeserialization;
    case 105:
    case "ErrStreamRead":
      return ErrCode.ErrStreamRead;
    case 106:
    case "ErrStreamWrite":
      return ErrCode.ErrStreamWrite;
    case 110:
    case "ErrStreamTransform":
      return ErrCode.ErrStreamTransform;
    case 111:
    case "ErrStreamSendAndClose":
      return ErrCode.ErrStreamSendAndClose;
    case 112:
    case "ErrStreamHeaderWrite":
      return ErrCode.ErrStreamHeaderWrite;
    case 115:
    case "ErrStreamHeaderRead":
      return ErrCode.ErrStreamHeaderRead;
    case 113:
    case "ErrStreamSink":
      return ErrCode.ErrStreamSink;
    case 114:
    case "ErrStreamCloseAndRecv":
      return ErrCode.ErrStreamCloseAndRecv;
    case 107:
    case "ErrMissingMapKey":
      return ErrCode.ErrMissingMapKey;
    case 108:
    case "ErrDBWrite":
      return ErrCode.ErrDBWrite;
    case 109:
    case "ErrDBRead":
      return ErrCode.ErrDBRead;
    case 120:
    case "ErrDBDestroy":
      return ErrCode.ErrDBDestroy;
    case 121:
    case "ErrDBMigrate":
      return ErrCode.ErrDBMigrate;
    case 122:
    case "ErrDBReplay":
      return ErrCode.ErrDBReplay;
    case 123:
    case "ErrDBRestore":
      return ErrCode.ErrDBRestore;
    case 124:
    case "ErrDBOpen":
      return ErrCode.ErrDBOpen;
    case 125:
    case "ErrDBClose":
      return ErrCode.ErrDBClose;
    case 200:
    case "ErrCryptoRandomGeneration":
      return ErrCode.ErrCryptoRandomGeneration;
    case 201:
    case "ErrCryptoKeyGeneration":
      return ErrCode.ErrCryptoKeyGeneration;
    case 202:
    case "ErrCryptoNonceGeneration":
      return ErrCode.ErrCryptoNonceGeneration;
    case 203:
    case "ErrCryptoSignature":
      return ErrCode.ErrCryptoSignature;
    case 204:
    case "ErrCryptoSignatureVerification":
      return ErrCode.ErrCryptoSignatureVerification;
    case 205:
    case "ErrCryptoDecrypt":
      return ErrCode.ErrCryptoDecrypt;
    case 206:
    case "ErrCryptoDecryptPayload":
      return ErrCode.ErrCryptoDecryptPayload;
    case 207:
    case "ErrCryptoEncrypt":
      return ErrCode.ErrCryptoEncrypt;
    case 208:
    case "ErrCryptoKeyConversion":
      return ErrCode.ErrCryptoKeyConversion;
    case 209:
    case "ErrCryptoCipherInit":
      return ErrCode.ErrCryptoCipherInit;
    case 210:
    case "ErrCryptoKeyDerivation":
      return ErrCode.ErrCryptoKeyDerivation;
    case 300:
    case "ErrMap":
      return ErrCode.ErrMap;
    case 301:
    case "ErrForEach":
      return ErrCode.ErrForEach;
    case 400:
    case "ErrKeystoreGet":
      return ErrCode.ErrKeystoreGet;
    case 401:
    case "ErrKeystorePut":
      return ErrCode.ErrKeystorePut;
    case 404:
    case "ErrNotFound":
      return ErrCode.ErrNotFound;
    case 1000:
    case "ErrOrbitDBInit":
      return ErrCode.ErrOrbitDBInit;
    case 1001:
    case "ErrOrbitDBOpen":
      return ErrCode.ErrOrbitDBOpen;
    case 1002:
    case "ErrOrbitDBAppend":
      return ErrCode.ErrOrbitDBAppend;
    case 1003:
    case "ErrOrbitDBDeserialization":
      return ErrCode.ErrOrbitDBDeserialization;
    case 1004:
    case "ErrOrbitDBStoreCast":
      return ErrCode.ErrOrbitDBStoreCast;
    case 1100:
    case "ErrHandshakeOwnEphemeralKeyGenSend":
      return ErrCode.ErrHandshakeOwnEphemeralKeyGenSend;
    case 1101:
    case "ErrHandshakePeerEphemeralKeyRecv":
      return ErrCode.ErrHandshakePeerEphemeralKeyRecv;
    case 1102:
    case "ErrHandshakeRequesterAuthenticateBoxKeyGen":
      return ErrCode.ErrHandshakeRequesterAuthenticateBoxKeyGen;
    case 1103:
    case "ErrHandshakeResponderAcceptBoxKeyGen":
      return ErrCode.ErrHandshakeResponderAcceptBoxKeyGen;
    case 1104:
    case "ErrHandshakeRequesterHello":
      return ErrCode.ErrHandshakeRequesterHello;
    case 1105:
    case "ErrHandshakeResponderHello":
      return ErrCode.ErrHandshakeResponderHello;
    case 1106:
    case "ErrHandshakeRequesterAuthenticate":
      return ErrCode.ErrHandshakeRequesterAuthenticate;
    case 1107:
    case "ErrHandshakeResponderAccept":
      return ErrCode.ErrHandshakeResponderAccept;
    case 1108:
    case "ErrHandshakeRequesterAcknowledge":
      return ErrCode.ErrHandshakeRequesterAcknowledge;
    case 1200:
    case "ErrContactRequestSameAccount":
      return ErrCode.ErrContactRequestSameAccount;
    case 1201:
    case "ErrContactRequestContactAlreadyAdded":
      return ErrCode.ErrContactRequestContactAlreadyAdded;
    case 1202:
    case "ErrContactRequestContactBlocked":
      return ErrCode.ErrContactRequestContactBlocked;
    case 1203:
    case "ErrContactRequestContactUndefined":
      return ErrCode.ErrContactRequestContactUndefined;
    case 1204:
    case "ErrContactRequestIncomingAlreadyReceived":
      return ErrCode.ErrContactRequestIncomingAlreadyReceived;
    case 1300:
    case "ErrGroupMemberLogEventOpen":
      return ErrCode.ErrGroupMemberLogEventOpen;
    case 1301:
    case "ErrGroupMemberLogEventSignature":
      return ErrCode.ErrGroupMemberLogEventSignature;
    case 1302:
    case "ErrGroupMemberUnknownGroupID":
      return ErrCode.ErrGroupMemberUnknownGroupID;
    case 1303:
    case "ErrGroupSecretOtherDestMember":
      return ErrCode.ErrGroupSecretOtherDestMember;
    case 1304:
    case "ErrGroupSecretAlreadySentToMember":
      return ErrCode.ErrGroupSecretAlreadySentToMember;
    case 1305:
    case "ErrGroupInvalidType":
      return ErrCode.ErrGroupInvalidType;
    case 1306:
    case "ErrGroupMissing":
      return ErrCode.ErrGroupMissing;
    case 1307:
    case "ErrGroupActivate":
      return ErrCode.ErrGroupActivate;
    case 1308:
    case "ErrGroupDeactivate":
      return ErrCode.ErrGroupDeactivate;
    case 1309:
    case "ErrGroupInfo":
      return ErrCode.ErrGroupInfo;
    case 1310:
    case "ErrGroupUnknown":
      return ErrCode.ErrGroupUnknown;
    case 1311:
    case "ErrGroupOpen":
      return ErrCode.ErrGroupOpen;
    case 1500:
    case "ErrMessageKeyPersistencePut":
      return ErrCode.ErrMessageKeyPersistencePut;
    case 1501:
    case "ErrMessageKeyPersistenceGet":
      return ErrCode.ErrMessageKeyPersistenceGet;
    case 4100:
    case "ErrServiceReplication":
      return ErrCode.ErrServiceReplication;
    case 4101:
    case "ErrServiceReplicationServer":
      return ErrCode.ErrServiceReplicationServer;
    case 4102:
    case "ErrServiceReplicationMissingEndpoint":
      return ErrCode.ErrServiceReplicationMissingEndpoint;
    case 4200:
    case "ErrServicesDirectory":
      return ErrCode.ErrServicesDirectory;
    case 4201:
    case "ErrServicesDirectoryInvalidVerifiedCredentialSubject":
      return ErrCode.ErrServicesDirectoryInvalidVerifiedCredentialSubject;
    case 4202:
    case "ErrServicesDirectoryExistingRecordNotFound":
      return ErrCode.ErrServicesDirectoryExistingRecordNotFound;
    case 4203:
    case "ErrServicesDirectoryRecordLockedAndCantBeReplaced":
      return ErrCode.ErrServicesDirectoryRecordLockedAndCantBeReplaced;
    case 4204:
    case "ErrServicesDirectoryExplicitReplaceFlagRequired":
      return ErrCode.ErrServicesDirectoryExplicitReplaceFlagRequired;
    case 4205:
    case "ErrServicesDirectoryInvalidVerifiedCredential":
      return ErrCode.ErrServicesDirectoryInvalidVerifiedCredential;
    case 4206:
    case "ErrServicesDirectoryExpiredVerifiedCredential":
      return ErrCode.ErrServicesDirectoryExpiredVerifiedCredential;
    case 4207:
    case "ErrServicesDirectoryInvalidVerifiedCredentialID":
      return ErrCode.ErrServicesDirectoryInvalidVerifiedCredentialID;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ErrCode.UNRECOGNIZED;
  }
}

export function errCodeToJSON(object: ErrCode): string {
  switch (object) {
    case ErrCode.Undefined:
      return "Undefined";
    case ErrCode.TODO:
      return "TODO";
    case ErrCode.ErrNotImplemented:
      return "ErrNotImplemented";
    case ErrCode.ErrInternal:
      return "ErrInternal";
    case ErrCode.ErrInvalidInput:
      return "ErrInvalidInput";
    case ErrCode.ErrInvalidRange:
      return "ErrInvalidRange";
    case ErrCode.ErrMissingInput:
      return "ErrMissingInput";
    case ErrCode.ErrSerialization:
      return "ErrSerialization";
    case ErrCode.ErrDeserialization:
      return "ErrDeserialization";
    case ErrCode.ErrStreamRead:
      return "ErrStreamRead";
    case ErrCode.ErrStreamWrite:
      return "ErrStreamWrite";
    case ErrCode.ErrStreamTransform:
      return "ErrStreamTransform";
    case ErrCode.ErrStreamSendAndClose:
      return "ErrStreamSendAndClose";
    case ErrCode.ErrStreamHeaderWrite:
      return "ErrStreamHeaderWrite";
    case ErrCode.ErrStreamHeaderRead:
      return "ErrStreamHeaderRead";
    case ErrCode.ErrStreamSink:
      return "ErrStreamSink";
    case ErrCode.ErrStreamCloseAndRecv:
      return "ErrStreamCloseAndRecv";
    case ErrCode.ErrMissingMapKey:
      return "ErrMissingMapKey";
    case ErrCode.ErrDBWrite:
      return "ErrDBWrite";
    case ErrCode.ErrDBRead:
      return "ErrDBRead";
    case ErrCode.ErrDBDestroy:
      return "ErrDBDestroy";
    case ErrCode.ErrDBMigrate:
      return "ErrDBMigrate";
    case ErrCode.ErrDBReplay:
      return "ErrDBReplay";
    case ErrCode.ErrDBRestore:
      return "ErrDBRestore";
    case ErrCode.ErrDBOpen:
      return "ErrDBOpen";
    case ErrCode.ErrDBClose:
      return "ErrDBClose";
    case ErrCode.ErrCryptoRandomGeneration:
      return "ErrCryptoRandomGeneration";
    case ErrCode.ErrCryptoKeyGeneration:
      return "ErrCryptoKeyGeneration";
    case ErrCode.ErrCryptoNonceGeneration:
      return "ErrCryptoNonceGeneration";
    case ErrCode.ErrCryptoSignature:
      return "ErrCryptoSignature";
    case ErrCode.ErrCryptoSignatureVerification:
      return "ErrCryptoSignatureVerification";
    case ErrCode.ErrCryptoDecrypt:
      return "ErrCryptoDecrypt";
    case ErrCode.ErrCryptoDecryptPayload:
      return "ErrCryptoDecryptPayload";
    case ErrCode.ErrCryptoEncrypt:
      return "ErrCryptoEncrypt";
    case ErrCode.ErrCryptoKeyConversion:
      return "ErrCryptoKeyConversion";
    case ErrCode.ErrCryptoCipherInit:
      return "ErrCryptoCipherInit";
    case ErrCode.ErrCryptoKeyDerivation:
      return "ErrCryptoKeyDerivation";
    case ErrCode.ErrMap:
      return "ErrMap";
    case ErrCode.ErrForEach:
      return "ErrForEach";
    case ErrCode.ErrKeystoreGet:
      return "ErrKeystoreGet";
    case ErrCode.ErrKeystorePut:
      return "ErrKeystorePut";
    case ErrCode.ErrNotFound:
      return "ErrNotFound";
    case ErrCode.ErrOrbitDBInit:
      return "ErrOrbitDBInit";
    case ErrCode.ErrOrbitDBOpen:
      return "ErrOrbitDBOpen";
    case ErrCode.ErrOrbitDBAppend:
      return "ErrOrbitDBAppend";
    case ErrCode.ErrOrbitDBDeserialization:
      return "ErrOrbitDBDeserialization";
    case ErrCode.ErrOrbitDBStoreCast:
      return "ErrOrbitDBStoreCast";
    case ErrCode.ErrHandshakeOwnEphemeralKeyGenSend:
      return "ErrHandshakeOwnEphemeralKeyGenSend";
    case ErrCode.ErrHandshakePeerEphemeralKeyRecv:
      return "ErrHandshakePeerEphemeralKeyRecv";
    case ErrCode.ErrHandshakeRequesterAuthenticateBoxKeyGen:
      return "ErrHandshakeRequesterAuthenticateBoxKeyGen";
    case ErrCode.ErrHandshakeResponderAcceptBoxKeyGen:
      return "ErrHandshakeResponderAcceptBoxKeyGen";
    case ErrCode.ErrHandshakeRequesterHello:
      return "ErrHandshakeRequesterHello";
    case ErrCode.ErrHandshakeResponderHello:
      return "ErrHandshakeResponderHello";
    case ErrCode.ErrHandshakeRequesterAuthenticate:
      return "ErrHandshakeRequesterAuthenticate";
    case ErrCode.ErrHandshakeResponderAccept:
      return "ErrHandshakeResponderAccept";
    case ErrCode.ErrHandshakeRequesterAcknowledge:
      return "ErrHandshakeRequesterAcknowledge";
    case ErrCode.ErrContactRequestSameAccount:
      return "ErrContactRequestSameAccount";
    case ErrCode.ErrContactRequestContactAlreadyAdded:
      return "ErrContactRequestContactAlreadyAdded";
    case ErrCode.ErrContactRequestContactBlocked:
      return "ErrContactRequestContactBlocked";
    case ErrCode.ErrContactRequestContactUndefined:
      return "ErrContactRequestContactUndefined";
    case ErrCode.ErrContactRequestIncomingAlreadyReceived:
      return "ErrContactRequestIncomingAlreadyReceived";
    case ErrCode.ErrGroupMemberLogEventOpen:
      return "ErrGroupMemberLogEventOpen";
    case ErrCode.ErrGroupMemberLogEventSignature:
      return "ErrGroupMemberLogEventSignature";
    case ErrCode.ErrGroupMemberUnknownGroupID:
      return "ErrGroupMemberUnknownGroupID";
    case ErrCode.ErrGroupSecretOtherDestMember:
      return "ErrGroupSecretOtherDestMember";
    case ErrCode.ErrGroupSecretAlreadySentToMember:
      return "ErrGroupSecretAlreadySentToMember";
    case ErrCode.ErrGroupInvalidType:
      return "ErrGroupInvalidType";
    case ErrCode.ErrGroupMissing:
      return "ErrGroupMissing";
    case ErrCode.ErrGroupActivate:
      return "ErrGroupActivate";
    case ErrCode.ErrGroupDeactivate:
      return "ErrGroupDeactivate";
    case ErrCode.ErrGroupInfo:
      return "ErrGroupInfo";
    case ErrCode.ErrGroupUnknown:
      return "ErrGroupUnknown";
    case ErrCode.ErrGroupOpen:
      return "ErrGroupOpen";
    case ErrCode.ErrMessageKeyPersistencePut:
      return "ErrMessageKeyPersistencePut";
    case ErrCode.ErrMessageKeyPersistenceGet:
      return "ErrMessageKeyPersistenceGet";
    case ErrCode.ErrServiceReplication:
      return "ErrServiceReplication";
    case ErrCode.ErrServiceReplicationServer:
      return "ErrServiceReplicationServer";
    case ErrCode.ErrServiceReplicationMissingEndpoint:
      return "ErrServiceReplicationMissingEndpoint";
    case ErrCode.ErrServicesDirectory:
      return "ErrServicesDirectory";
    case ErrCode.ErrServicesDirectoryInvalidVerifiedCredentialSubject:
      return "ErrServicesDirectoryInvalidVerifiedCredentialSubject";
    case ErrCode.ErrServicesDirectoryExistingRecordNotFound:
      return "ErrServicesDirectoryExistingRecordNotFound";
    case ErrCode.ErrServicesDirectoryRecordLockedAndCantBeReplaced:
      return "ErrServicesDirectoryRecordLockedAndCantBeReplaced";
    case ErrCode.ErrServicesDirectoryExplicitReplaceFlagRequired:
      return "ErrServicesDirectoryExplicitReplaceFlagRequired";
    case ErrCode.ErrServicesDirectoryInvalidVerifiedCredential:
      return "ErrServicesDirectoryInvalidVerifiedCredential";
    case ErrCode.ErrServicesDirectoryExpiredVerifiedCredential:
      return "ErrServicesDirectoryExpiredVerifiedCredential";
    case ErrCode.ErrServicesDirectoryInvalidVerifiedCredentialID:
      return "ErrServicesDirectoryInvalidVerifiedCredentialID";
    case ErrCode.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ErrDetails {
  codes: ErrCode[];
}

function createBaseErrDetails(): ErrDetails {
  return { codes: [] };
}

export const ErrDetails = {
  encode(message: ErrDetails, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.codes) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ErrDetails {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseErrDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 8) {
            message.codes.push(reader.int32() as any);

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.codes.push(reader.int32() as any);
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ErrDetails {
    return { codes: Array.isArray(object?.codes) ? object.codes.map((e: any) => errCodeFromJSON(e)) : [] };
  },

  toJSON(message: ErrDetails): unknown {
    const obj: any = {};
    if (message.codes?.length) {
      obj.codes = message.codes.map((e) => errCodeToJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ErrDetails>, I>>(base?: I): ErrDetails {
    return ErrDetails.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ErrDetails>, I>>(object: I): ErrDetails {
    const message = createBaseErrDetails();
    message.codes = object.codes?.map((e) => e) || [];
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };
