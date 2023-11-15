import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from './gogoproto/gogo_pb'; // proto import: "gogoproto/gogo.proto"


export class Account extends jspb.Message {
  getGroup(): Group | undefined;
  setGroup(value?: Group): Account;
  hasGroup(): boolean;
  clearGroup(): Account;

  getAccountPrivateKey(): Uint8Array | string;
  getAccountPrivateKey_asU8(): Uint8Array;
  getAccountPrivateKey_asB64(): string;
  setAccountPrivateKey(value: Uint8Array | string): Account;

  getAliasPrivateKey(): Uint8Array | string;
  getAliasPrivateKey_asU8(): Uint8Array;
  getAliasPrivateKey_asB64(): string;
  setAliasPrivateKey(value: Uint8Array | string): Account;

  getPublicRendezvousSeed(): Uint8Array | string;
  getPublicRendezvousSeed_asU8(): Uint8Array;
  getPublicRendezvousSeed_asB64(): string;
  setPublicRendezvousSeed(value: Uint8Array | string): Account;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Account.AsObject;
  static toObject(includeInstance: boolean, msg: Account): Account.AsObject;
  static serializeBinaryToWriter(message: Account, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Account;
  static deserializeBinaryFromReader(message: Account, reader: jspb.BinaryReader): Account;
}

export namespace Account {
  export type AsObject = {
    group?: Group.AsObject,
    accountPrivateKey: Uint8Array | string,
    aliasPrivateKey: Uint8Array | string,
    publicRendezvousSeed: Uint8Array | string,
  }
}

export class Group extends jspb.Message {
  getPublicKey(): Uint8Array | string;
  getPublicKey_asU8(): Uint8Array;
  getPublicKey_asB64(): string;
  setPublicKey(value: Uint8Array | string): Group;

  getSecret(): Uint8Array | string;
  getSecret_asU8(): Uint8Array;
  getSecret_asB64(): string;
  setSecret(value: Uint8Array | string): Group;

  getSecretSig(): Uint8Array | string;
  getSecretSig_asU8(): Uint8Array;
  getSecretSig_asB64(): string;
  setSecretSig(value: Uint8Array | string): Group;

  getGroupType(): GroupType;
  setGroupType(value: GroupType): Group;

  getSignPub(): Uint8Array | string;
  getSignPub_asU8(): Uint8Array;
  getSignPub_asB64(): string;
  setSignPub(value: Uint8Array | string): Group;

  getLinkKey(): Uint8Array | string;
  getLinkKey_asU8(): Uint8Array;
  getLinkKey_asB64(): string;
  setLinkKey(value: Uint8Array | string): Group;

  getLinkKeySig(): Uint8Array | string;
  getLinkKeySig_asU8(): Uint8Array;
  getLinkKeySig_asB64(): string;
  setLinkKeySig(value: Uint8Array | string): Group;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Group.AsObject;
  static toObject(includeInstance: boolean, msg: Group): Group.AsObject;
  static serializeBinaryToWriter(message: Group, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Group;
  static deserializeBinaryFromReader(message: Group, reader: jspb.BinaryReader): Group;
}

export namespace Group {
  export type AsObject = {
    publicKey: Uint8Array | string,
    secret: Uint8Array | string,
    secretSig: Uint8Array | string,
    groupType: GroupType,
    signPub: Uint8Array | string,
    linkKey: Uint8Array | string,
    linkKeySig: Uint8Array | string,
  }
}

export class GroupHeadsExport extends jspb.Message {
  getPublicKey(): Uint8Array | string;
  getPublicKey_asU8(): Uint8Array;
  getPublicKey_asB64(): string;
  setPublicKey(value: Uint8Array | string): GroupHeadsExport;

  getSignPub(): Uint8Array | string;
  getSignPub_asU8(): Uint8Array;
  getSignPub_asB64(): string;
  setSignPub(value: Uint8Array | string): GroupHeadsExport;

  getMetadataHeadsCidsList(): Array<Uint8Array | string>;
  setMetadataHeadsCidsList(value: Array<Uint8Array | string>): GroupHeadsExport;
  clearMetadataHeadsCidsList(): GroupHeadsExport;
  addMetadataHeadsCids(value: Uint8Array | string, index?: number): GroupHeadsExport;

  getMessagesHeadsCidsList(): Array<Uint8Array | string>;
  setMessagesHeadsCidsList(value: Array<Uint8Array | string>): GroupHeadsExport;
  clearMessagesHeadsCidsList(): GroupHeadsExport;
  addMessagesHeadsCids(value: Uint8Array | string, index?: number): GroupHeadsExport;

  getLinkKey(): Uint8Array | string;
  getLinkKey_asU8(): Uint8Array;
  getLinkKey_asB64(): string;
  setLinkKey(value: Uint8Array | string): GroupHeadsExport;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupHeadsExport.AsObject;
  static toObject(includeInstance: boolean, msg: GroupHeadsExport): GroupHeadsExport.AsObject;
  static serializeBinaryToWriter(message: GroupHeadsExport, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupHeadsExport;
  static deserializeBinaryFromReader(message: GroupHeadsExport, reader: jspb.BinaryReader): GroupHeadsExport;
}

export namespace GroupHeadsExport {
  export type AsObject = {
    publicKey: Uint8Array | string,
    signPub: Uint8Array | string,
    metadataHeadsCidsList: Array<Uint8Array | string>,
    messagesHeadsCidsList: Array<Uint8Array | string>,
    linkKey: Uint8Array | string,
  }
}

export class GroupMetadata extends jspb.Message {
  getEventType(): EventType;
  setEventType(value: EventType): GroupMetadata;

  getPayload(): Uint8Array | string;
  getPayload_asU8(): Uint8Array;
  getPayload_asB64(): string;
  setPayload(value: Uint8Array | string): GroupMetadata;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): GroupMetadata;

  getProtocolMetadata(): ProtocolMetadata | undefined;
  setProtocolMetadata(value?: ProtocolMetadata): GroupMetadata;
  hasProtocolMetadata(): boolean;
  clearProtocolMetadata(): GroupMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: GroupMetadata): GroupMetadata.AsObject;
  static serializeBinaryToWriter(message: GroupMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupMetadata;
  static deserializeBinaryFromReader(message: GroupMetadata, reader: jspb.BinaryReader): GroupMetadata;
}

export namespace GroupMetadata {
  export type AsObject = {
    eventType: EventType,
    payload: Uint8Array | string,
    sig: Uint8Array | string,
    protocolMetadata?: ProtocolMetadata.AsObject,
  }
}

export class GroupEnvelope extends jspb.Message {
  getNonce(): Uint8Array | string;
  getNonce_asU8(): Uint8Array;
  getNonce_asB64(): string;
  setNonce(value: Uint8Array | string): GroupEnvelope;

  getEvent(): Uint8Array | string;
  getEvent_asU8(): Uint8Array;
  getEvent_asB64(): string;
  setEvent(value: Uint8Array | string): GroupEnvelope;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupEnvelope.AsObject;
  static toObject(includeInstance: boolean, msg: GroupEnvelope): GroupEnvelope.AsObject;
  static serializeBinaryToWriter(message: GroupEnvelope, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupEnvelope;
  static deserializeBinaryFromReader(message: GroupEnvelope, reader: jspb.BinaryReader): GroupEnvelope;
}

export namespace GroupEnvelope {
  export type AsObject = {
    nonce: Uint8Array | string,
    event: Uint8Array | string,
  }
}

export class MessageHeaders extends jspb.Message {
  getCounter(): number;
  setCounter(value: number): MessageHeaders;

  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): MessageHeaders;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): MessageHeaders;

  getMetadataMap(): jspb.Map<string, string>;
  clearMetadataMap(): MessageHeaders;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageHeaders.AsObject;
  static toObject(includeInstance: boolean, msg: MessageHeaders): MessageHeaders.AsObject;
  static serializeBinaryToWriter(message: MessageHeaders, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageHeaders;
  static deserializeBinaryFromReader(message: MessageHeaders, reader: jspb.BinaryReader): MessageHeaders;
}

export namespace MessageHeaders {
  export type AsObject = {
    counter: number,
    devicePk: Uint8Array | string,
    sig: Uint8Array | string,
    metadataMap: Array<[string, string]>,
  }
}

export class ProtocolMetadata extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProtocolMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: ProtocolMetadata): ProtocolMetadata.AsObject;
  static serializeBinaryToWriter(message: ProtocolMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProtocolMetadata;
  static deserializeBinaryFromReader(message: ProtocolMetadata, reader: jspb.BinaryReader): ProtocolMetadata;
}

export namespace ProtocolMetadata {
  export type AsObject = {
  }
}

export class EncryptedMessage extends jspb.Message {
  getPlaintext(): Uint8Array | string;
  getPlaintext_asU8(): Uint8Array;
  getPlaintext_asB64(): string;
  setPlaintext(value: Uint8Array | string): EncryptedMessage;

  getProtocolMetadata(): ProtocolMetadata | undefined;
  setProtocolMetadata(value?: ProtocolMetadata): EncryptedMessage;
  hasProtocolMetadata(): boolean;
  clearProtocolMetadata(): EncryptedMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EncryptedMessage.AsObject;
  static toObject(includeInstance: boolean, msg: EncryptedMessage): EncryptedMessage.AsObject;
  static serializeBinaryToWriter(message: EncryptedMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EncryptedMessage;
  static deserializeBinaryFromReader(message: EncryptedMessage, reader: jspb.BinaryReader): EncryptedMessage;
}

export namespace EncryptedMessage {
  export type AsObject = {
    plaintext: Uint8Array | string,
    protocolMetadata?: ProtocolMetadata.AsObject,
  }
}

export class MessageEnvelope extends jspb.Message {
  getMessageHeaders(): Uint8Array | string;
  getMessageHeaders_asU8(): Uint8Array;
  getMessageHeaders_asB64(): string;
  setMessageHeaders(value: Uint8Array | string): MessageEnvelope;

  getMessage(): Uint8Array | string;
  getMessage_asU8(): Uint8Array;
  getMessage_asB64(): string;
  setMessage(value: Uint8Array | string): MessageEnvelope;

  getNonce(): Uint8Array | string;
  getNonce_asU8(): Uint8Array;
  getNonce_asB64(): string;
  setNonce(value: Uint8Array | string): MessageEnvelope;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageEnvelope.AsObject;
  static toObject(includeInstance: boolean, msg: MessageEnvelope): MessageEnvelope.AsObject;
  static serializeBinaryToWriter(message: MessageEnvelope, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageEnvelope;
  static deserializeBinaryFromReader(message: MessageEnvelope, reader: jspb.BinaryReader): MessageEnvelope;
}

export namespace MessageEnvelope {
  export type AsObject = {
    messageHeaders: Uint8Array | string,
    message: Uint8Array | string,
    nonce: Uint8Array | string,
  }
}

export class EventContext extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): EventContext;

  getParentIdsList(): Array<Uint8Array | string>;
  setParentIdsList(value: Array<Uint8Array | string>): EventContext;
  clearParentIdsList(): EventContext;
  addParentIds(value: Uint8Array | string, index?: number): EventContext;

  getGroupPk(): Uint8Array | string;
  getGroupPk_asU8(): Uint8Array;
  getGroupPk_asB64(): string;
  setGroupPk(value: Uint8Array | string): EventContext;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventContext.AsObject;
  static toObject(includeInstance: boolean, msg: EventContext): EventContext.AsObject;
  static serializeBinaryToWriter(message: EventContext, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventContext;
  static deserializeBinaryFromReader(message: EventContext, reader: jspb.BinaryReader): EventContext;
}

export namespace EventContext {
  export type AsObject = {
    id: Uint8Array | string,
    parentIdsList: Array<Uint8Array | string>,
    groupPk: Uint8Array | string,
  }
}

export class GroupMetadataPayloadSent extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): GroupMetadataPayloadSent;

  getMessage(): Uint8Array | string;
  getMessage_asU8(): Uint8Array;
  getMessage_asB64(): string;
  setMessage(value: Uint8Array | string): GroupMetadataPayloadSent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupMetadataPayloadSent.AsObject;
  static toObject(includeInstance: boolean, msg: GroupMetadataPayloadSent): GroupMetadataPayloadSent.AsObject;
  static serializeBinaryToWriter(message: GroupMetadataPayloadSent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupMetadataPayloadSent;
  static deserializeBinaryFromReader(message: GroupMetadataPayloadSent, reader: jspb.BinaryReader): GroupMetadataPayloadSent;
}

export namespace GroupMetadataPayloadSent {
  export type AsObject = {
    devicePk: Uint8Array | string,
    message: Uint8Array | string,
  }
}

export class ContactAliasKeyAdded extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): ContactAliasKeyAdded;

  getAliasPk(): Uint8Array | string;
  getAliasPk_asU8(): Uint8Array;
  getAliasPk_asB64(): string;
  setAliasPk(value: Uint8Array | string): ContactAliasKeyAdded;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactAliasKeyAdded.AsObject;
  static toObject(includeInstance: boolean, msg: ContactAliasKeyAdded): ContactAliasKeyAdded.AsObject;
  static serializeBinaryToWriter(message: ContactAliasKeyAdded, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactAliasKeyAdded;
  static deserializeBinaryFromReader(message: ContactAliasKeyAdded, reader: jspb.BinaryReader): ContactAliasKeyAdded;
}

export namespace ContactAliasKeyAdded {
  export type AsObject = {
    devicePk: Uint8Array | string,
    aliasPk: Uint8Array | string,
  }
}

export class GroupMemberDeviceAdded extends jspb.Message {
  getMemberPk(): Uint8Array | string;
  getMemberPk_asU8(): Uint8Array;
  getMemberPk_asB64(): string;
  setMemberPk(value: Uint8Array | string): GroupMemberDeviceAdded;

  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): GroupMemberDeviceAdded;

  getMemberSig(): Uint8Array | string;
  getMemberSig_asU8(): Uint8Array;
  getMemberSig_asB64(): string;
  setMemberSig(value: Uint8Array | string): GroupMemberDeviceAdded;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupMemberDeviceAdded.AsObject;
  static toObject(includeInstance: boolean, msg: GroupMemberDeviceAdded): GroupMemberDeviceAdded.AsObject;
  static serializeBinaryToWriter(message: GroupMemberDeviceAdded, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupMemberDeviceAdded;
  static deserializeBinaryFromReader(message: GroupMemberDeviceAdded, reader: jspb.BinaryReader): GroupMemberDeviceAdded;
}

export namespace GroupMemberDeviceAdded {
  export type AsObject = {
    memberPk: Uint8Array | string,
    devicePk: Uint8Array | string,
    memberSig: Uint8Array | string,
  }
}

export class DeviceChainKey extends jspb.Message {
  getChainKey(): Uint8Array | string;
  getChainKey_asU8(): Uint8Array;
  getChainKey_asB64(): string;
  setChainKey(value: Uint8Array | string): DeviceChainKey;

  getCounter(): number;
  setCounter(value: number): DeviceChainKey;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeviceChainKey.AsObject;
  static toObject(includeInstance: boolean, msg: DeviceChainKey): DeviceChainKey.AsObject;
  static serializeBinaryToWriter(message: DeviceChainKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeviceChainKey;
  static deserializeBinaryFromReader(message: DeviceChainKey, reader: jspb.BinaryReader): DeviceChainKey;
}

export namespace DeviceChainKey {
  export type AsObject = {
    chainKey: Uint8Array | string,
    counter: number,
  }
}

export class GroupDeviceChainKeyAdded extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): GroupDeviceChainKeyAdded;

  getDestMemberPk(): Uint8Array | string;
  getDestMemberPk_asU8(): Uint8Array;
  getDestMemberPk_asB64(): string;
  setDestMemberPk(value: Uint8Array | string): GroupDeviceChainKeyAdded;

  getPayload(): Uint8Array | string;
  getPayload_asU8(): Uint8Array;
  getPayload_asB64(): string;
  setPayload(value: Uint8Array | string): GroupDeviceChainKeyAdded;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupDeviceChainKeyAdded.AsObject;
  static toObject(includeInstance: boolean, msg: GroupDeviceChainKeyAdded): GroupDeviceChainKeyAdded.AsObject;
  static serializeBinaryToWriter(message: GroupDeviceChainKeyAdded, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupDeviceChainKeyAdded;
  static deserializeBinaryFromReader(message: GroupDeviceChainKeyAdded, reader: jspb.BinaryReader): GroupDeviceChainKeyAdded;
}

export namespace GroupDeviceChainKeyAdded {
  export type AsObject = {
    devicePk: Uint8Array | string,
    destMemberPk: Uint8Array | string,
    payload: Uint8Array | string,
  }
}

export class MultiMemberGroupAliasResolverAdded extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): MultiMemberGroupAliasResolverAdded;

  getAliasResolver(): Uint8Array | string;
  getAliasResolver_asU8(): Uint8Array;
  getAliasResolver_asB64(): string;
  setAliasResolver(value: Uint8Array | string): MultiMemberGroupAliasResolverAdded;

  getAliasProof(): Uint8Array | string;
  getAliasProof_asU8(): Uint8Array;
  getAliasProof_asB64(): string;
  setAliasProof(value: Uint8Array | string): MultiMemberGroupAliasResolverAdded;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultiMemberGroupAliasResolverAdded.AsObject;
  static toObject(includeInstance: boolean, msg: MultiMemberGroupAliasResolverAdded): MultiMemberGroupAliasResolverAdded.AsObject;
  static serializeBinaryToWriter(message: MultiMemberGroupAliasResolverAdded, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultiMemberGroupAliasResolverAdded;
  static deserializeBinaryFromReader(message: MultiMemberGroupAliasResolverAdded, reader: jspb.BinaryReader): MultiMemberGroupAliasResolverAdded;
}

export namespace MultiMemberGroupAliasResolverAdded {
  export type AsObject = {
    devicePk: Uint8Array | string,
    aliasResolver: Uint8Array | string,
    aliasProof: Uint8Array | string,
  }
}

export class MultiMemberGroupAdminRoleGranted extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): MultiMemberGroupAdminRoleGranted;

  getGranteeMemberPk(): Uint8Array | string;
  getGranteeMemberPk_asU8(): Uint8Array;
  getGranteeMemberPk_asB64(): string;
  setGranteeMemberPk(value: Uint8Array | string): MultiMemberGroupAdminRoleGranted;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultiMemberGroupAdminRoleGranted.AsObject;
  static toObject(includeInstance: boolean, msg: MultiMemberGroupAdminRoleGranted): MultiMemberGroupAdminRoleGranted.AsObject;
  static serializeBinaryToWriter(message: MultiMemberGroupAdminRoleGranted, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultiMemberGroupAdminRoleGranted;
  static deserializeBinaryFromReader(message: MultiMemberGroupAdminRoleGranted, reader: jspb.BinaryReader): MultiMemberGroupAdminRoleGranted;
}

export namespace MultiMemberGroupAdminRoleGranted {
  export type AsObject = {
    devicePk: Uint8Array | string,
    granteeMemberPk: Uint8Array | string,
  }
}

export class MultiMemberGroupInitialMemberAnnounced extends jspb.Message {
  getMemberPk(): Uint8Array | string;
  getMemberPk_asU8(): Uint8Array;
  getMemberPk_asB64(): string;
  setMemberPk(value: Uint8Array | string): MultiMemberGroupInitialMemberAnnounced;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultiMemberGroupInitialMemberAnnounced.AsObject;
  static toObject(includeInstance: boolean, msg: MultiMemberGroupInitialMemberAnnounced): MultiMemberGroupInitialMemberAnnounced.AsObject;
  static serializeBinaryToWriter(message: MultiMemberGroupInitialMemberAnnounced, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultiMemberGroupInitialMemberAnnounced;
  static deserializeBinaryFromReader(message: MultiMemberGroupInitialMemberAnnounced, reader: jspb.BinaryReader): MultiMemberGroupInitialMemberAnnounced;
}

export namespace MultiMemberGroupInitialMemberAnnounced {
  export type AsObject = {
    memberPk: Uint8Array | string,
  }
}

export class GroupAddAdditionalRendezvousSeed extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): GroupAddAdditionalRendezvousSeed;

  getSeed(): Uint8Array | string;
  getSeed_asU8(): Uint8Array;
  getSeed_asB64(): string;
  setSeed(value: Uint8Array | string): GroupAddAdditionalRendezvousSeed;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupAddAdditionalRendezvousSeed.AsObject;
  static toObject(includeInstance: boolean, msg: GroupAddAdditionalRendezvousSeed): GroupAddAdditionalRendezvousSeed.AsObject;
  static serializeBinaryToWriter(message: GroupAddAdditionalRendezvousSeed, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupAddAdditionalRendezvousSeed;
  static deserializeBinaryFromReader(message: GroupAddAdditionalRendezvousSeed, reader: jspb.BinaryReader): GroupAddAdditionalRendezvousSeed;
}

export namespace GroupAddAdditionalRendezvousSeed {
  export type AsObject = {
    devicePk: Uint8Array | string,
    seed: Uint8Array | string,
  }
}

export class GroupRemoveAdditionalRendezvousSeed extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): GroupRemoveAdditionalRendezvousSeed;

  getSeed(): Uint8Array | string;
  getSeed_asU8(): Uint8Array;
  getSeed_asB64(): string;
  setSeed(value: Uint8Array | string): GroupRemoveAdditionalRendezvousSeed;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupRemoveAdditionalRendezvousSeed.AsObject;
  static toObject(includeInstance: boolean, msg: GroupRemoveAdditionalRendezvousSeed): GroupRemoveAdditionalRendezvousSeed.AsObject;
  static serializeBinaryToWriter(message: GroupRemoveAdditionalRendezvousSeed, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupRemoveAdditionalRendezvousSeed;
  static deserializeBinaryFromReader(message: GroupRemoveAdditionalRendezvousSeed, reader: jspb.BinaryReader): GroupRemoveAdditionalRendezvousSeed;
}

export namespace GroupRemoveAdditionalRendezvousSeed {
  export type AsObject = {
    devicePk: Uint8Array | string,
    seed: Uint8Array | string,
  }
}

export class AccountGroupJoined extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountGroupJoined;

  getGroup(): Group | undefined;
  setGroup(value?: Group): AccountGroupJoined;
  hasGroup(): boolean;
  clearGroup(): AccountGroupJoined;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountGroupJoined.AsObject;
  static toObject(includeInstance: boolean, msg: AccountGroupJoined): AccountGroupJoined.AsObject;
  static serializeBinaryToWriter(message: AccountGroupJoined, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountGroupJoined;
  static deserializeBinaryFromReader(message: AccountGroupJoined, reader: jspb.BinaryReader): AccountGroupJoined;
}

export namespace AccountGroupJoined {
  export type AsObject = {
    devicePk: Uint8Array | string,
    group?: Group.AsObject,
  }
}

export class AccountGroupLeft extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountGroupLeft;

  getGroupPk(): Uint8Array | string;
  getGroupPk_asU8(): Uint8Array;
  getGroupPk_asB64(): string;
  setGroupPk(value: Uint8Array | string): AccountGroupLeft;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountGroupLeft.AsObject;
  static toObject(includeInstance: boolean, msg: AccountGroupLeft): AccountGroupLeft.AsObject;
  static serializeBinaryToWriter(message: AccountGroupLeft, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountGroupLeft;
  static deserializeBinaryFromReader(message: AccountGroupLeft, reader: jspb.BinaryReader): AccountGroupLeft;
}

export namespace AccountGroupLeft {
  export type AsObject = {
    devicePk: Uint8Array | string,
    groupPk: Uint8Array | string,
  }
}

export class AccountContactRequestDisabled extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountContactRequestDisabled;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountContactRequestDisabled.AsObject;
  static toObject(includeInstance: boolean, msg: AccountContactRequestDisabled): AccountContactRequestDisabled.AsObject;
  static serializeBinaryToWriter(message: AccountContactRequestDisabled, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountContactRequestDisabled;
  static deserializeBinaryFromReader(message: AccountContactRequestDisabled, reader: jspb.BinaryReader): AccountContactRequestDisabled;
}

export namespace AccountContactRequestDisabled {
  export type AsObject = {
    devicePk: Uint8Array | string,
  }
}

export class AccountContactRequestEnabled extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountContactRequestEnabled;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountContactRequestEnabled.AsObject;
  static toObject(includeInstance: boolean, msg: AccountContactRequestEnabled): AccountContactRequestEnabled.AsObject;
  static serializeBinaryToWriter(message: AccountContactRequestEnabled, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountContactRequestEnabled;
  static deserializeBinaryFromReader(message: AccountContactRequestEnabled, reader: jspb.BinaryReader): AccountContactRequestEnabled;
}

export namespace AccountContactRequestEnabled {
  export type AsObject = {
    devicePk: Uint8Array | string,
  }
}

export class AccountContactRequestReferenceReset extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountContactRequestReferenceReset;

  getPublicRendezvousSeed(): Uint8Array | string;
  getPublicRendezvousSeed_asU8(): Uint8Array;
  getPublicRendezvousSeed_asB64(): string;
  setPublicRendezvousSeed(value: Uint8Array | string): AccountContactRequestReferenceReset;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountContactRequestReferenceReset.AsObject;
  static toObject(includeInstance: boolean, msg: AccountContactRequestReferenceReset): AccountContactRequestReferenceReset.AsObject;
  static serializeBinaryToWriter(message: AccountContactRequestReferenceReset, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountContactRequestReferenceReset;
  static deserializeBinaryFromReader(message: AccountContactRequestReferenceReset, reader: jspb.BinaryReader): AccountContactRequestReferenceReset;
}

export namespace AccountContactRequestReferenceReset {
  export type AsObject = {
    devicePk: Uint8Array | string,
    publicRendezvousSeed: Uint8Array | string,
  }
}

export class AccountContactRequestOutgoingEnqueued extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountContactRequestOutgoingEnqueued;

  getGroupPk(): Uint8Array | string;
  getGroupPk_asU8(): Uint8Array;
  getGroupPk_asB64(): string;
  setGroupPk(value: Uint8Array | string): AccountContactRequestOutgoingEnqueued;

  getContact(): ShareableContact | undefined;
  setContact(value?: ShareableContact): AccountContactRequestOutgoingEnqueued;
  hasContact(): boolean;
  clearContact(): AccountContactRequestOutgoingEnqueued;

  getOwnMetadata(): Uint8Array | string;
  getOwnMetadata_asU8(): Uint8Array;
  getOwnMetadata_asB64(): string;
  setOwnMetadata(value: Uint8Array | string): AccountContactRequestOutgoingEnqueued;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountContactRequestOutgoingEnqueued.AsObject;
  static toObject(includeInstance: boolean, msg: AccountContactRequestOutgoingEnqueued): AccountContactRequestOutgoingEnqueued.AsObject;
  static serializeBinaryToWriter(message: AccountContactRequestOutgoingEnqueued, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountContactRequestOutgoingEnqueued;
  static deserializeBinaryFromReader(message: AccountContactRequestOutgoingEnqueued, reader: jspb.BinaryReader): AccountContactRequestOutgoingEnqueued;
}

export namespace AccountContactRequestOutgoingEnqueued {
  export type AsObject = {
    devicePk: Uint8Array | string,
    groupPk: Uint8Array | string,
    contact?: ShareableContact.AsObject,
    ownMetadata: Uint8Array | string,
  }
}

export class AccountContactRequestOutgoingSent extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountContactRequestOutgoingSent;

  getContactPk(): Uint8Array | string;
  getContactPk_asU8(): Uint8Array;
  getContactPk_asB64(): string;
  setContactPk(value: Uint8Array | string): AccountContactRequestOutgoingSent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountContactRequestOutgoingSent.AsObject;
  static toObject(includeInstance: boolean, msg: AccountContactRequestOutgoingSent): AccountContactRequestOutgoingSent.AsObject;
  static serializeBinaryToWriter(message: AccountContactRequestOutgoingSent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountContactRequestOutgoingSent;
  static deserializeBinaryFromReader(message: AccountContactRequestOutgoingSent, reader: jspb.BinaryReader): AccountContactRequestOutgoingSent;
}

export namespace AccountContactRequestOutgoingSent {
  export type AsObject = {
    devicePk: Uint8Array | string,
    contactPk: Uint8Array | string,
  }
}

export class AccountContactRequestIncomingReceived extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountContactRequestIncomingReceived;

  getContactPk(): Uint8Array | string;
  getContactPk_asU8(): Uint8Array;
  getContactPk_asB64(): string;
  setContactPk(value: Uint8Array | string): AccountContactRequestIncomingReceived;

  getContactRendezvousSeed(): Uint8Array | string;
  getContactRendezvousSeed_asU8(): Uint8Array;
  getContactRendezvousSeed_asB64(): string;
  setContactRendezvousSeed(value: Uint8Array | string): AccountContactRequestIncomingReceived;

  getContactMetadata(): Uint8Array | string;
  getContactMetadata_asU8(): Uint8Array;
  getContactMetadata_asB64(): string;
  setContactMetadata(value: Uint8Array | string): AccountContactRequestIncomingReceived;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountContactRequestIncomingReceived.AsObject;
  static toObject(includeInstance: boolean, msg: AccountContactRequestIncomingReceived): AccountContactRequestIncomingReceived.AsObject;
  static serializeBinaryToWriter(message: AccountContactRequestIncomingReceived, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountContactRequestIncomingReceived;
  static deserializeBinaryFromReader(message: AccountContactRequestIncomingReceived, reader: jspb.BinaryReader): AccountContactRequestIncomingReceived;
}

export namespace AccountContactRequestIncomingReceived {
  export type AsObject = {
    devicePk: Uint8Array | string,
    contactPk: Uint8Array | string,
    contactRendezvousSeed: Uint8Array | string,
    contactMetadata: Uint8Array | string,
  }
}

export class AccountContactRequestIncomingDiscarded extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountContactRequestIncomingDiscarded;

  getContactPk(): Uint8Array | string;
  getContactPk_asU8(): Uint8Array;
  getContactPk_asB64(): string;
  setContactPk(value: Uint8Array | string): AccountContactRequestIncomingDiscarded;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountContactRequestIncomingDiscarded.AsObject;
  static toObject(includeInstance: boolean, msg: AccountContactRequestIncomingDiscarded): AccountContactRequestIncomingDiscarded.AsObject;
  static serializeBinaryToWriter(message: AccountContactRequestIncomingDiscarded, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountContactRequestIncomingDiscarded;
  static deserializeBinaryFromReader(message: AccountContactRequestIncomingDiscarded, reader: jspb.BinaryReader): AccountContactRequestIncomingDiscarded;
}

export namespace AccountContactRequestIncomingDiscarded {
  export type AsObject = {
    devicePk: Uint8Array | string,
    contactPk: Uint8Array | string,
  }
}

export class AccountContactRequestIncomingAccepted extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountContactRequestIncomingAccepted;

  getContactPk(): Uint8Array | string;
  getContactPk_asU8(): Uint8Array;
  getContactPk_asB64(): string;
  setContactPk(value: Uint8Array | string): AccountContactRequestIncomingAccepted;

  getGroupPk(): Uint8Array | string;
  getGroupPk_asU8(): Uint8Array;
  getGroupPk_asB64(): string;
  setGroupPk(value: Uint8Array | string): AccountContactRequestIncomingAccepted;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountContactRequestIncomingAccepted.AsObject;
  static toObject(includeInstance: boolean, msg: AccountContactRequestIncomingAccepted): AccountContactRequestIncomingAccepted.AsObject;
  static serializeBinaryToWriter(message: AccountContactRequestIncomingAccepted, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountContactRequestIncomingAccepted;
  static deserializeBinaryFromReader(message: AccountContactRequestIncomingAccepted, reader: jspb.BinaryReader): AccountContactRequestIncomingAccepted;
}

export namespace AccountContactRequestIncomingAccepted {
  export type AsObject = {
    devicePk: Uint8Array | string,
    contactPk: Uint8Array | string,
    groupPk: Uint8Array | string,
  }
}

export class AccountContactBlocked extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountContactBlocked;

  getContactPk(): Uint8Array | string;
  getContactPk_asU8(): Uint8Array;
  getContactPk_asB64(): string;
  setContactPk(value: Uint8Array | string): AccountContactBlocked;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountContactBlocked.AsObject;
  static toObject(includeInstance: boolean, msg: AccountContactBlocked): AccountContactBlocked.AsObject;
  static serializeBinaryToWriter(message: AccountContactBlocked, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountContactBlocked;
  static deserializeBinaryFromReader(message: AccountContactBlocked, reader: jspb.BinaryReader): AccountContactBlocked;
}

export namespace AccountContactBlocked {
  export type AsObject = {
    devicePk: Uint8Array | string,
    contactPk: Uint8Array | string,
  }
}

export class AccountContactUnblocked extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountContactUnblocked;

  getContactPk(): Uint8Array | string;
  getContactPk_asU8(): Uint8Array;
  getContactPk_asB64(): string;
  setContactPk(value: Uint8Array | string): AccountContactUnblocked;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountContactUnblocked.AsObject;
  static toObject(includeInstance: boolean, msg: AccountContactUnblocked): AccountContactUnblocked.AsObject;
  static serializeBinaryToWriter(message: AccountContactUnblocked, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountContactUnblocked;
  static deserializeBinaryFromReader(message: AccountContactUnblocked, reader: jspb.BinaryReader): AccountContactUnblocked;
}

export namespace AccountContactUnblocked {
  export type AsObject = {
    devicePk: Uint8Array | string,
    contactPk: Uint8Array | string,
  }
}

export class GroupReplicating extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): GroupReplicating;

  getAuthenticationUrl(): string;
  setAuthenticationUrl(value: string): GroupReplicating;

  getReplicationServer(): string;
  setReplicationServer(value: string): GroupReplicating;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupReplicating.AsObject;
  static toObject(includeInstance: boolean, msg: GroupReplicating): GroupReplicating.AsObject;
  static serializeBinaryToWriter(message: GroupReplicating, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupReplicating;
  static deserializeBinaryFromReader(message: GroupReplicating, reader: jspb.BinaryReader): GroupReplicating;
}

export namespace GroupReplicating {
  export type AsObject = {
    devicePk: Uint8Array | string,
    authenticationUrl: string,
    replicationServer: string,
  }
}

export class ServiceExportData extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceExportData.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceExportData): ServiceExportData.AsObject;
  static serializeBinaryToWriter(message: ServiceExportData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceExportData;
  static deserializeBinaryFromReader(message: ServiceExportData, reader: jspb.BinaryReader): ServiceExportData;
}

export namespace ServiceExportData {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
    }
  }


  export class Reply extends jspb.Message {
    getExportedData(): Uint8Array | string;
    getExportedData_asU8(): Uint8Array;
    getExportedData_asB64(): string;
    setExportedData(value: Uint8Array | string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      exportedData: Uint8Array | string,
    }
  }

}

export class ServiceGetConfiguration extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceGetConfiguration.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceGetConfiguration): ServiceGetConfiguration.AsObject;
  static serializeBinaryToWriter(message: ServiceGetConfiguration, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceGetConfiguration;
  static deserializeBinaryFromReader(message: ServiceGetConfiguration, reader: jspb.BinaryReader): ServiceGetConfiguration;
}

export namespace ServiceGetConfiguration {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
    }
  }


  export class Reply extends jspb.Message {
    getAccountPk(): Uint8Array | string;
    getAccountPk_asU8(): Uint8Array;
    getAccountPk_asB64(): string;
    setAccountPk(value: Uint8Array | string): Reply;

    getDevicePk(): Uint8Array | string;
    getDevicePk_asU8(): Uint8Array;
    getDevicePk_asB64(): string;
    setDevicePk(value: Uint8Array | string): Reply;

    getAccountGroupPk(): Uint8Array | string;
    getAccountGroupPk_asU8(): Uint8Array;
    getAccountGroupPk_asB64(): string;
    setAccountGroupPk(value: Uint8Array | string): Reply;

    getPeerId(): string;
    setPeerId(value: string): Reply;

    getListenersList(): Array<string>;
    setListenersList(value: Array<string>): Reply;
    clearListenersList(): Reply;
    addListeners(value: string, index?: number): Reply;

    getBleEnabled(): ServiceGetConfiguration.SettingState;
    setBleEnabled(value: ServiceGetConfiguration.SettingState): Reply;

    getWifiP2pEnabled(): ServiceGetConfiguration.SettingState;
    setWifiP2pEnabled(value: ServiceGetConfiguration.SettingState): Reply;

    getMdnsEnabled(): ServiceGetConfiguration.SettingState;
    setMdnsEnabled(value: ServiceGetConfiguration.SettingState): Reply;

    getRelayEnabled(): ServiceGetConfiguration.SettingState;
    setRelayEnabled(value: ServiceGetConfiguration.SettingState): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      accountPk: Uint8Array | string,
      devicePk: Uint8Array | string,
      accountGroupPk: Uint8Array | string,
      peerId: string,
      listenersList: Array<string>,
      bleEnabled: ServiceGetConfiguration.SettingState,
      wifiP2pEnabled: ServiceGetConfiguration.SettingState,
      mdnsEnabled: ServiceGetConfiguration.SettingState,
      relayEnabled: ServiceGetConfiguration.SettingState,
    }
  }


  export enum SettingState { 
    UNKNOWN = 0,
    ENABLED = 1,
    DISABLED = 2,
    UNAVAILABLE = 3,
  }
}

export class ContactRequestReference extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactRequestReference.AsObject;
  static toObject(includeInstance: boolean, msg: ContactRequestReference): ContactRequestReference.AsObject;
  static serializeBinaryToWriter(message: ContactRequestReference, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactRequestReference;
  static deserializeBinaryFromReader(message: ContactRequestReference, reader: jspb.BinaryReader): ContactRequestReference;
}

export namespace ContactRequestReference {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
    }
  }


  export class Reply extends jspb.Message {
    getPublicRendezvousSeed(): Uint8Array | string;
    getPublicRendezvousSeed_asU8(): Uint8Array;
    getPublicRendezvousSeed_asB64(): string;
    setPublicRendezvousSeed(value: Uint8Array | string): Reply;

    getEnabled(): boolean;
    setEnabled(value: boolean): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      publicRendezvousSeed: Uint8Array | string,
      enabled: boolean,
    }
  }

}

export class ContactRequestDisable extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactRequestDisable.AsObject;
  static toObject(includeInstance: boolean, msg: ContactRequestDisable): ContactRequestDisable.AsObject;
  static serializeBinaryToWriter(message: ContactRequestDisable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactRequestDisable;
  static deserializeBinaryFromReader(message: ContactRequestDisable, reader: jspb.BinaryReader): ContactRequestDisable;
}

export namespace ContactRequestDisable {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class ContactRequestEnable extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactRequestEnable.AsObject;
  static toObject(includeInstance: boolean, msg: ContactRequestEnable): ContactRequestEnable.AsObject;
  static serializeBinaryToWriter(message: ContactRequestEnable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactRequestEnable;
  static deserializeBinaryFromReader(message: ContactRequestEnable, reader: jspb.BinaryReader): ContactRequestEnable;
}

export namespace ContactRequestEnable {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
    }
  }


  export class Reply extends jspb.Message {
    getPublicRendezvousSeed(): Uint8Array | string;
    getPublicRendezvousSeed_asU8(): Uint8Array;
    getPublicRendezvousSeed_asB64(): string;
    setPublicRendezvousSeed(value: Uint8Array | string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      publicRendezvousSeed: Uint8Array | string,
    }
  }

}

export class ContactRequestResetReference extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactRequestResetReference.AsObject;
  static toObject(includeInstance: boolean, msg: ContactRequestResetReference): ContactRequestResetReference.AsObject;
  static serializeBinaryToWriter(message: ContactRequestResetReference, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactRequestResetReference;
  static deserializeBinaryFromReader(message: ContactRequestResetReference, reader: jspb.BinaryReader): ContactRequestResetReference;
}

export namespace ContactRequestResetReference {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
    }
  }


  export class Reply extends jspb.Message {
    getPublicRendezvousSeed(): Uint8Array | string;
    getPublicRendezvousSeed_asU8(): Uint8Array;
    getPublicRendezvousSeed_asB64(): string;
    setPublicRendezvousSeed(value: Uint8Array | string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      publicRendezvousSeed: Uint8Array | string,
    }
  }

}

export class ContactRequestSend extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactRequestSend.AsObject;
  static toObject(includeInstance: boolean, msg: ContactRequestSend): ContactRequestSend.AsObject;
  static serializeBinaryToWriter(message: ContactRequestSend, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactRequestSend;
  static deserializeBinaryFromReader(message: ContactRequestSend, reader: jspb.BinaryReader): ContactRequestSend;
}

export namespace ContactRequestSend {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getContact(): ShareableContact | undefined;
    setContact(value?: ShareableContact): Request;
    hasContact(): boolean;
    clearContact(): Request;

    getOwnMetadata(): Uint8Array | string;
    getOwnMetadata_asU8(): Uint8Array;
    getOwnMetadata_asB64(): string;
    setOwnMetadata(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      contact?: ShareableContact.AsObject,
      ownMetadata: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class ContactRequestAccept extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactRequestAccept.AsObject;
  static toObject(includeInstance: boolean, msg: ContactRequestAccept): ContactRequestAccept.AsObject;
  static serializeBinaryToWriter(message: ContactRequestAccept, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactRequestAccept;
  static deserializeBinaryFromReader(message: ContactRequestAccept, reader: jspb.BinaryReader): ContactRequestAccept;
}

export namespace ContactRequestAccept {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getContactPk(): Uint8Array | string;
    getContactPk_asU8(): Uint8Array;
    getContactPk_asB64(): string;
    setContactPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      contactPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class ContactRequestDiscard extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactRequestDiscard.AsObject;
  static toObject(includeInstance: boolean, msg: ContactRequestDiscard): ContactRequestDiscard.AsObject;
  static serializeBinaryToWriter(message: ContactRequestDiscard, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactRequestDiscard;
  static deserializeBinaryFromReader(message: ContactRequestDiscard, reader: jspb.BinaryReader): ContactRequestDiscard;
}

export namespace ContactRequestDiscard {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getContactPk(): Uint8Array | string;
    getContactPk_asU8(): Uint8Array;
    getContactPk_asB64(): string;
    setContactPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      contactPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class ShareContact extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ShareContact.AsObject;
  static toObject(includeInstance: boolean, msg: ShareContact): ShareContact.AsObject;
  static serializeBinaryToWriter(message: ShareContact, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ShareContact;
  static deserializeBinaryFromReader(message: ShareContact, reader: jspb.BinaryReader): ShareContact;
}

export namespace ShareContact {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
    }
  }


  export class Reply extends jspb.Message {
    getEncodedContact(): Uint8Array | string;
    getEncodedContact_asU8(): Uint8Array;
    getEncodedContact_asB64(): string;
    setEncodedContact(value: Uint8Array | string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      encodedContact: Uint8Array | string,
    }
  }

}

export class DecodeContact extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DecodeContact.AsObject;
  static toObject(includeInstance: boolean, msg: DecodeContact): DecodeContact.AsObject;
  static serializeBinaryToWriter(message: DecodeContact, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DecodeContact;
  static deserializeBinaryFromReader(message: DecodeContact, reader: jspb.BinaryReader): DecodeContact;
}

export namespace DecodeContact {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getEncodedContact(): Uint8Array | string;
    getEncodedContact_asU8(): Uint8Array;
    getEncodedContact_asB64(): string;
    setEncodedContact(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      encodedContact: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    getContact(): ShareableContact | undefined;
    setContact(value?: ShareableContact): Reply;
    hasContact(): boolean;
    clearContact(): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      contact?: ShareableContact.AsObject,
    }
  }

}

export class ContactBlock extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactBlock.AsObject;
  static toObject(includeInstance: boolean, msg: ContactBlock): ContactBlock.AsObject;
  static serializeBinaryToWriter(message: ContactBlock, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactBlock;
  static deserializeBinaryFromReader(message: ContactBlock, reader: jspb.BinaryReader): ContactBlock;
}

export namespace ContactBlock {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getContactPk(): Uint8Array | string;
    getContactPk_asU8(): Uint8Array;
    getContactPk_asB64(): string;
    setContactPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      contactPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class ContactUnblock extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactUnblock.AsObject;
  static toObject(includeInstance: boolean, msg: ContactUnblock): ContactUnblock.AsObject;
  static serializeBinaryToWriter(message: ContactUnblock, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactUnblock;
  static deserializeBinaryFromReader(message: ContactUnblock, reader: jspb.BinaryReader): ContactUnblock;
}

export namespace ContactUnblock {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getContactPk(): Uint8Array | string;
    getContactPk_asU8(): Uint8Array;
    getContactPk_asB64(): string;
    setContactPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      contactPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class ContactAliasKeySend extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactAliasKeySend.AsObject;
  static toObject(includeInstance: boolean, msg: ContactAliasKeySend): ContactAliasKeySend.AsObject;
  static serializeBinaryToWriter(message: ContactAliasKeySend, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactAliasKeySend;
  static deserializeBinaryFromReader(message: ContactAliasKeySend, reader: jspb.BinaryReader): ContactAliasKeySend;
}

export namespace ContactAliasKeySend {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class MultiMemberGroupCreate extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultiMemberGroupCreate.AsObject;
  static toObject(includeInstance: boolean, msg: MultiMemberGroupCreate): MultiMemberGroupCreate.AsObject;
  static serializeBinaryToWriter(message: MultiMemberGroupCreate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultiMemberGroupCreate;
  static deserializeBinaryFromReader(message: MultiMemberGroupCreate, reader: jspb.BinaryReader): MultiMemberGroupCreate;
}

export namespace MultiMemberGroupCreate {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
    }
  }


  export class Reply extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      groupPk: Uint8Array | string,
    }
  }

}

export class MultiMemberGroupJoin extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultiMemberGroupJoin.AsObject;
  static toObject(includeInstance: boolean, msg: MultiMemberGroupJoin): MultiMemberGroupJoin.AsObject;
  static serializeBinaryToWriter(message: MultiMemberGroupJoin, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultiMemberGroupJoin;
  static deserializeBinaryFromReader(message: MultiMemberGroupJoin, reader: jspb.BinaryReader): MultiMemberGroupJoin;
}

export namespace MultiMemberGroupJoin {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroup(): Group | undefined;
    setGroup(value?: Group): Request;
    hasGroup(): boolean;
    clearGroup(): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      group?: Group.AsObject,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class MultiMemberGroupLeave extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultiMemberGroupLeave.AsObject;
  static toObject(includeInstance: boolean, msg: MultiMemberGroupLeave): MultiMemberGroupLeave.AsObject;
  static serializeBinaryToWriter(message: MultiMemberGroupLeave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultiMemberGroupLeave;
  static deserializeBinaryFromReader(message: MultiMemberGroupLeave, reader: jspb.BinaryReader): MultiMemberGroupLeave;
}

export namespace MultiMemberGroupLeave {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class MultiMemberGroupAliasResolverDisclose extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultiMemberGroupAliasResolverDisclose.AsObject;
  static toObject(includeInstance: boolean, msg: MultiMemberGroupAliasResolverDisclose): MultiMemberGroupAliasResolverDisclose.AsObject;
  static serializeBinaryToWriter(message: MultiMemberGroupAliasResolverDisclose, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultiMemberGroupAliasResolverDisclose;
  static deserializeBinaryFromReader(message: MultiMemberGroupAliasResolverDisclose, reader: jspb.BinaryReader): MultiMemberGroupAliasResolverDisclose;
}

export namespace MultiMemberGroupAliasResolverDisclose {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class MultiMemberGroupAdminRoleGrant extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultiMemberGroupAdminRoleGrant.AsObject;
  static toObject(includeInstance: boolean, msg: MultiMemberGroupAdminRoleGrant): MultiMemberGroupAdminRoleGrant.AsObject;
  static serializeBinaryToWriter(message: MultiMemberGroupAdminRoleGrant, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultiMemberGroupAdminRoleGrant;
  static deserializeBinaryFromReader(message: MultiMemberGroupAdminRoleGrant, reader: jspb.BinaryReader): MultiMemberGroupAdminRoleGrant;
}

export namespace MultiMemberGroupAdminRoleGrant {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    getMemberPk(): Uint8Array | string;
    getMemberPk_asU8(): Uint8Array;
    getMemberPk_asB64(): string;
    setMemberPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
      memberPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class MultiMemberGroupInvitationCreate extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultiMemberGroupInvitationCreate.AsObject;
  static toObject(includeInstance: boolean, msg: MultiMemberGroupInvitationCreate): MultiMemberGroupInvitationCreate.AsObject;
  static serializeBinaryToWriter(message: MultiMemberGroupInvitationCreate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultiMemberGroupInvitationCreate;
  static deserializeBinaryFromReader(message: MultiMemberGroupInvitationCreate, reader: jspb.BinaryReader): MultiMemberGroupInvitationCreate;
}

export namespace MultiMemberGroupInvitationCreate {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    getGroup(): Group | undefined;
    setGroup(value?: Group): Reply;
    hasGroup(): boolean;
    clearGroup(): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      group?: Group.AsObject,
    }
  }

}

export class AppMetadataSend extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AppMetadataSend.AsObject;
  static toObject(includeInstance: boolean, msg: AppMetadataSend): AppMetadataSend.AsObject;
  static serializeBinaryToWriter(message: AppMetadataSend, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AppMetadataSend;
  static deserializeBinaryFromReader(message: AppMetadataSend, reader: jspb.BinaryReader): AppMetadataSend;
}

export namespace AppMetadataSend {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    getPayload(): Uint8Array | string;
    getPayload_asU8(): Uint8Array;
    getPayload_asB64(): string;
    setPayload(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
      payload: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    getCid(): Uint8Array | string;
    getCid_asU8(): Uint8Array;
    getCid_asB64(): string;
    setCid(value: Uint8Array | string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      cid: Uint8Array | string,
    }
  }

}

export class AppMessageSend extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AppMessageSend.AsObject;
  static toObject(includeInstance: boolean, msg: AppMessageSend): AppMessageSend.AsObject;
  static serializeBinaryToWriter(message: AppMessageSend, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AppMessageSend;
  static deserializeBinaryFromReader(message: AppMessageSend, reader: jspb.BinaryReader): AppMessageSend;
}

export namespace AppMessageSend {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    getPayload(): Uint8Array | string;
    getPayload_asU8(): Uint8Array;
    getPayload_asB64(): string;
    setPayload(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
      payload: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    getCid(): Uint8Array | string;
    getCid_asU8(): Uint8Array;
    getCid_asB64(): string;
    setCid(value: Uint8Array | string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      cid: Uint8Array | string,
    }
  }

}

export class GroupMetadataEvent extends jspb.Message {
  getEventContext(): EventContext | undefined;
  setEventContext(value?: EventContext): GroupMetadataEvent;
  hasEventContext(): boolean;
  clearEventContext(): GroupMetadataEvent;

  getMetadata(): GroupMetadata | undefined;
  setMetadata(value?: GroupMetadata): GroupMetadataEvent;
  hasMetadata(): boolean;
  clearMetadata(): GroupMetadataEvent;

  getEvent(): Uint8Array | string;
  getEvent_asU8(): Uint8Array;
  getEvent_asB64(): string;
  setEvent(value: Uint8Array | string): GroupMetadataEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupMetadataEvent.AsObject;
  static toObject(includeInstance: boolean, msg: GroupMetadataEvent): GroupMetadataEvent.AsObject;
  static serializeBinaryToWriter(message: GroupMetadataEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupMetadataEvent;
  static deserializeBinaryFromReader(message: GroupMetadataEvent, reader: jspb.BinaryReader): GroupMetadataEvent;
}

export namespace GroupMetadataEvent {
  export type AsObject = {
    eventContext?: EventContext.AsObject,
    metadata?: GroupMetadata.AsObject,
    event: Uint8Array | string,
  }
}

export class GroupMessageEvent extends jspb.Message {
  getEventContext(): EventContext | undefined;
  setEventContext(value?: EventContext): GroupMessageEvent;
  hasEventContext(): boolean;
  clearEventContext(): GroupMessageEvent;

  getHeaders(): MessageHeaders | undefined;
  setHeaders(value?: MessageHeaders): GroupMessageEvent;
  hasHeaders(): boolean;
  clearHeaders(): GroupMessageEvent;

  getMessage(): Uint8Array | string;
  getMessage_asU8(): Uint8Array;
  getMessage_asB64(): string;
  setMessage(value: Uint8Array | string): GroupMessageEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupMessageEvent.AsObject;
  static toObject(includeInstance: boolean, msg: GroupMessageEvent): GroupMessageEvent.AsObject;
  static serializeBinaryToWriter(message: GroupMessageEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupMessageEvent;
  static deserializeBinaryFromReader(message: GroupMessageEvent, reader: jspb.BinaryReader): GroupMessageEvent;
}

export namespace GroupMessageEvent {
  export type AsObject = {
    eventContext?: EventContext.AsObject,
    headers?: MessageHeaders.AsObject,
    message: Uint8Array | string,
  }
}

export class GroupMetadataList extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupMetadataList.AsObject;
  static toObject(includeInstance: boolean, msg: GroupMetadataList): GroupMetadataList.AsObject;
  static serializeBinaryToWriter(message: GroupMetadataList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupMetadataList;
  static deserializeBinaryFromReader(message: GroupMetadataList, reader: jspb.BinaryReader): GroupMetadataList;
}

export namespace GroupMetadataList {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    getSinceId(): Uint8Array | string;
    getSinceId_asU8(): Uint8Array;
    getSinceId_asB64(): string;
    setSinceId(value: Uint8Array | string): Request;

    getSinceNow(): boolean;
    setSinceNow(value: boolean): Request;

    getUntilId(): Uint8Array | string;
    getUntilId_asU8(): Uint8Array;
    getUntilId_asB64(): string;
    setUntilId(value: Uint8Array | string): Request;

    getUntilNow(): boolean;
    setUntilNow(value: boolean): Request;

    getReverseOrder(): boolean;
    setReverseOrder(value: boolean): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
      sinceId: Uint8Array | string,
      sinceNow: boolean,
      untilId: Uint8Array | string,
      untilNow: boolean,
      reverseOrder: boolean,
    }
  }

}

export class GroupMessageList extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupMessageList.AsObject;
  static toObject(includeInstance: boolean, msg: GroupMessageList): GroupMessageList.AsObject;
  static serializeBinaryToWriter(message: GroupMessageList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupMessageList;
  static deserializeBinaryFromReader(message: GroupMessageList, reader: jspb.BinaryReader): GroupMessageList;
}

export namespace GroupMessageList {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    getSinceId(): Uint8Array | string;
    getSinceId_asU8(): Uint8Array;
    getSinceId_asB64(): string;
    setSinceId(value: Uint8Array | string): Request;

    getSinceNow(): boolean;
    setSinceNow(value: boolean): Request;

    getUntilId(): Uint8Array | string;
    getUntilId_asU8(): Uint8Array;
    getUntilId_asB64(): string;
    setUntilId(value: Uint8Array | string): Request;

    getUntilNow(): boolean;
    setUntilNow(value: boolean): Request;

    getReverseOrder(): boolean;
    setReverseOrder(value: boolean): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
      sinceId: Uint8Array | string,
      sinceNow: boolean,
      untilId: Uint8Array | string,
      untilNow: boolean,
      reverseOrder: boolean,
    }
  }

}

export class GroupInfo extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupInfo.AsObject;
  static toObject(includeInstance: boolean, msg: GroupInfo): GroupInfo.AsObject;
  static serializeBinaryToWriter(message: GroupInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupInfo;
  static deserializeBinaryFromReader(message: GroupInfo, reader: jspb.BinaryReader): GroupInfo;
}

export namespace GroupInfo {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    getContactPk(): Uint8Array | string;
    getContactPk_asU8(): Uint8Array;
    getContactPk_asB64(): string;
    setContactPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
      contactPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    getGroup(): Group | undefined;
    setGroup(value?: Group): Reply;
    hasGroup(): boolean;
    clearGroup(): Reply;

    getMemberPk(): Uint8Array | string;
    getMemberPk_asU8(): Uint8Array;
    getMemberPk_asB64(): string;
    setMemberPk(value: Uint8Array | string): Reply;

    getDevicePk(): Uint8Array | string;
    getDevicePk_asU8(): Uint8Array;
    getDevicePk_asB64(): string;
    setDevicePk(value: Uint8Array | string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      group?: Group.AsObject,
      memberPk: Uint8Array | string,
      devicePk: Uint8Array | string,
    }
  }

}

export class ActivateGroup extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ActivateGroup.AsObject;
  static toObject(includeInstance: boolean, msg: ActivateGroup): ActivateGroup.AsObject;
  static serializeBinaryToWriter(message: ActivateGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ActivateGroup;
  static deserializeBinaryFromReader(message: ActivateGroup, reader: jspb.BinaryReader): ActivateGroup;
}

export namespace ActivateGroup {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    getLocalOnly(): boolean;
    setLocalOnly(value: boolean): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
      localOnly: boolean,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class DeactivateGroup extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeactivateGroup.AsObject;
  static toObject(includeInstance: boolean, msg: DeactivateGroup): DeactivateGroup.AsObject;
  static serializeBinaryToWriter(message: DeactivateGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeactivateGroup;
  static deserializeBinaryFromReader(message: DeactivateGroup, reader: jspb.BinaryReader): DeactivateGroup;
}

export namespace DeactivateGroup {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class GroupDeviceStatus extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupDeviceStatus.AsObject;
  static toObject(includeInstance: boolean, msg: GroupDeviceStatus): GroupDeviceStatus.AsObject;
  static serializeBinaryToWriter(message: GroupDeviceStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupDeviceStatus;
  static deserializeBinaryFromReader(message: GroupDeviceStatus, reader: jspb.BinaryReader): GroupDeviceStatus;
}

export namespace GroupDeviceStatus {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    getType(): GroupDeviceStatus.Type;
    setType(value: GroupDeviceStatus.Type): Reply;

    getEvent(): Uint8Array | string;
    getEvent_asU8(): Uint8Array;
    getEvent_asB64(): string;
    setEvent(value: Uint8Array | string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      type: GroupDeviceStatus.Type,
      event: Uint8Array | string,
    }

    export class PeerConnected extends jspb.Message {
      getPeerId(): string;
      setPeerId(value: string): PeerConnected;

      getDevicePk(): Uint8Array | string;
      getDevicePk_asU8(): Uint8Array;
      getDevicePk_asB64(): string;
      setDevicePk(value: Uint8Array | string): PeerConnected;

      getTransportsList(): Array<GroupDeviceStatus.Transport>;
      setTransportsList(value: Array<GroupDeviceStatus.Transport>): PeerConnected;
      clearTransportsList(): PeerConnected;
      addTransports(value: GroupDeviceStatus.Transport, index?: number): PeerConnected;

      getMaddrsList(): Array<string>;
      setMaddrsList(value: Array<string>): PeerConnected;
      clearMaddrsList(): PeerConnected;
      addMaddrs(value: string, index?: number): PeerConnected;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): PeerConnected.AsObject;
      static toObject(includeInstance: boolean, msg: PeerConnected): PeerConnected.AsObject;
      static serializeBinaryToWriter(message: PeerConnected, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): PeerConnected;
      static deserializeBinaryFromReader(message: PeerConnected, reader: jspb.BinaryReader): PeerConnected;
    }

    export namespace PeerConnected {
      export type AsObject = {
        peerId: string,
        devicePk: Uint8Array | string,
        transportsList: Array<GroupDeviceStatus.Transport>,
        maddrsList: Array<string>,
      }
    }


    export class PeerReconnecting extends jspb.Message {
      getPeerId(): string;
      setPeerId(value: string): PeerReconnecting;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): PeerReconnecting.AsObject;
      static toObject(includeInstance: boolean, msg: PeerReconnecting): PeerReconnecting.AsObject;
      static serializeBinaryToWriter(message: PeerReconnecting, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): PeerReconnecting;
      static deserializeBinaryFromReader(message: PeerReconnecting, reader: jspb.BinaryReader): PeerReconnecting;
    }

    export namespace PeerReconnecting {
      export type AsObject = {
        peerId: string,
      }
    }


    export class PeerDisconnected extends jspb.Message {
      getPeerId(): string;
      setPeerId(value: string): PeerDisconnected;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): PeerDisconnected.AsObject;
      static toObject(includeInstance: boolean, msg: PeerDisconnected): PeerDisconnected.AsObject;
      static serializeBinaryToWriter(message: PeerDisconnected, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): PeerDisconnected;
      static deserializeBinaryFromReader(message: PeerDisconnected, reader: jspb.BinaryReader): PeerDisconnected;
    }

    export namespace PeerDisconnected {
      export type AsObject = {
        peerId: string,
      }
    }

  }


  export enum Type { 
    TYPEUNKNOWN = 0,
    TYPEPEERDISCONNECTED = 1,
    TYPEPEERCONNECTED = 2,
    TYPEPEERRECONNECTING = 3,
  }

  export enum Transport { 
    TPTUNKNOWN = 0,
    TPTLAN = 1,
    TPTWAN = 2,
    TPTPROXIMITY = 3,
  }
}

export class DebugListGroups extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DebugListGroups.AsObject;
  static toObject(includeInstance: boolean, msg: DebugListGroups): DebugListGroups.AsObject;
  static serializeBinaryToWriter(message: DebugListGroups, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DebugListGroups;
  static deserializeBinaryFromReader(message: DebugListGroups, reader: jspb.BinaryReader): DebugListGroups;
}

export namespace DebugListGroups {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
    }
  }


  export class Reply extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Reply;

    getGroupType(): GroupType;
    setGroupType(value: GroupType): Reply;

    getContactPk(): Uint8Array | string;
    getContactPk_asU8(): Uint8Array;
    getContactPk_asB64(): string;
    setContactPk(value: Uint8Array | string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      groupPk: Uint8Array | string,
      groupType: GroupType,
      contactPk: Uint8Array | string,
    }
  }

}

export class DebugInspectGroupStore extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DebugInspectGroupStore.AsObject;
  static toObject(includeInstance: boolean, msg: DebugInspectGroupStore): DebugInspectGroupStore.AsObject;
  static serializeBinaryToWriter(message: DebugInspectGroupStore, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DebugInspectGroupStore;
  static deserializeBinaryFromReader(message: DebugInspectGroupStore, reader: jspb.BinaryReader): DebugInspectGroupStore;
}

export namespace DebugInspectGroupStore {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    getLogType(): DebugInspectGroupLogType;
    setLogType(value: DebugInspectGroupLogType): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
      logType: DebugInspectGroupLogType,
    }
  }


  export class Reply extends jspb.Message {
    getCid(): Uint8Array | string;
    getCid_asU8(): Uint8Array;
    getCid_asB64(): string;
    setCid(value: Uint8Array | string): Reply;

    getParentCidsList(): Array<Uint8Array | string>;
    setParentCidsList(value: Array<Uint8Array | string>): Reply;
    clearParentCidsList(): Reply;
    addParentCids(value: Uint8Array | string, index?: number): Reply;

    getMetadataEventType(): EventType;
    setMetadataEventType(value: EventType): Reply;

    getDevicePk(): Uint8Array | string;
    getDevicePk_asU8(): Uint8Array;
    getDevicePk_asB64(): string;
    setDevicePk(value: Uint8Array | string): Reply;

    getPayload(): Uint8Array | string;
    getPayload_asU8(): Uint8Array;
    getPayload_asB64(): string;
    setPayload(value: Uint8Array | string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      cid: Uint8Array | string,
      parentCidsList: Array<Uint8Array | string>,
      metadataEventType: EventType,
      devicePk: Uint8Array | string,
      payload: Uint8Array | string,
    }
  }

}

export class DebugGroup extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DebugGroup.AsObject;
  static toObject(includeInstance: boolean, msg: DebugGroup): DebugGroup.AsObject;
  static serializeBinaryToWriter(message: DebugGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DebugGroup;
  static deserializeBinaryFromReader(message: DebugGroup, reader: jspb.BinaryReader): DebugGroup;
}

export namespace DebugGroup {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    getPeerIdsList(): Array<string>;
    setPeerIdsList(value: Array<string>): Reply;
    clearPeerIdsList(): Reply;
    addPeerIds(value: string, index?: number): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      peerIdsList: Array<string>,
    }
  }

}

export class ShareableContact extends jspb.Message {
  getPk(): Uint8Array | string;
  getPk_asU8(): Uint8Array;
  getPk_asB64(): string;
  setPk(value: Uint8Array | string): ShareableContact;

  getPublicRendezvousSeed(): Uint8Array | string;
  getPublicRendezvousSeed_asU8(): Uint8Array;
  getPublicRendezvousSeed_asB64(): string;
  setPublicRendezvousSeed(value: Uint8Array | string): ShareableContact;

  getMetadata(): Uint8Array | string;
  getMetadata_asU8(): Uint8Array;
  getMetadata_asB64(): string;
  setMetadata(value: Uint8Array | string): ShareableContact;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ShareableContact.AsObject;
  static toObject(includeInstance: boolean, msg: ShareableContact): ShareableContact.AsObject;
  static serializeBinaryToWriter(message: ShareableContact, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ShareableContact;
  static deserializeBinaryFromReader(message: ShareableContact, reader: jspb.BinaryReader): ShareableContact;
}

export namespace ShareableContact {
  export type AsObject = {
    pk: Uint8Array | string,
    publicRendezvousSeed: Uint8Array | string,
    metadata: Uint8Array | string,
  }
}

export class ServiceTokenSupportedService extends jspb.Message {
  getServiceType(): string;
  setServiceType(value: string): ServiceTokenSupportedService;

  getServiceEndpoint(): string;
  setServiceEndpoint(value: string): ServiceTokenSupportedService;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceTokenSupportedService.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceTokenSupportedService): ServiceTokenSupportedService.AsObject;
  static serializeBinaryToWriter(message: ServiceTokenSupportedService, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceTokenSupportedService;
  static deserializeBinaryFromReader(message: ServiceTokenSupportedService, reader: jspb.BinaryReader): ServiceTokenSupportedService;
}

export namespace ServiceTokenSupportedService {
  export type AsObject = {
    serviceType: string,
    serviceEndpoint: string,
  }
}

export class ServiceToken extends jspb.Message {
  getToken(): string;
  setToken(value: string): ServiceToken;

  getAuthenticationUrl(): string;
  setAuthenticationUrl(value: string): ServiceToken;

  getSupportedServicesList(): Array<ServiceTokenSupportedService>;
  setSupportedServicesList(value: Array<ServiceTokenSupportedService>): ServiceToken;
  clearSupportedServicesList(): ServiceToken;
  addSupportedServices(value?: ServiceTokenSupportedService, index?: number): ServiceTokenSupportedService;

  getExpiration(): number;
  setExpiration(value: number): ServiceToken;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceToken.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceToken): ServiceToken.AsObject;
  static serializeBinaryToWriter(message: ServiceToken, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceToken;
  static deserializeBinaryFromReader(message: ServiceToken, reader: jspb.BinaryReader): ServiceToken;
}

export namespace ServiceToken {
  export type AsObject = {
    token: string,
    authenticationUrl: string,
    supportedServicesList: Array<ServiceTokenSupportedService.AsObject>,
    expiration: number,
  }
}

export class CredentialVerificationServiceInitFlow extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CredentialVerificationServiceInitFlow.AsObject;
  static toObject(includeInstance: boolean, msg: CredentialVerificationServiceInitFlow): CredentialVerificationServiceInitFlow.AsObject;
  static serializeBinaryToWriter(message: CredentialVerificationServiceInitFlow, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CredentialVerificationServiceInitFlow;
  static deserializeBinaryFromReader(message: CredentialVerificationServiceInitFlow, reader: jspb.BinaryReader): CredentialVerificationServiceInitFlow;
}

export namespace CredentialVerificationServiceInitFlow {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getServiceUrl(): string;
    setServiceUrl(value: string): Request;

    getPublicKey(): Uint8Array | string;
    getPublicKey_asU8(): Uint8Array;
    getPublicKey_asB64(): string;
    setPublicKey(value: Uint8Array | string): Request;

    getLink(): string;
    setLink(value: string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      serviceUrl: string,
      publicKey: Uint8Array | string,
      link: string,
    }
  }


  export class Reply extends jspb.Message {
    getUrl(): string;
    setUrl(value: string): Reply;

    getSecureUrl(): boolean;
    setSecureUrl(value: boolean): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      url: string,
      secureUrl: boolean,
    }
  }

}

export class CredentialVerificationServiceCompleteFlow extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CredentialVerificationServiceCompleteFlow.AsObject;
  static toObject(includeInstance: boolean, msg: CredentialVerificationServiceCompleteFlow): CredentialVerificationServiceCompleteFlow.AsObject;
  static serializeBinaryToWriter(message: CredentialVerificationServiceCompleteFlow, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CredentialVerificationServiceCompleteFlow;
  static deserializeBinaryFromReader(message: CredentialVerificationServiceCompleteFlow, reader: jspb.BinaryReader): CredentialVerificationServiceCompleteFlow;
}

export namespace CredentialVerificationServiceCompleteFlow {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getCallbackUri(): string;
    setCallbackUri(value: string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      callbackUri: string,
    }
  }


  export class Reply extends jspb.Message {
    getIdentifier(): string;
    setIdentifier(value: string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      identifier: string,
    }
  }

}

export class VerifiedCredentialsList extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifiedCredentialsList.AsObject;
  static toObject(includeInstance: boolean, msg: VerifiedCredentialsList): VerifiedCredentialsList.AsObject;
  static serializeBinaryToWriter(message: VerifiedCredentialsList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifiedCredentialsList;
  static deserializeBinaryFromReader(message: VerifiedCredentialsList, reader: jspb.BinaryReader): VerifiedCredentialsList;
}

export namespace VerifiedCredentialsList {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getFilterIdentifier(): string;
    setFilterIdentifier(value: string): Request;

    getFilterIssuer(): string;
    setFilterIssuer(value: string): Request;

    getExcludeExpired(): boolean;
    setExcludeExpired(value: boolean): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      filterIdentifier: string,
      filterIssuer: string,
      excludeExpired: boolean,
    }
  }


  export class Reply extends jspb.Message {
    getCredential(): AccountVerifiedCredentialRegistered | undefined;
    setCredential(value?: AccountVerifiedCredentialRegistered): Reply;
    hasCredential(): boolean;
    clearCredential(): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      credential?: AccountVerifiedCredentialRegistered.AsObject,
    }
  }

}

export class ReplicationServiceRegisterGroup extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReplicationServiceRegisterGroup.AsObject;
  static toObject(includeInstance: boolean, msg: ReplicationServiceRegisterGroup): ReplicationServiceRegisterGroup.AsObject;
  static serializeBinaryToWriter(message: ReplicationServiceRegisterGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReplicationServiceRegisterGroup;
  static deserializeBinaryFromReader(message: ReplicationServiceRegisterGroup, reader: jspb.BinaryReader): ReplicationServiceRegisterGroup;
}

export namespace ReplicationServiceRegisterGroup {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPk(): Uint8Array | string;
    getGroupPk_asU8(): Uint8Array;
    getGroupPk_asB64(): string;
    setGroupPk(value: Uint8Array | string): Request;

    getToken(): string;
    setToken(value: string): Request;

    getAuthenticationUrl(): string;
    setAuthenticationUrl(value: string): Request;

    getReplicationServer(): string;
    setReplicationServer(value: string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPk: Uint8Array | string,
      token: string,
      authenticationUrl: string,
      replicationServer: string,
    }
  }


  export class Reply extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
    }
  }

}

export class ReplicationServiceReplicateGroup extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReplicationServiceReplicateGroup.AsObject;
  static toObject(includeInstance: boolean, msg: ReplicationServiceReplicateGroup): ReplicationServiceReplicateGroup.AsObject;
  static serializeBinaryToWriter(message: ReplicationServiceReplicateGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReplicationServiceReplicateGroup;
  static deserializeBinaryFromReader(message: ReplicationServiceReplicateGroup, reader: jspb.BinaryReader): ReplicationServiceReplicateGroup;
}

export namespace ReplicationServiceReplicateGroup {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroup(): Group | undefined;
    setGroup(value?: Group): Request;
    hasGroup(): boolean;
    clearGroup(): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      group?: Group.AsObject,
    }
  }


  export class Reply extends jspb.Message {
    getOk(): boolean;
    setOk(value: boolean): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      ok: boolean,
    }
  }

}

export class SystemInfo extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SystemInfo.AsObject;
  static toObject(includeInstance: boolean, msg: SystemInfo): SystemInfo.AsObject;
  static serializeBinaryToWriter(message: SystemInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SystemInfo;
  static deserializeBinaryFromReader(message: SystemInfo, reader: jspb.BinaryReader): SystemInfo;
}

export namespace SystemInfo {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
    }
  }


  export class Reply extends jspb.Message {
    getProcess(): SystemInfo.Process | undefined;
    setProcess(value?: SystemInfo.Process): Reply;
    hasProcess(): boolean;
    clearProcess(): Reply;

    getP2p(): SystemInfo.P2P | undefined;
    setP2p(value?: SystemInfo.P2P): Reply;
    hasP2p(): boolean;
    clearP2p(): Reply;

    getOrbitdb(): SystemInfo.OrbitDB | undefined;
    setOrbitdb(value?: SystemInfo.OrbitDB): Reply;
    hasOrbitdb(): boolean;
    clearOrbitdb(): Reply;

    getWarnsList(): Array<string>;
    setWarnsList(value: Array<string>): Reply;
    clearWarnsList(): Reply;
    addWarns(value: string, index?: number): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      process?: SystemInfo.Process.AsObject,
      p2p?: SystemInfo.P2P.AsObject,
      orbitdb?: SystemInfo.OrbitDB.AsObject,
      warnsList: Array<string>,
    }
  }


  export class OrbitDB extends jspb.Message {
    getAccountMetadata(): SystemInfo.OrbitDB.ReplicationStatus | undefined;
    setAccountMetadata(value?: SystemInfo.OrbitDB.ReplicationStatus): OrbitDB;
    hasAccountMetadata(): boolean;
    clearAccountMetadata(): OrbitDB;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrbitDB.AsObject;
    static toObject(includeInstance: boolean, msg: OrbitDB): OrbitDB.AsObject;
    static serializeBinaryToWriter(message: OrbitDB, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrbitDB;
    static deserializeBinaryFromReader(message: OrbitDB, reader: jspb.BinaryReader): OrbitDB;
  }

  export namespace OrbitDB {
    export type AsObject = {
      accountMetadata?: SystemInfo.OrbitDB.ReplicationStatus.AsObject,
    }

    export class ReplicationStatus extends jspb.Message {
      getProgress(): number;
      setProgress(value: number): ReplicationStatus;

      getMaximum(): number;
      setMaximum(value: number): ReplicationStatus;

      getBuffered(): number;
      setBuffered(value: number): ReplicationStatus;

      getQueued(): number;
      setQueued(value: number): ReplicationStatus;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): ReplicationStatus.AsObject;
      static toObject(includeInstance: boolean, msg: ReplicationStatus): ReplicationStatus.AsObject;
      static serializeBinaryToWriter(message: ReplicationStatus, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): ReplicationStatus;
      static deserializeBinaryFromReader(message: ReplicationStatus, reader: jspb.BinaryReader): ReplicationStatus;
    }

    export namespace ReplicationStatus {
      export type AsObject = {
        progress: number,
        maximum: number,
        buffered: number,
        queued: number,
      }
    }

  }


  export class P2P extends jspb.Message {
    getConnectedPeers(): number;
    setConnectedPeers(value: number): P2P;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): P2P.AsObject;
    static toObject(includeInstance: boolean, msg: P2P): P2P.AsObject;
    static serializeBinaryToWriter(message: P2P, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): P2P;
    static deserializeBinaryFromReader(message: P2P, reader: jspb.BinaryReader): P2P;
  }

  export namespace P2P {
    export type AsObject = {
      connectedPeers: number,
    }
  }


  export class Process extends jspb.Message {
    getVersion(): string;
    setVersion(value: string): Process;

    getVcsRef(): string;
    setVcsRef(value: string): Process;

    getUptimeMs(): number;
    setUptimeMs(value: number): Process;

    getUserCpuTimeMs(): number;
    setUserCpuTimeMs(value: number): Process;

    getSystemCpuTimeMs(): number;
    setSystemCpuTimeMs(value: number): Process;

    getStartedAt(): number;
    setStartedAt(value: number): Process;

    getRlimitCur(): number;
    setRlimitCur(value: number): Process;

    getNumGoroutine(): number;
    setNumGoroutine(value: number): Process;

    getNofile(): number;
    setNofile(value: number): Process;

    getTooManyOpenFiles(): boolean;
    setTooManyOpenFiles(value: boolean): Process;

    getNumCpu(): number;
    setNumCpu(value: number): Process;

    getGoVersion(): string;
    setGoVersion(value: string): Process;

    getOperatingSystem(): string;
    setOperatingSystem(value: string): Process;

    getHostName(): string;
    setHostName(value: string): Process;

    getArch(): string;
    setArch(value: string): Process;

    getRlimitMax(): number;
    setRlimitMax(value: number): Process;

    getPid(): number;
    setPid(value: number): Process;

    getPpid(): number;
    setPpid(value: number): Process;

    getPriority(): number;
    setPriority(value: number): Process;

    getUid(): number;
    setUid(value: number): Process;

    getWorkingDir(): string;
    setWorkingDir(value: string): Process;

    getSystemUsername(): string;
    setSystemUsername(value: string): Process;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Process.AsObject;
    static toObject(includeInstance: boolean, msg: Process): Process.AsObject;
    static serializeBinaryToWriter(message: Process, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Process;
    static deserializeBinaryFromReader(message: Process, reader: jspb.BinaryReader): Process;
  }

  export namespace Process {
    export type AsObject = {
      version: string,
      vcsRef: string,
      uptimeMs: number,
      userCpuTimeMs: number,
      systemCpuTimeMs: number,
      startedAt: number,
      rlimitCur: number,
      numGoroutine: number,
      nofile: number,
      tooManyOpenFiles: boolean,
      numCpu: number,
      goVersion: string,
      operatingSystem: string,
      hostName: string,
      arch: string,
      rlimitMax: number,
      pid: number,
      ppid: number,
      priority: number,
      uid: number,
      workingDir: string,
      systemUsername: string,
    }
  }

}

export class PeerList extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeerList.AsObject;
  static toObject(includeInstance: boolean, msg: PeerList): PeerList.AsObject;
  static serializeBinaryToWriter(message: PeerList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PeerList;
  static deserializeBinaryFromReader(message: PeerList, reader: jspb.BinaryReader): PeerList;
}

export namespace PeerList {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
    }
  }


  export class Reply extends jspb.Message {
    getPeersList(): Array<PeerList.Peer>;
    setPeersList(value: Array<PeerList.Peer>): Reply;
    clearPeersList(): Reply;
    addPeers(value?: PeerList.Peer, index?: number): PeerList.Peer;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      peersList: Array<PeerList.Peer.AsObject>,
    }
  }


  export class Peer extends jspb.Message {
    getId(): string;
    setId(value: string): Peer;

    getRoutesList(): Array<PeerList.Route>;
    setRoutesList(value: Array<PeerList.Route>): Peer;
    clearRoutesList(): Peer;
    addRoutes(value?: PeerList.Route, index?: number): PeerList.Route;

    getErrorsList(): Array<string>;
    setErrorsList(value: Array<string>): Peer;
    clearErrorsList(): Peer;
    addErrors(value: string, index?: number): Peer;

    getFeaturesList(): Array<PeerList.Feature>;
    setFeaturesList(value: Array<PeerList.Feature>): Peer;
    clearFeaturesList(): Peer;
    addFeatures(value: PeerList.Feature, index?: number): Peer;

    getMinLatency(): number;
    setMinLatency(value: number): Peer;

    getIsActive(): boolean;
    setIsActive(value: boolean): Peer;

    getDirection(): Direction;
    setDirection(value: Direction): Peer;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Peer.AsObject;
    static toObject(includeInstance: boolean, msg: Peer): Peer.AsObject;
    static serializeBinaryToWriter(message: Peer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Peer;
    static deserializeBinaryFromReader(message: Peer, reader: jspb.BinaryReader): Peer;
  }

  export namespace Peer {
    export type AsObject = {
      id: string,
      routesList: Array<PeerList.Route.AsObject>,
      errorsList: Array<string>,
      featuresList: Array<PeerList.Feature>,
      minLatency: number,
      isActive: boolean,
      direction: Direction,
    }
  }


  export class Route extends jspb.Message {
    getIsActive(): boolean;
    setIsActive(value: boolean): Route;

    getAddress(): string;
    setAddress(value: string): Route;

    getDirection(): Direction;
    setDirection(value: Direction): Route;

    getLatency(): number;
    setLatency(value: number): Route;

    getStreamsList(): Array<PeerList.Stream>;
    setStreamsList(value: Array<PeerList.Stream>): Route;
    clearStreamsList(): Route;
    addStreams(value?: PeerList.Stream, index?: number): PeerList.Stream;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Route.AsObject;
    static toObject(includeInstance: boolean, msg: Route): Route.AsObject;
    static serializeBinaryToWriter(message: Route, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Route;
    static deserializeBinaryFromReader(message: Route, reader: jspb.BinaryReader): Route;
  }

  export namespace Route {
    export type AsObject = {
      isActive: boolean,
      address: string,
      direction: Direction,
      latency: number,
      streamsList: Array<PeerList.Stream.AsObject>,
    }
  }


  export class Stream extends jspb.Message {
    getId(): string;
    setId(value: string): Stream;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Stream.AsObject;
    static toObject(includeInstance: boolean, msg: Stream): Stream.AsObject;
    static serializeBinaryToWriter(message: Stream, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Stream;
    static deserializeBinaryFromReader(message: Stream, reader: jspb.BinaryReader): Stream;
  }

  export namespace Stream {
    export type AsObject = {
      id: string,
    }
  }


  export enum Feature { 
    UNKNOWNFEATURE = 0,
    WESHFEATURE = 1,
    BLEFEATURE = 2,
    LOCALFEATURE = 3,
    TORFEATURE = 4,
    QUICFEATURE = 5,
  }
}

export class Progress extends jspb.Message {
  getState(): string;
  setState(value: string): Progress;

  getDoing(): string;
  setDoing(value: string): Progress;

  getProgress(): number;
  setProgress(value: number): Progress;

  getCompleted(): number;
  setCompleted(value: number): Progress;

  getTotal(): number;
  setTotal(value: number): Progress;

  getDelay(): number;
  setDelay(value: number): Progress;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Progress.AsObject;
  static toObject(includeInstance: boolean, msg: Progress): Progress.AsObject;
  static serializeBinaryToWriter(message: Progress, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Progress;
  static deserializeBinaryFromReader(message: Progress, reader: jspb.BinaryReader): Progress;
}

export namespace Progress {
  export type AsObject = {
    state: string,
    doing: string,
    progress: number,
    completed: number,
    total: number,
    delay: number,
  }
}

export class OutOfStoreMessage extends jspb.Message {
  getCid(): Uint8Array | string;
  getCid_asU8(): Uint8Array;
  getCid_asB64(): string;
  setCid(value: Uint8Array | string): OutOfStoreMessage;

  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): OutOfStoreMessage;

  getCounter(): number;
  setCounter(value: number): OutOfStoreMessage;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): OutOfStoreMessage;

  getFlags(): number;
  setFlags(value: number): OutOfStoreMessage;

  getEncryptedPayload(): Uint8Array | string;
  getEncryptedPayload_asU8(): Uint8Array;
  getEncryptedPayload_asB64(): string;
  setEncryptedPayload(value: Uint8Array | string): OutOfStoreMessage;

  getNonce(): Uint8Array | string;
  getNonce_asU8(): Uint8Array;
  getNonce_asB64(): string;
  setNonce(value: Uint8Array | string): OutOfStoreMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OutOfStoreMessage.AsObject;
  static toObject(includeInstance: boolean, msg: OutOfStoreMessage): OutOfStoreMessage.AsObject;
  static serializeBinaryToWriter(message: OutOfStoreMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OutOfStoreMessage;
  static deserializeBinaryFromReader(message: OutOfStoreMessage, reader: jspb.BinaryReader): OutOfStoreMessage;
}

export namespace OutOfStoreMessage {
  export type AsObject = {
    cid: Uint8Array | string,
    devicePk: Uint8Array | string,
    counter: number,
    sig: Uint8Array | string,
    flags: number,
    encryptedPayload: Uint8Array | string,
    nonce: Uint8Array | string,
  }
}

export class OutOfStoreMessageEnvelope extends jspb.Message {
  getNonce(): Uint8Array | string;
  getNonce_asU8(): Uint8Array;
  getNonce_asB64(): string;
  setNonce(value: Uint8Array | string): OutOfStoreMessageEnvelope;

  getBox(): Uint8Array | string;
  getBox_asU8(): Uint8Array;
  getBox_asB64(): string;
  setBox(value: Uint8Array | string): OutOfStoreMessageEnvelope;

  getGroupReference(): Uint8Array | string;
  getGroupReference_asU8(): Uint8Array;
  getGroupReference_asB64(): string;
  setGroupReference(value: Uint8Array | string): OutOfStoreMessageEnvelope;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OutOfStoreMessageEnvelope.AsObject;
  static toObject(includeInstance: boolean, msg: OutOfStoreMessageEnvelope): OutOfStoreMessageEnvelope.AsObject;
  static serializeBinaryToWriter(message: OutOfStoreMessageEnvelope, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OutOfStoreMessageEnvelope;
  static deserializeBinaryFromReader(message: OutOfStoreMessageEnvelope, reader: jspb.BinaryReader): OutOfStoreMessageEnvelope;
}

export namespace OutOfStoreMessageEnvelope {
  export type AsObject = {
    nonce: Uint8Array | string,
    box: Uint8Array | string,
    groupReference: Uint8Array | string,
  }
}

export class OutOfStoreReceive extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OutOfStoreReceive.AsObject;
  static toObject(includeInstance: boolean, msg: OutOfStoreReceive): OutOfStoreReceive.AsObject;
  static serializeBinaryToWriter(message: OutOfStoreReceive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OutOfStoreReceive;
  static deserializeBinaryFromReader(message: OutOfStoreReceive, reader: jspb.BinaryReader): OutOfStoreReceive;
}

export namespace OutOfStoreReceive {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getPayload(): Uint8Array | string;
    getPayload_asU8(): Uint8Array;
    getPayload_asB64(): string;
    setPayload(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      payload: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    getMessage(): OutOfStoreMessage | undefined;
    setMessage(value?: OutOfStoreMessage): Reply;
    hasMessage(): boolean;
    clearMessage(): Reply;

    getCleartext(): Uint8Array | string;
    getCleartext_asU8(): Uint8Array;
    getCleartext_asB64(): string;
    setCleartext(value: Uint8Array | string): Reply;

    getGroupPublicKey(): Uint8Array | string;
    getGroupPublicKey_asU8(): Uint8Array;
    getGroupPublicKey_asB64(): string;
    setGroupPublicKey(value: Uint8Array | string): Reply;

    getAlreadyReceived(): boolean;
    setAlreadyReceived(value: boolean): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      message?: OutOfStoreMessage.AsObject,
      cleartext: Uint8Array | string,
      groupPublicKey: Uint8Array | string,
      alreadyReceived: boolean,
    }
  }

}

export class OutOfStoreSeal extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OutOfStoreSeal.AsObject;
  static toObject(includeInstance: boolean, msg: OutOfStoreSeal): OutOfStoreSeal.AsObject;
  static serializeBinaryToWriter(message: OutOfStoreSeal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OutOfStoreSeal;
  static deserializeBinaryFromReader(message: OutOfStoreSeal, reader: jspb.BinaryReader): OutOfStoreSeal;
}

export namespace OutOfStoreSeal {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getCid(): Uint8Array | string;
    getCid_asU8(): Uint8Array;
    getCid_asB64(): string;
    setCid(value: Uint8Array | string): Request;

    getGroupPublicKey(): Uint8Array | string;
    getGroupPublicKey_asU8(): Uint8Array;
    getGroupPublicKey_asB64(): string;
    setGroupPublicKey(value: Uint8Array | string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      cid: Uint8Array | string,
      groupPublicKey: Uint8Array | string,
    }
  }


  export class Reply extends jspb.Message {
    getEncrypted(): Uint8Array | string;
    getEncrypted_asU8(): Uint8Array;
    getEncrypted_asB64(): string;
    setEncrypted(value: Uint8Array | string): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      encrypted: Uint8Array | string,
    }
  }

}

export class AccountVerifiedCredentialRegistered extends jspb.Message {
  getDevicePk(): Uint8Array | string;
  getDevicePk_asU8(): Uint8Array;
  getDevicePk_asB64(): string;
  setDevicePk(value: Uint8Array | string): AccountVerifiedCredentialRegistered;

  getSignedIdentityPublicKey(): Uint8Array | string;
  getSignedIdentityPublicKey_asU8(): Uint8Array;
  getSignedIdentityPublicKey_asB64(): string;
  setSignedIdentityPublicKey(value: Uint8Array | string): AccountVerifiedCredentialRegistered;

  getVerifiedCredential(): string;
  setVerifiedCredential(value: string): AccountVerifiedCredentialRegistered;

  getRegistrationDate(): number;
  setRegistrationDate(value: number): AccountVerifiedCredentialRegistered;

  getExpirationDate(): number;
  setExpirationDate(value: number): AccountVerifiedCredentialRegistered;

  getIdentifier(): string;
  setIdentifier(value: string): AccountVerifiedCredentialRegistered;

  getIssuer(): string;
  setIssuer(value: string): AccountVerifiedCredentialRegistered;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountVerifiedCredentialRegistered.AsObject;
  static toObject(includeInstance: boolean, msg: AccountVerifiedCredentialRegistered): AccountVerifiedCredentialRegistered.AsObject;
  static serializeBinaryToWriter(message: AccountVerifiedCredentialRegistered, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountVerifiedCredentialRegistered;
  static deserializeBinaryFromReader(message: AccountVerifiedCredentialRegistered, reader: jspb.BinaryReader): AccountVerifiedCredentialRegistered;
}

export namespace AccountVerifiedCredentialRegistered {
  export type AsObject = {
    devicePk: Uint8Array | string,
    signedIdentityPublicKey: Uint8Array | string,
    verifiedCredential: string,
    registrationDate: number,
    expirationDate: number,
    identifier: string,
    issuer: string,
  }
}

export class FirstLastCounters extends jspb.Message {
  getFirst(): number;
  setFirst(value: number): FirstLastCounters;

  getLast(): number;
  setLast(value: number): FirstLastCounters;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FirstLastCounters.AsObject;
  static toObject(includeInstance: boolean, msg: FirstLastCounters): FirstLastCounters.AsObject;
  static serializeBinaryToWriter(message: FirstLastCounters, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FirstLastCounters;
  static deserializeBinaryFromReader(message: FirstLastCounters, reader: jspb.BinaryReader): FirstLastCounters;
}

export namespace FirstLastCounters {
  export type AsObject = {
    first: number,
    last: number,
  }
}

export class OrbitDBMessageHeads extends jspb.Message {
  getSealedBox(): Uint8Array | string;
  getSealedBox_asU8(): Uint8Array;
  getSealedBox_asB64(): string;
  setSealedBox(value: Uint8Array | string): OrbitDBMessageHeads;

  getRawRotation(): Uint8Array | string;
  getRawRotation_asU8(): Uint8Array;
  getRawRotation_asB64(): string;
  setRawRotation(value: Uint8Array | string): OrbitDBMessageHeads;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OrbitDBMessageHeads.AsObject;
  static toObject(includeInstance: boolean, msg: OrbitDBMessageHeads): OrbitDBMessageHeads.AsObject;
  static serializeBinaryToWriter(message: OrbitDBMessageHeads, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OrbitDBMessageHeads;
  static deserializeBinaryFromReader(message: OrbitDBMessageHeads, reader: jspb.BinaryReader): OrbitDBMessageHeads;
}

export namespace OrbitDBMessageHeads {
  export type AsObject = {
    sealedBox: Uint8Array | string,
    rawRotation: Uint8Array | string,
  }

  export class Box extends jspb.Message {
    getAddress(): string;
    setAddress(value: string): Box;

    getHeads(): Uint8Array | string;
    getHeads_asU8(): Uint8Array;
    getHeads_asB64(): string;
    setHeads(value: Uint8Array | string): Box;

    getDevicePk(): Uint8Array | string;
    getDevicePk_asU8(): Uint8Array;
    getDevicePk_asB64(): string;
    setDevicePk(value: Uint8Array | string): Box;

    getPeerId(): Uint8Array | string;
    getPeerId_asU8(): Uint8Array;
    getPeerId_asB64(): string;
    setPeerId(value: Uint8Array | string): Box;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Box.AsObject;
    static toObject(includeInstance: boolean, msg: Box): Box.AsObject;
    static serializeBinaryToWriter(message: Box, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Box;
    static deserializeBinaryFromReader(message: Box, reader: jspb.BinaryReader): Box;
  }

  export namespace Box {
    export type AsObject = {
      address: string,
      heads: Uint8Array | string,
      devicePk: Uint8Array | string,
      peerId: Uint8Array | string,
    }
  }

}

export class RefreshContactRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RefreshContactRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RefreshContactRequest): RefreshContactRequest.AsObject;
  static serializeBinaryToWriter(message: RefreshContactRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RefreshContactRequest;
  static deserializeBinaryFromReader(message: RefreshContactRequest, reader: jspb.BinaryReader): RefreshContactRequest;
}

export namespace RefreshContactRequest {
  export type AsObject = {
  }

  export class Peer extends jspb.Message {
    getId(): string;
    setId(value: string): Peer;

    getAddrsList(): Array<string>;
    setAddrsList(value: Array<string>): Peer;
    clearAddrsList(): Peer;
    addAddrs(value: string, index?: number): Peer;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Peer.AsObject;
    static toObject(includeInstance: boolean, msg: Peer): Peer.AsObject;
    static serializeBinaryToWriter(message: Peer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Peer;
    static deserializeBinaryFromReader(message: Peer, reader: jspb.BinaryReader): Peer;
  }

  export namespace Peer {
    export type AsObject = {
      id: string,
      addrsList: Array<string>,
    }
  }


  export class Request extends jspb.Message {
    getContactPk(): Uint8Array | string;
    getContactPk_asU8(): Uint8Array;
    getContactPk_asB64(): string;
    setContactPk(value: Uint8Array | string): Request;

    getTimeout(): number;
    setTimeout(value: number): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      contactPk: Uint8Array | string,
      timeout: number,
    }
  }


  export class Reply extends jspb.Message {
    getPeersFoundList(): Array<RefreshContactRequest.Peer>;
    setPeersFoundList(value: Array<RefreshContactRequest.Peer>): Reply;
    clearPeersFoundList(): Reply;
    addPeersFound(value?: RefreshContactRequest.Peer, index?: number): RefreshContactRequest.Peer;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      peersFoundList: Array<RefreshContactRequest.Peer.AsObject>,
    }
  }

}

export enum GroupType { 
  GROUPTYPEUNDEFINED = 0,
  GROUPTYPEACCOUNT = 1,
  GROUPTYPECONTACT = 2,
  GROUPTYPEMULTIMEMBER = 3,
}
export enum EventType { 
  EVENTTYPEUNDEFINED = 0,
  EVENTTYPEGROUPMEMBERDEVICEADDED = 1,
  EVENTTYPEGROUPDEVICECHAINKEYADDED = 2,
  EVENTTYPEACCOUNTGROUPJOINED = 101,
  EVENTTYPEACCOUNTGROUPLEFT = 102,
  EVENTTYPEACCOUNTCONTACTREQUESTDISABLED = 103,
  EVENTTYPEACCOUNTCONTACTREQUESTENABLED = 104,
  EVENTTYPEACCOUNTCONTACTREQUESTREFERENCERESET = 105,
  EVENTTYPEACCOUNTCONTACTREQUESTOUTGOINGENQUEUED = 106,
  EVENTTYPEACCOUNTCONTACTREQUESTOUTGOINGSENT = 107,
  EVENTTYPEACCOUNTCONTACTREQUESTINCOMINGRECEIVED = 108,
  EVENTTYPEACCOUNTCONTACTREQUESTINCOMINGDISCARDED = 109,
  EVENTTYPEACCOUNTCONTACTREQUESTINCOMINGACCEPTED = 110,
  EVENTTYPEACCOUNTCONTACTBLOCKED = 111,
  EVENTTYPEACCOUNTCONTACTUNBLOCKED = 112,
  EVENTTYPECONTACTALIASKEYADDED = 201,
  EVENTTYPEMULTIMEMBERGROUPALIASRESOLVERADDED = 301,
  EVENTTYPEMULTIMEMBERGROUPINITIALMEMBERANNOUNCED = 302,
  EVENTTYPEMULTIMEMBERGROUPADMINROLEGRANTED = 303,
  EVENTTYPEGROUPREPLICATING = 403,
  EVENTTYPEACCOUNTVERIFIEDCREDENTIALREGISTERED = 500,
  EVENTTYPEGROUPMETADATAPAYLOADSENT = 1001,
}
export enum DebugInspectGroupLogType { 
  DEBUGINSPECTGROUPLOGTYPEUNDEFINED = 0,
  DEBUGINSPECTGROUPLOGTYPEMESSAGE = 1,
  DEBUGINSPECTGROUPLOGTYPEMETADATA = 2,
}
export enum ContactState { 
  CONTACTSTATEUNDEFINED = 0,
  CONTACTSTATETOREQUEST = 1,
  CONTACTSTATERECEIVED = 2,
  CONTACTSTATEADDED = 3,
  CONTACTSTATEREMOVED = 4,
  CONTACTSTATEDISCARDED = 5,
  CONTACTSTATEBLOCKED = 6,
}
export enum Direction { 
  UNKNOWNDIR = 0,
  INBOUNDDIR = 1,
  OUTBOUNDDIR = 2,
  BIDIR = 3,
}
