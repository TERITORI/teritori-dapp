/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { share } from "rxjs/operators";

export const protobufPackage = "weshnet.protocol.v1";

export enum GroupType {
  /** GroupTypeUndefined - GroupTypeUndefined indicates that the value has not been set. For example, happens if group is replicated. */
  GroupTypeUndefined = 0,
  /** GroupTypeAccount - GroupTypeAccount is the group managing an account, available to all its devices. */
  GroupTypeAccount = 1,
  /** GroupTypeContact - GroupTypeContact is the group created between two accounts, available to all their devices. */
  GroupTypeContact = 2,
  /** GroupTypeMultiMember - GroupTypeMultiMember is a group containing an undefined number of members. */
  GroupTypeMultiMember = 3,
  UNRECOGNIZED = -1,
}

export function groupTypeFromJSON(object: any): GroupType {
  switch (object) {
    case 0:
    case "GroupTypeUndefined":
      return GroupType.GroupTypeUndefined;
    case 1:
    case "GroupTypeAccount":
      return GroupType.GroupTypeAccount;
    case 2:
    case "GroupTypeContact":
      return GroupType.GroupTypeContact;
    case 3:
    case "GroupTypeMultiMember":
      return GroupType.GroupTypeMultiMember;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GroupType.UNRECOGNIZED;
  }
}

export function groupTypeToJSON(object: GroupType): string {
  switch (object) {
    case GroupType.GroupTypeUndefined:
      return "GroupTypeUndefined";
    case GroupType.GroupTypeAccount:
      return "GroupTypeAccount";
    case GroupType.GroupTypeContact:
      return "GroupTypeContact";
    case GroupType.GroupTypeMultiMember:
      return "GroupTypeMultiMember";
    case GroupType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum EventType {
  /** EventTypeUndefined - EventTypeUndefined indicates that the value has not been set. Should not happen. */
  EventTypeUndefined = 0,
  /** EventTypeGroupMemberDeviceAdded - EventTypeGroupMemberDeviceAdded indicates the payload includes that a member has added their device to the group */
  EventTypeGroupMemberDeviceAdded = 1,
  /** EventTypeGroupDeviceChainKeyAdded - EventTypeGroupDeviceChainKeyAdded indicates the payload includes that a member has sent their device chain key to another member */
  EventTypeGroupDeviceChainKeyAdded = 2,
  /** EventTypeAccountGroupJoined - EventTypeAccountGroupJoined indicates the payload includes that the account has joined a group */
  EventTypeAccountGroupJoined = 101,
  /** EventTypeAccountGroupLeft - EventTypeAccountGroupLeft indicates the payload includes that the account has left a group */
  EventTypeAccountGroupLeft = 102,
  /** EventTypeAccountContactRequestDisabled - EventTypeAccountContactRequestDisabled indicates the payload includes that the account has disabled incoming contact requests */
  EventTypeAccountContactRequestDisabled = 103,
  /** EventTypeAccountContactRequestEnabled - EventTypeAccountContactRequestEnabled indicates the payload includes that the account has enabled incoming contact requests */
  EventTypeAccountContactRequestEnabled = 104,
  /** EventTypeAccountContactRequestReferenceReset - EventTypeAccountContactRequestReferenceReset indicates the payload includes that the account has a new contact request rendezvous seed */
  EventTypeAccountContactRequestReferenceReset = 105,
  /** EventTypeAccountContactRequestOutgoingEnqueued - EventTypeAccountContactRequestOutgoingEnqueued indicates the payload includes that the account will attempt to send a new contact request */
  EventTypeAccountContactRequestOutgoingEnqueued = 106,
  /** EventTypeAccountContactRequestOutgoingSent - EventTypeAccountContactRequestOutgoingSent indicates the payload includes that the account has sent a contact request */
  EventTypeAccountContactRequestOutgoingSent = 107,
  /** EventTypeAccountContactRequestIncomingReceived - EventTypeAccountContactRequestIncomingReceived indicates the payload includes that the account has received a contact request */
  EventTypeAccountContactRequestIncomingReceived = 108,
  /** EventTypeAccountContactRequestIncomingDiscarded - EventTypeAccountContactRequestIncomingDiscarded indicates the payload includes that the account has ignored a contact request */
  EventTypeAccountContactRequestIncomingDiscarded = 109,
  /** EventTypeAccountContactRequestIncomingAccepted - EventTypeAccountContactRequestIncomingAccepted indicates the payload includes that the account has accepted a contact request */
  EventTypeAccountContactRequestIncomingAccepted = 110,
  /** EventTypeAccountContactBlocked - EventTypeAccountContactBlocked indicates the payload includes that the account has blocked a contact */
  EventTypeAccountContactBlocked = 111,
  /** EventTypeAccountContactUnblocked - EventTypeAccountContactUnblocked indicates the payload includes that the account has unblocked a contact */
  EventTypeAccountContactUnblocked = 112,
  /** EventTypeContactAliasKeyAdded - EventTypeContactAliasKeyAdded indicates the payload includes that the contact group has received an alias key */
  EventTypeContactAliasKeyAdded = 201,
  /** EventTypeMultiMemberGroupAliasResolverAdded - EventTypeMultiMemberGroupAliasResolverAdded indicates the payload includes that a member of the group sent their alias proof */
  EventTypeMultiMemberGroupAliasResolverAdded = 301,
  /** EventTypeMultiMemberGroupInitialMemberAnnounced - EventTypeMultiMemberGroupInitialMemberAnnounced indicates the payload includes that a member has authenticated themselves as the group owner */
  EventTypeMultiMemberGroupInitialMemberAnnounced = 302,
  /** EventTypeMultiMemberGroupAdminRoleGranted - EventTypeMultiMemberGroupAdminRoleGranted indicates the payload includes that an admin of the group granted another member as an admin */
  EventTypeMultiMemberGroupAdminRoleGranted = 303,
  /** EventTypeGroupReplicating - EventTypeGroupReplicating indicates that the group has been registered for replication on a server */
  EventTypeGroupReplicating = 403,
  /** EventTypeAccountVerifiedCredentialRegistered - EventTypeAccountVerifiedCredentialRegistered */
  EventTypeAccountVerifiedCredentialRegistered = 500,
  /** EventTypeGroupMetadataPayloadSent - EventTypeGroupMetadataPayloadSent indicates the payload includes an app specific event, unlike messages stored on the message store it is encrypted using a static key */
  EventTypeGroupMetadataPayloadSent = 1001,
  UNRECOGNIZED = -1,
}

export function eventTypeFromJSON(object: any): EventType {
  switch (object) {
    case 0:
    case "EventTypeUndefined":
      return EventType.EventTypeUndefined;
    case 1:
    case "EventTypeGroupMemberDeviceAdded":
      return EventType.EventTypeGroupMemberDeviceAdded;
    case 2:
    case "EventTypeGroupDeviceChainKeyAdded":
      return EventType.EventTypeGroupDeviceChainKeyAdded;
    case 101:
    case "EventTypeAccountGroupJoined":
      return EventType.EventTypeAccountGroupJoined;
    case 102:
    case "EventTypeAccountGroupLeft":
      return EventType.EventTypeAccountGroupLeft;
    case 103:
    case "EventTypeAccountContactRequestDisabled":
      return EventType.EventTypeAccountContactRequestDisabled;
    case 104:
    case "EventTypeAccountContactRequestEnabled":
      return EventType.EventTypeAccountContactRequestEnabled;
    case 105:
    case "EventTypeAccountContactRequestReferenceReset":
      return EventType.EventTypeAccountContactRequestReferenceReset;
    case 106:
    case "EventTypeAccountContactRequestOutgoingEnqueued":
      return EventType.EventTypeAccountContactRequestOutgoingEnqueued;
    case 107:
    case "EventTypeAccountContactRequestOutgoingSent":
      return EventType.EventTypeAccountContactRequestOutgoingSent;
    case 108:
    case "EventTypeAccountContactRequestIncomingReceived":
      return EventType.EventTypeAccountContactRequestIncomingReceived;
    case 109:
    case "EventTypeAccountContactRequestIncomingDiscarded":
      return EventType.EventTypeAccountContactRequestIncomingDiscarded;
    case 110:
    case "EventTypeAccountContactRequestIncomingAccepted":
      return EventType.EventTypeAccountContactRequestIncomingAccepted;
    case 111:
    case "EventTypeAccountContactBlocked":
      return EventType.EventTypeAccountContactBlocked;
    case 112:
    case "EventTypeAccountContactUnblocked":
      return EventType.EventTypeAccountContactUnblocked;
    case 201:
    case "EventTypeContactAliasKeyAdded":
      return EventType.EventTypeContactAliasKeyAdded;
    case 301:
    case "EventTypeMultiMemberGroupAliasResolverAdded":
      return EventType.EventTypeMultiMemberGroupAliasResolverAdded;
    case 302:
    case "EventTypeMultiMemberGroupInitialMemberAnnounced":
      return EventType.EventTypeMultiMemberGroupInitialMemberAnnounced;
    case 303:
    case "EventTypeMultiMemberGroupAdminRoleGranted":
      return EventType.EventTypeMultiMemberGroupAdminRoleGranted;
    case 403:
    case "EventTypeGroupReplicating":
      return EventType.EventTypeGroupReplicating;
    case 500:
    case "EventTypeAccountVerifiedCredentialRegistered":
      return EventType.EventTypeAccountVerifiedCredentialRegistered;
    case 1001:
    case "EventTypeGroupMetadataPayloadSent":
      return EventType.EventTypeGroupMetadataPayloadSent;
    case -1:
    case "UNRECOGNIZED":
    default:
      return EventType.UNRECOGNIZED;
  }
}

export function eventTypeToJSON(object: EventType): string {
  switch (object) {
    case EventType.EventTypeUndefined:
      return "EventTypeUndefined";
    case EventType.EventTypeGroupMemberDeviceAdded:
      return "EventTypeGroupMemberDeviceAdded";
    case EventType.EventTypeGroupDeviceChainKeyAdded:
      return "EventTypeGroupDeviceChainKeyAdded";
    case EventType.EventTypeAccountGroupJoined:
      return "EventTypeAccountGroupJoined";
    case EventType.EventTypeAccountGroupLeft:
      return "EventTypeAccountGroupLeft";
    case EventType.EventTypeAccountContactRequestDisabled:
      return "EventTypeAccountContactRequestDisabled";
    case EventType.EventTypeAccountContactRequestEnabled:
      return "EventTypeAccountContactRequestEnabled";
    case EventType.EventTypeAccountContactRequestReferenceReset:
      return "EventTypeAccountContactRequestReferenceReset";
    case EventType.EventTypeAccountContactRequestOutgoingEnqueued:
      return "EventTypeAccountContactRequestOutgoingEnqueued";
    case EventType.EventTypeAccountContactRequestOutgoingSent:
      return "EventTypeAccountContactRequestOutgoingSent";
    case EventType.EventTypeAccountContactRequestIncomingReceived:
      return "EventTypeAccountContactRequestIncomingReceived";
    case EventType.EventTypeAccountContactRequestIncomingDiscarded:
      return "EventTypeAccountContactRequestIncomingDiscarded";
    case EventType.EventTypeAccountContactRequestIncomingAccepted:
      return "EventTypeAccountContactRequestIncomingAccepted";
    case EventType.EventTypeAccountContactBlocked:
      return "EventTypeAccountContactBlocked";
    case EventType.EventTypeAccountContactUnblocked:
      return "EventTypeAccountContactUnblocked";
    case EventType.EventTypeContactAliasKeyAdded:
      return "EventTypeContactAliasKeyAdded";
    case EventType.EventTypeMultiMemberGroupAliasResolverAdded:
      return "EventTypeMultiMemberGroupAliasResolverAdded";
    case EventType.EventTypeMultiMemberGroupInitialMemberAnnounced:
      return "EventTypeMultiMemberGroupInitialMemberAnnounced";
    case EventType.EventTypeMultiMemberGroupAdminRoleGranted:
      return "EventTypeMultiMemberGroupAdminRoleGranted";
    case EventType.EventTypeGroupReplicating:
      return "EventTypeGroupReplicating";
    case EventType.EventTypeAccountVerifiedCredentialRegistered:
      return "EventTypeAccountVerifiedCredentialRegistered";
    case EventType.EventTypeGroupMetadataPayloadSent:
      return "EventTypeGroupMetadataPayloadSent";
    case EventType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum DebugInspectGroupLogType {
  DebugInspectGroupLogTypeUndefined = 0,
  DebugInspectGroupLogTypeMessage = 1,
  DebugInspectGroupLogTypeMetadata = 2,
  UNRECOGNIZED = -1,
}

export function debugInspectGroupLogTypeFromJSON(object: any): DebugInspectGroupLogType {
  switch (object) {
    case 0:
    case "DebugInspectGroupLogTypeUndefined":
      return DebugInspectGroupLogType.DebugInspectGroupLogTypeUndefined;
    case 1:
    case "DebugInspectGroupLogTypeMessage":
      return DebugInspectGroupLogType.DebugInspectGroupLogTypeMessage;
    case 2:
    case "DebugInspectGroupLogTypeMetadata":
      return DebugInspectGroupLogType.DebugInspectGroupLogTypeMetadata;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DebugInspectGroupLogType.UNRECOGNIZED;
  }
}

export function debugInspectGroupLogTypeToJSON(object: DebugInspectGroupLogType): string {
  switch (object) {
    case DebugInspectGroupLogType.DebugInspectGroupLogTypeUndefined:
      return "DebugInspectGroupLogTypeUndefined";
    case DebugInspectGroupLogType.DebugInspectGroupLogTypeMessage:
      return "DebugInspectGroupLogTypeMessage";
    case DebugInspectGroupLogType.DebugInspectGroupLogTypeMetadata:
      return "DebugInspectGroupLogTypeMetadata";
    case DebugInspectGroupLogType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum ContactState {
  ContactStateUndefined = 0,
  ContactStateToRequest = 1,
  ContactStateReceived = 2,
  ContactStateAdded = 3,
  ContactStateRemoved = 4,
  ContactStateDiscarded = 5,
  ContactStateBlocked = 6,
  UNRECOGNIZED = -1,
}

export function contactStateFromJSON(object: any): ContactState {
  switch (object) {
    case 0:
    case "ContactStateUndefined":
      return ContactState.ContactStateUndefined;
    case 1:
    case "ContactStateToRequest":
      return ContactState.ContactStateToRequest;
    case 2:
    case "ContactStateReceived":
      return ContactState.ContactStateReceived;
    case 3:
    case "ContactStateAdded":
      return ContactState.ContactStateAdded;
    case 4:
    case "ContactStateRemoved":
      return ContactState.ContactStateRemoved;
    case 5:
    case "ContactStateDiscarded":
      return ContactState.ContactStateDiscarded;
    case 6:
    case "ContactStateBlocked":
      return ContactState.ContactStateBlocked;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ContactState.UNRECOGNIZED;
  }
}

export function contactStateToJSON(object: ContactState): string {
  switch (object) {
    case ContactState.ContactStateUndefined:
      return "ContactStateUndefined";
    case ContactState.ContactStateToRequest:
      return "ContactStateToRequest";
    case ContactState.ContactStateReceived:
      return "ContactStateReceived";
    case ContactState.ContactStateAdded:
      return "ContactStateAdded";
    case ContactState.ContactStateRemoved:
      return "ContactStateRemoved";
    case ContactState.ContactStateDiscarded:
      return "ContactStateDiscarded";
    case ContactState.ContactStateBlocked:
      return "ContactStateBlocked";
    case ContactState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum Direction {
  UnknownDir = 0,
  InboundDir = 1,
  OutboundDir = 2,
  BiDir = 3,
  UNRECOGNIZED = -1,
}

export function directionFromJSON(object: any): Direction {
  switch (object) {
    case 0:
    case "UnknownDir":
      return Direction.UnknownDir;
    case 1:
    case "InboundDir":
      return Direction.InboundDir;
    case 2:
    case "OutboundDir":
      return Direction.OutboundDir;
    case 3:
    case "BiDir":
      return Direction.BiDir;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Direction.UNRECOGNIZED;
  }
}

export function directionToJSON(object: Direction): string {
  switch (object) {
    case Direction.UnknownDir:
      return "UnknownDir";
    case Direction.InboundDir:
      return "InboundDir";
    case Direction.OutboundDir:
      return "OutboundDir";
    case Direction.BiDir:
      return "BiDir";
    case Direction.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Account describes all the secrets that identifies an Account */
export interface Account {
  /** group specifies which group is used to manage the account */
  group:
    | Group
    | undefined;
  /** account_private_key, private part is used to signs handshake, signs device, create contacts group keys via ECDH -- public part is used to have a shareable identity */
  accountPrivateKey: Uint8Array;
  /** alias_private_key, private part is use to derive group members private keys, signs alias proofs, public part can be shared to contacts to prove identity */
  aliasPrivateKey: Uint8Array;
  /** public_rendezvous_seed, rendezvous seed used for direct communication */
  publicRendezvousSeed: Uint8Array;
}

/** Group define a group and is enough to invite someone to it */
export interface Group {
  /** public_key is the identifier of the group, it signs the group secret and the initial member of a multi-member group */
  publicKey: Uint8Array;
  /** secret is the symmetric secret of the group, which is used to encrypt the metadata */
  secret: Uint8Array;
  /** secret_sig is the signature of the secret used to ensure the validity of the group */
  secretSig: Uint8Array;
  /** group_type specifies the type of the group, used to determine how device chain key is generated */
  groupType: GroupType;
  /** sign_pub is the signature public key used to verify entries, not required when secret and secret_sig are provided */
  signPub: Uint8Array;
  /** link_key is the secret key used to exchange group updates and links to attachments, useful for replication services */
  linkKey: Uint8Array;
  /** link_key_sig is the signature of the link_key using the group private key */
  linkKeySig: Uint8Array;
}

export interface GroupHeadsExport {
  /** public_key is the identifier of the group, it signs the group secret and the initial member of a multi-member group */
  publicKey: Uint8Array;
  /** sign_pub is the signature public key used to verify entries */
  signPub: Uint8Array;
  /** metadata_heads_cids are the heads of the metadata store that should be restored from an export */
  metadataHeadsCids: Uint8Array[];
  /** messages_heads_cids are the heads of the metadata store that should be restored from an export */
  messagesHeadsCids: Uint8Array[];
  /** link_key */
  linkKey: Uint8Array;
}

/** GroupMetadata is used in GroupEnvelope and only readable by invited group members */
export interface GroupMetadata {
  /** event_type defines which event type is used */
  eventType: EventType;
  /** the serialization depends on event_type, event is symmetrically encrypted */
  payload: Uint8Array;
  /** sig is the signature of the payload, it depends on the event_type for the used key */
  sig: Uint8Array;
  /** protocol_metadata is protocol layer data */
  protocolMetadata: ProtocolMetadata | undefined;
}

/** GroupEnvelope is a publicly exposed structure containing a group metadata event */
export interface GroupEnvelope {
  /** nonce is used to encrypt the message */
  nonce: Uint8Array;
  /** event is encrypted using a symmetric key shared among group members */
  event: Uint8Array;
}

/** MessageHeaders is used in MessageEnvelope and only readable by invited group members */
export interface MessageHeaders {
  /** counter is the current counter value for the specified device */
  counter: number;
  /** device_pk is the public key of the device sending the message */
  devicePk: Uint8Array;
  /** sig is the signature of the encrypted message using the device's private key */
  sig: Uint8Array;
  /** metadata allow to pass custom informations */
  metadata: { [key: string]: string };
}

export interface MessageHeaders_MetadataEntry {
  key: string;
  value: string;
}

export interface ProtocolMetadata {
}

/** EncryptedMessage is used in MessageEnvelope and only readable by groups members that joined before the message was sent */
export interface EncryptedMessage {
  /** plaintext is the app layer data */
  plaintext: Uint8Array;
  /** protocol_metadata is protocol layer data */
  protocolMetadata: ProtocolMetadata | undefined;
}

/** MessageEnvelope is a publicly exposed structure containing a group secure message */
export interface MessageEnvelope {
  /** message_headers is an encrypted serialization using a symmetric key of a MessageHeaders message */
  messageHeaders: Uint8Array;
  /** message is an encrypted message, only readable by group members who previously received the appropriate chain key */
  message: Uint8Array;
  /** nonce is a nonce for message headers */
  nonce: Uint8Array;
}

/** EventContext adds context (its id, its parents and its attachments) to an event */
export interface EventContext {
  /** id is the CID of the underlying OrbitDB event */
  id: Uint8Array;
  /** id are the the CIDs of the underlying parents of the OrbitDB event */
  parentIds: Uint8Array[];
  /** group_pk receiving the event */
  groupPk: Uint8Array;
}

/** GroupMetadataPayloadSent is an app defined message, accessible to future group members */
export interface GroupMetadataPayloadSent {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** message is the payload */
  message: Uint8Array;
}

/** ContactAliasKeyAdded is an event type where ones shares their alias public key */
export interface ContactAliasKeyAdded {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** alias_pk is the alias key which will be used to verify a contact identity */
  aliasPk: Uint8Array;
}

/**
 * GroupMemberDeviceAdded is an event which indicates to a group a new device (and eventually a new member) is joining it
 * When added on AccountGroup, this event should be followed by appropriate GroupMemberDeviceAdded and GroupDeviceChainKeyAdded events
 */
export interface GroupMemberDeviceAdded {
  /** member_pk is the member sending the event */
  memberPk: Uint8Array;
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** member_sig is used to prove the ownership of the member pk */
  memberSig: Uint8Array;
}

/** DeviceChainKey is a chain key, which will be encrypted for a specific member of the group */
export interface DeviceChainKey {
  /** chain_key is the current value of the chain key of the group device */
  chainKey: Uint8Array;
  /** counter is the current value of the counter of the group device */
  counter: number;
}

/** GroupDeviceChainKeyAdded is an event which indicates to a group member a device chain key */
export interface GroupDeviceChainKeyAdded {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** dest_member_pk is the member who should receive the secret */
  destMemberPk: Uint8Array;
  /** payload is the serialization of Payload encrypted for the specified member */
  payload: Uint8Array;
}

/** MultiMemberGroupAliasResolverAdded indicates that a group member want to disclose their presence in the group to their contacts */
export interface MultiMemberGroupAliasResolverAdded {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /**
   * alias_resolver allows contact of an account to resolve the real identity behind an alias (Multi-Member Group Member)
   * Generated by both contacts and account independently using: hmac(aliasPK, GroupID)
   */
  aliasResolver: Uint8Array;
  /**
   * alias_proof ensures that the associated alias_resolver has been issued by the right account
   * Generated using aliasSKSig(GroupID)
   */
  aliasProof: Uint8Array;
}

/** MultiMemberGroupAdminRoleGranted indicates that a group admin allows another group member to act as an admin */
export interface MultiMemberGroupAdminRoleGranted {
  /** device_pk is the device sending the event, signs the message, must be the device of an admin of the group */
  devicePk: Uint8Array;
  /** grantee_member_pk is the member public key of the member granted of the admin role */
  granteeMemberPk: Uint8Array;
}

/** MultiMemberGroupInitialMemberAnnounced indicates that a member is the group creator, this event is signed using the group ID private key */
export interface MultiMemberGroupInitialMemberAnnounced {
  /** member_pk is the public key of the member who is the group creator */
  memberPk: Uint8Array;
}

/** GroupAddAdditionalRendezvousSeed indicates that an additional rendezvous point should be used for data synchronization */
export interface GroupAddAdditionalRendezvousSeed {
  /** device_pk is the device sending the event, signs the message, must be the device of an admin of the group */
  devicePk: Uint8Array;
  /** seed is the additional rendezvous point seed which should be used */
  seed: Uint8Array;
}

/** GroupRemoveAdditionalRendezvousSeed indicates that a previously added rendezvous point should be removed */
export interface GroupRemoveAdditionalRendezvousSeed {
  /** device_pk is the device sending the event, signs the message, must be the device of an admin of the group */
  devicePk: Uint8Array;
  /** seed is the additional rendezvous point seed which should be removed */
  seed: Uint8Array;
}

/** AccountGroupJoined indicates that the account is now part of a new group */
export interface AccountGroupJoined {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** group describe the joined group */
  group: Group | undefined;
}

/** AccountGroupLeft indicates that the account has left a group */
export interface AccountGroupLeft {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** group_pk references the group left */
  groupPk: Uint8Array;
}

/** AccountContactRequestDisabled indicates that the account should not be advertised on a public rendezvous point */
export interface AccountContactRequestDisabled {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
}

/** AccountContactRequestEnabled indicates that the account should be advertised on a public rendezvous point */
export interface AccountContactRequestEnabled {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
}

/** AccountContactRequestReferenceReset indicates that the account should be advertised on different public rendezvous points */
export interface AccountContactRequestReferenceReset {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** public_rendezvous_seed is the new rendezvous point seed */
  publicRendezvousSeed: Uint8Array;
}

/**
 * This event should be followed by an AccountGroupJoined event
 * This event should be followed by a GroupMemberDeviceAdded event within the AccountGroup
 * This event should be followed by a GroupDeviceChainKeyAdded event within the AccountGroup
 * AccountContactRequestOutgoingEnqueued indicates that the account will attempt to send a contact request when a matching peer is discovered
 */
export interface AccountContactRequestOutgoingEnqueued {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** group_pk is the 1to1 group with the requested user */
  groupPk: Uint8Array;
  /** contact is a message describing how to connect to the other account */
  contact:
    | ShareableContact
    | undefined;
  /** own_metadata is the identifying metadata that will be shared to the other account */
  ownMetadata: Uint8Array;
}

/** AccountContactRequestOutgoingSent indicates that the account has sent a contact request */
export interface AccountContactRequestOutgoingSent {
  /** device_pk is the device sending the account event, signs the message */
  devicePk: Uint8Array;
  /** contact_pk is the contacted account */
  contactPk: Uint8Array;
}

/** AccountContactRequestIncomingReceived indicates that the account has received a new contact request */
export interface AccountContactRequestIncomingReceived {
  /** device_pk is the device sending the account event (which received the contact request), signs the message */
  devicePk: Uint8Array;
  /** contact_pk is the account sending the request */
  contactPk: Uint8Array;
  /**
   * TODO: is this necessary?
   * contact_rendezvous_seed is the rendezvous seed of the contact sending the request
   */
  contactRendezvousSeed: Uint8Array;
  /**
   * TODO: is this necessary?
   * contact_metadata is the metadata specific to the app to identify the contact for the request
   */
  contactMetadata: Uint8Array;
}

/** AccountContactRequestIncomingDiscarded indicates that a contact request has been refused */
export interface AccountContactRequestIncomingDiscarded {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** contact_pk is the contact whom request is refused */
  contactPk: Uint8Array;
}

/**
 * This event should be followed by an AccountGroupJoined event
 * This event should be followed by GroupMemberDeviceAdded and GroupDeviceChainKeyAdded events within the AccountGroup
 * AccountContactRequestIncomingAccepted indicates that a contact request has been accepted
 */
export interface AccountContactRequestIncomingAccepted {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** contact_pk is the contact whom request is accepted */
  contactPk: Uint8Array;
  /** group_pk is the 1to1 group with the requester user */
  groupPk: Uint8Array;
}

/** AccountContactBlocked indicates that a contact is blocked */
export interface AccountContactBlocked {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** contact_pk is the contact blocked */
  contactPk: Uint8Array;
}

/** AccountContactUnblocked indicates that a contact is unblocked */
export interface AccountContactUnblocked {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** contact_pk is the contact unblocked */
  contactPk: Uint8Array;
}

export interface GroupReplicating {
  /** device_pk is the device sending the event, signs the message */
  devicePk: Uint8Array;
  /** authentication_url indicates which server has been used for authentication */
  authenticationUrl: string;
  /** replication_server indicates which server will be used for replication */
  replicationServer: string;
}

export interface ServiceExportData {
}

export interface ServiceExportData_Request {
}

export interface ServiceExportData_Reply {
  exportedData: Uint8Array;
}

export interface ServiceGetConfiguration {
}

export enum ServiceGetConfiguration_SettingState {
  Unknown = 0,
  Enabled = 1,
  Disabled = 2,
  Unavailable = 3,
  UNRECOGNIZED = -1,
}

export function serviceGetConfiguration_SettingStateFromJSON(object: any): ServiceGetConfiguration_SettingState {
  switch (object) {
    case 0:
    case "Unknown":
      return ServiceGetConfiguration_SettingState.Unknown;
    case 1:
    case "Enabled":
      return ServiceGetConfiguration_SettingState.Enabled;
    case 2:
    case "Disabled":
      return ServiceGetConfiguration_SettingState.Disabled;
    case 3:
    case "Unavailable":
      return ServiceGetConfiguration_SettingState.Unavailable;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ServiceGetConfiguration_SettingState.UNRECOGNIZED;
  }
}

export function serviceGetConfiguration_SettingStateToJSON(object: ServiceGetConfiguration_SettingState): string {
  switch (object) {
    case ServiceGetConfiguration_SettingState.Unknown:
      return "Unknown";
    case ServiceGetConfiguration_SettingState.Enabled:
      return "Enabled";
    case ServiceGetConfiguration_SettingState.Disabled:
      return "Disabled";
    case ServiceGetConfiguration_SettingState.Unavailable:
      return "Unavailable";
    case ServiceGetConfiguration_SettingState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ServiceGetConfiguration_Request {
}

export interface ServiceGetConfiguration_Reply {
  /** account_pk is the public key of the current account */
  accountPk: Uint8Array;
  /** device_pk is the public key of the current device */
  devicePk: Uint8Array;
  /** account_group_pk is the public key of the account group */
  accountGroupPk: Uint8Array;
  /** peer_id is the peer ID of the current IPFS node */
  peerId: string;
  /** listeners is the list of swarm listening addresses of the current IPFS node */
  listeners: string[];
  bleEnabled: ServiceGetConfiguration_SettingState;
  /** MultiPeerConnectivity for Darwin and Nearby for Android */
  wifiP2pEnabled: ServiceGetConfiguration_SettingState;
  mdnsEnabled: ServiceGetConfiguration_SettingState;
  relayEnabled: ServiceGetConfiguration_SettingState;
}

export interface ContactRequestReference {
}

export interface ContactRequestReference_Request {
}

export interface ContactRequestReference_Reply {
  /** public_rendezvous_seed is the rendezvous seed used by the current account */
  publicRendezvousSeed: Uint8Array;
  /** enabled indicates if incoming contact requests are enabled */
  enabled: boolean;
}

export interface ContactRequestDisable {
}

export interface ContactRequestDisable_Request {
}

export interface ContactRequestDisable_Reply {
}

export interface ContactRequestEnable {
}

export interface ContactRequestEnable_Request {
}

export interface ContactRequestEnable_Reply {
  /** public_rendezvous_seed is the rendezvous seed used by the current account */
  publicRendezvousSeed: Uint8Array;
}

export interface ContactRequestResetReference {
}

export interface ContactRequestResetReference_Request {
}

export interface ContactRequestResetReference_Reply {
  /** public_rendezvous_seed is the rendezvous seed used by the current account */
  publicRendezvousSeed: Uint8Array;
}

export interface ContactRequestSend {
}

export interface ContactRequestSend_Request {
  /** contact is a message describing how to connect to the other account */
  contact:
    | ShareableContact
    | undefined;
  /** own_metadata is the identifying metadata that will be shared to the other account */
  ownMetadata: Uint8Array;
}

export interface ContactRequestSend_Reply {
}

export interface ContactRequestAccept {
}

export interface ContactRequestAccept_Request {
  /** contact_pk is the identifier of the contact to accept the request from */
  contactPk: Uint8Array;
}

export interface ContactRequestAccept_Reply {
}

export interface ContactRequestDiscard {
}

export interface ContactRequestDiscard_Request {
  /** contact_pk is the identifier of the contact to ignore the request from */
  contactPk: Uint8Array;
}

export interface ContactRequestDiscard_Reply {
}

export interface ShareContact {
}

export interface ShareContact_Request {
}

export interface ShareContact_Reply {
  /** encoded_contact is the Protobuf encoding of the ShareableContact. You can further encode the bytes for sharing, such as base58 or QR code. */
  encodedContact: Uint8Array;
}

export interface DecodeContact {
}

export interface DecodeContact_Request {
  /** encoded_contact is the Protobuf encoding of the shareable contact (as returned by ShareContact). */
  encodedContact: Uint8Array;
}

export interface DecodeContact_Reply {
  /** shareable_contact is the decoded shareable contact. */
  contact: ShareableContact | undefined;
}

export interface ContactBlock {
}

export interface ContactBlock_Request {
  /** contact_pk is the identifier of the contact to block */
  contactPk: Uint8Array;
}

export interface ContactBlock_Reply {
}

export interface ContactUnblock {
}

export interface ContactUnblock_Request {
  /** contact_pk is the identifier of the contact to unblock */
  contactPk: Uint8Array;
}

export interface ContactUnblock_Reply {
}

export interface ContactAliasKeySend {
}

export interface ContactAliasKeySend_Request {
  /** contact_pk is the identifier of the contact to send the alias public key to */
  groupPk: Uint8Array;
}

export interface ContactAliasKeySend_Reply {
}

export interface MultiMemberGroupCreate {
}

export interface MultiMemberGroupCreate_Request {
}

export interface MultiMemberGroupCreate_Reply {
  /** group_pk is the identifier of the newly created group */
  groupPk: Uint8Array;
}

export interface MultiMemberGroupJoin {
}

export interface MultiMemberGroupJoin_Request {
  /** group is the information of the group to join */
  group: Group | undefined;
}

export interface MultiMemberGroupJoin_Reply {
}

export interface MultiMemberGroupLeave {
}

export interface MultiMemberGroupLeave_Request {
  groupPk: Uint8Array;
}

export interface MultiMemberGroupLeave_Reply {
}

export interface MultiMemberGroupAliasResolverDisclose {
}

export interface MultiMemberGroupAliasResolverDisclose_Request {
  /** group_pk is the identifier of the group */
  groupPk: Uint8Array;
}

export interface MultiMemberGroupAliasResolverDisclose_Reply {
}

export interface MultiMemberGroupAdminRoleGrant {
}

export interface MultiMemberGroupAdminRoleGrant_Request {
  /** group_pk is the identifier of the group */
  groupPk: Uint8Array;
  /** member_pk is the identifier of the member which will be granted the admin role */
  memberPk: Uint8Array;
}

export interface MultiMemberGroupAdminRoleGrant_Reply {
}

export interface MultiMemberGroupInvitationCreate {
}

export interface MultiMemberGroupInvitationCreate_Request {
  /** group_pk is the identifier of the group */
  groupPk: Uint8Array;
}

export interface MultiMemberGroupInvitationCreate_Reply {
  /** group is the invitation to the group */
  group: Group | undefined;
}

export interface AppMetadataSend {
}

export interface AppMetadataSend_Request {
  /** group_pk is the identifier of the group */
  groupPk: Uint8Array;
  /** payload is the payload to send */
  payload: Uint8Array;
}

export interface AppMetadataSend_Reply {
  cid: Uint8Array;
}

export interface AppMessageSend {
}

export interface AppMessageSend_Request {
  /** group_pk is the identifier of the group */
  groupPk: Uint8Array;
  /** payload is the payload to send */
  payload: Uint8Array;
}

export interface AppMessageSend_Reply {
  cid: Uint8Array;
}

export interface GroupMetadataEvent {
  /** event_context contains context information about the event */
  eventContext:
    | EventContext
    | undefined;
  /** metadata contains the newly available metadata */
  metadata:
    | GroupMetadata
    | undefined;
  /** event_clear clear bytes for the event */
  event: Uint8Array;
}

export interface GroupMessageEvent {
  /** event_context contains context information about the event */
  eventContext:
    | EventContext
    | undefined;
  /** headers contains headers of the secure message */
  headers:
    | MessageHeaders
    | undefined;
  /** message contains the secure message payload */
  message: Uint8Array;
}

export interface GroupMetadataList {
}

export interface GroupMetadataList_Request {
  /** group_pk is the identifier of the group */
  groupPk: Uint8Array;
  /**
   * since is the lower ID bound used to filter events
   * if not set, will return events since the beginning
   */
  sinceId: Uint8Array;
  /**
   * since_now will list only new event to come
   * since_id must not be set
   */
  sinceNow: boolean;
  /**
   * until is the upper ID bound used to filter events
   * if not set, will subscribe to new events to come
   */
  untilId: Uint8Array;
  /**
   * until_now will not list new event to come
   * until_id must not be set
   */
  untilNow: boolean;
  /**
   * reverse_order indicates whether the previous events should be returned in
   * reverse chronological order
   */
  reverseOrder: boolean;
}

export interface GroupMessageList {
}

export interface GroupMessageList_Request {
  /** group_pk is the identifier of the group */
  groupPk: Uint8Array;
  /**
   * since is the lower ID bound used to filter events
   * if not set, will return events since the beginning
   */
  sinceId: Uint8Array;
  /**
   * since_now will list only new event to come
   * since_id must not be set
   */
  sinceNow: boolean;
  /**
   * until is the upper ID bound used to filter events
   * if not set, will subscribe to new events to come
   */
  untilId: Uint8Array;
  /**
   * until_now will not list new event to come
   * until_id must not be set
   */
  untilNow: boolean;
  /**
   * reverse_order indicates whether the previous events should be returned in
   * reverse chronological order
   */
  reverseOrder: boolean;
}

export interface GroupInfo {
}

export interface GroupInfo_Request {
  /** group_pk is the identifier of the group */
  groupPk: Uint8Array;
  /** contact_pk is the identifier of the contact */
  contactPk: Uint8Array;
}

export interface GroupInfo_Reply {
  /** group is the group invitation, containing the group pk and its type */
  group:
    | Group
    | undefined;
  /** member_pk is the identifier of the current member in the group */
  memberPk: Uint8Array;
  /** device_pk is the identifier of the current device in the group */
  devicePk: Uint8Array;
}

export interface ActivateGroup {
}

export interface ActivateGroup_Request {
  /** group_pk is the identifier of the group */
  groupPk: Uint8Array;
  /**
   * local_only will open the group without enabling network interactions
   * with other members
   */
  localOnly: boolean;
}

export interface ActivateGroup_Reply {
}

export interface DeactivateGroup {
}

export interface DeactivateGroup_Request {
  /** group_pk is the identifier of the group */
  groupPk: Uint8Array;
}

export interface DeactivateGroup_Reply {
}

export interface GroupDeviceStatus {
}

export enum GroupDeviceStatus_Type {
  TypeUnknown = 0,
  TypePeerDisconnected = 1,
  TypePeerConnected = 2,
  TypePeerReconnecting = 3,
  UNRECOGNIZED = -1,
}

export function groupDeviceStatus_TypeFromJSON(object: any): GroupDeviceStatus_Type {
  switch (object) {
    case 0:
    case "TypeUnknown":
      return GroupDeviceStatus_Type.TypeUnknown;
    case 1:
    case "TypePeerDisconnected":
      return GroupDeviceStatus_Type.TypePeerDisconnected;
    case 2:
    case "TypePeerConnected":
      return GroupDeviceStatus_Type.TypePeerConnected;
    case 3:
    case "TypePeerReconnecting":
      return GroupDeviceStatus_Type.TypePeerReconnecting;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GroupDeviceStatus_Type.UNRECOGNIZED;
  }
}

export function groupDeviceStatus_TypeToJSON(object: GroupDeviceStatus_Type): string {
  switch (object) {
    case GroupDeviceStatus_Type.TypeUnknown:
      return "TypeUnknown";
    case GroupDeviceStatus_Type.TypePeerDisconnected:
      return "TypePeerDisconnected";
    case GroupDeviceStatus_Type.TypePeerConnected:
      return "TypePeerConnected";
    case GroupDeviceStatus_Type.TypePeerReconnecting:
      return "TypePeerReconnecting";
    case GroupDeviceStatus_Type.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum GroupDeviceStatus_Transport {
  TptUnknown = 0,
  TptLAN = 1,
  TptWAN = 2,
  TptProximity = 3,
  UNRECOGNIZED = -1,
}

export function groupDeviceStatus_TransportFromJSON(object: any): GroupDeviceStatus_Transport {
  switch (object) {
    case 0:
    case "TptUnknown":
      return GroupDeviceStatus_Transport.TptUnknown;
    case 1:
    case "TptLAN":
      return GroupDeviceStatus_Transport.TptLAN;
    case 2:
    case "TptWAN":
      return GroupDeviceStatus_Transport.TptWAN;
    case 3:
    case "TptProximity":
      return GroupDeviceStatus_Transport.TptProximity;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GroupDeviceStatus_Transport.UNRECOGNIZED;
  }
}

export function groupDeviceStatus_TransportToJSON(object: GroupDeviceStatus_Transport): string {
  switch (object) {
    case GroupDeviceStatus_Transport.TptUnknown:
      return "TptUnknown";
    case GroupDeviceStatus_Transport.TptLAN:
      return "TptLAN";
    case GroupDeviceStatus_Transport.TptWAN:
      return "TptWAN";
    case GroupDeviceStatus_Transport.TptProximity:
      return "TptProximity";
    case GroupDeviceStatus_Transport.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GroupDeviceStatus_Request {
  groupPk: Uint8Array;
}

export interface GroupDeviceStatus_Reply {
  type: GroupDeviceStatus_Type;
  event: Uint8Array;
}

export interface GroupDeviceStatus_Reply_PeerConnected {
  peerId: string;
  devicePk: Uint8Array;
  transports: GroupDeviceStatus_Transport[];
  maddrs: string[];
}

export interface GroupDeviceStatus_Reply_PeerReconnecting {
  peerId: string;
}

export interface GroupDeviceStatus_Reply_PeerDisconnected {
  peerId: string;
}

export interface DebugListGroups {
}

export interface DebugListGroups_Request {
}

export interface DebugListGroups_Reply {
  /** group_pk is the public key of the group */
  groupPk: Uint8Array;
  /** group_type is the type of the group */
  groupType: GroupType;
  /** contact_pk is the contact public key if appropriate */
  contactPk: Uint8Array;
}

export interface DebugInspectGroupStore {
}

export interface DebugInspectGroupStore_Request {
  /** group_pk is the identifier of the group */
  groupPk: Uint8Array;
  /** log_type is the log to inspect */
  logType: DebugInspectGroupLogType;
}

export interface DebugInspectGroupStore_Reply {
  /** cid is the CID of the IPFS log entry */
  cid: Uint8Array;
  /** parent_cids is the list of the parent entries */
  parentCids: Uint8Array[];
  /** event_type metadata event type if subscribed to metadata events */
  metadataEventType: EventType;
  /** device_pk is the public key of the device signing the entry */
  devicePk: Uint8Array;
  /** payload is the un encrypted entry payload if available */
  payload: Uint8Array;
}

export interface DebugGroup {
}

export interface DebugGroup_Request {
  /** group_pk is the identifier of the group */
  groupPk: Uint8Array;
}

export interface DebugGroup_Reply {
  /** peer_ids is the list of peer ids connected to the same group */
  peerIds: string[];
}

export interface ShareableContact {
  /** pk is the account to send a contact request to */
  pk: Uint8Array;
  /** public_rendezvous_seed is the rendezvous seed used by the account to send a contact request to */
  publicRendezvousSeed: Uint8Array;
  /** metadata is the metadata specific to the app to identify the contact for the request */
  metadata: Uint8Array;
}

export interface ServiceTokenSupportedService {
  serviceType: string;
  serviceEndpoint: string;
}

export interface ServiceToken {
  token: string;
  authenticationUrl: string;
  supportedServices: ServiceTokenSupportedService[];
  expiration: number;
}

export interface CredentialVerificationServiceInitFlow {
}

export interface CredentialVerificationServiceInitFlow_Request {
  serviceUrl: string;
  publicKey: Uint8Array;
  link: string;
}

export interface CredentialVerificationServiceInitFlow_Reply {
  url: string;
  secureUrl: boolean;
}

export interface CredentialVerificationServiceCompleteFlow {
}

export interface CredentialVerificationServiceCompleteFlow_Request {
  callbackUri: string;
}

export interface CredentialVerificationServiceCompleteFlow_Reply {
  identifier: string;
}

export interface VerifiedCredentialsList {
}

export interface VerifiedCredentialsList_Request {
  filterIdentifier: string;
  filterIssuer: string;
  excludeExpired: boolean;
}

export interface VerifiedCredentialsList_Reply {
  credential: AccountVerifiedCredentialRegistered | undefined;
}

export interface ReplicationServiceRegisterGroup {
}

export interface ReplicationServiceRegisterGroup_Request {
  groupPk: Uint8Array;
  token: string;
  authenticationUrl: string;
  replicationServer: string;
}

export interface ReplicationServiceRegisterGroup_Reply {
}

export interface ReplicationServiceReplicateGroup {
}

export interface ReplicationServiceReplicateGroup_Request {
  group: Group | undefined;
}

export interface ReplicationServiceReplicateGroup_Reply {
  ok: boolean;
}

export interface SystemInfo {
}

export interface SystemInfo_Request {
}

export interface SystemInfo_Reply {
  process: SystemInfo_Process | undefined;
  p2p: SystemInfo_P2P | undefined;
  orbitdb: SystemInfo_OrbitDB | undefined;
  warns: string[];
}

export interface SystemInfo_OrbitDB {
  accountMetadata: SystemInfo_OrbitDB_ReplicationStatus | undefined;
}

export interface SystemInfo_OrbitDB_ReplicationStatus {
  progress: number;
  maximum: number;
  buffered: number;
  queued: number;
}

export interface SystemInfo_P2P {
  connectedPeers: number;
}

export interface SystemInfo_Process {
  version: string;
  vcsRef: string;
  uptimeMs: number;
  userCpuTimeMs: number;
  systemCpuTimeMs: number;
  startedAt: number;
  rlimitCur: number;
  numGoroutine: number;
  nofile: number;
  tooManyOpenFiles: boolean;
  numCpu: number;
  goVersion: string;
  operatingSystem: string;
  hostName: string;
  arch: string;
  rlimitMax: number;
  pid: number;
  ppid: number;
  priority: number;
  uid: number;
  workingDir: string;
  systemUsername: string;
}

export interface PeerList {
}

export enum PeerList_Feature {
  UnknownFeature = 0,
  WeshFeature = 1,
  BLEFeature = 2,
  LocalFeature = 3,
  TorFeature = 4,
  QuicFeature = 5,
  UNRECOGNIZED = -1,
}

export function peerList_FeatureFromJSON(object: any): PeerList_Feature {
  switch (object) {
    case 0:
    case "UnknownFeature":
      return PeerList_Feature.UnknownFeature;
    case 1:
    case "WeshFeature":
      return PeerList_Feature.WeshFeature;
    case 2:
    case "BLEFeature":
      return PeerList_Feature.BLEFeature;
    case 3:
    case "LocalFeature":
      return PeerList_Feature.LocalFeature;
    case 4:
    case "TorFeature":
      return PeerList_Feature.TorFeature;
    case 5:
    case "QuicFeature":
      return PeerList_Feature.QuicFeature;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PeerList_Feature.UNRECOGNIZED;
  }
}

export function peerList_FeatureToJSON(object: PeerList_Feature): string {
  switch (object) {
    case PeerList_Feature.UnknownFeature:
      return "UnknownFeature";
    case PeerList_Feature.WeshFeature:
      return "WeshFeature";
    case PeerList_Feature.BLEFeature:
      return "BLEFeature";
    case PeerList_Feature.LocalFeature:
      return "LocalFeature";
    case PeerList_Feature.TorFeature:
      return "TorFeature";
    case PeerList_Feature.QuicFeature:
      return "QuicFeature";
    case PeerList_Feature.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface PeerList_Request {
}

export interface PeerList_Reply {
  peers: PeerList_Peer[];
}

export interface PeerList_Peer {
  /** id is the libp2p.PeerID. */
  id: string;
  /** routes are the list of active and known maddr. */
  routes: PeerList_Route[];
  /** errors is a list of errors related to the peer. */
  errors: string[];
  /** Features is a list of available features. */
  features: PeerList_Feature[];
  /** MinLatency is the minimum latency across all the peer routes. */
  minLatency: number;
  /** IsActive is true if at least one of the route is active. */
  isActive: boolean;
  /** Direction is the aggregate of all the routes's direction. */
  direction: Direction;
}

export interface PeerList_Route {
  /** IsActive indicates whether the address is currently used or just known. */
  isActive: boolean;
  /** Address is the multiaddress via which we are connected with the peer. */
  address: string;
  /** Direction is which way the connection was established. */
  direction: Direction;
  /** Latency is the last known round trip time to the peer in ms. */
  latency: number;
  /** Streams returns list of streams established with the peer. */
  streams: PeerList_Stream[];
}

export interface PeerList_Stream {
  /** id is an identifier used to write protocol headers in streams. */
  id: string;
}

/** Progress define a generic object that can be used to display a progress bar for long-running actions. */
export interface Progress {
  state: string;
  doing: string;
  progress: number;
  completed: number;
  total: number;
  delay: number;
}

export interface OutOfStoreMessage {
  cid: Uint8Array;
  devicePk: Uint8Array;
  counter: number;
  sig: Uint8Array;
  flags: number;
  encryptedPayload: Uint8Array;
  nonce: Uint8Array;
}

export interface OutOfStoreMessageEnvelope {
  nonce: Uint8Array;
  box: Uint8Array;
  groupReference: Uint8Array;
}

export interface OutOfStoreReceive {
}

export interface OutOfStoreReceive_Request {
  payload: Uint8Array;
}

export interface OutOfStoreReceive_Reply {
  message: OutOfStoreMessage | undefined;
  cleartext: Uint8Array;
  groupPublicKey: Uint8Array;
  alreadyReceived: boolean;
}

export interface OutOfStoreSeal {
}

export interface OutOfStoreSeal_Request {
  cid: Uint8Array;
  groupPublicKey: Uint8Array;
}

export interface OutOfStoreSeal_Reply {
  encrypted: Uint8Array;
}

export interface AccountVerifiedCredentialRegistered {
  /** device_pk is the public key of the device sending the message */
  devicePk: Uint8Array;
  signedIdentityPublicKey: Uint8Array;
  verifiedCredential: string;
  registrationDate: number;
  expirationDate: number;
  identifier: string;
  issuer: string;
}

export interface FirstLastCounters {
  first: number;
  last: number;
}

/** OrbitDBMessageHeads is the payload sent on orbitdb to share peer's heads */
export interface OrbitDBMessageHeads {
  /** sealed box should contain encrypted Box */
  sealedBox: Uint8Array;
  /** current topic used */
  rawRotation: Uint8Array;
}

export interface OrbitDBMessageHeads_Box {
  address: string;
  heads: Uint8Array;
  devicePk: Uint8Array;
  peerId: Uint8Array;
}

export interface RefreshContactRequest {
}

export interface RefreshContactRequest_Peer {
  /** id is the libp2p.PeerID. */
  id: string;
  /** list of peers multiaddrs. */
  addrs: string[];
}

export interface RefreshContactRequest_Request {
  contactPk: Uint8Array;
  /** timeout in second */
  timeout: number;
}

export interface RefreshContactRequest_Reply {
  /** peers found and successfully connected. */
  peersFound: RefreshContactRequest_Peer[];
}

function createBaseAccount(): Account {
  return {
    group: undefined,
    accountPrivateKey: new Uint8Array(0),
    aliasPrivateKey: new Uint8Array(0),
    publicRendezvousSeed: new Uint8Array(0),
  };
}

export const Account = {
  encode(message: Account, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.group !== undefined) {
      Group.encode(message.group, writer.uint32(10).fork()).ldelim();
    }
    if (message.accountPrivateKey.length !== 0) {
      writer.uint32(18).bytes(message.accountPrivateKey);
    }
    if (message.aliasPrivateKey.length !== 0) {
      writer.uint32(26).bytes(message.aliasPrivateKey);
    }
    if (message.publicRendezvousSeed.length !== 0) {
      writer.uint32(34).bytes(message.publicRendezvousSeed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Account {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.group = Group.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.accountPrivateKey = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.aliasPrivateKey = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.publicRendezvousSeed = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Account {
    return {
      group: isSet(object.group) ? Group.fromJSON(object.group) : undefined,
      accountPrivateKey: isSet(object.accountPrivateKey)
        ? bytesFromBase64(object.accountPrivateKey)
        : new Uint8Array(0),
      aliasPrivateKey: isSet(object.aliasPrivateKey) ? bytesFromBase64(object.aliasPrivateKey) : new Uint8Array(0),
      publicRendezvousSeed: isSet(object.publicRendezvousSeed)
        ? bytesFromBase64(object.publicRendezvousSeed)
        : new Uint8Array(0),
    };
  },

  toJSON(message: Account): unknown {
    const obj: any = {};
    if (message.group !== undefined) {
      obj.group = Group.toJSON(message.group);
    }
    if (message.accountPrivateKey.length !== 0) {
      obj.accountPrivateKey = base64FromBytes(message.accountPrivateKey);
    }
    if (message.aliasPrivateKey.length !== 0) {
      obj.aliasPrivateKey = base64FromBytes(message.aliasPrivateKey);
    }
    if (message.publicRendezvousSeed.length !== 0) {
      obj.publicRendezvousSeed = base64FromBytes(message.publicRendezvousSeed);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Account>, I>>(base?: I): Account {
    return Account.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Account>, I>>(object: I): Account {
    const message = createBaseAccount();
    message.group = (object.group !== undefined && object.group !== null) ? Group.fromPartial(object.group) : undefined;
    message.accountPrivateKey = object.accountPrivateKey ?? new Uint8Array(0);
    message.aliasPrivateKey = object.aliasPrivateKey ?? new Uint8Array(0);
    message.publicRendezvousSeed = object.publicRendezvousSeed ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroup(): Group {
  return {
    publicKey: new Uint8Array(0),
    secret: new Uint8Array(0),
    secretSig: new Uint8Array(0),
    groupType: 0,
    signPub: new Uint8Array(0),
    linkKey: new Uint8Array(0),
    linkKeySig: new Uint8Array(0),
  };
}

export const Group = {
  encode(message: Group, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publicKey.length !== 0) {
      writer.uint32(10).bytes(message.publicKey);
    }
    if (message.secret.length !== 0) {
      writer.uint32(18).bytes(message.secret);
    }
    if (message.secretSig.length !== 0) {
      writer.uint32(26).bytes(message.secretSig);
    }
    if (message.groupType !== 0) {
      writer.uint32(32).int32(message.groupType);
    }
    if (message.signPub.length !== 0) {
      writer.uint32(42).bytes(message.signPub);
    }
    if (message.linkKey.length !== 0) {
      writer.uint32(50).bytes(message.linkKey);
    }
    if (message.linkKeySig.length !== 0) {
      writer.uint32(58).bytes(message.linkKeySig);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Group {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroup();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.publicKey = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.secret = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.secretSig = reader.bytes();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.groupType = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.signPub = reader.bytes();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.linkKey = reader.bytes();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.linkKeySig = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Group {
    return {
      publicKey: isSet(object.publicKey) ? bytesFromBase64(object.publicKey) : new Uint8Array(0),
      secret: isSet(object.secret) ? bytesFromBase64(object.secret) : new Uint8Array(0),
      secretSig: isSet(object.secretSig) ? bytesFromBase64(object.secretSig) : new Uint8Array(0),
      groupType: isSet(object.groupType) ? groupTypeFromJSON(object.groupType) : 0,
      signPub: isSet(object.signPub) ? bytesFromBase64(object.signPub) : new Uint8Array(0),
      linkKey: isSet(object.linkKey) ? bytesFromBase64(object.linkKey) : new Uint8Array(0),
      linkKeySig: isSet(object.linkKeySig) ? bytesFromBase64(object.linkKeySig) : new Uint8Array(0),
    };
  },

  toJSON(message: Group): unknown {
    const obj: any = {};
    if (message.publicKey.length !== 0) {
      obj.publicKey = base64FromBytes(message.publicKey);
    }
    if (message.secret.length !== 0) {
      obj.secret = base64FromBytes(message.secret);
    }
    if (message.secretSig.length !== 0) {
      obj.secretSig = base64FromBytes(message.secretSig);
    }
    if (message.groupType !== 0) {
      obj.groupType = groupTypeToJSON(message.groupType);
    }
    if (message.signPub.length !== 0) {
      obj.signPub = base64FromBytes(message.signPub);
    }
    if (message.linkKey.length !== 0) {
      obj.linkKey = base64FromBytes(message.linkKey);
    }
    if (message.linkKeySig.length !== 0) {
      obj.linkKeySig = base64FromBytes(message.linkKeySig);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Group>, I>>(base?: I): Group {
    return Group.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Group>, I>>(object: I): Group {
    const message = createBaseGroup();
    message.publicKey = object.publicKey ?? new Uint8Array(0);
    message.secret = object.secret ?? new Uint8Array(0);
    message.secretSig = object.secretSig ?? new Uint8Array(0);
    message.groupType = object.groupType ?? 0;
    message.signPub = object.signPub ?? new Uint8Array(0);
    message.linkKey = object.linkKey ?? new Uint8Array(0);
    message.linkKeySig = object.linkKeySig ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupHeadsExport(): GroupHeadsExport {
  return {
    publicKey: new Uint8Array(0),
    signPub: new Uint8Array(0),
    metadataHeadsCids: [],
    messagesHeadsCids: [],
    linkKey: new Uint8Array(0),
  };
}

export const GroupHeadsExport = {
  encode(message: GroupHeadsExport, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publicKey.length !== 0) {
      writer.uint32(10).bytes(message.publicKey);
    }
    if (message.signPub.length !== 0) {
      writer.uint32(18).bytes(message.signPub);
    }
    for (const v of message.metadataHeadsCids) {
      writer.uint32(26).bytes(v!);
    }
    for (const v of message.messagesHeadsCids) {
      writer.uint32(34).bytes(v!);
    }
    if (message.linkKey.length !== 0) {
      writer.uint32(42).bytes(message.linkKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupHeadsExport {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupHeadsExport();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.publicKey = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.signPub = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.metadataHeadsCids.push(reader.bytes());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.messagesHeadsCids.push(reader.bytes());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.linkKey = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupHeadsExport {
    return {
      publicKey: isSet(object.publicKey) ? bytesFromBase64(object.publicKey) : new Uint8Array(0),
      signPub: isSet(object.signPub) ? bytesFromBase64(object.signPub) : new Uint8Array(0),
      metadataHeadsCids: globalThis.Array.isArray(object?.metadataHeadsCids)
        ? object.metadataHeadsCids.map((e: any) => bytesFromBase64(e))
        : [],
      messagesHeadsCids: globalThis.Array.isArray(object?.messagesHeadsCids)
        ? object.messagesHeadsCids.map((e: any) => bytesFromBase64(e))
        : [],
      linkKey: isSet(object.linkKey) ? bytesFromBase64(object.linkKey) : new Uint8Array(0),
    };
  },

  toJSON(message: GroupHeadsExport): unknown {
    const obj: any = {};
    if (message.publicKey.length !== 0) {
      obj.publicKey = base64FromBytes(message.publicKey);
    }
    if (message.signPub.length !== 0) {
      obj.signPub = base64FromBytes(message.signPub);
    }
    if (message.metadataHeadsCids?.length) {
      obj.metadataHeadsCids = message.metadataHeadsCids.map((e) => base64FromBytes(e));
    }
    if (message.messagesHeadsCids?.length) {
      obj.messagesHeadsCids = message.messagesHeadsCids.map((e) => base64FromBytes(e));
    }
    if (message.linkKey.length !== 0) {
      obj.linkKey = base64FromBytes(message.linkKey);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupHeadsExport>, I>>(base?: I): GroupHeadsExport {
    return GroupHeadsExport.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupHeadsExport>, I>>(object: I): GroupHeadsExport {
    const message = createBaseGroupHeadsExport();
    message.publicKey = object.publicKey ?? new Uint8Array(0);
    message.signPub = object.signPub ?? new Uint8Array(0);
    message.metadataHeadsCids = object.metadataHeadsCids?.map((e) => e) || [];
    message.messagesHeadsCids = object.messagesHeadsCids?.map((e) => e) || [];
    message.linkKey = object.linkKey ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupMetadata(): GroupMetadata {
  return { eventType: 0, payload: new Uint8Array(0), sig: new Uint8Array(0), protocolMetadata: undefined };
}

export const GroupMetadata = {
  encode(message: GroupMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.eventType !== 0) {
      writer.uint32(8).int32(message.eventType);
    }
    if (message.payload.length !== 0) {
      writer.uint32(18).bytes(message.payload);
    }
    if (message.sig.length !== 0) {
      writer.uint32(26).bytes(message.sig);
    }
    if (message.protocolMetadata !== undefined) {
      ProtocolMetadata.encode(message.protocolMetadata, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupMetadata {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.eventType = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.payload = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.sig = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.protocolMetadata = ProtocolMetadata.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupMetadata {
    return {
      eventType: isSet(object.eventType) ? eventTypeFromJSON(object.eventType) : 0,
      payload: isSet(object.payload) ? bytesFromBase64(object.payload) : new Uint8Array(0),
      sig: isSet(object.sig) ? bytesFromBase64(object.sig) : new Uint8Array(0),
      protocolMetadata: isSet(object.protocolMetadata) ? ProtocolMetadata.fromJSON(object.protocolMetadata) : undefined,
    };
  },

  toJSON(message: GroupMetadata): unknown {
    const obj: any = {};
    if (message.eventType !== 0) {
      obj.eventType = eventTypeToJSON(message.eventType);
    }
    if (message.payload.length !== 0) {
      obj.payload = base64FromBytes(message.payload);
    }
    if (message.sig.length !== 0) {
      obj.sig = base64FromBytes(message.sig);
    }
    if (message.protocolMetadata !== undefined) {
      obj.protocolMetadata = ProtocolMetadata.toJSON(message.protocolMetadata);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupMetadata>, I>>(base?: I): GroupMetadata {
    return GroupMetadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupMetadata>, I>>(object: I): GroupMetadata {
    const message = createBaseGroupMetadata();
    message.eventType = object.eventType ?? 0;
    message.payload = object.payload ?? new Uint8Array(0);
    message.sig = object.sig ?? new Uint8Array(0);
    message.protocolMetadata = (object.protocolMetadata !== undefined && object.protocolMetadata !== null)
      ? ProtocolMetadata.fromPartial(object.protocolMetadata)
      : undefined;
    return message;
  },
};

function createBaseGroupEnvelope(): GroupEnvelope {
  return { nonce: new Uint8Array(0), event: new Uint8Array(0) };
}

export const GroupEnvelope = {
  encode(message: GroupEnvelope, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nonce.length !== 0) {
      writer.uint32(10).bytes(message.nonce);
    }
    if (message.event.length !== 0) {
      writer.uint32(18).bytes(message.event);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupEnvelope {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupEnvelope();
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

          message.event = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupEnvelope {
    return {
      nonce: isSet(object.nonce) ? bytesFromBase64(object.nonce) : new Uint8Array(0),
      event: isSet(object.event) ? bytesFromBase64(object.event) : new Uint8Array(0),
    };
  },

  toJSON(message: GroupEnvelope): unknown {
    const obj: any = {};
    if (message.nonce.length !== 0) {
      obj.nonce = base64FromBytes(message.nonce);
    }
    if (message.event.length !== 0) {
      obj.event = base64FromBytes(message.event);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupEnvelope>, I>>(base?: I): GroupEnvelope {
    return GroupEnvelope.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupEnvelope>, I>>(object: I): GroupEnvelope {
    const message = createBaseGroupEnvelope();
    message.nonce = object.nonce ?? new Uint8Array(0);
    message.event = object.event ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMessageHeaders(): MessageHeaders {
  return { counter: 0, devicePk: new Uint8Array(0), sig: new Uint8Array(0), metadata: {} };
}

export const MessageHeaders = {
  encode(message: MessageHeaders, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.counter !== 0) {
      writer.uint32(8).uint64(message.counter);
    }
    if (message.devicePk.length !== 0) {
      writer.uint32(18).bytes(message.devicePk);
    }
    if (message.sig.length !== 0) {
      writer.uint32(26).bytes(message.sig);
    }
    Object.entries(message.metadata).forEach(([key, value]) => {
      MessageHeaders_MetadataEntry.encode({ key: key as any, value }, writer.uint32(34).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageHeaders {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageHeaders();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.counter = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.sig = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          const entry4 = MessageHeaders_MetadataEntry.decode(reader, reader.uint32());
          if (entry4.value !== undefined) {
            message.metadata[entry4.key] = entry4.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageHeaders {
    return {
      counter: isSet(object.counter) ? globalThis.Number(object.counter) : 0,
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      sig: isSet(object.sig) ? bytesFromBase64(object.sig) : new Uint8Array(0),
      metadata: isObject(object.metadata)
        ? Object.entries(object.metadata).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: MessageHeaders): unknown {
    const obj: any = {};
    if (message.counter !== 0) {
      obj.counter = Math.round(message.counter);
    }
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.sig.length !== 0) {
      obj.sig = base64FromBytes(message.sig);
    }
    if (message.metadata) {
      const entries = Object.entries(message.metadata);
      if (entries.length > 0) {
        obj.metadata = {};
        entries.forEach(([k, v]) => {
          obj.metadata[k] = v;
        });
      }
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageHeaders>, I>>(base?: I): MessageHeaders {
    return MessageHeaders.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageHeaders>, I>>(object: I): MessageHeaders {
    const message = createBaseMessageHeaders();
    message.counter = object.counter ?? 0;
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.sig = object.sig ?? new Uint8Array(0);
    message.metadata = Object.entries(object.metadata ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = globalThis.String(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseMessageHeaders_MetadataEntry(): MessageHeaders_MetadataEntry {
  return { key: "", value: "" };
}

export const MessageHeaders_MetadataEntry = {
  encode(message: MessageHeaders_MetadataEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageHeaders_MetadataEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageHeaders_MetadataEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageHeaders_MetadataEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: MessageHeaders_MetadataEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageHeaders_MetadataEntry>, I>>(base?: I): MessageHeaders_MetadataEntry {
    return MessageHeaders_MetadataEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageHeaders_MetadataEntry>, I>>(object: I): MessageHeaders_MetadataEntry {
    const message = createBaseMessageHeaders_MetadataEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseProtocolMetadata(): ProtocolMetadata {
  return {};
}

export const ProtocolMetadata = {
  encode(_: ProtocolMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProtocolMetadata {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProtocolMetadata();
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

  fromJSON(_: any): ProtocolMetadata {
    return {};
  },

  toJSON(_: ProtocolMetadata): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ProtocolMetadata>, I>>(base?: I): ProtocolMetadata {
    return ProtocolMetadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ProtocolMetadata>, I>>(_: I): ProtocolMetadata {
    const message = createBaseProtocolMetadata();
    return message;
  },
};

function createBaseEncryptedMessage(): EncryptedMessage {
  return { plaintext: new Uint8Array(0), protocolMetadata: undefined };
}

export const EncryptedMessage = {
  encode(message: EncryptedMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.plaintext.length !== 0) {
      writer.uint32(10).bytes(message.plaintext);
    }
    if (message.protocolMetadata !== undefined) {
      ProtocolMetadata.encode(message.protocolMetadata, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EncryptedMessage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncryptedMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.plaintext = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.protocolMetadata = ProtocolMetadata.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EncryptedMessage {
    return {
      plaintext: isSet(object.plaintext) ? bytesFromBase64(object.plaintext) : new Uint8Array(0),
      protocolMetadata: isSet(object.protocolMetadata) ? ProtocolMetadata.fromJSON(object.protocolMetadata) : undefined,
    };
  },

  toJSON(message: EncryptedMessage): unknown {
    const obj: any = {};
    if (message.plaintext.length !== 0) {
      obj.plaintext = base64FromBytes(message.plaintext);
    }
    if (message.protocolMetadata !== undefined) {
      obj.protocolMetadata = ProtocolMetadata.toJSON(message.protocolMetadata);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EncryptedMessage>, I>>(base?: I): EncryptedMessage {
    return EncryptedMessage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EncryptedMessage>, I>>(object: I): EncryptedMessage {
    const message = createBaseEncryptedMessage();
    message.plaintext = object.plaintext ?? new Uint8Array(0);
    message.protocolMetadata = (object.protocolMetadata !== undefined && object.protocolMetadata !== null)
      ? ProtocolMetadata.fromPartial(object.protocolMetadata)
      : undefined;
    return message;
  },
};

function createBaseMessageEnvelope(): MessageEnvelope {
  return { messageHeaders: new Uint8Array(0), message: new Uint8Array(0), nonce: new Uint8Array(0) };
}

export const MessageEnvelope = {
  encode(message: MessageEnvelope, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.messageHeaders.length !== 0) {
      writer.uint32(10).bytes(message.messageHeaders);
    }
    if (message.message.length !== 0) {
      writer.uint32(18).bytes(message.message);
    }
    if (message.nonce.length !== 0) {
      writer.uint32(26).bytes(message.nonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageEnvelope {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageEnvelope();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.messageHeaders = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.message = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.nonce = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageEnvelope {
    return {
      messageHeaders: isSet(object.messageHeaders) ? bytesFromBase64(object.messageHeaders) : new Uint8Array(0),
      message: isSet(object.message) ? bytesFromBase64(object.message) : new Uint8Array(0),
      nonce: isSet(object.nonce) ? bytesFromBase64(object.nonce) : new Uint8Array(0),
    };
  },

  toJSON(message: MessageEnvelope): unknown {
    const obj: any = {};
    if (message.messageHeaders.length !== 0) {
      obj.messageHeaders = base64FromBytes(message.messageHeaders);
    }
    if (message.message.length !== 0) {
      obj.message = base64FromBytes(message.message);
    }
    if (message.nonce.length !== 0) {
      obj.nonce = base64FromBytes(message.nonce);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageEnvelope>, I>>(base?: I): MessageEnvelope {
    return MessageEnvelope.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageEnvelope>, I>>(object: I): MessageEnvelope {
    const message = createBaseMessageEnvelope();
    message.messageHeaders = object.messageHeaders ?? new Uint8Array(0);
    message.message = object.message ?? new Uint8Array(0);
    message.nonce = object.nonce ?? new Uint8Array(0);
    return message;
  },
};

function createBaseEventContext(): EventContext {
  return { id: new Uint8Array(0), parentIds: [], groupPk: new Uint8Array(0) };
}

export const EventContext = {
  encode(message: EventContext, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id.length !== 0) {
      writer.uint32(10).bytes(message.id);
    }
    for (const v of message.parentIds) {
      writer.uint32(18).bytes(v!);
    }
    if (message.groupPk.length !== 0) {
      writer.uint32(26).bytes(message.groupPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventContext {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventContext();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.parentIds.push(reader.bytes());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EventContext {
    return {
      id: isSet(object.id) ? bytesFromBase64(object.id) : new Uint8Array(0),
      parentIds: globalThis.Array.isArray(object?.parentIds)
        ? object.parentIds.map((e: any) => bytesFromBase64(e))
        : [],
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
    };
  },

  toJSON(message: EventContext): unknown {
    const obj: any = {};
    if (message.id.length !== 0) {
      obj.id = base64FromBytes(message.id);
    }
    if (message.parentIds?.length) {
      obj.parentIds = message.parentIds.map((e) => base64FromBytes(e));
    }
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EventContext>, I>>(base?: I): EventContext {
    return EventContext.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EventContext>, I>>(object: I): EventContext {
    const message = createBaseEventContext();
    message.id = object.id ?? new Uint8Array(0);
    message.parentIds = object.parentIds?.map((e) => e) || [];
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupMetadataPayloadSent(): GroupMetadataPayloadSent {
  return { devicePk: new Uint8Array(0), message: new Uint8Array(0) };
}

export const GroupMetadataPayloadSent = {
  encode(message: GroupMetadataPayloadSent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.message.length !== 0) {
      writer.uint32(18).bytes(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupMetadataPayloadSent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupMetadataPayloadSent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.message = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupMetadataPayloadSent {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      message: isSet(object.message) ? bytesFromBase64(object.message) : new Uint8Array(0),
    };
  },

  toJSON(message: GroupMetadataPayloadSent): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.message.length !== 0) {
      obj.message = base64FromBytes(message.message);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupMetadataPayloadSent>, I>>(base?: I): GroupMetadataPayloadSent {
    return GroupMetadataPayloadSent.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupMetadataPayloadSent>, I>>(object: I): GroupMetadataPayloadSent {
    const message = createBaseGroupMetadataPayloadSent();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.message = object.message ?? new Uint8Array(0);
    return message;
  },
};

function createBaseContactAliasKeyAdded(): ContactAliasKeyAdded {
  return { devicePk: new Uint8Array(0), aliasPk: new Uint8Array(0) };
}

export const ContactAliasKeyAdded = {
  encode(message: ContactAliasKeyAdded, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.aliasPk.length !== 0) {
      writer.uint32(18).bytes(message.aliasPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactAliasKeyAdded {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactAliasKeyAdded();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.aliasPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContactAliasKeyAdded {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      aliasPk: isSet(object.aliasPk) ? bytesFromBase64(object.aliasPk) : new Uint8Array(0),
    };
  },

  toJSON(message: ContactAliasKeyAdded): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.aliasPk.length !== 0) {
      obj.aliasPk = base64FromBytes(message.aliasPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactAliasKeyAdded>, I>>(base?: I): ContactAliasKeyAdded {
    return ContactAliasKeyAdded.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactAliasKeyAdded>, I>>(object: I): ContactAliasKeyAdded {
    const message = createBaseContactAliasKeyAdded();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.aliasPk = object.aliasPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupMemberDeviceAdded(): GroupMemberDeviceAdded {
  return { memberPk: new Uint8Array(0), devicePk: new Uint8Array(0), memberSig: new Uint8Array(0) };
}

export const GroupMemberDeviceAdded = {
  encode(message: GroupMemberDeviceAdded, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.memberPk.length !== 0) {
      writer.uint32(10).bytes(message.memberPk);
    }
    if (message.devicePk.length !== 0) {
      writer.uint32(18).bytes(message.devicePk);
    }
    if (message.memberSig.length !== 0) {
      writer.uint32(26).bytes(message.memberSig);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupMemberDeviceAdded {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupMemberDeviceAdded();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.memberPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.memberSig = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupMemberDeviceAdded {
    return {
      memberPk: isSet(object.memberPk) ? bytesFromBase64(object.memberPk) : new Uint8Array(0),
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      memberSig: isSet(object.memberSig) ? bytesFromBase64(object.memberSig) : new Uint8Array(0),
    };
  },

  toJSON(message: GroupMemberDeviceAdded): unknown {
    const obj: any = {};
    if (message.memberPk.length !== 0) {
      obj.memberPk = base64FromBytes(message.memberPk);
    }
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.memberSig.length !== 0) {
      obj.memberSig = base64FromBytes(message.memberSig);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupMemberDeviceAdded>, I>>(base?: I): GroupMemberDeviceAdded {
    return GroupMemberDeviceAdded.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupMemberDeviceAdded>, I>>(object: I): GroupMemberDeviceAdded {
    const message = createBaseGroupMemberDeviceAdded();
    message.memberPk = object.memberPk ?? new Uint8Array(0);
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.memberSig = object.memberSig ?? new Uint8Array(0);
    return message;
  },
};

function createBaseDeviceChainKey(): DeviceChainKey {
  return { chainKey: new Uint8Array(0), counter: 0 };
}

export const DeviceChainKey = {
  encode(message: DeviceChainKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.chainKey.length !== 0) {
      writer.uint32(10).bytes(message.chainKey);
    }
    if (message.counter !== 0) {
      writer.uint32(16).uint64(message.counter);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeviceChainKey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeviceChainKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.chainKey = reader.bytes();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.counter = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeviceChainKey {
    return {
      chainKey: isSet(object.chainKey) ? bytesFromBase64(object.chainKey) : new Uint8Array(0),
      counter: isSet(object.counter) ? globalThis.Number(object.counter) : 0,
    };
  },

  toJSON(message: DeviceChainKey): unknown {
    const obj: any = {};
    if (message.chainKey.length !== 0) {
      obj.chainKey = base64FromBytes(message.chainKey);
    }
    if (message.counter !== 0) {
      obj.counter = Math.round(message.counter);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeviceChainKey>, I>>(base?: I): DeviceChainKey {
    return DeviceChainKey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeviceChainKey>, I>>(object: I): DeviceChainKey {
    const message = createBaseDeviceChainKey();
    message.chainKey = object.chainKey ?? new Uint8Array(0);
    message.counter = object.counter ?? 0;
    return message;
  },
};

function createBaseGroupDeviceChainKeyAdded(): GroupDeviceChainKeyAdded {
  return { devicePk: new Uint8Array(0), destMemberPk: new Uint8Array(0), payload: new Uint8Array(0) };
}

export const GroupDeviceChainKeyAdded = {
  encode(message: GroupDeviceChainKeyAdded, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.destMemberPk.length !== 0) {
      writer.uint32(18).bytes(message.destMemberPk);
    }
    if (message.payload.length !== 0) {
      writer.uint32(26).bytes(message.payload);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupDeviceChainKeyAdded {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupDeviceChainKeyAdded();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.destMemberPk = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.payload = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupDeviceChainKeyAdded {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      destMemberPk: isSet(object.destMemberPk) ? bytesFromBase64(object.destMemberPk) : new Uint8Array(0),
      payload: isSet(object.payload) ? bytesFromBase64(object.payload) : new Uint8Array(0),
    };
  },

  toJSON(message: GroupDeviceChainKeyAdded): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.destMemberPk.length !== 0) {
      obj.destMemberPk = base64FromBytes(message.destMemberPk);
    }
    if (message.payload.length !== 0) {
      obj.payload = base64FromBytes(message.payload);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupDeviceChainKeyAdded>, I>>(base?: I): GroupDeviceChainKeyAdded {
    return GroupDeviceChainKeyAdded.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupDeviceChainKeyAdded>, I>>(object: I): GroupDeviceChainKeyAdded {
    const message = createBaseGroupDeviceChainKeyAdded();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.destMemberPk = object.destMemberPk ?? new Uint8Array(0);
    message.payload = object.payload ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMultiMemberGroupAliasResolverAdded(): MultiMemberGroupAliasResolverAdded {
  return { devicePk: new Uint8Array(0), aliasResolver: new Uint8Array(0), aliasProof: new Uint8Array(0) };
}

export const MultiMemberGroupAliasResolverAdded = {
  encode(message: MultiMemberGroupAliasResolverAdded, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.aliasResolver.length !== 0) {
      writer.uint32(18).bytes(message.aliasResolver);
    }
    if (message.aliasProof.length !== 0) {
      writer.uint32(26).bytes(message.aliasProof);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupAliasResolverAdded {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupAliasResolverAdded();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.aliasResolver = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.aliasProof = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultiMemberGroupAliasResolverAdded {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      aliasResolver: isSet(object.aliasResolver) ? bytesFromBase64(object.aliasResolver) : new Uint8Array(0),
      aliasProof: isSet(object.aliasProof) ? bytesFromBase64(object.aliasProof) : new Uint8Array(0),
    };
  },

  toJSON(message: MultiMemberGroupAliasResolverAdded): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.aliasResolver.length !== 0) {
      obj.aliasResolver = base64FromBytes(message.aliasResolver);
    }
    if (message.aliasProof.length !== 0) {
      obj.aliasProof = base64FromBytes(message.aliasProof);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupAliasResolverAdded>, I>>(
    base?: I,
  ): MultiMemberGroupAliasResolverAdded {
    return MultiMemberGroupAliasResolverAdded.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupAliasResolverAdded>, I>>(
    object: I,
  ): MultiMemberGroupAliasResolverAdded {
    const message = createBaseMultiMemberGroupAliasResolverAdded();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.aliasResolver = object.aliasResolver ?? new Uint8Array(0);
    message.aliasProof = object.aliasProof ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMultiMemberGroupAdminRoleGranted(): MultiMemberGroupAdminRoleGranted {
  return { devicePk: new Uint8Array(0), granteeMemberPk: new Uint8Array(0) };
}

export const MultiMemberGroupAdminRoleGranted = {
  encode(message: MultiMemberGroupAdminRoleGranted, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.granteeMemberPk.length !== 0) {
      writer.uint32(18).bytes(message.granteeMemberPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupAdminRoleGranted {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupAdminRoleGranted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.granteeMemberPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultiMemberGroupAdminRoleGranted {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      granteeMemberPk: isSet(object.granteeMemberPk) ? bytesFromBase64(object.granteeMemberPk) : new Uint8Array(0),
    };
  },

  toJSON(message: MultiMemberGroupAdminRoleGranted): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.granteeMemberPk.length !== 0) {
      obj.granteeMemberPk = base64FromBytes(message.granteeMemberPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupAdminRoleGranted>, I>>(
    base?: I,
  ): MultiMemberGroupAdminRoleGranted {
    return MultiMemberGroupAdminRoleGranted.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupAdminRoleGranted>, I>>(
    object: I,
  ): MultiMemberGroupAdminRoleGranted {
    const message = createBaseMultiMemberGroupAdminRoleGranted();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.granteeMemberPk = object.granteeMemberPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMultiMemberGroupInitialMemberAnnounced(): MultiMemberGroupInitialMemberAnnounced {
  return { memberPk: new Uint8Array(0) };
}

export const MultiMemberGroupInitialMemberAnnounced = {
  encode(message: MultiMemberGroupInitialMemberAnnounced, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.memberPk.length !== 0) {
      writer.uint32(10).bytes(message.memberPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupInitialMemberAnnounced {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupInitialMemberAnnounced();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.memberPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultiMemberGroupInitialMemberAnnounced {
    return { memberPk: isSet(object.memberPk) ? bytesFromBase64(object.memberPk) : new Uint8Array(0) };
  },

  toJSON(message: MultiMemberGroupInitialMemberAnnounced): unknown {
    const obj: any = {};
    if (message.memberPk.length !== 0) {
      obj.memberPk = base64FromBytes(message.memberPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupInitialMemberAnnounced>, I>>(
    base?: I,
  ): MultiMemberGroupInitialMemberAnnounced {
    return MultiMemberGroupInitialMemberAnnounced.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupInitialMemberAnnounced>, I>>(
    object: I,
  ): MultiMemberGroupInitialMemberAnnounced {
    const message = createBaseMultiMemberGroupInitialMemberAnnounced();
    message.memberPk = object.memberPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupAddAdditionalRendezvousSeed(): GroupAddAdditionalRendezvousSeed {
  return { devicePk: new Uint8Array(0), seed: new Uint8Array(0) };
}

export const GroupAddAdditionalRendezvousSeed = {
  encode(message: GroupAddAdditionalRendezvousSeed, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.seed.length !== 0) {
      writer.uint32(18).bytes(message.seed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupAddAdditionalRendezvousSeed {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupAddAdditionalRendezvousSeed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.seed = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupAddAdditionalRendezvousSeed {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      seed: isSet(object.seed) ? bytesFromBase64(object.seed) : new Uint8Array(0),
    };
  },

  toJSON(message: GroupAddAdditionalRendezvousSeed): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.seed.length !== 0) {
      obj.seed = base64FromBytes(message.seed);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupAddAdditionalRendezvousSeed>, I>>(
    base?: I,
  ): GroupAddAdditionalRendezvousSeed {
    return GroupAddAdditionalRendezvousSeed.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupAddAdditionalRendezvousSeed>, I>>(
    object: I,
  ): GroupAddAdditionalRendezvousSeed {
    const message = createBaseGroupAddAdditionalRendezvousSeed();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.seed = object.seed ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupRemoveAdditionalRendezvousSeed(): GroupRemoveAdditionalRendezvousSeed {
  return { devicePk: new Uint8Array(0), seed: new Uint8Array(0) };
}

export const GroupRemoveAdditionalRendezvousSeed = {
  encode(message: GroupRemoveAdditionalRendezvousSeed, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.seed.length !== 0) {
      writer.uint32(18).bytes(message.seed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupRemoveAdditionalRendezvousSeed {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupRemoveAdditionalRendezvousSeed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.seed = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupRemoveAdditionalRendezvousSeed {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      seed: isSet(object.seed) ? bytesFromBase64(object.seed) : new Uint8Array(0),
    };
  },

  toJSON(message: GroupRemoveAdditionalRendezvousSeed): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.seed.length !== 0) {
      obj.seed = base64FromBytes(message.seed);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupRemoveAdditionalRendezvousSeed>, I>>(
    base?: I,
  ): GroupRemoveAdditionalRendezvousSeed {
    return GroupRemoveAdditionalRendezvousSeed.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupRemoveAdditionalRendezvousSeed>, I>>(
    object: I,
  ): GroupRemoveAdditionalRendezvousSeed {
    const message = createBaseGroupRemoveAdditionalRendezvousSeed();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.seed = object.seed ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAccountGroupJoined(): AccountGroupJoined {
  return { devicePk: new Uint8Array(0), group: undefined };
}

export const AccountGroupJoined = {
  encode(message: AccountGroupJoined, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.group !== undefined) {
      Group.encode(message.group, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountGroupJoined {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountGroupJoined();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.group = Group.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountGroupJoined {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      group: isSet(object.group) ? Group.fromJSON(object.group) : undefined,
    };
  },

  toJSON(message: AccountGroupJoined): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.group !== undefined) {
      obj.group = Group.toJSON(message.group);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountGroupJoined>, I>>(base?: I): AccountGroupJoined {
    return AccountGroupJoined.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountGroupJoined>, I>>(object: I): AccountGroupJoined {
    const message = createBaseAccountGroupJoined();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.group = (object.group !== undefined && object.group !== null) ? Group.fromPartial(object.group) : undefined;
    return message;
  },
};

function createBaseAccountGroupLeft(): AccountGroupLeft {
  return { devicePk: new Uint8Array(0), groupPk: new Uint8Array(0) };
}

export const AccountGroupLeft = {
  encode(message: AccountGroupLeft, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.groupPk.length !== 0) {
      writer.uint32(18).bytes(message.groupPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountGroupLeft {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountGroupLeft();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountGroupLeft {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
    };
  },

  toJSON(message: AccountGroupLeft): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountGroupLeft>, I>>(base?: I): AccountGroupLeft {
    return AccountGroupLeft.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountGroupLeft>, I>>(object: I): AccountGroupLeft {
    const message = createBaseAccountGroupLeft();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAccountContactRequestDisabled(): AccountContactRequestDisabled {
  return { devicePk: new Uint8Array(0) };
}

export const AccountContactRequestDisabled = {
  encode(message: AccountContactRequestDisabled, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountContactRequestDisabled {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountContactRequestDisabled();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountContactRequestDisabled {
    return { devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0) };
  },

  toJSON(message: AccountContactRequestDisabled): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountContactRequestDisabled>, I>>(base?: I): AccountContactRequestDisabled {
    return AccountContactRequestDisabled.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountContactRequestDisabled>, I>>(
    object: I,
  ): AccountContactRequestDisabled {
    const message = createBaseAccountContactRequestDisabled();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAccountContactRequestEnabled(): AccountContactRequestEnabled {
  return { devicePk: new Uint8Array(0) };
}

export const AccountContactRequestEnabled = {
  encode(message: AccountContactRequestEnabled, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountContactRequestEnabled {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountContactRequestEnabled();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountContactRequestEnabled {
    return { devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0) };
  },

  toJSON(message: AccountContactRequestEnabled): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountContactRequestEnabled>, I>>(base?: I): AccountContactRequestEnabled {
    return AccountContactRequestEnabled.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountContactRequestEnabled>, I>>(object: I): AccountContactRequestEnabled {
    const message = createBaseAccountContactRequestEnabled();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAccountContactRequestReferenceReset(): AccountContactRequestReferenceReset {
  return { devicePk: new Uint8Array(0), publicRendezvousSeed: new Uint8Array(0) };
}

export const AccountContactRequestReferenceReset = {
  encode(message: AccountContactRequestReferenceReset, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.publicRendezvousSeed.length !== 0) {
      writer.uint32(18).bytes(message.publicRendezvousSeed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountContactRequestReferenceReset {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountContactRequestReferenceReset();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.publicRendezvousSeed = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountContactRequestReferenceReset {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      publicRendezvousSeed: isSet(object.publicRendezvousSeed)
        ? bytesFromBase64(object.publicRendezvousSeed)
        : new Uint8Array(0),
    };
  },

  toJSON(message: AccountContactRequestReferenceReset): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.publicRendezvousSeed.length !== 0) {
      obj.publicRendezvousSeed = base64FromBytes(message.publicRendezvousSeed);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountContactRequestReferenceReset>, I>>(
    base?: I,
  ): AccountContactRequestReferenceReset {
    return AccountContactRequestReferenceReset.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountContactRequestReferenceReset>, I>>(
    object: I,
  ): AccountContactRequestReferenceReset {
    const message = createBaseAccountContactRequestReferenceReset();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.publicRendezvousSeed = object.publicRendezvousSeed ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAccountContactRequestOutgoingEnqueued(): AccountContactRequestOutgoingEnqueued {
  return {
    devicePk: new Uint8Array(0),
    groupPk: new Uint8Array(0),
    contact: undefined,
    ownMetadata: new Uint8Array(0),
  };
}

export const AccountContactRequestOutgoingEnqueued = {
  encode(message: AccountContactRequestOutgoingEnqueued, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.groupPk.length !== 0) {
      writer.uint32(18).bytes(message.groupPk);
    }
    if (message.contact !== undefined) {
      ShareableContact.encode(message.contact, writer.uint32(26).fork()).ldelim();
    }
    if (message.ownMetadata.length !== 0) {
      writer.uint32(34).bytes(message.ownMetadata);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountContactRequestOutgoingEnqueued {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountContactRequestOutgoingEnqueued();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.contact = ShareableContact.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.ownMetadata = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountContactRequestOutgoingEnqueued {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
      contact: isSet(object.contact) ? ShareableContact.fromJSON(object.contact) : undefined,
      ownMetadata: isSet(object.ownMetadata) ? bytesFromBase64(object.ownMetadata) : new Uint8Array(0),
    };
  },

  toJSON(message: AccountContactRequestOutgoingEnqueued): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    if (message.contact !== undefined) {
      obj.contact = ShareableContact.toJSON(message.contact);
    }
    if (message.ownMetadata.length !== 0) {
      obj.ownMetadata = base64FromBytes(message.ownMetadata);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountContactRequestOutgoingEnqueued>, I>>(
    base?: I,
  ): AccountContactRequestOutgoingEnqueued {
    return AccountContactRequestOutgoingEnqueued.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountContactRequestOutgoingEnqueued>, I>>(
    object: I,
  ): AccountContactRequestOutgoingEnqueued {
    const message = createBaseAccountContactRequestOutgoingEnqueued();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    message.contact = (object.contact !== undefined && object.contact !== null)
      ? ShareableContact.fromPartial(object.contact)
      : undefined;
    message.ownMetadata = object.ownMetadata ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAccountContactRequestOutgoingSent(): AccountContactRequestOutgoingSent {
  return { devicePk: new Uint8Array(0), contactPk: new Uint8Array(0) };
}

export const AccountContactRequestOutgoingSent = {
  encode(message: AccountContactRequestOutgoingSent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.contactPk.length !== 0) {
      writer.uint32(18).bytes(message.contactPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountContactRequestOutgoingSent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountContactRequestOutgoingSent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountContactRequestOutgoingSent {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0),
    };
  },

  toJSON(message: AccountContactRequestOutgoingSent): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountContactRequestOutgoingSent>, I>>(
    base?: I,
  ): AccountContactRequestOutgoingSent {
    return AccountContactRequestOutgoingSent.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountContactRequestOutgoingSent>, I>>(
    object: I,
  ): AccountContactRequestOutgoingSent {
    const message = createBaseAccountContactRequestOutgoingSent();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAccountContactRequestIncomingReceived(): AccountContactRequestIncomingReceived {
  return {
    devicePk: new Uint8Array(0),
    contactPk: new Uint8Array(0),
    contactRendezvousSeed: new Uint8Array(0),
    contactMetadata: new Uint8Array(0),
  };
}

export const AccountContactRequestIncomingReceived = {
  encode(message: AccountContactRequestIncomingReceived, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.contactPk.length !== 0) {
      writer.uint32(18).bytes(message.contactPk);
    }
    if (message.contactRendezvousSeed.length !== 0) {
      writer.uint32(26).bytes(message.contactRendezvousSeed);
    }
    if (message.contactMetadata.length !== 0) {
      writer.uint32(34).bytes(message.contactMetadata);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountContactRequestIncomingReceived {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountContactRequestIncomingReceived();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.contactRendezvousSeed = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.contactMetadata = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountContactRequestIncomingReceived {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0),
      contactRendezvousSeed: isSet(object.contactRendezvousSeed)
        ? bytesFromBase64(object.contactRendezvousSeed)
        : new Uint8Array(0),
      contactMetadata: isSet(object.contactMetadata) ? bytesFromBase64(object.contactMetadata) : new Uint8Array(0),
    };
  },

  toJSON(message: AccountContactRequestIncomingReceived): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    if (message.contactRendezvousSeed.length !== 0) {
      obj.contactRendezvousSeed = base64FromBytes(message.contactRendezvousSeed);
    }
    if (message.contactMetadata.length !== 0) {
      obj.contactMetadata = base64FromBytes(message.contactMetadata);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountContactRequestIncomingReceived>, I>>(
    base?: I,
  ): AccountContactRequestIncomingReceived {
    return AccountContactRequestIncomingReceived.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountContactRequestIncomingReceived>, I>>(
    object: I,
  ): AccountContactRequestIncomingReceived {
    const message = createBaseAccountContactRequestIncomingReceived();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    message.contactRendezvousSeed = object.contactRendezvousSeed ?? new Uint8Array(0);
    message.contactMetadata = object.contactMetadata ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAccountContactRequestIncomingDiscarded(): AccountContactRequestIncomingDiscarded {
  return { devicePk: new Uint8Array(0), contactPk: new Uint8Array(0) };
}

export const AccountContactRequestIncomingDiscarded = {
  encode(message: AccountContactRequestIncomingDiscarded, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.contactPk.length !== 0) {
      writer.uint32(18).bytes(message.contactPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountContactRequestIncomingDiscarded {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountContactRequestIncomingDiscarded();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountContactRequestIncomingDiscarded {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0),
    };
  },

  toJSON(message: AccountContactRequestIncomingDiscarded): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountContactRequestIncomingDiscarded>, I>>(
    base?: I,
  ): AccountContactRequestIncomingDiscarded {
    return AccountContactRequestIncomingDiscarded.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountContactRequestIncomingDiscarded>, I>>(
    object: I,
  ): AccountContactRequestIncomingDiscarded {
    const message = createBaseAccountContactRequestIncomingDiscarded();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAccountContactRequestIncomingAccepted(): AccountContactRequestIncomingAccepted {
  return { devicePk: new Uint8Array(0), contactPk: new Uint8Array(0), groupPk: new Uint8Array(0) };
}

export const AccountContactRequestIncomingAccepted = {
  encode(message: AccountContactRequestIncomingAccepted, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.contactPk.length !== 0) {
      writer.uint32(18).bytes(message.contactPk);
    }
    if (message.groupPk.length !== 0) {
      writer.uint32(26).bytes(message.groupPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountContactRequestIncomingAccepted {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountContactRequestIncomingAccepted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountContactRequestIncomingAccepted {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0),
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
    };
  },

  toJSON(message: AccountContactRequestIncomingAccepted): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountContactRequestIncomingAccepted>, I>>(
    base?: I,
  ): AccountContactRequestIncomingAccepted {
    return AccountContactRequestIncomingAccepted.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountContactRequestIncomingAccepted>, I>>(
    object: I,
  ): AccountContactRequestIncomingAccepted {
    const message = createBaseAccountContactRequestIncomingAccepted();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAccountContactBlocked(): AccountContactBlocked {
  return { devicePk: new Uint8Array(0), contactPk: new Uint8Array(0) };
}

export const AccountContactBlocked = {
  encode(message: AccountContactBlocked, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.contactPk.length !== 0) {
      writer.uint32(18).bytes(message.contactPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountContactBlocked {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountContactBlocked();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountContactBlocked {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0),
    };
  },

  toJSON(message: AccountContactBlocked): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountContactBlocked>, I>>(base?: I): AccountContactBlocked {
    return AccountContactBlocked.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountContactBlocked>, I>>(object: I): AccountContactBlocked {
    const message = createBaseAccountContactBlocked();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAccountContactUnblocked(): AccountContactUnblocked {
  return { devicePk: new Uint8Array(0), contactPk: new Uint8Array(0) };
}

export const AccountContactUnblocked = {
  encode(message: AccountContactUnblocked, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.contactPk.length !== 0) {
      writer.uint32(18).bytes(message.contactPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountContactUnblocked {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountContactUnblocked();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountContactUnblocked {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0),
    };
  },

  toJSON(message: AccountContactUnblocked): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountContactUnblocked>, I>>(base?: I): AccountContactUnblocked {
    return AccountContactUnblocked.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountContactUnblocked>, I>>(object: I): AccountContactUnblocked {
    const message = createBaseAccountContactUnblocked();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupReplicating(): GroupReplicating {
  return { devicePk: new Uint8Array(0), authenticationUrl: "", replicationServer: "" };
}

export const GroupReplicating = {
  encode(message: GroupReplicating, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.authenticationUrl !== "") {
      writer.uint32(18).string(message.authenticationUrl);
    }
    if (message.replicationServer !== "") {
      writer.uint32(26).string(message.replicationServer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupReplicating {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupReplicating();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.authenticationUrl = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.replicationServer = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupReplicating {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      authenticationUrl: isSet(object.authenticationUrl) ? globalThis.String(object.authenticationUrl) : "",
      replicationServer: isSet(object.replicationServer) ? globalThis.String(object.replicationServer) : "",
    };
  },

  toJSON(message: GroupReplicating): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.authenticationUrl !== "") {
      obj.authenticationUrl = message.authenticationUrl;
    }
    if (message.replicationServer !== "") {
      obj.replicationServer = message.replicationServer;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupReplicating>, I>>(base?: I): GroupReplicating {
    return GroupReplicating.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupReplicating>, I>>(object: I): GroupReplicating {
    const message = createBaseGroupReplicating();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.authenticationUrl = object.authenticationUrl ?? "";
    message.replicationServer = object.replicationServer ?? "";
    return message;
  },
};

function createBaseServiceExportData(): ServiceExportData {
  return {};
}

export const ServiceExportData = {
  encode(_: ServiceExportData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServiceExportData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServiceExportData();
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

  fromJSON(_: any): ServiceExportData {
    return {};
  },

  toJSON(_: ServiceExportData): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ServiceExportData>, I>>(base?: I): ServiceExportData {
    return ServiceExportData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServiceExportData>, I>>(_: I): ServiceExportData {
    const message = createBaseServiceExportData();
    return message;
  },
};

function createBaseServiceExportData_Request(): ServiceExportData_Request {
  return {};
}

export const ServiceExportData_Request = {
  encode(_: ServiceExportData_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServiceExportData_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServiceExportData_Request();
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

  fromJSON(_: any): ServiceExportData_Request {
    return {};
  },

  toJSON(_: ServiceExportData_Request): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ServiceExportData_Request>, I>>(base?: I): ServiceExportData_Request {
    return ServiceExportData_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServiceExportData_Request>, I>>(_: I): ServiceExportData_Request {
    const message = createBaseServiceExportData_Request();
    return message;
  },
};

function createBaseServiceExportData_Reply(): ServiceExportData_Reply {
  return { exportedData: new Uint8Array(0) };
}

export const ServiceExportData_Reply = {
  encode(message: ServiceExportData_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.exportedData.length !== 0) {
      writer.uint32(10).bytes(message.exportedData);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServiceExportData_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServiceExportData_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.exportedData = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServiceExportData_Reply {
    return { exportedData: isSet(object.exportedData) ? bytesFromBase64(object.exportedData) : new Uint8Array(0) };
  },

  toJSON(message: ServiceExportData_Reply): unknown {
    const obj: any = {};
    if (message.exportedData.length !== 0) {
      obj.exportedData = base64FromBytes(message.exportedData);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ServiceExportData_Reply>, I>>(base?: I): ServiceExportData_Reply {
    return ServiceExportData_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServiceExportData_Reply>, I>>(object: I): ServiceExportData_Reply {
    const message = createBaseServiceExportData_Reply();
    message.exportedData = object.exportedData ?? new Uint8Array(0);
    return message;
  },
};

function createBaseServiceGetConfiguration(): ServiceGetConfiguration {
  return {};
}

export const ServiceGetConfiguration = {
  encode(_: ServiceGetConfiguration, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServiceGetConfiguration {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServiceGetConfiguration();
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

  fromJSON(_: any): ServiceGetConfiguration {
    return {};
  },

  toJSON(_: ServiceGetConfiguration): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ServiceGetConfiguration>, I>>(base?: I): ServiceGetConfiguration {
    return ServiceGetConfiguration.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServiceGetConfiguration>, I>>(_: I): ServiceGetConfiguration {
    const message = createBaseServiceGetConfiguration();
    return message;
  },
};

function createBaseServiceGetConfiguration_Request(): ServiceGetConfiguration_Request {
  return {};
}

export const ServiceGetConfiguration_Request = {
  encode(_: ServiceGetConfiguration_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServiceGetConfiguration_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServiceGetConfiguration_Request();
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

  fromJSON(_: any): ServiceGetConfiguration_Request {
    return {};
  },

  toJSON(_: ServiceGetConfiguration_Request): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ServiceGetConfiguration_Request>, I>>(base?: I): ServiceGetConfiguration_Request {
    return ServiceGetConfiguration_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServiceGetConfiguration_Request>, I>>(_: I): ServiceGetConfiguration_Request {
    const message = createBaseServiceGetConfiguration_Request();
    return message;
  },
};

function createBaseServiceGetConfiguration_Reply(): ServiceGetConfiguration_Reply {
  return {
    accountPk: new Uint8Array(0),
    devicePk: new Uint8Array(0),
    accountGroupPk: new Uint8Array(0),
    peerId: "",
    listeners: [],
    bleEnabled: 0,
    wifiP2pEnabled: 0,
    mdnsEnabled: 0,
    relayEnabled: 0,
  };
}

export const ServiceGetConfiguration_Reply = {
  encode(message: ServiceGetConfiguration_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accountPk.length !== 0) {
      writer.uint32(10).bytes(message.accountPk);
    }
    if (message.devicePk.length !== 0) {
      writer.uint32(18).bytes(message.devicePk);
    }
    if (message.accountGroupPk.length !== 0) {
      writer.uint32(26).bytes(message.accountGroupPk);
    }
    if (message.peerId !== "") {
      writer.uint32(34).string(message.peerId);
    }
    for (const v of message.listeners) {
      writer.uint32(42).string(v!);
    }
    if (message.bleEnabled !== 0) {
      writer.uint32(48).int32(message.bleEnabled);
    }
    if (message.wifiP2pEnabled !== 0) {
      writer.uint32(56).int32(message.wifiP2pEnabled);
    }
    if (message.mdnsEnabled !== 0) {
      writer.uint32(64).int32(message.mdnsEnabled);
    }
    if (message.relayEnabled !== 0) {
      writer.uint32(72).int32(message.relayEnabled);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServiceGetConfiguration_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServiceGetConfiguration_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.accountPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.accountGroupPk = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.peerId = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.listeners.push(reader.string());
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.bleEnabled = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.wifiP2pEnabled = reader.int32() as any;
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.mdnsEnabled = reader.int32() as any;
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.relayEnabled = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServiceGetConfiguration_Reply {
    return {
      accountPk: isSet(object.accountPk) ? bytesFromBase64(object.accountPk) : new Uint8Array(0),
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      accountGroupPk: isSet(object.accountGroupPk) ? bytesFromBase64(object.accountGroupPk) : new Uint8Array(0),
      peerId: isSet(object.peerId) ? globalThis.String(object.peerId) : "",
      listeners: globalThis.Array.isArray(object?.listeners)
        ? object.listeners.map((e: any) => globalThis.String(e))
        : [],
      bleEnabled: isSet(object.bleEnabled) ? serviceGetConfiguration_SettingStateFromJSON(object.bleEnabled) : 0,
      wifiP2pEnabled: isSet(object.wifiP2pEnabled)
        ? serviceGetConfiguration_SettingStateFromJSON(object.wifiP2pEnabled)
        : 0,
      mdnsEnabled: isSet(object.mdnsEnabled) ? serviceGetConfiguration_SettingStateFromJSON(object.mdnsEnabled) : 0,
      relayEnabled: isSet(object.relayEnabled) ? serviceGetConfiguration_SettingStateFromJSON(object.relayEnabled) : 0,
    };
  },

  toJSON(message: ServiceGetConfiguration_Reply): unknown {
    const obj: any = {};
    if (message.accountPk.length !== 0) {
      obj.accountPk = base64FromBytes(message.accountPk);
    }
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.accountGroupPk.length !== 0) {
      obj.accountGroupPk = base64FromBytes(message.accountGroupPk);
    }
    if (message.peerId !== "") {
      obj.peerId = message.peerId;
    }
    if (message.listeners?.length) {
      obj.listeners = message.listeners;
    }
    if (message.bleEnabled !== 0) {
      obj.bleEnabled = serviceGetConfiguration_SettingStateToJSON(message.bleEnabled);
    }
    if (message.wifiP2pEnabled !== 0) {
      obj.wifiP2pEnabled = serviceGetConfiguration_SettingStateToJSON(message.wifiP2pEnabled);
    }
    if (message.mdnsEnabled !== 0) {
      obj.mdnsEnabled = serviceGetConfiguration_SettingStateToJSON(message.mdnsEnabled);
    }
    if (message.relayEnabled !== 0) {
      obj.relayEnabled = serviceGetConfiguration_SettingStateToJSON(message.relayEnabled);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ServiceGetConfiguration_Reply>, I>>(base?: I): ServiceGetConfiguration_Reply {
    return ServiceGetConfiguration_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServiceGetConfiguration_Reply>, I>>(
    object: I,
  ): ServiceGetConfiguration_Reply {
    const message = createBaseServiceGetConfiguration_Reply();
    message.accountPk = object.accountPk ?? new Uint8Array(0);
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.accountGroupPk = object.accountGroupPk ?? new Uint8Array(0);
    message.peerId = object.peerId ?? "";
    message.listeners = object.listeners?.map((e) => e) || [];
    message.bleEnabled = object.bleEnabled ?? 0;
    message.wifiP2pEnabled = object.wifiP2pEnabled ?? 0;
    message.mdnsEnabled = object.mdnsEnabled ?? 0;
    message.relayEnabled = object.relayEnabled ?? 0;
    return message;
  },
};

function createBaseContactRequestReference(): ContactRequestReference {
  return {};
}

export const ContactRequestReference = {
  encode(_: ContactRequestReference, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestReference {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestReference();
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

  fromJSON(_: any): ContactRequestReference {
    return {};
  },

  toJSON(_: ContactRequestReference): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestReference>, I>>(base?: I): ContactRequestReference {
    return ContactRequestReference.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestReference>, I>>(_: I): ContactRequestReference {
    const message = createBaseContactRequestReference();
    return message;
  },
};

function createBaseContactRequestReference_Request(): ContactRequestReference_Request {
  return {};
}

export const ContactRequestReference_Request = {
  encode(_: ContactRequestReference_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestReference_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestReference_Request();
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

  fromJSON(_: any): ContactRequestReference_Request {
    return {};
  },

  toJSON(_: ContactRequestReference_Request): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestReference_Request>, I>>(base?: I): ContactRequestReference_Request {
    return ContactRequestReference_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestReference_Request>, I>>(_: I): ContactRequestReference_Request {
    const message = createBaseContactRequestReference_Request();
    return message;
  },
};

function createBaseContactRequestReference_Reply(): ContactRequestReference_Reply {
  return { publicRendezvousSeed: new Uint8Array(0), enabled: false };
}

export const ContactRequestReference_Reply = {
  encode(message: ContactRequestReference_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publicRendezvousSeed.length !== 0) {
      writer.uint32(10).bytes(message.publicRendezvousSeed);
    }
    if (message.enabled === true) {
      writer.uint32(16).bool(message.enabled);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestReference_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestReference_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.publicRendezvousSeed = reader.bytes();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.enabled = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContactRequestReference_Reply {
    return {
      publicRendezvousSeed: isSet(object.publicRendezvousSeed)
        ? bytesFromBase64(object.publicRendezvousSeed)
        : new Uint8Array(0),
      enabled: isSet(object.enabled) ? globalThis.Boolean(object.enabled) : false,
    };
  },

  toJSON(message: ContactRequestReference_Reply): unknown {
    const obj: any = {};
    if (message.publicRendezvousSeed.length !== 0) {
      obj.publicRendezvousSeed = base64FromBytes(message.publicRendezvousSeed);
    }
    if (message.enabled === true) {
      obj.enabled = message.enabled;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestReference_Reply>, I>>(base?: I): ContactRequestReference_Reply {
    return ContactRequestReference_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestReference_Reply>, I>>(
    object: I,
  ): ContactRequestReference_Reply {
    const message = createBaseContactRequestReference_Reply();
    message.publicRendezvousSeed = object.publicRendezvousSeed ?? new Uint8Array(0);
    message.enabled = object.enabled ?? false;
    return message;
  },
};

function createBaseContactRequestDisable(): ContactRequestDisable {
  return {};
}

export const ContactRequestDisable = {
  encode(_: ContactRequestDisable, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestDisable {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestDisable();
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

  fromJSON(_: any): ContactRequestDisable {
    return {};
  },

  toJSON(_: ContactRequestDisable): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestDisable>, I>>(base?: I): ContactRequestDisable {
    return ContactRequestDisable.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestDisable>, I>>(_: I): ContactRequestDisable {
    const message = createBaseContactRequestDisable();
    return message;
  },
};

function createBaseContactRequestDisable_Request(): ContactRequestDisable_Request {
  return {};
}

export const ContactRequestDisable_Request = {
  encode(_: ContactRequestDisable_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestDisable_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestDisable_Request();
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

  fromJSON(_: any): ContactRequestDisable_Request {
    return {};
  },

  toJSON(_: ContactRequestDisable_Request): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestDisable_Request>, I>>(base?: I): ContactRequestDisable_Request {
    return ContactRequestDisable_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestDisable_Request>, I>>(_: I): ContactRequestDisable_Request {
    const message = createBaseContactRequestDisable_Request();
    return message;
  },
};

function createBaseContactRequestDisable_Reply(): ContactRequestDisable_Reply {
  return {};
}

export const ContactRequestDisable_Reply = {
  encode(_: ContactRequestDisable_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestDisable_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestDisable_Reply();
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

  fromJSON(_: any): ContactRequestDisable_Reply {
    return {};
  },

  toJSON(_: ContactRequestDisable_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestDisable_Reply>, I>>(base?: I): ContactRequestDisable_Reply {
    return ContactRequestDisable_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestDisable_Reply>, I>>(_: I): ContactRequestDisable_Reply {
    const message = createBaseContactRequestDisable_Reply();
    return message;
  },
};

function createBaseContactRequestEnable(): ContactRequestEnable {
  return {};
}

export const ContactRequestEnable = {
  encode(_: ContactRequestEnable, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestEnable {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestEnable();
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

  fromJSON(_: any): ContactRequestEnable {
    return {};
  },

  toJSON(_: ContactRequestEnable): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestEnable>, I>>(base?: I): ContactRequestEnable {
    return ContactRequestEnable.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestEnable>, I>>(_: I): ContactRequestEnable {
    const message = createBaseContactRequestEnable();
    return message;
  },
};

function createBaseContactRequestEnable_Request(): ContactRequestEnable_Request {
  return {};
}

export const ContactRequestEnable_Request = {
  encode(_: ContactRequestEnable_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestEnable_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestEnable_Request();
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

  fromJSON(_: any): ContactRequestEnable_Request {
    return {};
  },

  toJSON(_: ContactRequestEnable_Request): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestEnable_Request>, I>>(base?: I): ContactRequestEnable_Request {
    return ContactRequestEnable_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestEnable_Request>, I>>(_: I): ContactRequestEnable_Request {
    const message = createBaseContactRequestEnable_Request();
    return message;
  },
};

function createBaseContactRequestEnable_Reply(): ContactRequestEnable_Reply {
  return { publicRendezvousSeed: new Uint8Array(0) };
}

export const ContactRequestEnable_Reply = {
  encode(message: ContactRequestEnable_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publicRendezvousSeed.length !== 0) {
      writer.uint32(10).bytes(message.publicRendezvousSeed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestEnable_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestEnable_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.publicRendezvousSeed = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContactRequestEnable_Reply {
    return {
      publicRendezvousSeed: isSet(object.publicRendezvousSeed)
        ? bytesFromBase64(object.publicRendezvousSeed)
        : new Uint8Array(0),
    };
  },

  toJSON(message: ContactRequestEnable_Reply): unknown {
    const obj: any = {};
    if (message.publicRendezvousSeed.length !== 0) {
      obj.publicRendezvousSeed = base64FromBytes(message.publicRendezvousSeed);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestEnable_Reply>, I>>(base?: I): ContactRequestEnable_Reply {
    return ContactRequestEnable_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestEnable_Reply>, I>>(object: I): ContactRequestEnable_Reply {
    const message = createBaseContactRequestEnable_Reply();
    message.publicRendezvousSeed = object.publicRendezvousSeed ?? new Uint8Array(0);
    return message;
  },
};

function createBaseContactRequestResetReference(): ContactRequestResetReference {
  return {};
}

export const ContactRequestResetReference = {
  encode(_: ContactRequestResetReference, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestResetReference {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestResetReference();
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

  fromJSON(_: any): ContactRequestResetReference {
    return {};
  },

  toJSON(_: ContactRequestResetReference): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestResetReference>, I>>(base?: I): ContactRequestResetReference {
    return ContactRequestResetReference.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestResetReference>, I>>(_: I): ContactRequestResetReference {
    const message = createBaseContactRequestResetReference();
    return message;
  },
};

function createBaseContactRequestResetReference_Request(): ContactRequestResetReference_Request {
  return {};
}

export const ContactRequestResetReference_Request = {
  encode(_: ContactRequestResetReference_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestResetReference_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestResetReference_Request();
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

  fromJSON(_: any): ContactRequestResetReference_Request {
    return {};
  },

  toJSON(_: ContactRequestResetReference_Request): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestResetReference_Request>, I>>(
    base?: I,
  ): ContactRequestResetReference_Request {
    return ContactRequestResetReference_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestResetReference_Request>, I>>(
    _: I,
  ): ContactRequestResetReference_Request {
    const message = createBaseContactRequestResetReference_Request();
    return message;
  },
};

function createBaseContactRequestResetReference_Reply(): ContactRequestResetReference_Reply {
  return { publicRendezvousSeed: new Uint8Array(0) };
}

export const ContactRequestResetReference_Reply = {
  encode(message: ContactRequestResetReference_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publicRendezvousSeed.length !== 0) {
      writer.uint32(10).bytes(message.publicRendezvousSeed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestResetReference_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestResetReference_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.publicRendezvousSeed = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContactRequestResetReference_Reply {
    return {
      publicRendezvousSeed: isSet(object.publicRendezvousSeed)
        ? bytesFromBase64(object.publicRendezvousSeed)
        : new Uint8Array(0),
    };
  },

  toJSON(message: ContactRequestResetReference_Reply): unknown {
    const obj: any = {};
    if (message.publicRendezvousSeed.length !== 0) {
      obj.publicRendezvousSeed = base64FromBytes(message.publicRendezvousSeed);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestResetReference_Reply>, I>>(
    base?: I,
  ): ContactRequestResetReference_Reply {
    return ContactRequestResetReference_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestResetReference_Reply>, I>>(
    object: I,
  ): ContactRequestResetReference_Reply {
    const message = createBaseContactRequestResetReference_Reply();
    message.publicRendezvousSeed = object.publicRendezvousSeed ?? new Uint8Array(0);
    return message;
  },
};

function createBaseContactRequestSend(): ContactRequestSend {
  return {};
}

export const ContactRequestSend = {
  encode(_: ContactRequestSend, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestSend {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestSend();
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

  fromJSON(_: any): ContactRequestSend {
    return {};
  },

  toJSON(_: ContactRequestSend): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestSend>, I>>(base?: I): ContactRequestSend {
    return ContactRequestSend.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestSend>, I>>(_: I): ContactRequestSend {
    const message = createBaseContactRequestSend();
    return message;
  },
};

function createBaseContactRequestSend_Request(): ContactRequestSend_Request {
  return { contact: undefined, ownMetadata: new Uint8Array(0) };
}

export const ContactRequestSend_Request = {
  encode(message: ContactRequestSend_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contact !== undefined) {
      ShareableContact.encode(message.contact, writer.uint32(10).fork()).ldelim();
    }
    if (message.ownMetadata.length !== 0) {
      writer.uint32(18).bytes(message.ownMetadata);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestSend_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestSend_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.contact = ShareableContact.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.ownMetadata = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContactRequestSend_Request {
    return {
      contact: isSet(object.contact) ? ShareableContact.fromJSON(object.contact) : undefined,
      ownMetadata: isSet(object.ownMetadata) ? bytesFromBase64(object.ownMetadata) : new Uint8Array(0),
    };
  },

  toJSON(message: ContactRequestSend_Request): unknown {
    const obj: any = {};
    if (message.contact !== undefined) {
      obj.contact = ShareableContact.toJSON(message.contact);
    }
    if (message.ownMetadata.length !== 0) {
      obj.ownMetadata = base64FromBytes(message.ownMetadata);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestSend_Request>, I>>(base?: I): ContactRequestSend_Request {
    return ContactRequestSend_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestSend_Request>, I>>(object: I): ContactRequestSend_Request {
    const message = createBaseContactRequestSend_Request();
    message.contact = (object.contact !== undefined && object.contact !== null)
      ? ShareableContact.fromPartial(object.contact)
      : undefined;
    message.ownMetadata = object.ownMetadata ?? new Uint8Array(0);
    return message;
  },
};

function createBaseContactRequestSend_Reply(): ContactRequestSend_Reply {
  return {};
}

export const ContactRequestSend_Reply = {
  encode(_: ContactRequestSend_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestSend_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestSend_Reply();
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

  fromJSON(_: any): ContactRequestSend_Reply {
    return {};
  },

  toJSON(_: ContactRequestSend_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestSend_Reply>, I>>(base?: I): ContactRequestSend_Reply {
    return ContactRequestSend_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestSend_Reply>, I>>(_: I): ContactRequestSend_Reply {
    const message = createBaseContactRequestSend_Reply();
    return message;
  },
};

function createBaseContactRequestAccept(): ContactRequestAccept {
  return {};
}

export const ContactRequestAccept = {
  encode(_: ContactRequestAccept, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestAccept {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestAccept();
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

  fromJSON(_: any): ContactRequestAccept {
    return {};
  },

  toJSON(_: ContactRequestAccept): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestAccept>, I>>(base?: I): ContactRequestAccept {
    return ContactRequestAccept.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestAccept>, I>>(_: I): ContactRequestAccept {
    const message = createBaseContactRequestAccept();
    return message;
  },
};

function createBaseContactRequestAccept_Request(): ContactRequestAccept_Request {
  return { contactPk: new Uint8Array(0) };
}

export const ContactRequestAccept_Request = {
  encode(message: ContactRequestAccept_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contactPk.length !== 0) {
      writer.uint32(10).bytes(message.contactPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestAccept_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestAccept_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContactRequestAccept_Request {
    return { contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0) };
  },

  toJSON(message: ContactRequestAccept_Request): unknown {
    const obj: any = {};
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestAccept_Request>, I>>(base?: I): ContactRequestAccept_Request {
    return ContactRequestAccept_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestAccept_Request>, I>>(object: I): ContactRequestAccept_Request {
    const message = createBaseContactRequestAccept_Request();
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseContactRequestAccept_Reply(): ContactRequestAccept_Reply {
  return {};
}

export const ContactRequestAccept_Reply = {
  encode(_: ContactRequestAccept_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestAccept_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestAccept_Reply();
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

  fromJSON(_: any): ContactRequestAccept_Reply {
    return {};
  },

  toJSON(_: ContactRequestAccept_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestAccept_Reply>, I>>(base?: I): ContactRequestAccept_Reply {
    return ContactRequestAccept_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestAccept_Reply>, I>>(_: I): ContactRequestAccept_Reply {
    const message = createBaseContactRequestAccept_Reply();
    return message;
  },
};

function createBaseContactRequestDiscard(): ContactRequestDiscard {
  return {};
}

export const ContactRequestDiscard = {
  encode(_: ContactRequestDiscard, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestDiscard {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestDiscard();
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

  fromJSON(_: any): ContactRequestDiscard {
    return {};
  },

  toJSON(_: ContactRequestDiscard): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestDiscard>, I>>(base?: I): ContactRequestDiscard {
    return ContactRequestDiscard.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestDiscard>, I>>(_: I): ContactRequestDiscard {
    const message = createBaseContactRequestDiscard();
    return message;
  },
};

function createBaseContactRequestDiscard_Request(): ContactRequestDiscard_Request {
  return { contactPk: new Uint8Array(0) };
}

export const ContactRequestDiscard_Request = {
  encode(message: ContactRequestDiscard_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contactPk.length !== 0) {
      writer.uint32(10).bytes(message.contactPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestDiscard_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestDiscard_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContactRequestDiscard_Request {
    return { contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0) };
  },

  toJSON(message: ContactRequestDiscard_Request): unknown {
    const obj: any = {};
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestDiscard_Request>, I>>(base?: I): ContactRequestDiscard_Request {
    return ContactRequestDiscard_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestDiscard_Request>, I>>(
    object: I,
  ): ContactRequestDiscard_Request {
    const message = createBaseContactRequestDiscard_Request();
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseContactRequestDiscard_Reply(): ContactRequestDiscard_Reply {
  return {};
}

export const ContactRequestDiscard_Reply = {
  encode(_: ContactRequestDiscard_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequestDiscard_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequestDiscard_Reply();
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

  fromJSON(_: any): ContactRequestDiscard_Reply {
    return {};
  },

  toJSON(_: ContactRequestDiscard_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactRequestDiscard_Reply>, I>>(base?: I): ContactRequestDiscard_Reply {
    return ContactRequestDiscard_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactRequestDiscard_Reply>, I>>(_: I): ContactRequestDiscard_Reply {
    const message = createBaseContactRequestDiscard_Reply();
    return message;
  },
};

function createBaseShareContact(): ShareContact {
  return {};
}

export const ShareContact = {
  encode(_: ShareContact, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ShareContact {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseShareContact();
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

  fromJSON(_: any): ShareContact {
    return {};
  },

  toJSON(_: ShareContact): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ShareContact>, I>>(base?: I): ShareContact {
    return ShareContact.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ShareContact>, I>>(_: I): ShareContact {
    const message = createBaseShareContact();
    return message;
  },
};

function createBaseShareContact_Request(): ShareContact_Request {
  return {};
}

export const ShareContact_Request = {
  encode(_: ShareContact_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ShareContact_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseShareContact_Request();
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

  fromJSON(_: any): ShareContact_Request {
    return {};
  },

  toJSON(_: ShareContact_Request): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ShareContact_Request>, I>>(base?: I): ShareContact_Request {
    return ShareContact_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ShareContact_Request>, I>>(_: I): ShareContact_Request {
    const message = createBaseShareContact_Request();
    return message;
  },
};

function createBaseShareContact_Reply(): ShareContact_Reply {
  return { encodedContact: new Uint8Array(0) };
}

export const ShareContact_Reply = {
  encode(message: ShareContact_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encodedContact.length !== 0) {
      writer.uint32(10).bytes(message.encodedContact);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ShareContact_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseShareContact_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.encodedContact = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ShareContact_Reply {
    return {
      encodedContact: isSet(object.encodedContact) ? bytesFromBase64(object.encodedContact) : new Uint8Array(0),
    };
  },

  toJSON(message: ShareContact_Reply): unknown {
    const obj: any = {};
    if (message.encodedContact.length !== 0) {
      obj.encodedContact = base64FromBytes(message.encodedContact);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ShareContact_Reply>, I>>(base?: I): ShareContact_Reply {
    return ShareContact_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ShareContact_Reply>, I>>(object: I): ShareContact_Reply {
    const message = createBaseShareContact_Reply();
    message.encodedContact = object.encodedContact ?? new Uint8Array(0);
    return message;
  },
};

function createBaseDecodeContact(): DecodeContact {
  return {};
}

export const DecodeContact = {
  encode(_: DecodeContact, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DecodeContact {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDecodeContact();
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

  fromJSON(_: any): DecodeContact {
    return {};
  },

  toJSON(_: DecodeContact): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DecodeContact>, I>>(base?: I): DecodeContact {
    return DecodeContact.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DecodeContact>, I>>(_: I): DecodeContact {
    const message = createBaseDecodeContact();
    return message;
  },
};

function createBaseDecodeContact_Request(): DecodeContact_Request {
  return { encodedContact: new Uint8Array(0) };
}

export const DecodeContact_Request = {
  encode(message: DecodeContact_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encodedContact.length !== 0) {
      writer.uint32(10).bytes(message.encodedContact);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DecodeContact_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDecodeContact_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.encodedContact = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DecodeContact_Request {
    return {
      encodedContact: isSet(object.encodedContact) ? bytesFromBase64(object.encodedContact) : new Uint8Array(0),
    };
  },

  toJSON(message: DecodeContact_Request): unknown {
    const obj: any = {};
    if (message.encodedContact.length !== 0) {
      obj.encodedContact = base64FromBytes(message.encodedContact);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DecodeContact_Request>, I>>(base?: I): DecodeContact_Request {
    return DecodeContact_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DecodeContact_Request>, I>>(object: I): DecodeContact_Request {
    const message = createBaseDecodeContact_Request();
    message.encodedContact = object.encodedContact ?? new Uint8Array(0);
    return message;
  },
};

function createBaseDecodeContact_Reply(): DecodeContact_Reply {
  return { contact: undefined };
}

export const DecodeContact_Reply = {
  encode(message: DecodeContact_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contact !== undefined) {
      ShareableContact.encode(message.contact, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DecodeContact_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDecodeContact_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.contact = ShareableContact.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DecodeContact_Reply {
    return { contact: isSet(object.contact) ? ShareableContact.fromJSON(object.contact) : undefined };
  },

  toJSON(message: DecodeContact_Reply): unknown {
    const obj: any = {};
    if (message.contact !== undefined) {
      obj.contact = ShareableContact.toJSON(message.contact);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DecodeContact_Reply>, I>>(base?: I): DecodeContact_Reply {
    return DecodeContact_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DecodeContact_Reply>, I>>(object: I): DecodeContact_Reply {
    const message = createBaseDecodeContact_Reply();
    message.contact = (object.contact !== undefined && object.contact !== null)
      ? ShareableContact.fromPartial(object.contact)
      : undefined;
    return message;
  },
};

function createBaseContactBlock(): ContactBlock {
  return {};
}

export const ContactBlock = {
  encode(_: ContactBlock, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactBlock {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactBlock();
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

  fromJSON(_: any): ContactBlock {
    return {};
  },

  toJSON(_: ContactBlock): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactBlock>, I>>(base?: I): ContactBlock {
    return ContactBlock.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactBlock>, I>>(_: I): ContactBlock {
    const message = createBaseContactBlock();
    return message;
  },
};

function createBaseContactBlock_Request(): ContactBlock_Request {
  return { contactPk: new Uint8Array(0) };
}

export const ContactBlock_Request = {
  encode(message: ContactBlock_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contactPk.length !== 0) {
      writer.uint32(10).bytes(message.contactPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactBlock_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactBlock_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContactBlock_Request {
    return { contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0) };
  },

  toJSON(message: ContactBlock_Request): unknown {
    const obj: any = {};
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactBlock_Request>, I>>(base?: I): ContactBlock_Request {
    return ContactBlock_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactBlock_Request>, I>>(object: I): ContactBlock_Request {
    const message = createBaseContactBlock_Request();
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseContactBlock_Reply(): ContactBlock_Reply {
  return {};
}

export const ContactBlock_Reply = {
  encode(_: ContactBlock_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactBlock_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactBlock_Reply();
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

  fromJSON(_: any): ContactBlock_Reply {
    return {};
  },

  toJSON(_: ContactBlock_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactBlock_Reply>, I>>(base?: I): ContactBlock_Reply {
    return ContactBlock_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactBlock_Reply>, I>>(_: I): ContactBlock_Reply {
    const message = createBaseContactBlock_Reply();
    return message;
  },
};

function createBaseContactUnblock(): ContactUnblock {
  return {};
}

export const ContactUnblock = {
  encode(_: ContactUnblock, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactUnblock {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactUnblock();
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

  fromJSON(_: any): ContactUnblock {
    return {};
  },

  toJSON(_: ContactUnblock): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactUnblock>, I>>(base?: I): ContactUnblock {
    return ContactUnblock.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactUnblock>, I>>(_: I): ContactUnblock {
    const message = createBaseContactUnblock();
    return message;
  },
};

function createBaseContactUnblock_Request(): ContactUnblock_Request {
  return { contactPk: new Uint8Array(0) };
}

export const ContactUnblock_Request = {
  encode(message: ContactUnblock_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contactPk.length !== 0) {
      writer.uint32(10).bytes(message.contactPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactUnblock_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactUnblock_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContactUnblock_Request {
    return { contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0) };
  },

  toJSON(message: ContactUnblock_Request): unknown {
    const obj: any = {};
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactUnblock_Request>, I>>(base?: I): ContactUnblock_Request {
    return ContactUnblock_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactUnblock_Request>, I>>(object: I): ContactUnblock_Request {
    const message = createBaseContactUnblock_Request();
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseContactUnblock_Reply(): ContactUnblock_Reply {
  return {};
}

export const ContactUnblock_Reply = {
  encode(_: ContactUnblock_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactUnblock_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactUnblock_Reply();
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

  fromJSON(_: any): ContactUnblock_Reply {
    return {};
  },

  toJSON(_: ContactUnblock_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactUnblock_Reply>, I>>(base?: I): ContactUnblock_Reply {
    return ContactUnblock_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactUnblock_Reply>, I>>(_: I): ContactUnblock_Reply {
    const message = createBaseContactUnblock_Reply();
    return message;
  },
};

function createBaseContactAliasKeySend(): ContactAliasKeySend {
  return {};
}

export const ContactAliasKeySend = {
  encode(_: ContactAliasKeySend, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactAliasKeySend {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactAliasKeySend();
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

  fromJSON(_: any): ContactAliasKeySend {
    return {};
  },

  toJSON(_: ContactAliasKeySend): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactAliasKeySend>, I>>(base?: I): ContactAliasKeySend {
    return ContactAliasKeySend.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactAliasKeySend>, I>>(_: I): ContactAliasKeySend {
    const message = createBaseContactAliasKeySend();
    return message;
  },
};

function createBaseContactAliasKeySend_Request(): ContactAliasKeySend_Request {
  return { groupPk: new Uint8Array(0) };
}

export const ContactAliasKeySend_Request = {
  encode(message: ContactAliasKeySend_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactAliasKeySend_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactAliasKeySend_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContactAliasKeySend_Request {
    return { groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0) };
  },

  toJSON(message: ContactAliasKeySend_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactAliasKeySend_Request>, I>>(base?: I): ContactAliasKeySend_Request {
    return ContactAliasKeySend_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactAliasKeySend_Request>, I>>(object: I): ContactAliasKeySend_Request {
    const message = createBaseContactAliasKeySend_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseContactAliasKeySend_Reply(): ContactAliasKeySend_Reply {
  return {};
}

export const ContactAliasKeySend_Reply = {
  encode(_: ContactAliasKeySend_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactAliasKeySend_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactAliasKeySend_Reply();
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

  fromJSON(_: any): ContactAliasKeySend_Reply {
    return {};
  },

  toJSON(_: ContactAliasKeySend_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactAliasKeySend_Reply>, I>>(base?: I): ContactAliasKeySend_Reply {
    return ContactAliasKeySend_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactAliasKeySend_Reply>, I>>(_: I): ContactAliasKeySend_Reply {
    const message = createBaseContactAliasKeySend_Reply();
    return message;
  },
};

function createBaseMultiMemberGroupCreate(): MultiMemberGroupCreate {
  return {};
}

export const MultiMemberGroupCreate = {
  encode(_: MultiMemberGroupCreate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupCreate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupCreate();
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

  fromJSON(_: any): MultiMemberGroupCreate {
    return {};
  },

  toJSON(_: MultiMemberGroupCreate): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupCreate>, I>>(base?: I): MultiMemberGroupCreate {
    return MultiMemberGroupCreate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupCreate>, I>>(_: I): MultiMemberGroupCreate {
    const message = createBaseMultiMemberGroupCreate();
    return message;
  },
};

function createBaseMultiMemberGroupCreate_Request(): MultiMemberGroupCreate_Request {
  return {};
}

export const MultiMemberGroupCreate_Request = {
  encode(_: MultiMemberGroupCreate_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupCreate_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupCreate_Request();
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

  fromJSON(_: any): MultiMemberGroupCreate_Request {
    return {};
  },

  toJSON(_: MultiMemberGroupCreate_Request): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupCreate_Request>, I>>(base?: I): MultiMemberGroupCreate_Request {
    return MultiMemberGroupCreate_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupCreate_Request>, I>>(_: I): MultiMemberGroupCreate_Request {
    const message = createBaseMultiMemberGroupCreate_Request();
    return message;
  },
};

function createBaseMultiMemberGroupCreate_Reply(): MultiMemberGroupCreate_Reply {
  return { groupPk: new Uint8Array(0) };
}

export const MultiMemberGroupCreate_Reply = {
  encode(message: MultiMemberGroupCreate_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupCreate_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupCreate_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultiMemberGroupCreate_Reply {
    return { groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0) };
  },

  toJSON(message: MultiMemberGroupCreate_Reply): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupCreate_Reply>, I>>(base?: I): MultiMemberGroupCreate_Reply {
    return MultiMemberGroupCreate_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupCreate_Reply>, I>>(object: I): MultiMemberGroupCreate_Reply {
    const message = createBaseMultiMemberGroupCreate_Reply();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMultiMemberGroupJoin(): MultiMemberGroupJoin {
  return {};
}

export const MultiMemberGroupJoin = {
  encode(_: MultiMemberGroupJoin, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupJoin {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupJoin();
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

  fromJSON(_: any): MultiMemberGroupJoin {
    return {};
  },

  toJSON(_: MultiMemberGroupJoin): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupJoin>, I>>(base?: I): MultiMemberGroupJoin {
    return MultiMemberGroupJoin.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupJoin>, I>>(_: I): MultiMemberGroupJoin {
    const message = createBaseMultiMemberGroupJoin();
    return message;
  },
};

function createBaseMultiMemberGroupJoin_Request(): MultiMemberGroupJoin_Request {
  return { group: undefined };
}

export const MultiMemberGroupJoin_Request = {
  encode(message: MultiMemberGroupJoin_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.group !== undefined) {
      Group.encode(message.group, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupJoin_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupJoin_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.group = Group.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultiMemberGroupJoin_Request {
    return { group: isSet(object.group) ? Group.fromJSON(object.group) : undefined };
  },

  toJSON(message: MultiMemberGroupJoin_Request): unknown {
    const obj: any = {};
    if (message.group !== undefined) {
      obj.group = Group.toJSON(message.group);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupJoin_Request>, I>>(base?: I): MultiMemberGroupJoin_Request {
    return MultiMemberGroupJoin_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupJoin_Request>, I>>(object: I): MultiMemberGroupJoin_Request {
    const message = createBaseMultiMemberGroupJoin_Request();
    message.group = (object.group !== undefined && object.group !== null) ? Group.fromPartial(object.group) : undefined;
    return message;
  },
};

function createBaseMultiMemberGroupJoin_Reply(): MultiMemberGroupJoin_Reply {
  return {};
}

export const MultiMemberGroupJoin_Reply = {
  encode(_: MultiMemberGroupJoin_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupJoin_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupJoin_Reply();
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

  fromJSON(_: any): MultiMemberGroupJoin_Reply {
    return {};
  },

  toJSON(_: MultiMemberGroupJoin_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupJoin_Reply>, I>>(base?: I): MultiMemberGroupJoin_Reply {
    return MultiMemberGroupJoin_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupJoin_Reply>, I>>(_: I): MultiMemberGroupJoin_Reply {
    const message = createBaseMultiMemberGroupJoin_Reply();
    return message;
  },
};

function createBaseMultiMemberGroupLeave(): MultiMemberGroupLeave {
  return {};
}

export const MultiMemberGroupLeave = {
  encode(_: MultiMemberGroupLeave, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupLeave {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupLeave();
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

  fromJSON(_: any): MultiMemberGroupLeave {
    return {};
  },

  toJSON(_: MultiMemberGroupLeave): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupLeave>, I>>(base?: I): MultiMemberGroupLeave {
    return MultiMemberGroupLeave.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupLeave>, I>>(_: I): MultiMemberGroupLeave {
    const message = createBaseMultiMemberGroupLeave();
    return message;
  },
};

function createBaseMultiMemberGroupLeave_Request(): MultiMemberGroupLeave_Request {
  return { groupPk: new Uint8Array(0) };
}

export const MultiMemberGroupLeave_Request = {
  encode(message: MultiMemberGroupLeave_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupLeave_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupLeave_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultiMemberGroupLeave_Request {
    return { groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0) };
  },

  toJSON(message: MultiMemberGroupLeave_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupLeave_Request>, I>>(base?: I): MultiMemberGroupLeave_Request {
    return MultiMemberGroupLeave_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupLeave_Request>, I>>(
    object: I,
  ): MultiMemberGroupLeave_Request {
    const message = createBaseMultiMemberGroupLeave_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMultiMemberGroupLeave_Reply(): MultiMemberGroupLeave_Reply {
  return {};
}

export const MultiMemberGroupLeave_Reply = {
  encode(_: MultiMemberGroupLeave_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupLeave_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupLeave_Reply();
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

  fromJSON(_: any): MultiMemberGroupLeave_Reply {
    return {};
  },

  toJSON(_: MultiMemberGroupLeave_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupLeave_Reply>, I>>(base?: I): MultiMemberGroupLeave_Reply {
    return MultiMemberGroupLeave_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupLeave_Reply>, I>>(_: I): MultiMemberGroupLeave_Reply {
    const message = createBaseMultiMemberGroupLeave_Reply();
    return message;
  },
};

function createBaseMultiMemberGroupAliasResolverDisclose(): MultiMemberGroupAliasResolverDisclose {
  return {};
}

export const MultiMemberGroupAliasResolverDisclose = {
  encode(_: MultiMemberGroupAliasResolverDisclose, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupAliasResolverDisclose {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupAliasResolverDisclose();
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

  fromJSON(_: any): MultiMemberGroupAliasResolverDisclose {
    return {};
  },

  toJSON(_: MultiMemberGroupAliasResolverDisclose): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupAliasResolverDisclose>, I>>(
    base?: I,
  ): MultiMemberGroupAliasResolverDisclose {
    return MultiMemberGroupAliasResolverDisclose.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupAliasResolverDisclose>, I>>(
    _: I,
  ): MultiMemberGroupAliasResolverDisclose {
    const message = createBaseMultiMemberGroupAliasResolverDisclose();
    return message;
  },
};

function createBaseMultiMemberGroupAliasResolverDisclose_Request(): MultiMemberGroupAliasResolverDisclose_Request {
  return { groupPk: new Uint8Array(0) };
}

export const MultiMemberGroupAliasResolverDisclose_Request = {
  encode(message: MultiMemberGroupAliasResolverDisclose_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupAliasResolverDisclose_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupAliasResolverDisclose_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultiMemberGroupAliasResolverDisclose_Request {
    return { groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0) };
  },

  toJSON(message: MultiMemberGroupAliasResolverDisclose_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupAliasResolverDisclose_Request>, I>>(
    base?: I,
  ): MultiMemberGroupAliasResolverDisclose_Request {
    return MultiMemberGroupAliasResolverDisclose_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupAliasResolverDisclose_Request>, I>>(
    object: I,
  ): MultiMemberGroupAliasResolverDisclose_Request {
    const message = createBaseMultiMemberGroupAliasResolverDisclose_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMultiMemberGroupAliasResolverDisclose_Reply(): MultiMemberGroupAliasResolverDisclose_Reply {
  return {};
}

export const MultiMemberGroupAliasResolverDisclose_Reply = {
  encode(_: MultiMemberGroupAliasResolverDisclose_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupAliasResolverDisclose_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupAliasResolverDisclose_Reply();
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

  fromJSON(_: any): MultiMemberGroupAliasResolverDisclose_Reply {
    return {};
  },

  toJSON(_: MultiMemberGroupAliasResolverDisclose_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupAliasResolverDisclose_Reply>, I>>(
    base?: I,
  ): MultiMemberGroupAliasResolverDisclose_Reply {
    return MultiMemberGroupAliasResolverDisclose_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupAliasResolverDisclose_Reply>, I>>(
    _: I,
  ): MultiMemberGroupAliasResolverDisclose_Reply {
    const message = createBaseMultiMemberGroupAliasResolverDisclose_Reply();
    return message;
  },
};

function createBaseMultiMemberGroupAdminRoleGrant(): MultiMemberGroupAdminRoleGrant {
  return {};
}

export const MultiMemberGroupAdminRoleGrant = {
  encode(_: MultiMemberGroupAdminRoleGrant, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupAdminRoleGrant {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupAdminRoleGrant();
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

  fromJSON(_: any): MultiMemberGroupAdminRoleGrant {
    return {};
  },

  toJSON(_: MultiMemberGroupAdminRoleGrant): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupAdminRoleGrant>, I>>(base?: I): MultiMemberGroupAdminRoleGrant {
    return MultiMemberGroupAdminRoleGrant.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupAdminRoleGrant>, I>>(_: I): MultiMemberGroupAdminRoleGrant {
    const message = createBaseMultiMemberGroupAdminRoleGrant();
    return message;
  },
};

function createBaseMultiMemberGroupAdminRoleGrant_Request(): MultiMemberGroupAdminRoleGrant_Request {
  return { groupPk: new Uint8Array(0), memberPk: new Uint8Array(0) };
}

export const MultiMemberGroupAdminRoleGrant_Request = {
  encode(message: MultiMemberGroupAdminRoleGrant_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    if (message.memberPk.length !== 0) {
      writer.uint32(18).bytes(message.memberPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupAdminRoleGrant_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupAdminRoleGrant_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.memberPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultiMemberGroupAdminRoleGrant_Request {
    return {
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
      memberPk: isSet(object.memberPk) ? bytesFromBase64(object.memberPk) : new Uint8Array(0),
    };
  },

  toJSON(message: MultiMemberGroupAdminRoleGrant_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    if (message.memberPk.length !== 0) {
      obj.memberPk = base64FromBytes(message.memberPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupAdminRoleGrant_Request>, I>>(
    base?: I,
  ): MultiMemberGroupAdminRoleGrant_Request {
    return MultiMemberGroupAdminRoleGrant_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupAdminRoleGrant_Request>, I>>(
    object: I,
  ): MultiMemberGroupAdminRoleGrant_Request {
    const message = createBaseMultiMemberGroupAdminRoleGrant_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    message.memberPk = object.memberPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMultiMemberGroupAdminRoleGrant_Reply(): MultiMemberGroupAdminRoleGrant_Reply {
  return {};
}

export const MultiMemberGroupAdminRoleGrant_Reply = {
  encode(_: MultiMemberGroupAdminRoleGrant_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupAdminRoleGrant_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupAdminRoleGrant_Reply();
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

  fromJSON(_: any): MultiMemberGroupAdminRoleGrant_Reply {
    return {};
  },

  toJSON(_: MultiMemberGroupAdminRoleGrant_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupAdminRoleGrant_Reply>, I>>(
    base?: I,
  ): MultiMemberGroupAdminRoleGrant_Reply {
    return MultiMemberGroupAdminRoleGrant_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupAdminRoleGrant_Reply>, I>>(
    _: I,
  ): MultiMemberGroupAdminRoleGrant_Reply {
    const message = createBaseMultiMemberGroupAdminRoleGrant_Reply();
    return message;
  },
};

function createBaseMultiMemberGroupInvitationCreate(): MultiMemberGroupInvitationCreate {
  return {};
}

export const MultiMemberGroupInvitationCreate = {
  encode(_: MultiMemberGroupInvitationCreate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupInvitationCreate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupInvitationCreate();
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

  fromJSON(_: any): MultiMemberGroupInvitationCreate {
    return {};
  },

  toJSON(_: MultiMemberGroupInvitationCreate): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupInvitationCreate>, I>>(
    base?: I,
  ): MultiMemberGroupInvitationCreate {
    return MultiMemberGroupInvitationCreate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupInvitationCreate>, I>>(
    _: I,
  ): MultiMemberGroupInvitationCreate {
    const message = createBaseMultiMemberGroupInvitationCreate();
    return message;
  },
};

function createBaseMultiMemberGroupInvitationCreate_Request(): MultiMemberGroupInvitationCreate_Request {
  return { groupPk: new Uint8Array(0) };
}

export const MultiMemberGroupInvitationCreate_Request = {
  encode(message: MultiMemberGroupInvitationCreate_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupInvitationCreate_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupInvitationCreate_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultiMemberGroupInvitationCreate_Request {
    return { groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0) };
  },

  toJSON(message: MultiMemberGroupInvitationCreate_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupInvitationCreate_Request>, I>>(
    base?: I,
  ): MultiMemberGroupInvitationCreate_Request {
    return MultiMemberGroupInvitationCreate_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupInvitationCreate_Request>, I>>(
    object: I,
  ): MultiMemberGroupInvitationCreate_Request {
    const message = createBaseMultiMemberGroupInvitationCreate_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMultiMemberGroupInvitationCreate_Reply(): MultiMemberGroupInvitationCreate_Reply {
  return { group: undefined };
}

export const MultiMemberGroupInvitationCreate_Reply = {
  encode(message: MultiMemberGroupInvitationCreate_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.group !== undefined) {
      Group.encode(message.group, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiMemberGroupInvitationCreate_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiMemberGroupInvitationCreate_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.group = Group.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultiMemberGroupInvitationCreate_Reply {
    return { group: isSet(object.group) ? Group.fromJSON(object.group) : undefined };
  },

  toJSON(message: MultiMemberGroupInvitationCreate_Reply): unknown {
    const obj: any = {};
    if (message.group !== undefined) {
      obj.group = Group.toJSON(message.group);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiMemberGroupInvitationCreate_Reply>, I>>(
    base?: I,
  ): MultiMemberGroupInvitationCreate_Reply {
    return MultiMemberGroupInvitationCreate_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiMemberGroupInvitationCreate_Reply>, I>>(
    object: I,
  ): MultiMemberGroupInvitationCreate_Reply {
    const message = createBaseMultiMemberGroupInvitationCreate_Reply();
    message.group = (object.group !== undefined && object.group !== null) ? Group.fromPartial(object.group) : undefined;
    return message;
  },
};

function createBaseAppMetadataSend(): AppMetadataSend {
  return {};
}

export const AppMetadataSend = {
  encode(_: AppMetadataSend, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AppMetadataSend {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAppMetadataSend();
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

  fromJSON(_: any): AppMetadataSend {
    return {};
  },

  toJSON(_: AppMetadataSend): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<AppMetadataSend>, I>>(base?: I): AppMetadataSend {
    return AppMetadataSend.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AppMetadataSend>, I>>(_: I): AppMetadataSend {
    const message = createBaseAppMetadataSend();
    return message;
  },
};

function createBaseAppMetadataSend_Request(): AppMetadataSend_Request {
  return { groupPk: new Uint8Array(0), payload: new Uint8Array(0) };
}

export const AppMetadataSend_Request = {
  encode(message: AppMetadataSend_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    if (message.payload.length !== 0) {
      writer.uint32(18).bytes(message.payload);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AppMetadataSend_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAppMetadataSend_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.payload = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AppMetadataSend_Request {
    return {
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
      payload: isSet(object.payload) ? bytesFromBase64(object.payload) : new Uint8Array(0),
    };
  },

  toJSON(message: AppMetadataSend_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    if (message.payload.length !== 0) {
      obj.payload = base64FromBytes(message.payload);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AppMetadataSend_Request>, I>>(base?: I): AppMetadataSend_Request {
    return AppMetadataSend_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AppMetadataSend_Request>, I>>(object: I): AppMetadataSend_Request {
    const message = createBaseAppMetadataSend_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    message.payload = object.payload ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAppMetadataSend_Reply(): AppMetadataSend_Reply {
  return { cid: new Uint8Array(0) };
}

export const AppMetadataSend_Reply = {
  encode(message: AppMetadataSend_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cid.length !== 0) {
      writer.uint32(10).bytes(message.cid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AppMetadataSend_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAppMetadataSend_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cid = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AppMetadataSend_Reply {
    return { cid: isSet(object.cid) ? bytesFromBase64(object.cid) : new Uint8Array(0) };
  },

  toJSON(message: AppMetadataSend_Reply): unknown {
    const obj: any = {};
    if (message.cid.length !== 0) {
      obj.cid = base64FromBytes(message.cid);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AppMetadataSend_Reply>, I>>(base?: I): AppMetadataSend_Reply {
    return AppMetadataSend_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AppMetadataSend_Reply>, I>>(object: I): AppMetadataSend_Reply {
    const message = createBaseAppMetadataSend_Reply();
    message.cid = object.cid ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAppMessageSend(): AppMessageSend {
  return {};
}

export const AppMessageSend = {
  encode(_: AppMessageSend, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AppMessageSend {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAppMessageSend();
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

  fromJSON(_: any): AppMessageSend {
    return {};
  },

  toJSON(_: AppMessageSend): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<AppMessageSend>, I>>(base?: I): AppMessageSend {
    return AppMessageSend.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AppMessageSend>, I>>(_: I): AppMessageSend {
    const message = createBaseAppMessageSend();
    return message;
  },
};

function createBaseAppMessageSend_Request(): AppMessageSend_Request {
  return { groupPk: new Uint8Array(0), payload: new Uint8Array(0) };
}

export const AppMessageSend_Request = {
  encode(message: AppMessageSend_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    if (message.payload.length !== 0) {
      writer.uint32(18).bytes(message.payload);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AppMessageSend_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAppMessageSend_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.payload = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AppMessageSend_Request {
    return {
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
      payload: isSet(object.payload) ? bytesFromBase64(object.payload) : new Uint8Array(0),
    };
  },

  toJSON(message: AppMessageSend_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    if (message.payload.length !== 0) {
      obj.payload = base64FromBytes(message.payload);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AppMessageSend_Request>, I>>(base?: I): AppMessageSend_Request {
    return AppMessageSend_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AppMessageSend_Request>, I>>(object: I): AppMessageSend_Request {
    const message = createBaseAppMessageSend_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    message.payload = object.payload ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAppMessageSend_Reply(): AppMessageSend_Reply {
  return { cid: new Uint8Array(0) };
}

export const AppMessageSend_Reply = {
  encode(message: AppMessageSend_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cid.length !== 0) {
      writer.uint32(10).bytes(message.cid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AppMessageSend_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAppMessageSend_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cid = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AppMessageSend_Reply {
    return { cid: isSet(object.cid) ? bytesFromBase64(object.cid) : new Uint8Array(0) };
  },

  toJSON(message: AppMessageSend_Reply): unknown {
    const obj: any = {};
    if (message.cid.length !== 0) {
      obj.cid = base64FromBytes(message.cid);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AppMessageSend_Reply>, I>>(base?: I): AppMessageSend_Reply {
    return AppMessageSend_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AppMessageSend_Reply>, I>>(object: I): AppMessageSend_Reply {
    const message = createBaseAppMessageSend_Reply();
    message.cid = object.cid ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupMetadataEvent(): GroupMetadataEvent {
  return { eventContext: undefined, metadata: undefined, event: new Uint8Array(0) };
}

export const GroupMetadataEvent = {
  encode(message: GroupMetadataEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.eventContext !== undefined) {
      EventContext.encode(message.eventContext, writer.uint32(10).fork()).ldelim();
    }
    if (message.metadata !== undefined) {
      GroupMetadata.encode(message.metadata, writer.uint32(18).fork()).ldelim();
    }
    if (message.event.length !== 0) {
      writer.uint32(26).bytes(message.event);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupMetadataEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupMetadataEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.eventContext = EventContext.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.metadata = GroupMetadata.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.event = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupMetadataEvent {
    return {
      eventContext: isSet(object.eventContext) ? EventContext.fromJSON(object.eventContext) : undefined,
      metadata: isSet(object.metadata) ? GroupMetadata.fromJSON(object.metadata) : undefined,
      event: isSet(object.event) ? bytesFromBase64(object.event) : new Uint8Array(0),
    };
  },

  toJSON(message: GroupMetadataEvent): unknown {
    const obj: any = {};
    if (message.eventContext !== undefined) {
      obj.eventContext = EventContext.toJSON(message.eventContext);
    }
    if (message.metadata !== undefined) {
      obj.metadata = GroupMetadata.toJSON(message.metadata);
    }
    if (message.event.length !== 0) {
      obj.event = base64FromBytes(message.event);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupMetadataEvent>, I>>(base?: I): GroupMetadataEvent {
    return GroupMetadataEvent.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupMetadataEvent>, I>>(object: I): GroupMetadataEvent {
    const message = createBaseGroupMetadataEvent();
    message.eventContext = (object.eventContext !== undefined && object.eventContext !== null)
      ? EventContext.fromPartial(object.eventContext)
      : undefined;
    message.metadata = (object.metadata !== undefined && object.metadata !== null)
      ? GroupMetadata.fromPartial(object.metadata)
      : undefined;
    message.event = object.event ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupMessageEvent(): GroupMessageEvent {
  return { eventContext: undefined, headers: undefined, message: new Uint8Array(0) };
}

export const GroupMessageEvent = {
  encode(message: GroupMessageEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.eventContext !== undefined) {
      EventContext.encode(message.eventContext, writer.uint32(10).fork()).ldelim();
    }
    if (message.headers !== undefined) {
      MessageHeaders.encode(message.headers, writer.uint32(18).fork()).ldelim();
    }
    if (message.message.length !== 0) {
      writer.uint32(26).bytes(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupMessageEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupMessageEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.eventContext = EventContext.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.headers = MessageHeaders.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.message = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupMessageEvent {
    return {
      eventContext: isSet(object.eventContext) ? EventContext.fromJSON(object.eventContext) : undefined,
      headers: isSet(object.headers) ? MessageHeaders.fromJSON(object.headers) : undefined,
      message: isSet(object.message) ? bytesFromBase64(object.message) : new Uint8Array(0),
    };
  },

  toJSON(message: GroupMessageEvent): unknown {
    const obj: any = {};
    if (message.eventContext !== undefined) {
      obj.eventContext = EventContext.toJSON(message.eventContext);
    }
    if (message.headers !== undefined) {
      obj.headers = MessageHeaders.toJSON(message.headers);
    }
    if (message.message.length !== 0) {
      obj.message = base64FromBytes(message.message);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupMessageEvent>, I>>(base?: I): GroupMessageEvent {
    return GroupMessageEvent.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupMessageEvent>, I>>(object: I): GroupMessageEvent {
    const message = createBaseGroupMessageEvent();
    message.eventContext = (object.eventContext !== undefined && object.eventContext !== null)
      ? EventContext.fromPartial(object.eventContext)
      : undefined;
    message.headers = (object.headers !== undefined && object.headers !== null)
      ? MessageHeaders.fromPartial(object.headers)
      : undefined;
    message.message = object.message ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupMetadataList(): GroupMetadataList {
  return {};
}

export const GroupMetadataList = {
  encode(_: GroupMetadataList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupMetadataList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupMetadataList();
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

  fromJSON(_: any): GroupMetadataList {
    return {};
  },

  toJSON(_: GroupMetadataList): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupMetadataList>, I>>(base?: I): GroupMetadataList {
    return GroupMetadataList.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupMetadataList>, I>>(_: I): GroupMetadataList {
    const message = createBaseGroupMetadataList();
    return message;
  },
};

function createBaseGroupMetadataList_Request(): GroupMetadataList_Request {
  return {
    groupPk: new Uint8Array(0),
    sinceId: new Uint8Array(0),
    sinceNow: false,
    untilId: new Uint8Array(0),
    untilNow: false,
    reverseOrder: false,
  };
}

export const GroupMetadataList_Request = {
  encode(message: GroupMetadataList_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    if (message.sinceId.length !== 0) {
      writer.uint32(18).bytes(message.sinceId);
    }
    if (message.sinceNow === true) {
      writer.uint32(24).bool(message.sinceNow);
    }
    if (message.untilId.length !== 0) {
      writer.uint32(34).bytes(message.untilId);
    }
    if (message.untilNow === true) {
      writer.uint32(40).bool(message.untilNow);
    }
    if (message.reverseOrder === true) {
      writer.uint32(48).bool(message.reverseOrder);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupMetadataList_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupMetadataList_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.sinceId = reader.bytes();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.sinceNow = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.untilId = reader.bytes();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.untilNow = reader.bool();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.reverseOrder = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupMetadataList_Request {
    return {
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
      sinceId: isSet(object.sinceId) ? bytesFromBase64(object.sinceId) : new Uint8Array(0),
      sinceNow: isSet(object.sinceNow) ? globalThis.Boolean(object.sinceNow) : false,
      untilId: isSet(object.untilId) ? bytesFromBase64(object.untilId) : new Uint8Array(0),
      untilNow: isSet(object.untilNow) ? globalThis.Boolean(object.untilNow) : false,
      reverseOrder: isSet(object.reverseOrder) ? globalThis.Boolean(object.reverseOrder) : false,
    };
  },

  toJSON(message: GroupMetadataList_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    if (message.sinceId.length !== 0) {
      obj.sinceId = base64FromBytes(message.sinceId);
    }
    if (message.sinceNow === true) {
      obj.sinceNow = message.sinceNow;
    }
    if (message.untilId.length !== 0) {
      obj.untilId = base64FromBytes(message.untilId);
    }
    if (message.untilNow === true) {
      obj.untilNow = message.untilNow;
    }
    if (message.reverseOrder === true) {
      obj.reverseOrder = message.reverseOrder;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupMetadataList_Request>, I>>(base?: I): GroupMetadataList_Request {
    return GroupMetadataList_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupMetadataList_Request>, I>>(object: I): GroupMetadataList_Request {
    const message = createBaseGroupMetadataList_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    message.sinceId = object.sinceId ?? new Uint8Array(0);
    message.sinceNow = object.sinceNow ?? false;
    message.untilId = object.untilId ?? new Uint8Array(0);
    message.untilNow = object.untilNow ?? false;
    message.reverseOrder = object.reverseOrder ?? false;
    return message;
  },
};

function createBaseGroupMessageList(): GroupMessageList {
  return {};
}

export const GroupMessageList = {
  encode(_: GroupMessageList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupMessageList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupMessageList();
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

  fromJSON(_: any): GroupMessageList {
    return {};
  },

  toJSON(_: GroupMessageList): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupMessageList>, I>>(base?: I): GroupMessageList {
    return GroupMessageList.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupMessageList>, I>>(_: I): GroupMessageList {
    const message = createBaseGroupMessageList();
    return message;
  },
};

function createBaseGroupMessageList_Request(): GroupMessageList_Request {
  return {
    groupPk: new Uint8Array(0),
    sinceId: new Uint8Array(0),
    sinceNow: false,
    untilId: new Uint8Array(0),
    untilNow: false,
    reverseOrder: false,
  };
}

export const GroupMessageList_Request = {
  encode(message: GroupMessageList_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    if (message.sinceId.length !== 0) {
      writer.uint32(18).bytes(message.sinceId);
    }
    if (message.sinceNow === true) {
      writer.uint32(24).bool(message.sinceNow);
    }
    if (message.untilId.length !== 0) {
      writer.uint32(34).bytes(message.untilId);
    }
    if (message.untilNow === true) {
      writer.uint32(40).bool(message.untilNow);
    }
    if (message.reverseOrder === true) {
      writer.uint32(48).bool(message.reverseOrder);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupMessageList_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupMessageList_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.sinceId = reader.bytes();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.sinceNow = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.untilId = reader.bytes();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.untilNow = reader.bool();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.reverseOrder = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupMessageList_Request {
    return {
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
      sinceId: isSet(object.sinceId) ? bytesFromBase64(object.sinceId) : new Uint8Array(0),
      sinceNow: isSet(object.sinceNow) ? globalThis.Boolean(object.sinceNow) : false,
      untilId: isSet(object.untilId) ? bytesFromBase64(object.untilId) : new Uint8Array(0),
      untilNow: isSet(object.untilNow) ? globalThis.Boolean(object.untilNow) : false,
      reverseOrder: isSet(object.reverseOrder) ? globalThis.Boolean(object.reverseOrder) : false,
    };
  },

  toJSON(message: GroupMessageList_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    if (message.sinceId.length !== 0) {
      obj.sinceId = base64FromBytes(message.sinceId);
    }
    if (message.sinceNow === true) {
      obj.sinceNow = message.sinceNow;
    }
    if (message.untilId.length !== 0) {
      obj.untilId = base64FromBytes(message.untilId);
    }
    if (message.untilNow === true) {
      obj.untilNow = message.untilNow;
    }
    if (message.reverseOrder === true) {
      obj.reverseOrder = message.reverseOrder;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupMessageList_Request>, I>>(base?: I): GroupMessageList_Request {
    return GroupMessageList_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupMessageList_Request>, I>>(object: I): GroupMessageList_Request {
    const message = createBaseGroupMessageList_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    message.sinceId = object.sinceId ?? new Uint8Array(0);
    message.sinceNow = object.sinceNow ?? false;
    message.untilId = object.untilId ?? new Uint8Array(0);
    message.untilNow = object.untilNow ?? false;
    message.reverseOrder = object.reverseOrder ?? false;
    return message;
  },
};

function createBaseGroupInfo(): GroupInfo {
  return {};
}

export const GroupInfo = {
  encode(_: GroupInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupInfo();
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

  fromJSON(_: any): GroupInfo {
    return {};
  },

  toJSON(_: GroupInfo): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupInfo>, I>>(base?: I): GroupInfo {
    return GroupInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupInfo>, I>>(_: I): GroupInfo {
    const message = createBaseGroupInfo();
    return message;
  },
};

function createBaseGroupInfo_Request(): GroupInfo_Request {
  return { groupPk: new Uint8Array(0), contactPk: new Uint8Array(0) };
}

export const GroupInfo_Request = {
  encode(message: GroupInfo_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    if (message.contactPk.length !== 0) {
      writer.uint32(18).bytes(message.contactPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupInfo_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupInfo_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupInfo_Request {
    return {
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
      contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0),
    };
  },

  toJSON(message: GroupInfo_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupInfo_Request>, I>>(base?: I): GroupInfo_Request {
    return GroupInfo_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupInfo_Request>, I>>(object: I): GroupInfo_Request {
    const message = createBaseGroupInfo_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupInfo_Reply(): GroupInfo_Reply {
  return { group: undefined, memberPk: new Uint8Array(0), devicePk: new Uint8Array(0) };
}

export const GroupInfo_Reply = {
  encode(message: GroupInfo_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.group !== undefined) {
      Group.encode(message.group, writer.uint32(10).fork()).ldelim();
    }
    if (message.memberPk.length !== 0) {
      writer.uint32(18).bytes(message.memberPk);
    }
    if (message.devicePk.length !== 0) {
      writer.uint32(26).bytes(message.devicePk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupInfo_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupInfo_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.group = Group.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.memberPk = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupInfo_Reply {
    return {
      group: isSet(object.group) ? Group.fromJSON(object.group) : undefined,
      memberPk: isSet(object.memberPk) ? bytesFromBase64(object.memberPk) : new Uint8Array(0),
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
    };
  },

  toJSON(message: GroupInfo_Reply): unknown {
    const obj: any = {};
    if (message.group !== undefined) {
      obj.group = Group.toJSON(message.group);
    }
    if (message.memberPk.length !== 0) {
      obj.memberPk = base64FromBytes(message.memberPk);
    }
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupInfo_Reply>, I>>(base?: I): GroupInfo_Reply {
    return GroupInfo_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupInfo_Reply>, I>>(object: I): GroupInfo_Reply {
    const message = createBaseGroupInfo_Reply();
    message.group = (object.group !== undefined && object.group !== null) ? Group.fromPartial(object.group) : undefined;
    message.memberPk = object.memberPk ?? new Uint8Array(0);
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseActivateGroup(): ActivateGroup {
  return {};
}

export const ActivateGroup = {
  encode(_: ActivateGroup, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActivateGroup {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivateGroup();
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

  fromJSON(_: any): ActivateGroup {
    return {};
  },

  toJSON(_: ActivateGroup): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ActivateGroup>, I>>(base?: I): ActivateGroup {
    return ActivateGroup.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActivateGroup>, I>>(_: I): ActivateGroup {
    const message = createBaseActivateGroup();
    return message;
  },
};

function createBaseActivateGroup_Request(): ActivateGroup_Request {
  return { groupPk: new Uint8Array(0), localOnly: false };
}

export const ActivateGroup_Request = {
  encode(message: ActivateGroup_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    if (message.localOnly === true) {
      writer.uint32(16).bool(message.localOnly);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActivateGroup_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivateGroup_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.localOnly = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ActivateGroup_Request {
    return {
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
      localOnly: isSet(object.localOnly) ? globalThis.Boolean(object.localOnly) : false,
    };
  },

  toJSON(message: ActivateGroup_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    if (message.localOnly === true) {
      obj.localOnly = message.localOnly;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActivateGroup_Request>, I>>(base?: I): ActivateGroup_Request {
    return ActivateGroup_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActivateGroup_Request>, I>>(object: I): ActivateGroup_Request {
    const message = createBaseActivateGroup_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    message.localOnly = object.localOnly ?? false;
    return message;
  },
};

function createBaseActivateGroup_Reply(): ActivateGroup_Reply {
  return {};
}

export const ActivateGroup_Reply = {
  encode(_: ActivateGroup_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActivateGroup_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivateGroup_Reply();
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

  fromJSON(_: any): ActivateGroup_Reply {
    return {};
  },

  toJSON(_: ActivateGroup_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ActivateGroup_Reply>, I>>(base?: I): ActivateGroup_Reply {
    return ActivateGroup_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActivateGroup_Reply>, I>>(_: I): ActivateGroup_Reply {
    const message = createBaseActivateGroup_Reply();
    return message;
  },
};

function createBaseDeactivateGroup(): DeactivateGroup {
  return {};
}

export const DeactivateGroup = {
  encode(_: DeactivateGroup, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeactivateGroup {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeactivateGroup();
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

  fromJSON(_: any): DeactivateGroup {
    return {};
  },

  toJSON(_: DeactivateGroup): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeactivateGroup>, I>>(base?: I): DeactivateGroup {
    return DeactivateGroup.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeactivateGroup>, I>>(_: I): DeactivateGroup {
    const message = createBaseDeactivateGroup();
    return message;
  },
};

function createBaseDeactivateGroup_Request(): DeactivateGroup_Request {
  return { groupPk: new Uint8Array(0) };
}

export const DeactivateGroup_Request = {
  encode(message: DeactivateGroup_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeactivateGroup_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeactivateGroup_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeactivateGroup_Request {
    return { groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0) };
  },

  toJSON(message: DeactivateGroup_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeactivateGroup_Request>, I>>(base?: I): DeactivateGroup_Request {
    return DeactivateGroup_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeactivateGroup_Request>, I>>(object: I): DeactivateGroup_Request {
    const message = createBaseDeactivateGroup_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseDeactivateGroup_Reply(): DeactivateGroup_Reply {
  return {};
}

export const DeactivateGroup_Reply = {
  encode(_: DeactivateGroup_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeactivateGroup_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeactivateGroup_Reply();
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

  fromJSON(_: any): DeactivateGroup_Reply {
    return {};
  },

  toJSON(_: DeactivateGroup_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeactivateGroup_Reply>, I>>(base?: I): DeactivateGroup_Reply {
    return DeactivateGroup_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeactivateGroup_Reply>, I>>(_: I): DeactivateGroup_Reply {
    const message = createBaseDeactivateGroup_Reply();
    return message;
  },
};

function createBaseGroupDeviceStatus(): GroupDeviceStatus {
  return {};
}

export const GroupDeviceStatus = {
  encode(_: GroupDeviceStatus, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupDeviceStatus {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupDeviceStatus();
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

  fromJSON(_: any): GroupDeviceStatus {
    return {};
  },

  toJSON(_: GroupDeviceStatus): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupDeviceStatus>, I>>(base?: I): GroupDeviceStatus {
    return GroupDeviceStatus.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupDeviceStatus>, I>>(_: I): GroupDeviceStatus {
    const message = createBaseGroupDeviceStatus();
    return message;
  },
};

function createBaseGroupDeviceStatus_Request(): GroupDeviceStatus_Request {
  return { groupPk: new Uint8Array(0) };
}

export const GroupDeviceStatus_Request = {
  encode(message: GroupDeviceStatus_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupDeviceStatus_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupDeviceStatus_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupDeviceStatus_Request {
    return { groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0) };
  },

  toJSON(message: GroupDeviceStatus_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupDeviceStatus_Request>, I>>(base?: I): GroupDeviceStatus_Request {
    return GroupDeviceStatus_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupDeviceStatus_Request>, I>>(object: I): GroupDeviceStatus_Request {
    const message = createBaseGroupDeviceStatus_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupDeviceStatus_Reply(): GroupDeviceStatus_Reply {
  return { type: 0, event: new Uint8Array(0) };
}

export const GroupDeviceStatus_Reply = {
  encode(message: GroupDeviceStatus_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.event.length !== 0) {
      writer.uint32(18).bytes(message.event);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupDeviceStatus_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupDeviceStatus_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.event = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupDeviceStatus_Reply {
    return {
      type: isSet(object.type) ? groupDeviceStatus_TypeFromJSON(object.type) : 0,
      event: isSet(object.event) ? bytesFromBase64(object.event) : new Uint8Array(0),
    };
  },

  toJSON(message: GroupDeviceStatus_Reply): unknown {
    const obj: any = {};
    if (message.type !== 0) {
      obj.type = groupDeviceStatus_TypeToJSON(message.type);
    }
    if (message.event.length !== 0) {
      obj.event = base64FromBytes(message.event);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupDeviceStatus_Reply>, I>>(base?: I): GroupDeviceStatus_Reply {
    return GroupDeviceStatus_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupDeviceStatus_Reply>, I>>(object: I): GroupDeviceStatus_Reply {
    const message = createBaseGroupDeviceStatus_Reply();
    message.type = object.type ?? 0;
    message.event = object.event ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGroupDeviceStatus_Reply_PeerConnected(): GroupDeviceStatus_Reply_PeerConnected {
  return { peerId: "", devicePk: new Uint8Array(0), transports: [], maddrs: [] };
}

export const GroupDeviceStatus_Reply_PeerConnected = {
  encode(message: GroupDeviceStatus_Reply_PeerConnected, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.peerId !== "") {
      writer.uint32(10).string(message.peerId);
    }
    if (message.devicePk.length !== 0) {
      writer.uint32(18).bytes(message.devicePk);
    }
    writer.uint32(26).fork();
    for (const v of message.transports) {
      writer.int32(v);
    }
    writer.ldelim();
    for (const v of message.maddrs) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupDeviceStatus_Reply_PeerConnected {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupDeviceStatus_Reply_PeerConnected();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.peerId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 3:
          if (tag === 24) {
            message.transports.push(reader.int32() as any);

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.transports.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.maddrs.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupDeviceStatus_Reply_PeerConnected {
    return {
      peerId: isSet(object.peerId) ? globalThis.String(object.peerId) : "",
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      transports: globalThis.Array.isArray(object?.transports)
        ? object.transports.map((e: any) => groupDeviceStatus_TransportFromJSON(e))
        : [],
      maddrs: globalThis.Array.isArray(object?.maddrs) ? object.maddrs.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: GroupDeviceStatus_Reply_PeerConnected): unknown {
    const obj: any = {};
    if (message.peerId !== "") {
      obj.peerId = message.peerId;
    }
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.transports?.length) {
      obj.transports = message.transports.map((e) => groupDeviceStatus_TransportToJSON(e));
    }
    if (message.maddrs?.length) {
      obj.maddrs = message.maddrs;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupDeviceStatus_Reply_PeerConnected>, I>>(
    base?: I,
  ): GroupDeviceStatus_Reply_PeerConnected {
    return GroupDeviceStatus_Reply_PeerConnected.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupDeviceStatus_Reply_PeerConnected>, I>>(
    object: I,
  ): GroupDeviceStatus_Reply_PeerConnected {
    const message = createBaseGroupDeviceStatus_Reply_PeerConnected();
    message.peerId = object.peerId ?? "";
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.transports = object.transports?.map((e) => e) || [];
    message.maddrs = object.maddrs?.map((e) => e) || [];
    return message;
  },
};

function createBaseGroupDeviceStatus_Reply_PeerReconnecting(): GroupDeviceStatus_Reply_PeerReconnecting {
  return { peerId: "" };
}

export const GroupDeviceStatus_Reply_PeerReconnecting = {
  encode(message: GroupDeviceStatus_Reply_PeerReconnecting, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.peerId !== "") {
      writer.uint32(10).string(message.peerId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupDeviceStatus_Reply_PeerReconnecting {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupDeviceStatus_Reply_PeerReconnecting();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.peerId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupDeviceStatus_Reply_PeerReconnecting {
    return { peerId: isSet(object.peerId) ? globalThis.String(object.peerId) : "" };
  },

  toJSON(message: GroupDeviceStatus_Reply_PeerReconnecting): unknown {
    const obj: any = {};
    if (message.peerId !== "") {
      obj.peerId = message.peerId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupDeviceStatus_Reply_PeerReconnecting>, I>>(
    base?: I,
  ): GroupDeviceStatus_Reply_PeerReconnecting {
    return GroupDeviceStatus_Reply_PeerReconnecting.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupDeviceStatus_Reply_PeerReconnecting>, I>>(
    object: I,
  ): GroupDeviceStatus_Reply_PeerReconnecting {
    const message = createBaseGroupDeviceStatus_Reply_PeerReconnecting();
    message.peerId = object.peerId ?? "";
    return message;
  },
};

function createBaseGroupDeviceStatus_Reply_PeerDisconnected(): GroupDeviceStatus_Reply_PeerDisconnected {
  return { peerId: "" };
}

export const GroupDeviceStatus_Reply_PeerDisconnected = {
  encode(message: GroupDeviceStatus_Reply_PeerDisconnected, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.peerId !== "") {
      writer.uint32(10).string(message.peerId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupDeviceStatus_Reply_PeerDisconnected {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupDeviceStatus_Reply_PeerDisconnected();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.peerId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GroupDeviceStatus_Reply_PeerDisconnected {
    return { peerId: isSet(object.peerId) ? globalThis.String(object.peerId) : "" };
  },

  toJSON(message: GroupDeviceStatus_Reply_PeerDisconnected): unknown {
    const obj: any = {};
    if (message.peerId !== "") {
      obj.peerId = message.peerId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupDeviceStatus_Reply_PeerDisconnected>, I>>(
    base?: I,
  ): GroupDeviceStatus_Reply_PeerDisconnected {
    return GroupDeviceStatus_Reply_PeerDisconnected.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GroupDeviceStatus_Reply_PeerDisconnected>, I>>(
    object: I,
  ): GroupDeviceStatus_Reply_PeerDisconnected {
    const message = createBaseGroupDeviceStatus_Reply_PeerDisconnected();
    message.peerId = object.peerId ?? "";
    return message;
  },
};

function createBaseDebugListGroups(): DebugListGroups {
  return {};
}

export const DebugListGroups = {
  encode(_: DebugListGroups, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DebugListGroups {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDebugListGroups();
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

  fromJSON(_: any): DebugListGroups {
    return {};
  },

  toJSON(_: DebugListGroups): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DebugListGroups>, I>>(base?: I): DebugListGroups {
    return DebugListGroups.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DebugListGroups>, I>>(_: I): DebugListGroups {
    const message = createBaseDebugListGroups();
    return message;
  },
};

function createBaseDebugListGroups_Request(): DebugListGroups_Request {
  return {};
}

export const DebugListGroups_Request = {
  encode(_: DebugListGroups_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DebugListGroups_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDebugListGroups_Request();
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

  fromJSON(_: any): DebugListGroups_Request {
    return {};
  },

  toJSON(_: DebugListGroups_Request): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DebugListGroups_Request>, I>>(base?: I): DebugListGroups_Request {
    return DebugListGroups_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DebugListGroups_Request>, I>>(_: I): DebugListGroups_Request {
    const message = createBaseDebugListGroups_Request();
    return message;
  },
};

function createBaseDebugListGroups_Reply(): DebugListGroups_Reply {
  return { groupPk: new Uint8Array(0), groupType: 0, contactPk: new Uint8Array(0) };
}

export const DebugListGroups_Reply = {
  encode(message: DebugListGroups_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    if (message.groupType !== 0) {
      writer.uint32(16).int32(message.groupType);
    }
    if (message.contactPk.length !== 0) {
      writer.uint32(26).bytes(message.contactPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DebugListGroups_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDebugListGroups_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.groupType = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DebugListGroups_Reply {
    return {
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
      groupType: isSet(object.groupType) ? groupTypeFromJSON(object.groupType) : 0,
      contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0),
    };
  },

  toJSON(message: DebugListGroups_Reply): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    if (message.groupType !== 0) {
      obj.groupType = groupTypeToJSON(message.groupType);
    }
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DebugListGroups_Reply>, I>>(base?: I): DebugListGroups_Reply {
    return DebugListGroups_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DebugListGroups_Reply>, I>>(object: I): DebugListGroups_Reply {
    const message = createBaseDebugListGroups_Reply();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    message.groupType = object.groupType ?? 0;
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseDebugInspectGroupStore(): DebugInspectGroupStore {
  return {};
}

export const DebugInspectGroupStore = {
  encode(_: DebugInspectGroupStore, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DebugInspectGroupStore {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDebugInspectGroupStore();
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

  fromJSON(_: any): DebugInspectGroupStore {
    return {};
  },

  toJSON(_: DebugInspectGroupStore): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DebugInspectGroupStore>, I>>(base?: I): DebugInspectGroupStore {
    return DebugInspectGroupStore.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DebugInspectGroupStore>, I>>(_: I): DebugInspectGroupStore {
    const message = createBaseDebugInspectGroupStore();
    return message;
  },
};

function createBaseDebugInspectGroupStore_Request(): DebugInspectGroupStore_Request {
  return { groupPk: new Uint8Array(0), logType: 0 };
}

export const DebugInspectGroupStore_Request = {
  encode(message: DebugInspectGroupStore_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    if (message.logType !== 0) {
      writer.uint32(16).int32(message.logType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DebugInspectGroupStore_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDebugInspectGroupStore_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.logType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DebugInspectGroupStore_Request {
    return {
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
      logType: isSet(object.logType) ? debugInspectGroupLogTypeFromJSON(object.logType) : 0,
    };
  },

  toJSON(message: DebugInspectGroupStore_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    if (message.logType !== 0) {
      obj.logType = debugInspectGroupLogTypeToJSON(message.logType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DebugInspectGroupStore_Request>, I>>(base?: I): DebugInspectGroupStore_Request {
    return DebugInspectGroupStore_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DebugInspectGroupStore_Request>, I>>(
    object: I,
  ): DebugInspectGroupStore_Request {
    const message = createBaseDebugInspectGroupStore_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    message.logType = object.logType ?? 0;
    return message;
  },
};

function createBaseDebugInspectGroupStore_Reply(): DebugInspectGroupStore_Reply {
  return {
    cid: new Uint8Array(0),
    parentCids: [],
    metadataEventType: 0,
    devicePk: new Uint8Array(0),
    payload: new Uint8Array(0),
  };
}

export const DebugInspectGroupStore_Reply = {
  encode(message: DebugInspectGroupStore_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cid.length !== 0) {
      writer.uint32(10).bytes(message.cid);
    }
    for (const v of message.parentCids) {
      writer.uint32(18).bytes(v!);
    }
    if (message.metadataEventType !== 0) {
      writer.uint32(24).int32(message.metadataEventType);
    }
    if (message.devicePk.length !== 0) {
      writer.uint32(34).bytes(message.devicePk);
    }
    if (message.payload.length !== 0) {
      writer.uint32(50).bytes(message.payload);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DebugInspectGroupStore_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDebugInspectGroupStore_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cid = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.parentCids.push(reader.bytes());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.metadataEventType = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.payload = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DebugInspectGroupStore_Reply {
    return {
      cid: isSet(object.cid) ? bytesFromBase64(object.cid) : new Uint8Array(0),
      parentCids: globalThis.Array.isArray(object?.parentCids)
        ? object.parentCids.map((e: any) => bytesFromBase64(e))
        : [],
      metadataEventType: isSet(object.metadataEventType) ? eventTypeFromJSON(object.metadataEventType) : 0,
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      payload: isSet(object.payload) ? bytesFromBase64(object.payload) : new Uint8Array(0),
    };
  },

  toJSON(message: DebugInspectGroupStore_Reply): unknown {
    const obj: any = {};
    if (message.cid.length !== 0) {
      obj.cid = base64FromBytes(message.cid);
    }
    if (message.parentCids?.length) {
      obj.parentCids = message.parentCids.map((e) => base64FromBytes(e));
    }
    if (message.metadataEventType !== 0) {
      obj.metadataEventType = eventTypeToJSON(message.metadataEventType);
    }
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.payload.length !== 0) {
      obj.payload = base64FromBytes(message.payload);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DebugInspectGroupStore_Reply>, I>>(base?: I): DebugInspectGroupStore_Reply {
    return DebugInspectGroupStore_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DebugInspectGroupStore_Reply>, I>>(object: I): DebugInspectGroupStore_Reply {
    const message = createBaseDebugInspectGroupStore_Reply();
    message.cid = object.cid ?? new Uint8Array(0);
    message.parentCids = object.parentCids?.map((e) => e) || [];
    message.metadataEventType = object.metadataEventType ?? 0;
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.payload = object.payload ?? new Uint8Array(0);
    return message;
  },
};

function createBaseDebugGroup(): DebugGroup {
  return {};
}

export const DebugGroup = {
  encode(_: DebugGroup, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DebugGroup {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDebugGroup();
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

  fromJSON(_: any): DebugGroup {
    return {};
  },

  toJSON(_: DebugGroup): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DebugGroup>, I>>(base?: I): DebugGroup {
    return DebugGroup.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DebugGroup>, I>>(_: I): DebugGroup {
    const message = createBaseDebugGroup();
    return message;
  },
};

function createBaseDebugGroup_Request(): DebugGroup_Request {
  return { groupPk: new Uint8Array(0) };
}

export const DebugGroup_Request = {
  encode(message: DebugGroup_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DebugGroup_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDebugGroup_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DebugGroup_Request {
    return { groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0) };
  },

  toJSON(message: DebugGroup_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DebugGroup_Request>, I>>(base?: I): DebugGroup_Request {
    return DebugGroup_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DebugGroup_Request>, I>>(object: I): DebugGroup_Request {
    const message = createBaseDebugGroup_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    return message;
  },
};

function createBaseDebugGroup_Reply(): DebugGroup_Reply {
  return { peerIds: [] };
}

export const DebugGroup_Reply = {
  encode(message: DebugGroup_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.peerIds) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DebugGroup_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDebugGroup_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.peerIds.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DebugGroup_Reply {
    return {
      peerIds: globalThis.Array.isArray(object?.peerIds) ? object.peerIds.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: DebugGroup_Reply): unknown {
    const obj: any = {};
    if (message.peerIds?.length) {
      obj.peerIds = message.peerIds;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DebugGroup_Reply>, I>>(base?: I): DebugGroup_Reply {
    return DebugGroup_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DebugGroup_Reply>, I>>(object: I): DebugGroup_Reply {
    const message = createBaseDebugGroup_Reply();
    message.peerIds = object.peerIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseShareableContact(): ShareableContact {
  return { pk: new Uint8Array(0), publicRendezvousSeed: new Uint8Array(0), metadata: new Uint8Array(0) };
}

export const ShareableContact = {
  encode(message: ShareableContact, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pk.length !== 0) {
      writer.uint32(10).bytes(message.pk);
    }
    if (message.publicRendezvousSeed.length !== 0) {
      writer.uint32(18).bytes(message.publicRendezvousSeed);
    }
    if (message.metadata.length !== 0) {
      writer.uint32(26).bytes(message.metadata);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ShareableContact {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseShareableContact();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.publicRendezvousSeed = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.metadata = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ShareableContact {
    return {
      pk: isSet(object.pk) ? bytesFromBase64(object.pk) : new Uint8Array(0),
      publicRendezvousSeed: isSet(object.publicRendezvousSeed)
        ? bytesFromBase64(object.publicRendezvousSeed)
        : new Uint8Array(0),
      metadata: isSet(object.metadata) ? bytesFromBase64(object.metadata) : new Uint8Array(0),
    };
  },

  toJSON(message: ShareableContact): unknown {
    const obj: any = {};
    if (message.pk.length !== 0) {
      obj.pk = base64FromBytes(message.pk);
    }
    if (message.publicRendezvousSeed.length !== 0) {
      obj.publicRendezvousSeed = base64FromBytes(message.publicRendezvousSeed);
    }
    if (message.metadata.length !== 0) {
      obj.metadata = base64FromBytes(message.metadata);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ShareableContact>, I>>(base?: I): ShareableContact {
    return ShareableContact.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ShareableContact>, I>>(object: I): ShareableContact {
    const message = createBaseShareableContact();
    message.pk = object.pk ?? new Uint8Array(0);
    message.publicRendezvousSeed = object.publicRendezvousSeed ?? new Uint8Array(0);
    message.metadata = object.metadata ?? new Uint8Array(0);
    return message;
  },
};

function createBaseServiceTokenSupportedService(): ServiceTokenSupportedService {
  return { serviceType: "", serviceEndpoint: "" };
}

export const ServiceTokenSupportedService = {
  encode(message: ServiceTokenSupportedService, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serviceType !== "") {
      writer.uint32(10).string(message.serviceType);
    }
    if (message.serviceEndpoint !== "") {
      writer.uint32(18).string(message.serviceEndpoint);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServiceTokenSupportedService {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServiceTokenSupportedService();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.serviceType = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.serviceEndpoint = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServiceTokenSupportedService {
    return {
      serviceType: isSet(object.serviceType) ? globalThis.String(object.serviceType) : "",
      serviceEndpoint: isSet(object.serviceEndpoint) ? globalThis.String(object.serviceEndpoint) : "",
    };
  },

  toJSON(message: ServiceTokenSupportedService): unknown {
    const obj: any = {};
    if (message.serviceType !== "") {
      obj.serviceType = message.serviceType;
    }
    if (message.serviceEndpoint !== "") {
      obj.serviceEndpoint = message.serviceEndpoint;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ServiceTokenSupportedService>, I>>(base?: I): ServiceTokenSupportedService {
    return ServiceTokenSupportedService.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServiceTokenSupportedService>, I>>(object: I): ServiceTokenSupportedService {
    const message = createBaseServiceTokenSupportedService();
    message.serviceType = object.serviceType ?? "";
    message.serviceEndpoint = object.serviceEndpoint ?? "";
    return message;
  },
};

function createBaseServiceToken(): ServiceToken {
  return { token: "", authenticationUrl: "", supportedServices: [], expiration: 0 };
}

export const ServiceToken = {
  encode(message: ServiceToken, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    if (message.authenticationUrl !== "") {
      writer.uint32(18).string(message.authenticationUrl);
    }
    for (const v of message.supportedServices) {
      ServiceTokenSupportedService.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.expiration !== 0) {
      writer.uint32(32).int64(message.expiration);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServiceToken {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServiceToken();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.token = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.authenticationUrl = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.supportedServices.push(ServiceTokenSupportedService.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.expiration = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServiceToken {
    return {
      token: isSet(object.token) ? globalThis.String(object.token) : "",
      authenticationUrl: isSet(object.authenticationUrl) ? globalThis.String(object.authenticationUrl) : "",
      supportedServices: globalThis.Array.isArray(object?.supportedServices)
        ? object.supportedServices.map((e: any) => ServiceTokenSupportedService.fromJSON(e))
        : [],
      expiration: isSet(object.expiration) ? globalThis.Number(object.expiration) : 0,
    };
  },

  toJSON(message: ServiceToken): unknown {
    const obj: any = {};
    if (message.token !== "") {
      obj.token = message.token;
    }
    if (message.authenticationUrl !== "") {
      obj.authenticationUrl = message.authenticationUrl;
    }
    if (message.supportedServices?.length) {
      obj.supportedServices = message.supportedServices.map((e) => ServiceTokenSupportedService.toJSON(e));
    }
    if (message.expiration !== 0) {
      obj.expiration = Math.round(message.expiration);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ServiceToken>, I>>(base?: I): ServiceToken {
    return ServiceToken.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServiceToken>, I>>(object: I): ServiceToken {
    const message = createBaseServiceToken();
    message.token = object.token ?? "";
    message.authenticationUrl = object.authenticationUrl ?? "";
    message.supportedServices = object.supportedServices?.map((e) => ServiceTokenSupportedService.fromPartial(e)) || [];
    message.expiration = object.expiration ?? 0;
    return message;
  },
};

function createBaseCredentialVerificationServiceInitFlow(): CredentialVerificationServiceInitFlow {
  return {};
}

export const CredentialVerificationServiceInitFlow = {
  encode(_: CredentialVerificationServiceInitFlow, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CredentialVerificationServiceInitFlow {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredentialVerificationServiceInitFlow();
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

  fromJSON(_: any): CredentialVerificationServiceInitFlow {
    return {};
  },

  toJSON(_: CredentialVerificationServiceInitFlow): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CredentialVerificationServiceInitFlow>, I>>(
    base?: I,
  ): CredentialVerificationServiceInitFlow {
    return CredentialVerificationServiceInitFlow.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CredentialVerificationServiceInitFlow>, I>>(
    _: I,
  ): CredentialVerificationServiceInitFlow {
    const message = createBaseCredentialVerificationServiceInitFlow();
    return message;
  },
};

function createBaseCredentialVerificationServiceInitFlow_Request(): CredentialVerificationServiceInitFlow_Request {
  return { serviceUrl: "", publicKey: new Uint8Array(0), link: "" };
}

export const CredentialVerificationServiceInitFlow_Request = {
  encode(message: CredentialVerificationServiceInitFlow_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serviceUrl !== "") {
      writer.uint32(10).string(message.serviceUrl);
    }
    if (message.publicKey.length !== 0) {
      writer.uint32(18).bytes(message.publicKey);
    }
    if (message.link !== "") {
      writer.uint32(26).string(message.link);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CredentialVerificationServiceInitFlow_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredentialVerificationServiceInitFlow_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.serviceUrl = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.publicKey = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.link = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CredentialVerificationServiceInitFlow_Request {
    return {
      serviceUrl: isSet(object.serviceUrl) ? globalThis.String(object.serviceUrl) : "",
      publicKey: isSet(object.publicKey) ? bytesFromBase64(object.publicKey) : new Uint8Array(0),
      link: isSet(object.link) ? globalThis.String(object.link) : "",
    };
  },

  toJSON(message: CredentialVerificationServiceInitFlow_Request): unknown {
    const obj: any = {};
    if (message.serviceUrl !== "") {
      obj.serviceUrl = message.serviceUrl;
    }
    if (message.publicKey.length !== 0) {
      obj.publicKey = base64FromBytes(message.publicKey);
    }
    if (message.link !== "") {
      obj.link = message.link;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CredentialVerificationServiceInitFlow_Request>, I>>(
    base?: I,
  ): CredentialVerificationServiceInitFlow_Request {
    return CredentialVerificationServiceInitFlow_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CredentialVerificationServiceInitFlow_Request>, I>>(
    object: I,
  ): CredentialVerificationServiceInitFlow_Request {
    const message = createBaseCredentialVerificationServiceInitFlow_Request();
    message.serviceUrl = object.serviceUrl ?? "";
    message.publicKey = object.publicKey ?? new Uint8Array(0);
    message.link = object.link ?? "";
    return message;
  },
};

function createBaseCredentialVerificationServiceInitFlow_Reply(): CredentialVerificationServiceInitFlow_Reply {
  return { url: "", secureUrl: false };
}

export const CredentialVerificationServiceInitFlow_Reply = {
  encode(message: CredentialVerificationServiceInitFlow_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    if (message.secureUrl === true) {
      writer.uint32(16).bool(message.secureUrl);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CredentialVerificationServiceInitFlow_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredentialVerificationServiceInitFlow_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.url = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.secureUrl = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CredentialVerificationServiceInitFlow_Reply {
    return {
      url: isSet(object.url) ? globalThis.String(object.url) : "",
      secureUrl: isSet(object.secureUrl) ? globalThis.Boolean(object.secureUrl) : false,
    };
  },

  toJSON(message: CredentialVerificationServiceInitFlow_Reply): unknown {
    const obj: any = {};
    if (message.url !== "") {
      obj.url = message.url;
    }
    if (message.secureUrl === true) {
      obj.secureUrl = message.secureUrl;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CredentialVerificationServiceInitFlow_Reply>, I>>(
    base?: I,
  ): CredentialVerificationServiceInitFlow_Reply {
    return CredentialVerificationServiceInitFlow_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CredentialVerificationServiceInitFlow_Reply>, I>>(
    object: I,
  ): CredentialVerificationServiceInitFlow_Reply {
    const message = createBaseCredentialVerificationServiceInitFlow_Reply();
    message.url = object.url ?? "";
    message.secureUrl = object.secureUrl ?? false;
    return message;
  },
};

function createBaseCredentialVerificationServiceCompleteFlow(): CredentialVerificationServiceCompleteFlow {
  return {};
}

export const CredentialVerificationServiceCompleteFlow = {
  encode(_: CredentialVerificationServiceCompleteFlow, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CredentialVerificationServiceCompleteFlow {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredentialVerificationServiceCompleteFlow();
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

  fromJSON(_: any): CredentialVerificationServiceCompleteFlow {
    return {};
  },

  toJSON(_: CredentialVerificationServiceCompleteFlow): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CredentialVerificationServiceCompleteFlow>, I>>(
    base?: I,
  ): CredentialVerificationServiceCompleteFlow {
    return CredentialVerificationServiceCompleteFlow.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CredentialVerificationServiceCompleteFlow>, I>>(
    _: I,
  ): CredentialVerificationServiceCompleteFlow {
    const message = createBaseCredentialVerificationServiceCompleteFlow();
    return message;
  },
};

function createBaseCredentialVerificationServiceCompleteFlow_Request(): CredentialVerificationServiceCompleteFlow_Request {
  return { callbackUri: "" };
}

export const CredentialVerificationServiceCompleteFlow_Request = {
  encode(
    message: CredentialVerificationServiceCompleteFlow_Request,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.callbackUri !== "") {
      writer.uint32(10).string(message.callbackUri);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CredentialVerificationServiceCompleteFlow_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredentialVerificationServiceCompleteFlow_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.callbackUri = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CredentialVerificationServiceCompleteFlow_Request {
    return { callbackUri: isSet(object.callbackUri) ? globalThis.String(object.callbackUri) : "" };
  },

  toJSON(message: CredentialVerificationServiceCompleteFlow_Request): unknown {
    const obj: any = {};
    if (message.callbackUri !== "") {
      obj.callbackUri = message.callbackUri;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CredentialVerificationServiceCompleteFlow_Request>, I>>(
    base?: I,
  ): CredentialVerificationServiceCompleteFlow_Request {
    return CredentialVerificationServiceCompleteFlow_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CredentialVerificationServiceCompleteFlow_Request>, I>>(
    object: I,
  ): CredentialVerificationServiceCompleteFlow_Request {
    const message = createBaseCredentialVerificationServiceCompleteFlow_Request();
    message.callbackUri = object.callbackUri ?? "";
    return message;
  },
};

function createBaseCredentialVerificationServiceCompleteFlow_Reply(): CredentialVerificationServiceCompleteFlow_Reply {
  return { identifier: "" };
}

export const CredentialVerificationServiceCompleteFlow_Reply = {
  encode(
    message: CredentialVerificationServiceCompleteFlow_Reply,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CredentialVerificationServiceCompleteFlow_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredentialVerificationServiceCompleteFlow_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identifier = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CredentialVerificationServiceCompleteFlow_Reply {
    return { identifier: isSet(object.identifier) ? globalThis.String(object.identifier) : "" };
  },

  toJSON(message: CredentialVerificationServiceCompleteFlow_Reply): unknown {
    const obj: any = {};
    if (message.identifier !== "") {
      obj.identifier = message.identifier;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CredentialVerificationServiceCompleteFlow_Reply>, I>>(
    base?: I,
  ): CredentialVerificationServiceCompleteFlow_Reply {
    return CredentialVerificationServiceCompleteFlow_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CredentialVerificationServiceCompleteFlow_Reply>, I>>(
    object: I,
  ): CredentialVerificationServiceCompleteFlow_Reply {
    const message = createBaseCredentialVerificationServiceCompleteFlow_Reply();
    message.identifier = object.identifier ?? "";
    return message;
  },
};

function createBaseVerifiedCredentialsList(): VerifiedCredentialsList {
  return {};
}

export const VerifiedCredentialsList = {
  encode(_: VerifiedCredentialsList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VerifiedCredentialsList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerifiedCredentialsList();
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

  fromJSON(_: any): VerifiedCredentialsList {
    return {};
  },

  toJSON(_: VerifiedCredentialsList): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<VerifiedCredentialsList>, I>>(base?: I): VerifiedCredentialsList {
    return VerifiedCredentialsList.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VerifiedCredentialsList>, I>>(_: I): VerifiedCredentialsList {
    const message = createBaseVerifiedCredentialsList();
    return message;
  },
};

function createBaseVerifiedCredentialsList_Request(): VerifiedCredentialsList_Request {
  return { filterIdentifier: "", filterIssuer: "", excludeExpired: false };
}

export const VerifiedCredentialsList_Request = {
  encode(message: VerifiedCredentialsList_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.filterIdentifier !== "") {
      writer.uint32(10).string(message.filterIdentifier);
    }
    if (message.filterIssuer !== "") {
      writer.uint32(18).string(message.filterIssuer);
    }
    if (message.excludeExpired === true) {
      writer.uint32(24).bool(message.excludeExpired);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VerifiedCredentialsList_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerifiedCredentialsList_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.filterIdentifier = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.filterIssuer = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.excludeExpired = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VerifiedCredentialsList_Request {
    return {
      filterIdentifier: isSet(object.filterIdentifier) ? globalThis.String(object.filterIdentifier) : "",
      filterIssuer: isSet(object.filterIssuer) ? globalThis.String(object.filterIssuer) : "",
      excludeExpired: isSet(object.excludeExpired) ? globalThis.Boolean(object.excludeExpired) : false,
    };
  },

  toJSON(message: VerifiedCredentialsList_Request): unknown {
    const obj: any = {};
    if (message.filterIdentifier !== "") {
      obj.filterIdentifier = message.filterIdentifier;
    }
    if (message.filterIssuer !== "") {
      obj.filterIssuer = message.filterIssuer;
    }
    if (message.excludeExpired === true) {
      obj.excludeExpired = message.excludeExpired;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VerifiedCredentialsList_Request>, I>>(base?: I): VerifiedCredentialsList_Request {
    return VerifiedCredentialsList_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VerifiedCredentialsList_Request>, I>>(
    object: I,
  ): VerifiedCredentialsList_Request {
    const message = createBaseVerifiedCredentialsList_Request();
    message.filterIdentifier = object.filterIdentifier ?? "";
    message.filterIssuer = object.filterIssuer ?? "";
    message.excludeExpired = object.excludeExpired ?? false;
    return message;
  },
};

function createBaseVerifiedCredentialsList_Reply(): VerifiedCredentialsList_Reply {
  return { credential: undefined };
}

export const VerifiedCredentialsList_Reply = {
  encode(message: VerifiedCredentialsList_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.credential !== undefined) {
      AccountVerifiedCredentialRegistered.encode(message.credential, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VerifiedCredentialsList_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerifiedCredentialsList_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.credential = AccountVerifiedCredentialRegistered.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VerifiedCredentialsList_Reply {
    return {
      credential: isSet(object.credential)
        ? AccountVerifiedCredentialRegistered.fromJSON(object.credential)
        : undefined,
    };
  },

  toJSON(message: VerifiedCredentialsList_Reply): unknown {
    const obj: any = {};
    if (message.credential !== undefined) {
      obj.credential = AccountVerifiedCredentialRegistered.toJSON(message.credential);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VerifiedCredentialsList_Reply>, I>>(base?: I): VerifiedCredentialsList_Reply {
    return VerifiedCredentialsList_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VerifiedCredentialsList_Reply>, I>>(
    object: I,
  ): VerifiedCredentialsList_Reply {
    const message = createBaseVerifiedCredentialsList_Reply();
    message.credential = (object.credential !== undefined && object.credential !== null)
      ? AccountVerifiedCredentialRegistered.fromPartial(object.credential)
      : undefined;
    return message;
  },
};

function createBaseReplicationServiceRegisterGroup(): ReplicationServiceRegisterGroup {
  return {};
}

export const ReplicationServiceRegisterGroup = {
  encode(_: ReplicationServiceRegisterGroup, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReplicationServiceRegisterGroup {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReplicationServiceRegisterGroup();
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

  fromJSON(_: any): ReplicationServiceRegisterGroup {
    return {};
  },

  toJSON(_: ReplicationServiceRegisterGroup): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ReplicationServiceRegisterGroup>, I>>(base?: I): ReplicationServiceRegisterGroup {
    return ReplicationServiceRegisterGroup.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ReplicationServiceRegisterGroup>, I>>(_: I): ReplicationServiceRegisterGroup {
    const message = createBaseReplicationServiceRegisterGroup();
    return message;
  },
};

function createBaseReplicationServiceRegisterGroup_Request(): ReplicationServiceRegisterGroup_Request {
  return { groupPk: new Uint8Array(0), token: "", authenticationUrl: "", replicationServer: "" };
}

export const ReplicationServiceRegisterGroup_Request = {
  encode(message: ReplicationServiceRegisterGroup_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupPk.length !== 0) {
      writer.uint32(10).bytes(message.groupPk);
    }
    if (message.token !== "") {
      writer.uint32(18).string(message.token);
    }
    if (message.authenticationUrl !== "") {
      writer.uint32(26).string(message.authenticationUrl);
    }
    if (message.replicationServer !== "") {
      writer.uint32(34).string(message.replicationServer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReplicationServiceRegisterGroup_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReplicationServiceRegisterGroup_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.token = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.authenticationUrl = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.replicationServer = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReplicationServiceRegisterGroup_Request {
    return {
      groupPk: isSet(object.groupPk) ? bytesFromBase64(object.groupPk) : new Uint8Array(0),
      token: isSet(object.token) ? globalThis.String(object.token) : "",
      authenticationUrl: isSet(object.authenticationUrl) ? globalThis.String(object.authenticationUrl) : "",
      replicationServer: isSet(object.replicationServer) ? globalThis.String(object.replicationServer) : "",
    };
  },

  toJSON(message: ReplicationServiceRegisterGroup_Request): unknown {
    const obj: any = {};
    if (message.groupPk.length !== 0) {
      obj.groupPk = base64FromBytes(message.groupPk);
    }
    if (message.token !== "") {
      obj.token = message.token;
    }
    if (message.authenticationUrl !== "") {
      obj.authenticationUrl = message.authenticationUrl;
    }
    if (message.replicationServer !== "") {
      obj.replicationServer = message.replicationServer;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ReplicationServiceRegisterGroup_Request>, I>>(
    base?: I,
  ): ReplicationServiceRegisterGroup_Request {
    return ReplicationServiceRegisterGroup_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ReplicationServiceRegisterGroup_Request>, I>>(
    object: I,
  ): ReplicationServiceRegisterGroup_Request {
    const message = createBaseReplicationServiceRegisterGroup_Request();
    message.groupPk = object.groupPk ?? new Uint8Array(0);
    message.token = object.token ?? "";
    message.authenticationUrl = object.authenticationUrl ?? "";
    message.replicationServer = object.replicationServer ?? "";
    return message;
  },
};

function createBaseReplicationServiceRegisterGroup_Reply(): ReplicationServiceRegisterGroup_Reply {
  return {};
}

export const ReplicationServiceRegisterGroup_Reply = {
  encode(_: ReplicationServiceRegisterGroup_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReplicationServiceRegisterGroup_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReplicationServiceRegisterGroup_Reply();
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

  fromJSON(_: any): ReplicationServiceRegisterGroup_Reply {
    return {};
  },

  toJSON(_: ReplicationServiceRegisterGroup_Reply): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ReplicationServiceRegisterGroup_Reply>, I>>(
    base?: I,
  ): ReplicationServiceRegisterGroup_Reply {
    return ReplicationServiceRegisterGroup_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ReplicationServiceRegisterGroup_Reply>, I>>(
    _: I,
  ): ReplicationServiceRegisterGroup_Reply {
    const message = createBaseReplicationServiceRegisterGroup_Reply();
    return message;
  },
};

function createBaseReplicationServiceReplicateGroup(): ReplicationServiceReplicateGroup {
  return {};
}

export const ReplicationServiceReplicateGroup = {
  encode(_: ReplicationServiceReplicateGroup, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReplicationServiceReplicateGroup {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReplicationServiceReplicateGroup();
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

  fromJSON(_: any): ReplicationServiceReplicateGroup {
    return {};
  },

  toJSON(_: ReplicationServiceReplicateGroup): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ReplicationServiceReplicateGroup>, I>>(
    base?: I,
  ): ReplicationServiceReplicateGroup {
    return ReplicationServiceReplicateGroup.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ReplicationServiceReplicateGroup>, I>>(
    _: I,
  ): ReplicationServiceReplicateGroup {
    const message = createBaseReplicationServiceReplicateGroup();
    return message;
  },
};

function createBaseReplicationServiceReplicateGroup_Request(): ReplicationServiceReplicateGroup_Request {
  return { group: undefined };
}

export const ReplicationServiceReplicateGroup_Request = {
  encode(message: ReplicationServiceReplicateGroup_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.group !== undefined) {
      Group.encode(message.group, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReplicationServiceReplicateGroup_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReplicationServiceReplicateGroup_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.group = Group.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReplicationServiceReplicateGroup_Request {
    return { group: isSet(object.group) ? Group.fromJSON(object.group) : undefined };
  },

  toJSON(message: ReplicationServiceReplicateGroup_Request): unknown {
    const obj: any = {};
    if (message.group !== undefined) {
      obj.group = Group.toJSON(message.group);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ReplicationServiceReplicateGroup_Request>, I>>(
    base?: I,
  ): ReplicationServiceReplicateGroup_Request {
    return ReplicationServiceReplicateGroup_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ReplicationServiceReplicateGroup_Request>, I>>(
    object: I,
  ): ReplicationServiceReplicateGroup_Request {
    const message = createBaseReplicationServiceReplicateGroup_Request();
    message.group = (object.group !== undefined && object.group !== null) ? Group.fromPartial(object.group) : undefined;
    return message;
  },
};

function createBaseReplicationServiceReplicateGroup_Reply(): ReplicationServiceReplicateGroup_Reply {
  return { ok: false };
}

export const ReplicationServiceReplicateGroup_Reply = {
  encode(message: ReplicationServiceReplicateGroup_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ok === true) {
      writer.uint32(8).bool(message.ok);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReplicationServiceReplicateGroup_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReplicationServiceReplicateGroup_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.ok = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReplicationServiceReplicateGroup_Reply {
    return { ok: isSet(object.ok) ? globalThis.Boolean(object.ok) : false };
  },

  toJSON(message: ReplicationServiceReplicateGroup_Reply): unknown {
    const obj: any = {};
    if (message.ok === true) {
      obj.ok = message.ok;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ReplicationServiceReplicateGroup_Reply>, I>>(
    base?: I,
  ): ReplicationServiceReplicateGroup_Reply {
    return ReplicationServiceReplicateGroup_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ReplicationServiceReplicateGroup_Reply>, I>>(
    object: I,
  ): ReplicationServiceReplicateGroup_Reply {
    const message = createBaseReplicationServiceReplicateGroup_Reply();
    message.ok = object.ok ?? false;
    return message;
  },
};

function createBaseSystemInfo(): SystemInfo {
  return {};
}

export const SystemInfo = {
  encode(_: SystemInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SystemInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSystemInfo();
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

  fromJSON(_: any): SystemInfo {
    return {};
  },

  toJSON(_: SystemInfo): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SystemInfo>, I>>(base?: I): SystemInfo {
    return SystemInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SystemInfo>, I>>(_: I): SystemInfo {
    const message = createBaseSystemInfo();
    return message;
  },
};

function createBaseSystemInfo_Request(): SystemInfo_Request {
  return {};
}

export const SystemInfo_Request = {
  encode(_: SystemInfo_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SystemInfo_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSystemInfo_Request();
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

  fromJSON(_: any): SystemInfo_Request {
    return {};
  },

  toJSON(_: SystemInfo_Request): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SystemInfo_Request>, I>>(base?: I): SystemInfo_Request {
    return SystemInfo_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SystemInfo_Request>, I>>(_: I): SystemInfo_Request {
    const message = createBaseSystemInfo_Request();
    return message;
  },
};

function createBaseSystemInfo_Reply(): SystemInfo_Reply {
  return { process: undefined, p2p: undefined, orbitdb: undefined, warns: [] };
}

export const SystemInfo_Reply = {
  encode(message: SystemInfo_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.process !== undefined) {
      SystemInfo_Process.encode(message.process, writer.uint32(10).fork()).ldelim();
    }
    if (message.p2p !== undefined) {
      SystemInfo_P2P.encode(message.p2p, writer.uint32(18).fork()).ldelim();
    }
    if (message.orbitdb !== undefined) {
      SystemInfo_OrbitDB.encode(message.orbitdb, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.warns) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SystemInfo_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSystemInfo_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.process = SystemInfo_Process.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.p2p = SystemInfo_P2P.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.orbitdb = SystemInfo_OrbitDB.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.warns.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SystemInfo_Reply {
    return {
      process: isSet(object.process) ? SystemInfo_Process.fromJSON(object.process) : undefined,
      p2p: isSet(object.p2p) ? SystemInfo_P2P.fromJSON(object.p2p) : undefined,
      orbitdb: isSet(object.orbitdb) ? SystemInfo_OrbitDB.fromJSON(object.orbitdb) : undefined,
      warns: globalThis.Array.isArray(object?.warns) ? object.warns.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: SystemInfo_Reply): unknown {
    const obj: any = {};
    if (message.process !== undefined) {
      obj.process = SystemInfo_Process.toJSON(message.process);
    }
    if (message.p2p !== undefined) {
      obj.p2p = SystemInfo_P2P.toJSON(message.p2p);
    }
    if (message.orbitdb !== undefined) {
      obj.orbitdb = SystemInfo_OrbitDB.toJSON(message.orbitdb);
    }
    if (message.warns?.length) {
      obj.warns = message.warns;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SystemInfo_Reply>, I>>(base?: I): SystemInfo_Reply {
    return SystemInfo_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SystemInfo_Reply>, I>>(object: I): SystemInfo_Reply {
    const message = createBaseSystemInfo_Reply();
    message.process = (object.process !== undefined && object.process !== null)
      ? SystemInfo_Process.fromPartial(object.process)
      : undefined;
    message.p2p = (object.p2p !== undefined && object.p2p !== null)
      ? SystemInfo_P2P.fromPartial(object.p2p)
      : undefined;
    message.orbitdb = (object.orbitdb !== undefined && object.orbitdb !== null)
      ? SystemInfo_OrbitDB.fromPartial(object.orbitdb)
      : undefined;
    message.warns = object.warns?.map((e) => e) || [];
    return message;
  },
};

function createBaseSystemInfo_OrbitDB(): SystemInfo_OrbitDB {
  return { accountMetadata: undefined };
}

export const SystemInfo_OrbitDB = {
  encode(message: SystemInfo_OrbitDB, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accountMetadata !== undefined) {
      SystemInfo_OrbitDB_ReplicationStatus.encode(message.accountMetadata, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SystemInfo_OrbitDB {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSystemInfo_OrbitDB();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.accountMetadata = SystemInfo_OrbitDB_ReplicationStatus.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SystemInfo_OrbitDB {
    return {
      accountMetadata: isSet(object.accountMetadata)
        ? SystemInfo_OrbitDB_ReplicationStatus.fromJSON(object.accountMetadata)
        : undefined,
    };
  },

  toJSON(message: SystemInfo_OrbitDB): unknown {
    const obj: any = {};
    if (message.accountMetadata !== undefined) {
      obj.accountMetadata = SystemInfo_OrbitDB_ReplicationStatus.toJSON(message.accountMetadata);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SystemInfo_OrbitDB>, I>>(base?: I): SystemInfo_OrbitDB {
    return SystemInfo_OrbitDB.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SystemInfo_OrbitDB>, I>>(object: I): SystemInfo_OrbitDB {
    const message = createBaseSystemInfo_OrbitDB();
    message.accountMetadata = (object.accountMetadata !== undefined && object.accountMetadata !== null)
      ? SystemInfo_OrbitDB_ReplicationStatus.fromPartial(object.accountMetadata)
      : undefined;
    return message;
  },
};

function createBaseSystemInfo_OrbitDB_ReplicationStatus(): SystemInfo_OrbitDB_ReplicationStatus {
  return { progress: 0, maximum: 0, buffered: 0, queued: 0 };
}

export const SystemInfo_OrbitDB_ReplicationStatus = {
  encode(message: SystemInfo_OrbitDB_ReplicationStatus, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.progress !== 0) {
      writer.uint32(8).int64(message.progress);
    }
    if (message.maximum !== 0) {
      writer.uint32(16).int64(message.maximum);
    }
    if (message.buffered !== 0) {
      writer.uint32(24).int64(message.buffered);
    }
    if (message.queued !== 0) {
      writer.uint32(32).int64(message.queued);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SystemInfo_OrbitDB_ReplicationStatus {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSystemInfo_OrbitDB_ReplicationStatus();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.progress = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.maximum = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.buffered = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.queued = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SystemInfo_OrbitDB_ReplicationStatus {
    return {
      progress: isSet(object.progress) ? globalThis.Number(object.progress) : 0,
      maximum: isSet(object.maximum) ? globalThis.Number(object.maximum) : 0,
      buffered: isSet(object.buffered) ? globalThis.Number(object.buffered) : 0,
      queued: isSet(object.queued) ? globalThis.Number(object.queued) : 0,
    };
  },

  toJSON(message: SystemInfo_OrbitDB_ReplicationStatus): unknown {
    const obj: any = {};
    if (message.progress !== 0) {
      obj.progress = Math.round(message.progress);
    }
    if (message.maximum !== 0) {
      obj.maximum = Math.round(message.maximum);
    }
    if (message.buffered !== 0) {
      obj.buffered = Math.round(message.buffered);
    }
    if (message.queued !== 0) {
      obj.queued = Math.round(message.queued);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SystemInfo_OrbitDB_ReplicationStatus>, I>>(
    base?: I,
  ): SystemInfo_OrbitDB_ReplicationStatus {
    return SystemInfo_OrbitDB_ReplicationStatus.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SystemInfo_OrbitDB_ReplicationStatus>, I>>(
    object: I,
  ): SystemInfo_OrbitDB_ReplicationStatus {
    const message = createBaseSystemInfo_OrbitDB_ReplicationStatus();
    message.progress = object.progress ?? 0;
    message.maximum = object.maximum ?? 0;
    message.buffered = object.buffered ?? 0;
    message.queued = object.queued ?? 0;
    return message;
  },
};

function createBaseSystemInfo_P2P(): SystemInfo_P2P {
  return { connectedPeers: 0 };
}

export const SystemInfo_P2P = {
  encode(message: SystemInfo_P2P, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.connectedPeers !== 0) {
      writer.uint32(8).int64(message.connectedPeers);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SystemInfo_P2P {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSystemInfo_P2P();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.connectedPeers = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SystemInfo_P2P {
    return { connectedPeers: isSet(object.connectedPeers) ? globalThis.Number(object.connectedPeers) : 0 };
  },

  toJSON(message: SystemInfo_P2P): unknown {
    const obj: any = {};
    if (message.connectedPeers !== 0) {
      obj.connectedPeers = Math.round(message.connectedPeers);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SystemInfo_P2P>, I>>(base?: I): SystemInfo_P2P {
    return SystemInfo_P2P.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SystemInfo_P2P>, I>>(object: I): SystemInfo_P2P {
    const message = createBaseSystemInfo_P2P();
    message.connectedPeers = object.connectedPeers ?? 0;
    return message;
  },
};

function createBaseSystemInfo_Process(): SystemInfo_Process {
  return {
    version: "",
    vcsRef: "",
    uptimeMs: 0,
    userCpuTimeMs: 0,
    systemCpuTimeMs: 0,
    startedAt: 0,
    rlimitCur: 0,
    numGoroutine: 0,
    nofile: 0,
    tooManyOpenFiles: false,
    numCpu: 0,
    goVersion: "",
    operatingSystem: "",
    hostName: "",
    arch: "",
    rlimitMax: 0,
    pid: 0,
    ppid: 0,
    priority: 0,
    uid: 0,
    workingDir: "",
    systemUsername: "",
  };
}

export const SystemInfo_Process = {
  encode(message: SystemInfo_Process, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.version !== "") {
      writer.uint32(10).string(message.version);
    }
    if (message.vcsRef !== "") {
      writer.uint32(18).string(message.vcsRef);
    }
    if (message.uptimeMs !== 0) {
      writer.uint32(24).int64(message.uptimeMs);
    }
    if (message.userCpuTimeMs !== 0) {
      writer.uint32(80).int64(message.userCpuTimeMs);
    }
    if (message.systemCpuTimeMs !== 0) {
      writer.uint32(88).int64(message.systemCpuTimeMs);
    }
    if (message.startedAt !== 0) {
      writer.uint32(96).int64(message.startedAt);
    }
    if (message.rlimitCur !== 0) {
      writer.uint32(104).uint64(message.rlimitCur);
    }
    if (message.numGoroutine !== 0) {
      writer.uint32(112).int64(message.numGoroutine);
    }
    if (message.nofile !== 0) {
      writer.uint32(120).int64(message.nofile);
    }
    if (message.tooManyOpenFiles === true) {
      writer.uint32(128).bool(message.tooManyOpenFiles);
    }
    if (message.numCpu !== 0) {
      writer.uint32(136).int64(message.numCpu);
    }
    if (message.goVersion !== "") {
      writer.uint32(146).string(message.goVersion);
    }
    if (message.operatingSystem !== "") {
      writer.uint32(154).string(message.operatingSystem);
    }
    if (message.hostName !== "") {
      writer.uint32(162).string(message.hostName);
    }
    if (message.arch !== "") {
      writer.uint32(170).string(message.arch);
    }
    if (message.rlimitMax !== 0) {
      writer.uint32(176).uint64(message.rlimitMax);
    }
    if (message.pid !== 0) {
      writer.uint32(184).int64(message.pid);
    }
    if (message.ppid !== 0) {
      writer.uint32(192).int64(message.ppid);
    }
    if (message.priority !== 0) {
      writer.uint32(200).int64(message.priority);
    }
    if (message.uid !== 0) {
      writer.uint32(208).int64(message.uid);
    }
    if (message.workingDir !== "") {
      writer.uint32(218).string(message.workingDir);
    }
    if (message.systemUsername !== "") {
      writer.uint32(226).string(message.systemUsername);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SystemInfo_Process {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSystemInfo_Process();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.version = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.vcsRef = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.uptimeMs = longToNumber(reader.int64() as Long);
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.userCpuTimeMs = longToNumber(reader.int64() as Long);
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.systemCpuTimeMs = longToNumber(reader.int64() as Long);
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.startedAt = longToNumber(reader.int64() as Long);
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.rlimitCur = longToNumber(reader.uint64() as Long);
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }

          message.numGoroutine = longToNumber(reader.int64() as Long);
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }

          message.nofile = longToNumber(reader.int64() as Long);
          continue;
        case 16:
          if (tag !== 128) {
            break;
          }

          message.tooManyOpenFiles = reader.bool();
          continue;
        case 17:
          if (tag !== 136) {
            break;
          }

          message.numCpu = longToNumber(reader.int64() as Long);
          continue;
        case 18:
          if (tag !== 146) {
            break;
          }

          message.goVersion = reader.string();
          continue;
        case 19:
          if (tag !== 154) {
            break;
          }

          message.operatingSystem = reader.string();
          continue;
        case 20:
          if (tag !== 162) {
            break;
          }

          message.hostName = reader.string();
          continue;
        case 21:
          if (tag !== 170) {
            break;
          }

          message.arch = reader.string();
          continue;
        case 22:
          if (tag !== 176) {
            break;
          }

          message.rlimitMax = longToNumber(reader.uint64() as Long);
          continue;
        case 23:
          if (tag !== 184) {
            break;
          }

          message.pid = longToNumber(reader.int64() as Long);
          continue;
        case 24:
          if (tag !== 192) {
            break;
          }

          message.ppid = longToNumber(reader.int64() as Long);
          continue;
        case 25:
          if (tag !== 200) {
            break;
          }

          message.priority = longToNumber(reader.int64() as Long);
          continue;
        case 26:
          if (tag !== 208) {
            break;
          }

          message.uid = longToNumber(reader.int64() as Long);
          continue;
        case 27:
          if (tag !== 218) {
            break;
          }

          message.workingDir = reader.string();
          continue;
        case 28:
          if (tag !== 226) {
            break;
          }

          message.systemUsername = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SystemInfo_Process {
    return {
      version: isSet(object.version) ? globalThis.String(object.version) : "",
      vcsRef: isSet(object.vcsRef) ? globalThis.String(object.vcsRef) : "",
      uptimeMs: isSet(object.uptimeMs) ? globalThis.Number(object.uptimeMs) : 0,
      userCpuTimeMs: isSet(object.userCpuTimeMs) ? globalThis.Number(object.userCpuTimeMs) : 0,
      systemCpuTimeMs: isSet(object.systemCpuTimeMs) ? globalThis.Number(object.systemCpuTimeMs) : 0,
      startedAt: isSet(object.startedAt) ? globalThis.Number(object.startedAt) : 0,
      rlimitCur: isSet(object.rlimitCur) ? globalThis.Number(object.rlimitCur) : 0,
      numGoroutine: isSet(object.numGoroutine) ? globalThis.Number(object.numGoroutine) : 0,
      nofile: isSet(object.nofile) ? globalThis.Number(object.nofile) : 0,
      tooManyOpenFiles: isSet(object.tooManyOpenFiles) ? globalThis.Boolean(object.tooManyOpenFiles) : false,
      numCpu: isSet(object.numCpu) ? globalThis.Number(object.numCpu) : 0,
      goVersion: isSet(object.goVersion) ? globalThis.String(object.goVersion) : "",
      operatingSystem: isSet(object.operatingSystem) ? globalThis.String(object.operatingSystem) : "",
      hostName: isSet(object.hostName) ? globalThis.String(object.hostName) : "",
      arch: isSet(object.arch) ? globalThis.String(object.arch) : "",
      rlimitMax: isSet(object.rlimitMax) ? globalThis.Number(object.rlimitMax) : 0,
      pid: isSet(object.pid) ? globalThis.Number(object.pid) : 0,
      ppid: isSet(object.ppid) ? globalThis.Number(object.ppid) : 0,
      priority: isSet(object.priority) ? globalThis.Number(object.priority) : 0,
      uid: isSet(object.uid) ? globalThis.Number(object.uid) : 0,
      workingDir: isSet(object.workingDir) ? globalThis.String(object.workingDir) : "",
      systemUsername: isSet(object.systemUsername) ? globalThis.String(object.systemUsername) : "",
    };
  },

  toJSON(message: SystemInfo_Process): unknown {
    const obj: any = {};
    if (message.version !== "") {
      obj.version = message.version;
    }
    if (message.vcsRef !== "") {
      obj.vcsRef = message.vcsRef;
    }
    if (message.uptimeMs !== 0) {
      obj.uptimeMs = Math.round(message.uptimeMs);
    }
    if (message.userCpuTimeMs !== 0) {
      obj.userCpuTimeMs = Math.round(message.userCpuTimeMs);
    }
    if (message.systemCpuTimeMs !== 0) {
      obj.systemCpuTimeMs = Math.round(message.systemCpuTimeMs);
    }
    if (message.startedAt !== 0) {
      obj.startedAt = Math.round(message.startedAt);
    }
    if (message.rlimitCur !== 0) {
      obj.rlimitCur = Math.round(message.rlimitCur);
    }
    if (message.numGoroutine !== 0) {
      obj.numGoroutine = Math.round(message.numGoroutine);
    }
    if (message.nofile !== 0) {
      obj.nofile = Math.round(message.nofile);
    }
    if (message.tooManyOpenFiles === true) {
      obj.tooManyOpenFiles = message.tooManyOpenFiles;
    }
    if (message.numCpu !== 0) {
      obj.numCpu = Math.round(message.numCpu);
    }
    if (message.goVersion !== "") {
      obj.goVersion = message.goVersion;
    }
    if (message.operatingSystem !== "") {
      obj.operatingSystem = message.operatingSystem;
    }
    if (message.hostName !== "") {
      obj.hostName = message.hostName;
    }
    if (message.arch !== "") {
      obj.arch = message.arch;
    }
    if (message.rlimitMax !== 0) {
      obj.rlimitMax = Math.round(message.rlimitMax);
    }
    if (message.pid !== 0) {
      obj.pid = Math.round(message.pid);
    }
    if (message.ppid !== 0) {
      obj.ppid = Math.round(message.ppid);
    }
    if (message.priority !== 0) {
      obj.priority = Math.round(message.priority);
    }
    if (message.uid !== 0) {
      obj.uid = Math.round(message.uid);
    }
    if (message.workingDir !== "") {
      obj.workingDir = message.workingDir;
    }
    if (message.systemUsername !== "") {
      obj.systemUsername = message.systemUsername;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SystemInfo_Process>, I>>(base?: I): SystemInfo_Process {
    return SystemInfo_Process.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SystemInfo_Process>, I>>(object: I): SystemInfo_Process {
    const message = createBaseSystemInfo_Process();
    message.version = object.version ?? "";
    message.vcsRef = object.vcsRef ?? "";
    message.uptimeMs = object.uptimeMs ?? 0;
    message.userCpuTimeMs = object.userCpuTimeMs ?? 0;
    message.systemCpuTimeMs = object.systemCpuTimeMs ?? 0;
    message.startedAt = object.startedAt ?? 0;
    message.rlimitCur = object.rlimitCur ?? 0;
    message.numGoroutine = object.numGoroutine ?? 0;
    message.nofile = object.nofile ?? 0;
    message.tooManyOpenFiles = object.tooManyOpenFiles ?? false;
    message.numCpu = object.numCpu ?? 0;
    message.goVersion = object.goVersion ?? "";
    message.operatingSystem = object.operatingSystem ?? "";
    message.hostName = object.hostName ?? "";
    message.arch = object.arch ?? "";
    message.rlimitMax = object.rlimitMax ?? 0;
    message.pid = object.pid ?? 0;
    message.ppid = object.ppid ?? 0;
    message.priority = object.priority ?? 0;
    message.uid = object.uid ?? 0;
    message.workingDir = object.workingDir ?? "";
    message.systemUsername = object.systemUsername ?? "";
    return message;
  },
};

function createBasePeerList(): PeerList {
  return {};
}

export const PeerList = {
  encode(_: PeerList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PeerList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePeerList();
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

  fromJSON(_: any): PeerList {
    return {};
  },

  toJSON(_: PeerList): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<PeerList>, I>>(base?: I): PeerList {
    return PeerList.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PeerList>, I>>(_: I): PeerList {
    const message = createBasePeerList();
    return message;
  },
};

function createBasePeerList_Request(): PeerList_Request {
  return {};
}

export const PeerList_Request = {
  encode(_: PeerList_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PeerList_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePeerList_Request();
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

  fromJSON(_: any): PeerList_Request {
    return {};
  },

  toJSON(_: PeerList_Request): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<PeerList_Request>, I>>(base?: I): PeerList_Request {
    return PeerList_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PeerList_Request>, I>>(_: I): PeerList_Request {
    const message = createBasePeerList_Request();
    return message;
  },
};

function createBasePeerList_Reply(): PeerList_Reply {
  return { peers: [] };
}

export const PeerList_Reply = {
  encode(message: PeerList_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.peers) {
      PeerList_Peer.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PeerList_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePeerList_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.peers.push(PeerList_Peer.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PeerList_Reply {
    return {
      peers: globalThis.Array.isArray(object?.peers) ? object.peers.map((e: any) => PeerList_Peer.fromJSON(e)) : [],
    };
  },

  toJSON(message: PeerList_Reply): unknown {
    const obj: any = {};
    if (message.peers?.length) {
      obj.peers = message.peers.map((e) => PeerList_Peer.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PeerList_Reply>, I>>(base?: I): PeerList_Reply {
    return PeerList_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PeerList_Reply>, I>>(object: I): PeerList_Reply {
    const message = createBasePeerList_Reply();
    message.peers = object.peers?.map((e) => PeerList_Peer.fromPartial(e)) || [];
    return message;
  },
};

function createBasePeerList_Peer(): PeerList_Peer {
  return { id: "", routes: [], errors: [], features: [], minLatency: 0, isActive: false, direction: 0 };
}

export const PeerList_Peer = {
  encode(message: PeerList_Peer, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    for (const v of message.routes) {
      PeerList_Route.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.errors) {
      writer.uint32(26).string(v!);
    }
    writer.uint32(34).fork();
    for (const v of message.features) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.minLatency !== 0) {
      writer.uint32(40).int64(message.minLatency);
    }
    if (message.isActive === true) {
      writer.uint32(48).bool(message.isActive);
    }
    if (message.direction !== 0) {
      writer.uint32(56).int32(message.direction);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PeerList_Peer {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePeerList_Peer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.routes.push(PeerList_Route.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.errors.push(reader.string());
          continue;
        case 4:
          if (tag === 32) {
            message.features.push(reader.int32() as any);

            continue;
          }

          if (tag === 34) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.features.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.minLatency = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.isActive = reader.bool();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.direction = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PeerList_Peer {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      routes: globalThis.Array.isArray(object?.routes) ? object.routes.map((e: any) => PeerList_Route.fromJSON(e)) : [],
      errors: globalThis.Array.isArray(object?.errors) ? object.errors.map((e: any) => globalThis.String(e)) : [],
      features: globalThis.Array.isArray(object?.features)
        ? object.features.map((e: any) => peerList_FeatureFromJSON(e))
        : [],
      minLatency: isSet(object.minLatency) ? globalThis.Number(object.minLatency) : 0,
      isActive: isSet(object.isActive) ? globalThis.Boolean(object.isActive) : false,
      direction: isSet(object.direction) ? directionFromJSON(object.direction) : 0,
    };
  },

  toJSON(message: PeerList_Peer): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.routes?.length) {
      obj.routes = message.routes.map((e) => PeerList_Route.toJSON(e));
    }
    if (message.errors?.length) {
      obj.errors = message.errors;
    }
    if (message.features?.length) {
      obj.features = message.features.map((e) => peerList_FeatureToJSON(e));
    }
    if (message.minLatency !== 0) {
      obj.minLatency = Math.round(message.minLatency);
    }
    if (message.isActive === true) {
      obj.isActive = message.isActive;
    }
    if (message.direction !== 0) {
      obj.direction = directionToJSON(message.direction);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PeerList_Peer>, I>>(base?: I): PeerList_Peer {
    return PeerList_Peer.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PeerList_Peer>, I>>(object: I): PeerList_Peer {
    const message = createBasePeerList_Peer();
    message.id = object.id ?? "";
    message.routes = object.routes?.map((e) => PeerList_Route.fromPartial(e)) || [];
    message.errors = object.errors?.map((e) => e) || [];
    message.features = object.features?.map((e) => e) || [];
    message.minLatency = object.minLatency ?? 0;
    message.isActive = object.isActive ?? false;
    message.direction = object.direction ?? 0;
    return message;
  },
};

function createBasePeerList_Route(): PeerList_Route {
  return { isActive: false, address: "", direction: 0, latency: 0, streams: [] };
}

export const PeerList_Route = {
  encode(message: PeerList_Route, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isActive === true) {
      writer.uint32(8).bool(message.isActive);
    }
    if (message.address !== "") {
      writer.uint32(18).string(message.address);
    }
    if (message.direction !== 0) {
      writer.uint32(24).int32(message.direction);
    }
    if (message.latency !== 0) {
      writer.uint32(32).int64(message.latency);
    }
    for (const v of message.streams) {
      PeerList_Stream.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PeerList_Route {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePeerList_Route();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.isActive = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.address = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.direction = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.latency = longToNumber(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.streams.push(PeerList_Stream.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PeerList_Route {
    return {
      isActive: isSet(object.isActive) ? globalThis.Boolean(object.isActive) : false,
      address: isSet(object.address) ? globalThis.String(object.address) : "",
      direction: isSet(object.direction) ? directionFromJSON(object.direction) : 0,
      latency: isSet(object.latency) ? globalThis.Number(object.latency) : 0,
      streams: globalThis.Array.isArray(object?.streams)
        ? object.streams.map((e: any) => PeerList_Stream.fromJSON(e))
        : [],
    };
  },

  toJSON(message: PeerList_Route): unknown {
    const obj: any = {};
    if (message.isActive === true) {
      obj.isActive = message.isActive;
    }
    if (message.address !== "") {
      obj.address = message.address;
    }
    if (message.direction !== 0) {
      obj.direction = directionToJSON(message.direction);
    }
    if (message.latency !== 0) {
      obj.latency = Math.round(message.latency);
    }
    if (message.streams?.length) {
      obj.streams = message.streams.map((e) => PeerList_Stream.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PeerList_Route>, I>>(base?: I): PeerList_Route {
    return PeerList_Route.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PeerList_Route>, I>>(object: I): PeerList_Route {
    const message = createBasePeerList_Route();
    message.isActive = object.isActive ?? false;
    message.address = object.address ?? "";
    message.direction = object.direction ?? 0;
    message.latency = object.latency ?? 0;
    message.streams = object.streams?.map((e) => PeerList_Stream.fromPartial(e)) || [];
    return message;
  },
};

function createBasePeerList_Stream(): PeerList_Stream {
  return { id: "" };
}

export const PeerList_Stream = {
  encode(message: PeerList_Stream, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PeerList_Stream {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePeerList_Stream();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PeerList_Stream {
    return { id: isSet(object.id) ? globalThis.String(object.id) : "" };
  },

  toJSON(message: PeerList_Stream): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PeerList_Stream>, I>>(base?: I): PeerList_Stream {
    return PeerList_Stream.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PeerList_Stream>, I>>(object: I): PeerList_Stream {
    const message = createBasePeerList_Stream();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseProgress(): Progress {
  return { state: "", doing: "", progress: 0, completed: 0, total: 0, delay: 0 };
}

export const Progress = {
  encode(message: Progress, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.state !== "") {
      writer.uint32(10).string(message.state);
    }
    if (message.doing !== "") {
      writer.uint32(18).string(message.doing);
    }
    if (message.progress !== 0) {
      writer.uint32(29).float(message.progress);
    }
    if (message.completed !== 0) {
      writer.uint32(32).uint64(message.completed);
    }
    if (message.total !== 0) {
      writer.uint32(40).uint64(message.total);
    }
    if (message.delay !== 0) {
      writer.uint32(48).uint64(message.delay);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Progress {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProgress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.state = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.doing = reader.string();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }

          message.progress = reader.float();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.completed = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.total = longToNumber(reader.uint64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.delay = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Progress {
    return {
      state: isSet(object.state) ? globalThis.String(object.state) : "",
      doing: isSet(object.doing) ? globalThis.String(object.doing) : "",
      progress: isSet(object.progress) ? globalThis.Number(object.progress) : 0,
      completed: isSet(object.completed) ? globalThis.Number(object.completed) : 0,
      total: isSet(object.total) ? globalThis.Number(object.total) : 0,
      delay: isSet(object.delay) ? globalThis.Number(object.delay) : 0,
    };
  },

  toJSON(message: Progress): unknown {
    const obj: any = {};
    if (message.state !== "") {
      obj.state = message.state;
    }
    if (message.doing !== "") {
      obj.doing = message.doing;
    }
    if (message.progress !== 0) {
      obj.progress = message.progress;
    }
    if (message.completed !== 0) {
      obj.completed = Math.round(message.completed);
    }
    if (message.total !== 0) {
      obj.total = Math.round(message.total);
    }
    if (message.delay !== 0) {
      obj.delay = Math.round(message.delay);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Progress>, I>>(base?: I): Progress {
    return Progress.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Progress>, I>>(object: I): Progress {
    const message = createBaseProgress();
    message.state = object.state ?? "";
    message.doing = object.doing ?? "";
    message.progress = object.progress ?? 0;
    message.completed = object.completed ?? 0;
    message.total = object.total ?? 0;
    message.delay = object.delay ?? 0;
    return message;
  },
};

function createBaseOutOfStoreMessage(): OutOfStoreMessage {
  return {
    cid: new Uint8Array(0),
    devicePk: new Uint8Array(0),
    counter: 0,
    sig: new Uint8Array(0),
    flags: 0,
    encryptedPayload: new Uint8Array(0),
    nonce: new Uint8Array(0),
  };
}

export const OutOfStoreMessage = {
  encode(message: OutOfStoreMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cid.length !== 0) {
      writer.uint32(10).bytes(message.cid);
    }
    if (message.devicePk.length !== 0) {
      writer.uint32(18).bytes(message.devicePk);
    }
    if (message.counter !== 0) {
      writer.uint32(25).fixed64(message.counter);
    }
    if (message.sig.length !== 0) {
      writer.uint32(34).bytes(message.sig);
    }
    if (message.flags !== 0) {
      writer.uint32(45).fixed32(message.flags);
    }
    if (message.encryptedPayload.length !== 0) {
      writer.uint32(50).bytes(message.encryptedPayload);
    }
    if (message.nonce.length !== 0) {
      writer.uint32(58).bytes(message.nonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutOfStoreMessage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutOfStoreMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cid = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }

          message.counter = longToNumber(reader.fixed64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.sig = reader.bytes();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }

          message.flags = reader.fixed32();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.encryptedPayload = reader.bytes();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.nonce = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OutOfStoreMessage {
    return {
      cid: isSet(object.cid) ? bytesFromBase64(object.cid) : new Uint8Array(0),
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      counter: isSet(object.counter) ? globalThis.Number(object.counter) : 0,
      sig: isSet(object.sig) ? bytesFromBase64(object.sig) : new Uint8Array(0),
      flags: isSet(object.flags) ? globalThis.Number(object.flags) : 0,
      encryptedPayload: isSet(object.encryptedPayload) ? bytesFromBase64(object.encryptedPayload) : new Uint8Array(0),
      nonce: isSet(object.nonce) ? bytesFromBase64(object.nonce) : new Uint8Array(0),
    };
  },

  toJSON(message: OutOfStoreMessage): unknown {
    const obj: any = {};
    if (message.cid.length !== 0) {
      obj.cid = base64FromBytes(message.cid);
    }
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.counter !== 0) {
      obj.counter = Math.round(message.counter);
    }
    if (message.sig.length !== 0) {
      obj.sig = base64FromBytes(message.sig);
    }
    if (message.flags !== 0) {
      obj.flags = Math.round(message.flags);
    }
    if (message.encryptedPayload.length !== 0) {
      obj.encryptedPayload = base64FromBytes(message.encryptedPayload);
    }
    if (message.nonce.length !== 0) {
      obj.nonce = base64FromBytes(message.nonce);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OutOfStoreMessage>, I>>(base?: I): OutOfStoreMessage {
    return OutOfStoreMessage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OutOfStoreMessage>, I>>(object: I): OutOfStoreMessage {
    const message = createBaseOutOfStoreMessage();
    message.cid = object.cid ?? new Uint8Array(0);
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.counter = object.counter ?? 0;
    message.sig = object.sig ?? new Uint8Array(0);
    message.flags = object.flags ?? 0;
    message.encryptedPayload = object.encryptedPayload ?? new Uint8Array(0);
    message.nonce = object.nonce ?? new Uint8Array(0);
    return message;
  },
};

function createBaseOutOfStoreMessageEnvelope(): OutOfStoreMessageEnvelope {
  return { nonce: new Uint8Array(0), box: new Uint8Array(0), groupReference: new Uint8Array(0) };
}

export const OutOfStoreMessageEnvelope = {
  encode(message: OutOfStoreMessageEnvelope, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nonce.length !== 0) {
      writer.uint32(10).bytes(message.nonce);
    }
    if (message.box.length !== 0) {
      writer.uint32(18).bytes(message.box);
    }
    if (message.groupReference.length !== 0) {
      writer.uint32(26).bytes(message.groupReference);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutOfStoreMessageEnvelope {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutOfStoreMessageEnvelope();
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

          message.box = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.groupReference = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OutOfStoreMessageEnvelope {
    return {
      nonce: isSet(object.nonce) ? bytesFromBase64(object.nonce) : new Uint8Array(0),
      box: isSet(object.box) ? bytesFromBase64(object.box) : new Uint8Array(0),
      groupReference: isSet(object.groupReference) ? bytesFromBase64(object.groupReference) : new Uint8Array(0),
    };
  },

  toJSON(message: OutOfStoreMessageEnvelope): unknown {
    const obj: any = {};
    if (message.nonce.length !== 0) {
      obj.nonce = base64FromBytes(message.nonce);
    }
    if (message.box.length !== 0) {
      obj.box = base64FromBytes(message.box);
    }
    if (message.groupReference.length !== 0) {
      obj.groupReference = base64FromBytes(message.groupReference);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OutOfStoreMessageEnvelope>, I>>(base?: I): OutOfStoreMessageEnvelope {
    return OutOfStoreMessageEnvelope.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OutOfStoreMessageEnvelope>, I>>(object: I): OutOfStoreMessageEnvelope {
    const message = createBaseOutOfStoreMessageEnvelope();
    message.nonce = object.nonce ?? new Uint8Array(0);
    message.box = object.box ?? new Uint8Array(0);
    message.groupReference = object.groupReference ?? new Uint8Array(0);
    return message;
  },
};

function createBaseOutOfStoreReceive(): OutOfStoreReceive {
  return {};
}

export const OutOfStoreReceive = {
  encode(_: OutOfStoreReceive, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutOfStoreReceive {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutOfStoreReceive();
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

  fromJSON(_: any): OutOfStoreReceive {
    return {};
  },

  toJSON(_: OutOfStoreReceive): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<OutOfStoreReceive>, I>>(base?: I): OutOfStoreReceive {
    return OutOfStoreReceive.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OutOfStoreReceive>, I>>(_: I): OutOfStoreReceive {
    const message = createBaseOutOfStoreReceive();
    return message;
  },
};

function createBaseOutOfStoreReceive_Request(): OutOfStoreReceive_Request {
  return { payload: new Uint8Array(0) };
}

export const OutOfStoreReceive_Request = {
  encode(message: OutOfStoreReceive_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.payload.length !== 0) {
      writer.uint32(10).bytes(message.payload);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutOfStoreReceive_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutOfStoreReceive_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.payload = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OutOfStoreReceive_Request {
    return { payload: isSet(object.payload) ? bytesFromBase64(object.payload) : new Uint8Array(0) };
  },

  toJSON(message: OutOfStoreReceive_Request): unknown {
    const obj: any = {};
    if (message.payload.length !== 0) {
      obj.payload = base64FromBytes(message.payload);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OutOfStoreReceive_Request>, I>>(base?: I): OutOfStoreReceive_Request {
    return OutOfStoreReceive_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OutOfStoreReceive_Request>, I>>(object: I): OutOfStoreReceive_Request {
    const message = createBaseOutOfStoreReceive_Request();
    message.payload = object.payload ?? new Uint8Array(0);
    return message;
  },
};

function createBaseOutOfStoreReceive_Reply(): OutOfStoreReceive_Reply {
  return {
    message: undefined,
    cleartext: new Uint8Array(0),
    groupPublicKey: new Uint8Array(0),
    alreadyReceived: false,
  };
}

export const OutOfStoreReceive_Reply = {
  encode(message: OutOfStoreReceive_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.message !== undefined) {
      OutOfStoreMessage.encode(message.message, writer.uint32(10).fork()).ldelim();
    }
    if (message.cleartext.length !== 0) {
      writer.uint32(18).bytes(message.cleartext);
    }
    if (message.groupPublicKey.length !== 0) {
      writer.uint32(26).bytes(message.groupPublicKey);
    }
    if (message.alreadyReceived === true) {
      writer.uint32(32).bool(message.alreadyReceived);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutOfStoreReceive_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutOfStoreReceive_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.message = OutOfStoreMessage.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.cleartext = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.groupPublicKey = reader.bytes();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.alreadyReceived = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OutOfStoreReceive_Reply {
    return {
      message: isSet(object.message) ? OutOfStoreMessage.fromJSON(object.message) : undefined,
      cleartext: isSet(object.cleartext) ? bytesFromBase64(object.cleartext) : new Uint8Array(0),
      groupPublicKey: isSet(object.groupPublicKey) ? bytesFromBase64(object.groupPublicKey) : new Uint8Array(0),
      alreadyReceived: isSet(object.alreadyReceived) ? globalThis.Boolean(object.alreadyReceived) : false,
    };
  },

  toJSON(message: OutOfStoreReceive_Reply): unknown {
    const obj: any = {};
    if (message.message !== undefined) {
      obj.message = OutOfStoreMessage.toJSON(message.message);
    }
    if (message.cleartext.length !== 0) {
      obj.cleartext = base64FromBytes(message.cleartext);
    }
    if (message.groupPublicKey.length !== 0) {
      obj.groupPublicKey = base64FromBytes(message.groupPublicKey);
    }
    if (message.alreadyReceived === true) {
      obj.alreadyReceived = message.alreadyReceived;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OutOfStoreReceive_Reply>, I>>(base?: I): OutOfStoreReceive_Reply {
    return OutOfStoreReceive_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OutOfStoreReceive_Reply>, I>>(object: I): OutOfStoreReceive_Reply {
    const message = createBaseOutOfStoreReceive_Reply();
    message.message = (object.message !== undefined && object.message !== null)
      ? OutOfStoreMessage.fromPartial(object.message)
      : undefined;
    message.cleartext = object.cleartext ?? new Uint8Array(0);
    message.groupPublicKey = object.groupPublicKey ?? new Uint8Array(0);
    message.alreadyReceived = object.alreadyReceived ?? false;
    return message;
  },
};

function createBaseOutOfStoreSeal(): OutOfStoreSeal {
  return {};
}

export const OutOfStoreSeal = {
  encode(_: OutOfStoreSeal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutOfStoreSeal {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutOfStoreSeal();
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

  fromJSON(_: any): OutOfStoreSeal {
    return {};
  },

  toJSON(_: OutOfStoreSeal): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<OutOfStoreSeal>, I>>(base?: I): OutOfStoreSeal {
    return OutOfStoreSeal.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OutOfStoreSeal>, I>>(_: I): OutOfStoreSeal {
    const message = createBaseOutOfStoreSeal();
    return message;
  },
};

function createBaseOutOfStoreSeal_Request(): OutOfStoreSeal_Request {
  return { cid: new Uint8Array(0), groupPublicKey: new Uint8Array(0) };
}

export const OutOfStoreSeal_Request = {
  encode(message: OutOfStoreSeal_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cid.length !== 0) {
      writer.uint32(10).bytes(message.cid);
    }
    if (message.groupPublicKey.length !== 0) {
      writer.uint32(18).bytes(message.groupPublicKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutOfStoreSeal_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutOfStoreSeal_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cid = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.groupPublicKey = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OutOfStoreSeal_Request {
    return {
      cid: isSet(object.cid) ? bytesFromBase64(object.cid) : new Uint8Array(0),
      groupPublicKey: isSet(object.groupPublicKey) ? bytesFromBase64(object.groupPublicKey) : new Uint8Array(0),
    };
  },

  toJSON(message: OutOfStoreSeal_Request): unknown {
    const obj: any = {};
    if (message.cid.length !== 0) {
      obj.cid = base64FromBytes(message.cid);
    }
    if (message.groupPublicKey.length !== 0) {
      obj.groupPublicKey = base64FromBytes(message.groupPublicKey);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OutOfStoreSeal_Request>, I>>(base?: I): OutOfStoreSeal_Request {
    return OutOfStoreSeal_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OutOfStoreSeal_Request>, I>>(object: I): OutOfStoreSeal_Request {
    const message = createBaseOutOfStoreSeal_Request();
    message.cid = object.cid ?? new Uint8Array(0);
    message.groupPublicKey = object.groupPublicKey ?? new Uint8Array(0);
    return message;
  },
};

function createBaseOutOfStoreSeal_Reply(): OutOfStoreSeal_Reply {
  return { encrypted: new Uint8Array(0) };
}

export const OutOfStoreSeal_Reply = {
  encode(message: OutOfStoreSeal_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encrypted.length !== 0) {
      writer.uint32(10).bytes(message.encrypted);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutOfStoreSeal_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutOfStoreSeal_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.encrypted = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OutOfStoreSeal_Reply {
    return { encrypted: isSet(object.encrypted) ? bytesFromBase64(object.encrypted) : new Uint8Array(0) };
  },

  toJSON(message: OutOfStoreSeal_Reply): unknown {
    const obj: any = {};
    if (message.encrypted.length !== 0) {
      obj.encrypted = base64FromBytes(message.encrypted);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OutOfStoreSeal_Reply>, I>>(base?: I): OutOfStoreSeal_Reply {
    return OutOfStoreSeal_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OutOfStoreSeal_Reply>, I>>(object: I): OutOfStoreSeal_Reply {
    const message = createBaseOutOfStoreSeal_Reply();
    message.encrypted = object.encrypted ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAccountVerifiedCredentialRegistered(): AccountVerifiedCredentialRegistered {
  return {
    devicePk: new Uint8Array(0),
    signedIdentityPublicKey: new Uint8Array(0),
    verifiedCredential: "",
    registrationDate: 0,
    expirationDate: 0,
    identifier: "",
    issuer: "",
  };
}

export const AccountVerifiedCredentialRegistered = {
  encode(message: AccountVerifiedCredentialRegistered, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.devicePk.length !== 0) {
      writer.uint32(10).bytes(message.devicePk);
    }
    if (message.signedIdentityPublicKey.length !== 0) {
      writer.uint32(18).bytes(message.signedIdentityPublicKey);
    }
    if (message.verifiedCredential !== "") {
      writer.uint32(26).string(message.verifiedCredential);
    }
    if (message.registrationDate !== 0) {
      writer.uint32(32).int64(message.registrationDate);
    }
    if (message.expirationDate !== 0) {
      writer.uint32(40).int64(message.expirationDate);
    }
    if (message.identifier !== "") {
      writer.uint32(50).string(message.identifier);
    }
    if (message.issuer !== "") {
      writer.uint32(58).string(message.issuer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountVerifiedCredentialRegistered {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountVerifiedCredentialRegistered();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.signedIdentityPublicKey = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.verifiedCredential = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.registrationDate = longToNumber(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.expirationDate = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.identifier = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.issuer = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AccountVerifiedCredentialRegistered {
    return {
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      signedIdentityPublicKey: isSet(object.signedIdentityPublicKey)
        ? bytesFromBase64(object.signedIdentityPublicKey)
        : new Uint8Array(0),
      verifiedCredential: isSet(object.verifiedCredential) ? globalThis.String(object.verifiedCredential) : "",
      registrationDate: isSet(object.registrationDate) ? globalThis.Number(object.registrationDate) : 0,
      expirationDate: isSet(object.expirationDate) ? globalThis.Number(object.expirationDate) : 0,
      identifier: isSet(object.identifier) ? globalThis.String(object.identifier) : "",
      issuer: isSet(object.issuer) ? globalThis.String(object.issuer) : "",
    };
  },

  toJSON(message: AccountVerifiedCredentialRegistered): unknown {
    const obj: any = {};
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.signedIdentityPublicKey.length !== 0) {
      obj.signedIdentityPublicKey = base64FromBytes(message.signedIdentityPublicKey);
    }
    if (message.verifiedCredential !== "") {
      obj.verifiedCredential = message.verifiedCredential;
    }
    if (message.registrationDate !== 0) {
      obj.registrationDate = Math.round(message.registrationDate);
    }
    if (message.expirationDate !== 0) {
      obj.expirationDate = Math.round(message.expirationDate);
    }
    if (message.identifier !== "") {
      obj.identifier = message.identifier;
    }
    if (message.issuer !== "") {
      obj.issuer = message.issuer;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountVerifiedCredentialRegistered>, I>>(
    base?: I,
  ): AccountVerifiedCredentialRegistered {
    return AccountVerifiedCredentialRegistered.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AccountVerifiedCredentialRegistered>, I>>(
    object: I,
  ): AccountVerifiedCredentialRegistered {
    const message = createBaseAccountVerifiedCredentialRegistered();
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.signedIdentityPublicKey = object.signedIdentityPublicKey ?? new Uint8Array(0);
    message.verifiedCredential = object.verifiedCredential ?? "";
    message.registrationDate = object.registrationDate ?? 0;
    message.expirationDate = object.expirationDate ?? 0;
    message.identifier = object.identifier ?? "";
    message.issuer = object.issuer ?? "";
    return message;
  },
};

function createBaseFirstLastCounters(): FirstLastCounters {
  return { first: 0, last: 0 };
}

export const FirstLastCounters = {
  encode(message: FirstLastCounters, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.first !== 0) {
      writer.uint32(8).uint64(message.first);
    }
    if (message.last !== 0) {
      writer.uint32(16).uint64(message.last);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FirstLastCounters {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFirstLastCounters();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.first = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.last = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FirstLastCounters {
    return {
      first: isSet(object.first) ? globalThis.Number(object.first) : 0,
      last: isSet(object.last) ? globalThis.Number(object.last) : 0,
    };
  },

  toJSON(message: FirstLastCounters): unknown {
    const obj: any = {};
    if (message.first !== 0) {
      obj.first = Math.round(message.first);
    }
    if (message.last !== 0) {
      obj.last = Math.round(message.last);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FirstLastCounters>, I>>(base?: I): FirstLastCounters {
    return FirstLastCounters.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FirstLastCounters>, I>>(object: I): FirstLastCounters {
    const message = createBaseFirstLastCounters();
    message.first = object.first ?? 0;
    message.last = object.last ?? 0;
    return message;
  },
};

function createBaseOrbitDBMessageHeads(): OrbitDBMessageHeads {
  return { sealedBox: new Uint8Array(0), rawRotation: new Uint8Array(0) };
}

export const OrbitDBMessageHeads = {
  encode(message: OrbitDBMessageHeads, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sealedBox.length !== 0) {
      writer.uint32(18).bytes(message.sealedBox);
    }
    if (message.rawRotation.length !== 0) {
      writer.uint32(26).bytes(message.rawRotation);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OrbitDBMessageHeads {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOrbitDBMessageHeads();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.sealedBox = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.rawRotation = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OrbitDBMessageHeads {
    return {
      sealedBox: isSet(object.sealedBox) ? bytesFromBase64(object.sealedBox) : new Uint8Array(0),
      rawRotation: isSet(object.rawRotation) ? bytesFromBase64(object.rawRotation) : new Uint8Array(0),
    };
  },

  toJSON(message: OrbitDBMessageHeads): unknown {
    const obj: any = {};
    if (message.sealedBox.length !== 0) {
      obj.sealedBox = base64FromBytes(message.sealedBox);
    }
    if (message.rawRotation.length !== 0) {
      obj.rawRotation = base64FromBytes(message.rawRotation);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OrbitDBMessageHeads>, I>>(base?: I): OrbitDBMessageHeads {
    return OrbitDBMessageHeads.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OrbitDBMessageHeads>, I>>(object: I): OrbitDBMessageHeads {
    const message = createBaseOrbitDBMessageHeads();
    message.sealedBox = object.sealedBox ?? new Uint8Array(0);
    message.rawRotation = object.rawRotation ?? new Uint8Array(0);
    return message;
  },
};

function createBaseOrbitDBMessageHeads_Box(): OrbitDBMessageHeads_Box {
  return { address: "", heads: new Uint8Array(0), devicePk: new Uint8Array(0), peerId: new Uint8Array(0) };
}

export const OrbitDBMessageHeads_Box = {
  encode(message: OrbitDBMessageHeads_Box, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.heads.length !== 0) {
      writer.uint32(18).bytes(message.heads);
    }
    if (message.devicePk.length !== 0) {
      writer.uint32(26).bytes(message.devicePk);
    }
    if (message.peerId.length !== 0) {
      writer.uint32(34).bytes(message.peerId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OrbitDBMessageHeads_Box {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOrbitDBMessageHeads_Box();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.address = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.heads = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.devicePk = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.peerId = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OrbitDBMessageHeads_Box {
    return {
      address: isSet(object.address) ? globalThis.String(object.address) : "",
      heads: isSet(object.heads) ? bytesFromBase64(object.heads) : new Uint8Array(0),
      devicePk: isSet(object.devicePk) ? bytesFromBase64(object.devicePk) : new Uint8Array(0),
      peerId: isSet(object.peerId) ? bytesFromBase64(object.peerId) : new Uint8Array(0),
    };
  },

  toJSON(message: OrbitDBMessageHeads_Box): unknown {
    const obj: any = {};
    if (message.address !== "") {
      obj.address = message.address;
    }
    if (message.heads.length !== 0) {
      obj.heads = base64FromBytes(message.heads);
    }
    if (message.devicePk.length !== 0) {
      obj.devicePk = base64FromBytes(message.devicePk);
    }
    if (message.peerId.length !== 0) {
      obj.peerId = base64FromBytes(message.peerId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OrbitDBMessageHeads_Box>, I>>(base?: I): OrbitDBMessageHeads_Box {
    return OrbitDBMessageHeads_Box.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OrbitDBMessageHeads_Box>, I>>(object: I): OrbitDBMessageHeads_Box {
    const message = createBaseOrbitDBMessageHeads_Box();
    message.address = object.address ?? "";
    message.heads = object.heads ?? new Uint8Array(0);
    message.devicePk = object.devicePk ?? new Uint8Array(0);
    message.peerId = object.peerId ?? new Uint8Array(0);
    return message;
  },
};

function createBaseRefreshContactRequest(): RefreshContactRequest {
  return {};
}

export const RefreshContactRequest = {
  encode(_: RefreshContactRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RefreshContactRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRefreshContactRequest();
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

  fromJSON(_: any): RefreshContactRequest {
    return {};
  },

  toJSON(_: RefreshContactRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<RefreshContactRequest>, I>>(base?: I): RefreshContactRequest {
    return RefreshContactRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RefreshContactRequest>, I>>(_: I): RefreshContactRequest {
    const message = createBaseRefreshContactRequest();
    return message;
  },
};

function createBaseRefreshContactRequest_Peer(): RefreshContactRequest_Peer {
  return { id: "", addrs: [] };
}

export const RefreshContactRequest_Peer = {
  encode(message: RefreshContactRequest_Peer, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    for (const v of message.addrs) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RefreshContactRequest_Peer {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRefreshContactRequest_Peer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.addrs.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RefreshContactRequest_Peer {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      addrs: globalThis.Array.isArray(object?.addrs) ? object.addrs.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: RefreshContactRequest_Peer): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.addrs?.length) {
      obj.addrs = message.addrs;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RefreshContactRequest_Peer>, I>>(base?: I): RefreshContactRequest_Peer {
    return RefreshContactRequest_Peer.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RefreshContactRequest_Peer>, I>>(object: I): RefreshContactRequest_Peer {
    const message = createBaseRefreshContactRequest_Peer();
    message.id = object.id ?? "";
    message.addrs = object.addrs?.map((e) => e) || [];
    return message;
  },
};

function createBaseRefreshContactRequest_Request(): RefreshContactRequest_Request {
  return { contactPk: new Uint8Array(0), timeout: 0 };
}

export const RefreshContactRequest_Request = {
  encode(message: RefreshContactRequest_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contactPk.length !== 0) {
      writer.uint32(10).bytes(message.contactPk);
    }
    if (message.timeout !== 0) {
      writer.uint32(16).int64(message.timeout);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RefreshContactRequest_Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRefreshContactRequest_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.contactPk = reader.bytes();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.timeout = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RefreshContactRequest_Request {
    return {
      contactPk: isSet(object.contactPk) ? bytesFromBase64(object.contactPk) : new Uint8Array(0),
      timeout: isSet(object.timeout) ? globalThis.Number(object.timeout) : 0,
    };
  },

  toJSON(message: RefreshContactRequest_Request): unknown {
    const obj: any = {};
    if (message.contactPk.length !== 0) {
      obj.contactPk = base64FromBytes(message.contactPk);
    }
    if (message.timeout !== 0) {
      obj.timeout = Math.round(message.timeout);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RefreshContactRequest_Request>, I>>(base?: I): RefreshContactRequest_Request {
    return RefreshContactRequest_Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RefreshContactRequest_Request>, I>>(
    object: I,
  ): RefreshContactRequest_Request {
    const message = createBaseRefreshContactRequest_Request();
    message.contactPk = object.contactPk ?? new Uint8Array(0);
    message.timeout = object.timeout ?? 0;
    return message;
  },
};

function createBaseRefreshContactRequest_Reply(): RefreshContactRequest_Reply {
  return { peersFound: [] };
}

export const RefreshContactRequest_Reply = {
  encode(message: RefreshContactRequest_Reply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.peersFound) {
      RefreshContactRequest_Peer.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RefreshContactRequest_Reply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRefreshContactRequest_Reply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.peersFound.push(RefreshContactRequest_Peer.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RefreshContactRequest_Reply {
    return {
      peersFound: globalThis.Array.isArray(object?.peersFound)
        ? object.peersFound.map((e: any) => RefreshContactRequest_Peer.fromJSON(e))
        : [],
    };
  },

  toJSON(message: RefreshContactRequest_Reply): unknown {
    const obj: any = {};
    if (message.peersFound?.length) {
      obj.peersFound = message.peersFound.map((e) => RefreshContactRequest_Peer.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RefreshContactRequest_Reply>, I>>(base?: I): RefreshContactRequest_Reply {
    return RefreshContactRequest_Reply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RefreshContactRequest_Reply>, I>>(object: I): RefreshContactRequest_Reply {
    const message = createBaseRefreshContactRequest_Reply();
    message.peersFound = object.peersFound?.map((e) => RefreshContactRequest_Peer.fromPartial(e)) || [];
    return message;
  },
};

/**
 * ProtocolService is the top-level API to manage the Wesh protocol service.
 * Each active Wesh protocol service is considered as a Wesh device and is associated with a Wesh user.
 */
export interface ProtocolService {
  /** ServiceExportData exports the current data of the protocol service */
  ServiceExportData(
    request: DeepPartial<ServiceExportData_Request>,
    metadata?: grpc.Metadata,
  ): Observable<ServiceExportData_Reply>;
  /** ServiceGetConfiguration gets the current configuration of the protocol service */
  ServiceGetConfiguration(
    request: DeepPartial<ServiceGetConfiguration_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ServiceGetConfiguration_Reply>;
  /** ContactRequestReference retrieves the information required to create a reference (ie. included in a shareable link) to the current account */
  ContactRequestReference(
    request: DeepPartial<ContactRequestReference_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestReference_Reply>;
  /** ContactRequestDisable disables incoming contact requests */
  ContactRequestDisable(
    request: DeepPartial<ContactRequestDisable_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestDisable_Reply>;
  /** ContactRequestEnable enables incoming contact requests */
  ContactRequestEnable(
    request: DeepPartial<ContactRequestEnable_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestEnable_Reply>;
  /** ContactRequestResetReference changes the contact request reference */
  ContactRequestResetReference(
    request: DeepPartial<ContactRequestResetReference_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestResetReference_Reply>;
  /** ContactRequestSend attempt to send a contact request */
  ContactRequestSend(
    request: DeepPartial<ContactRequestSend_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestSend_Reply>;
  /** ContactRequestAccept accepts a contact request */
  ContactRequestAccept(
    request: DeepPartial<ContactRequestAccept_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestAccept_Reply>;
  /** ContactRequestDiscard ignores a contact request, without informing the other user */
  ContactRequestDiscard(
    request: DeepPartial<ContactRequestDiscard_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestDiscard_Reply>;
  /**
   * ShareContact uses ContactRequestReference to get the contact information for the current account and
   * returns the Protobuf encoding of a shareable contact which you can further encode and share. If needed, this
   * will reset the contact request reference and enable contact requests. To decode the result, see DecodeContact.
   */
  ShareContact(request: DeepPartial<ShareContact_Request>, metadata?: grpc.Metadata): Promise<ShareContact_Reply>;
  /** DecodeContact decodes the Protobuf encoding of a shareable contact which was returned by ShareContact. */
  DecodeContact(request: DeepPartial<DecodeContact_Request>, metadata?: grpc.Metadata): Promise<DecodeContact_Reply>;
  /** ContactBlock blocks a contact from sending requests */
  ContactBlock(request: DeepPartial<ContactBlock_Request>, metadata?: grpc.Metadata): Promise<ContactBlock_Reply>;
  /** ContactUnblock unblocks a contact from sending requests */
  ContactUnblock(request: DeepPartial<ContactUnblock_Request>, metadata?: grpc.Metadata): Promise<ContactUnblock_Reply>;
  /** ContactAliasKeySend send an alias key to a contact, the contact will be able to assert that your account is being present on a multi-member group */
  ContactAliasKeySend(
    request: DeepPartial<ContactAliasKeySend_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactAliasKeySend_Reply>;
  /** MultiMemberGroupCreate creates a new multi-member group */
  MultiMemberGroupCreate(
    request: DeepPartial<MultiMemberGroupCreate_Request>,
    metadata?: grpc.Metadata,
  ): Promise<MultiMemberGroupCreate_Reply>;
  /** MultiMemberGroupJoin joins a multi-member group */
  MultiMemberGroupJoin(
    request: DeepPartial<MultiMemberGroupJoin_Request>,
    metadata?: grpc.Metadata,
  ): Promise<MultiMemberGroupJoin_Reply>;
  /** MultiMemberGroupLeave leaves a multi-member group */
  MultiMemberGroupLeave(
    request: DeepPartial<MultiMemberGroupLeave_Request>,
    metadata?: grpc.Metadata,
  ): Promise<MultiMemberGroupLeave_Reply>;
  /** MultiMemberGroupAliasResolverDisclose discloses your alias resolver key */
  MultiMemberGroupAliasResolverDisclose(
    request: DeepPartial<MultiMemberGroupAliasResolverDisclose_Request>,
    metadata?: grpc.Metadata,
  ): Promise<MultiMemberGroupAliasResolverDisclose_Reply>;
  /** MultiMemberGroupAdminRoleGrant grants an admin role to a group member */
  MultiMemberGroupAdminRoleGrant(
    request: DeepPartial<MultiMemberGroupAdminRoleGrant_Request>,
    metadata?: grpc.Metadata,
  ): Promise<MultiMemberGroupAdminRoleGrant_Reply>;
  /** MultiMemberGroupInvitationCreate creates an invitation to a multi-member group */
  MultiMemberGroupInvitationCreate(
    request: DeepPartial<MultiMemberGroupInvitationCreate_Request>,
    metadata?: grpc.Metadata,
  ): Promise<MultiMemberGroupInvitationCreate_Reply>;
  /** AppMetadataSend adds an app event to the metadata store, the message is encrypted using a symmetric key and readable by future group members */
  AppMetadataSend(
    request: DeepPartial<AppMetadataSend_Request>,
    metadata?: grpc.Metadata,
  ): Promise<AppMetadataSend_Reply>;
  /** AppMessageSend adds an app event to the message store, the message is encrypted using a derived key and readable by current group members */
  AppMessageSend(request: DeepPartial<AppMessageSend_Request>, metadata?: grpc.Metadata): Promise<AppMessageSend_Reply>;
  /** GroupMetadataList replays previous and subscribes to new metadata events from the group */
  GroupMetadataList(
    request: DeepPartial<GroupMetadataList_Request>,
    metadata?: grpc.Metadata,
  ): Observable<GroupMetadataEvent>;
  /** GroupMessageList replays previous and subscribes to new message events from the group */
  GroupMessageList(
    request: DeepPartial<GroupMessageList_Request>,
    metadata?: grpc.Metadata,
  ): Observable<GroupMessageEvent>;
  /** GroupInfo retrieves information about a group */
  GroupInfo(request: DeepPartial<GroupInfo_Request>, metadata?: grpc.Metadata): Promise<GroupInfo_Reply>;
  /** ActivateGroup explicitly opens a group */
  ActivateGroup(request: DeepPartial<ActivateGroup_Request>, metadata?: grpc.Metadata): Promise<ActivateGroup_Reply>;
  /** DeactivateGroup closes a group */
  DeactivateGroup(
    request: DeepPartial<DeactivateGroup_Request>,
    metadata?: grpc.Metadata,
  ): Promise<DeactivateGroup_Reply>;
  /** GroupDeviceStatus monitor device status */
  GroupDeviceStatus(
    request: DeepPartial<GroupDeviceStatus_Request>,
    metadata?: grpc.Metadata,
  ): Observable<GroupDeviceStatus_Reply>;
  DebugListGroups(
    request: DeepPartial<DebugListGroups_Request>,
    metadata?: grpc.Metadata,
  ): Observable<DebugListGroups_Reply>;
  DebugInspectGroupStore(
    request: DeepPartial<DebugInspectGroupStore_Request>,
    metadata?: grpc.Metadata,
  ): Observable<DebugInspectGroupStore_Reply>;
  DebugGroup(request: DeepPartial<DebugGroup_Request>, metadata?: grpc.Metadata): Promise<DebugGroup_Reply>;
  SystemInfo(request: DeepPartial<SystemInfo_Request>, metadata?: grpc.Metadata): Promise<SystemInfo_Reply>;
  /** CredentialVerificationServiceInitFlow Initialize a credential verification flow */
  CredentialVerificationServiceInitFlow(
    request: DeepPartial<CredentialVerificationServiceInitFlow_Request>,
    metadata?: grpc.Metadata,
  ): Promise<CredentialVerificationServiceInitFlow_Reply>;
  /** CredentialVerificationServiceCompleteFlow Completes a credential verification flow */
  CredentialVerificationServiceCompleteFlow(
    request: DeepPartial<CredentialVerificationServiceCompleteFlow_Request>,
    metadata?: grpc.Metadata,
  ): Promise<CredentialVerificationServiceCompleteFlow_Reply>;
  /** VerifiedCredentialsList Retrieves the list of verified credentials */
  VerifiedCredentialsList(
    request: DeepPartial<VerifiedCredentialsList_Request>,
    metadata?: grpc.Metadata,
  ): Observable<VerifiedCredentialsList_Reply>;
  /** ReplicationServiceRegisterGroup Asks a replication service to distribute a group contents */
  ReplicationServiceRegisterGroup(
    request: DeepPartial<ReplicationServiceRegisterGroup_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ReplicationServiceRegisterGroup_Reply>;
  /** PeerList returns a list of P2P peers */
  PeerList(request: DeepPartial<PeerList_Request>, metadata?: grpc.Metadata): Promise<PeerList_Reply>;
  /** OutOfStoreReceive parses a payload received outside a synchronized store */
  OutOfStoreReceive(
    request: DeepPartial<OutOfStoreReceive_Request>,
    metadata?: grpc.Metadata,
  ): Promise<OutOfStoreReceive_Reply>;
  /** OutOfStoreSeal creates a payload of a message present in store to be sent outside a synchronized store */
  OutOfStoreSeal(request: DeepPartial<OutOfStoreSeal_Request>, metadata?: grpc.Metadata): Promise<OutOfStoreSeal_Reply>;
  /** RefreshContactRequest try to refresh the contact request for the given contact */
  RefreshContactRequest(
    request: DeepPartial<RefreshContactRequest_Request>,
    metadata?: grpc.Metadata,
  ): Promise<RefreshContactRequest_Reply>;
}

export class ProtocolServiceClientImpl implements ProtocolService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.ServiceExportData = this.ServiceExportData.bind(this);
    this.ServiceGetConfiguration = this.ServiceGetConfiguration.bind(this);
    this.ContactRequestReference = this.ContactRequestReference.bind(this);
    this.ContactRequestDisable = this.ContactRequestDisable.bind(this);
    this.ContactRequestEnable = this.ContactRequestEnable.bind(this);
    this.ContactRequestResetReference = this.ContactRequestResetReference.bind(this);
    this.ContactRequestSend = this.ContactRequestSend.bind(this);
    this.ContactRequestAccept = this.ContactRequestAccept.bind(this);
    this.ContactRequestDiscard = this.ContactRequestDiscard.bind(this);
    this.ShareContact = this.ShareContact.bind(this);
    this.DecodeContact = this.DecodeContact.bind(this);
    this.ContactBlock = this.ContactBlock.bind(this);
    this.ContactUnblock = this.ContactUnblock.bind(this);
    this.ContactAliasKeySend = this.ContactAliasKeySend.bind(this);
    this.MultiMemberGroupCreate = this.MultiMemberGroupCreate.bind(this);
    this.MultiMemberGroupJoin = this.MultiMemberGroupJoin.bind(this);
    this.MultiMemberGroupLeave = this.MultiMemberGroupLeave.bind(this);
    this.MultiMemberGroupAliasResolverDisclose = this.MultiMemberGroupAliasResolverDisclose.bind(this);
    this.MultiMemberGroupAdminRoleGrant = this.MultiMemberGroupAdminRoleGrant.bind(this);
    this.MultiMemberGroupInvitationCreate = this.MultiMemberGroupInvitationCreate.bind(this);
    this.AppMetadataSend = this.AppMetadataSend.bind(this);
    this.AppMessageSend = this.AppMessageSend.bind(this);
    this.GroupMetadataList = this.GroupMetadataList.bind(this);
    this.GroupMessageList = this.GroupMessageList.bind(this);
    this.GroupInfo = this.GroupInfo.bind(this);
    this.ActivateGroup = this.ActivateGroup.bind(this);
    this.DeactivateGroup = this.DeactivateGroup.bind(this);
    this.GroupDeviceStatus = this.GroupDeviceStatus.bind(this);
    this.DebugListGroups = this.DebugListGroups.bind(this);
    this.DebugInspectGroupStore = this.DebugInspectGroupStore.bind(this);
    this.DebugGroup = this.DebugGroup.bind(this);
    this.SystemInfo = this.SystemInfo.bind(this);
    this.CredentialVerificationServiceInitFlow = this.CredentialVerificationServiceInitFlow.bind(this);
    this.CredentialVerificationServiceCompleteFlow = this.CredentialVerificationServiceCompleteFlow.bind(this);
    this.VerifiedCredentialsList = this.VerifiedCredentialsList.bind(this);
    this.ReplicationServiceRegisterGroup = this.ReplicationServiceRegisterGroup.bind(this);
    this.PeerList = this.PeerList.bind(this);
    this.OutOfStoreReceive = this.OutOfStoreReceive.bind(this);
    this.OutOfStoreSeal = this.OutOfStoreSeal.bind(this);
    this.RefreshContactRequest = this.RefreshContactRequest.bind(this);
  }

  ServiceExportData(
    request: DeepPartial<ServiceExportData_Request>,
    metadata?: grpc.Metadata,
  ): Observable<ServiceExportData_Reply> {
    return this.rpc.invoke(
      ProtocolServiceServiceExportDataDesc,
      ServiceExportData_Request.fromPartial(request),
      metadata,
    );
  }

  ServiceGetConfiguration(
    request: DeepPartial<ServiceGetConfiguration_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ServiceGetConfiguration_Reply> {
    return this.rpc.unary(
      ProtocolServiceServiceGetConfigurationDesc,
      ServiceGetConfiguration_Request.fromPartial(request),
      metadata,
    );
  }

  ContactRequestReference(
    request: DeepPartial<ContactRequestReference_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestReference_Reply> {
    return this.rpc.unary(
      ProtocolServiceContactRequestReferenceDesc,
      ContactRequestReference_Request.fromPartial(request),
      metadata,
    );
  }

  ContactRequestDisable(
    request: DeepPartial<ContactRequestDisable_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestDisable_Reply> {
    return this.rpc.unary(
      ProtocolServiceContactRequestDisableDesc,
      ContactRequestDisable_Request.fromPartial(request),
      metadata,
    );
  }

  ContactRequestEnable(
    request: DeepPartial<ContactRequestEnable_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestEnable_Reply> {
    return this.rpc.unary(
      ProtocolServiceContactRequestEnableDesc,
      ContactRequestEnable_Request.fromPartial(request),
      metadata,
    );
  }

  ContactRequestResetReference(
    request: DeepPartial<ContactRequestResetReference_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestResetReference_Reply> {
    return this.rpc.unary(
      ProtocolServiceContactRequestResetReferenceDesc,
      ContactRequestResetReference_Request.fromPartial(request),
      metadata,
    );
  }

  ContactRequestSend(
    request: DeepPartial<ContactRequestSend_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestSend_Reply> {
    return this.rpc.unary(
      ProtocolServiceContactRequestSendDesc,
      ContactRequestSend_Request.fromPartial(request),
      metadata,
    );
  }

  ContactRequestAccept(
    request: DeepPartial<ContactRequestAccept_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestAccept_Reply> {
    return this.rpc.unary(
      ProtocolServiceContactRequestAcceptDesc,
      ContactRequestAccept_Request.fromPartial(request),
      metadata,
    );
  }

  ContactRequestDiscard(
    request: DeepPartial<ContactRequestDiscard_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactRequestDiscard_Reply> {
    return this.rpc.unary(
      ProtocolServiceContactRequestDiscardDesc,
      ContactRequestDiscard_Request.fromPartial(request),
      metadata,
    );
  }

  ShareContact(request: DeepPartial<ShareContact_Request>, metadata?: grpc.Metadata): Promise<ShareContact_Reply> {
    return this.rpc.unary(ProtocolServiceShareContactDesc, ShareContact_Request.fromPartial(request), metadata);
  }

  DecodeContact(request: DeepPartial<DecodeContact_Request>, metadata?: grpc.Metadata): Promise<DecodeContact_Reply> {
    return this.rpc.unary(ProtocolServiceDecodeContactDesc, DecodeContact_Request.fromPartial(request), metadata);
  }

  ContactBlock(request: DeepPartial<ContactBlock_Request>, metadata?: grpc.Metadata): Promise<ContactBlock_Reply> {
    return this.rpc.unary(ProtocolServiceContactBlockDesc, ContactBlock_Request.fromPartial(request), metadata);
  }

  ContactUnblock(
    request: DeepPartial<ContactUnblock_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactUnblock_Reply> {
    return this.rpc.unary(ProtocolServiceContactUnblockDesc, ContactUnblock_Request.fromPartial(request), metadata);
  }

  ContactAliasKeySend(
    request: DeepPartial<ContactAliasKeySend_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ContactAliasKeySend_Reply> {
    return this.rpc.unary(
      ProtocolServiceContactAliasKeySendDesc,
      ContactAliasKeySend_Request.fromPartial(request),
      metadata,
    );
  }

  MultiMemberGroupCreate(
    request: DeepPartial<MultiMemberGroupCreate_Request>,
    metadata?: grpc.Metadata,
  ): Promise<MultiMemberGroupCreate_Reply> {
    return this.rpc.unary(
      ProtocolServiceMultiMemberGroupCreateDesc,
      MultiMemberGroupCreate_Request.fromPartial(request),
      metadata,
    );
  }

  MultiMemberGroupJoin(
    request: DeepPartial<MultiMemberGroupJoin_Request>,
    metadata?: grpc.Metadata,
  ): Promise<MultiMemberGroupJoin_Reply> {
    return this.rpc.unary(
      ProtocolServiceMultiMemberGroupJoinDesc,
      MultiMemberGroupJoin_Request.fromPartial(request),
      metadata,
    );
  }

  MultiMemberGroupLeave(
    request: DeepPartial<MultiMemberGroupLeave_Request>,
    metadata?: grpc.Metadata,
  ): Promise<MultiMemberGroupLeave_Reply> {
    return this.rpc.unary(
      ProtocolServiceMultiMemberGroupLeaveDesc,
      MultiMemberGroupLeave_Request.fromPartial(request),
      metadata,
    );
  }

  MultiMemberGroupAliasResolverDisclose(
    request: DeepPartial<MultiMemberGroupAliasResolverDisclose_Request>,
    metadata?: grpc.Metadata,
  ): Promise<MultiMemberGroupAliasResolverDisclose_Reply> {
    return this.rpc.unary(
      ProtocolServiceMultiMemberGroupAliasResolverDiscloseDesc,
      MultiMemberGroupAliasResolverDisclose_Request.fromPartial(request),
      metadata,
    );
  }

  MultiMemberGroupAdminRoleGrant(
    request: DeepPartial<MultiMemberGroupAdminRoleGrant_Request>,
    metadata?: grpc.Metadata,
  ): Promise<MultiMemberGroupAdminRoleGrant_Reply> {
    return this.rpc.unary(
      ProtocolServiceMultiMemberGroupAdminRoleGrantDesc,
      MultiMemberGroupAdminRoleGrant_Request.fromPartial(request),
      metadata,
    );
  }

  MultiMemberGroupInvitationCreate(
    request: DeepPartial<MultiMemberGroupInvitationCreate_Request>,
    metadata?: grpc.Metadata,
  ): Promise<MultiMemberGroupInvitationCreate_Reply> {
    return this.rpc.unary(
      ProtocolServiceMultiMemberGroupInvitationCreateDesc,
      MultiMemberGroupInvitationCreate_Request.fromPartial(request),
      metadata,
    );
  }

  AppMetadataSend(
    request: DeepPartial<AppMetadataSend_Request>,
    metadata?: grpc.Metadata,
  ): Promise<AppMetadataSend_Reply> {
    return this.rpc.unary(ProtocolServiceAppMetadataSendDesc, AppMetadataSend_Request.fromPartial(request), metadata);
  }

  AppMessageSend(
    request: DeepPartial<AppMessageSend_Request>,
    metadata?: grpc.Metadata,
  ): Promise<AppMessageSend_Reply> {
    return this.rpc.unary(ProtocolServiceAppMessageSendDesc, AppMessageSend_Request.fromPartial(request), metadata);
  }

  GroupMetadataList(
    request: DeepPartial<GroupMetadataList_Request>,
    metadata?: grpc.Metadata,
  ): Observable<GroupMetadataEvent> {
    return this.rpc.invoke(
      ProtocolServiceGroupMetadataListDesc,
      GroupMetadataList_Request.fromPartial(request),
      metadata,
    );
  }

  GroupMessageList(
    request: DeepPartial<GroupMessageList_Request>,
    metadata?: grpc.Metadata,
  ): Observable<GroupMessageEvent> {
    return this.rpc.invoke(
      ProtocolServiceGroupMessageListDesc,
      GroupMessageList_Request.fromPartial(request),
      metadata,
    );
  }

  GroupInfo(request: DeepPartial<GroupInfo_Request>, metadata?: grpc.Metadata): Promise<GroupInfo_Reply> {
    return this.rpc.unary(ProtocolServiceGroupInfoDesc, GroupInfo_Request.fromPartial(request), metadata);
  }

  ActivateGroup(request: DeepPartial<ActivateGroup_Request>, metadata?: grpc.Metadata): Promise<ActivateGroup_Reply> {
    return this.rpc.unary(ProtocolServiceActivateGroupDesc, ActivateGroup_Request.fromPartial(request), metadata);
  }

  DeactivateGroup(
    request: DeepPartial<DeactivateGroup_Request>,
    metadata?: grpc.Metadata,
  ): Promise<DeactivateGroup_Reply> {
    return this.rpc.unary(ProtocolServiceDeactivateGroupDesc, DeactivateGroup_Request.fromPartial(request), metadata);
  }

  GroupDeviceStatus(
    request: DeepPartial<GroupDeviceStatus_Request>,
    metadata?: grpc.Metadata,
  ): Observable<GroupDeviceStatus_Reply> {
    return this.rpc.invoke(
      ProtocolServiceGroupDeviceStatusDesc,
      GroupDeviceStatus_Request.fromPartial(request),
      metadata,
    );
  }

  DebugListGroups(
    request: DeepPartial<DebugListGroups_Request>,
    metadata?: grpc.Metadata,
  ): Observable<DebugListGroups_Reply> {
    return this.rpc.invoke(ProtocolServiceDebugListGroupsDesc, DebugListGroups_Request.fromPartial(request), metadata);
  }

  DebugInspectGroupStore(
    request: DeepPartial<DebugInspectGroupStore_Request>,
    metadata?: grpc.Metadata,
  ): Observable<DebugInspectGroupStore_Reply> {
    return this.rpc.invoke(
      ProtocolServiceDebugInspectGroupStoreDesc,
      DebugInspectGroupStore_Request.fromPartial(request),
      metadata,
    );
  }

  DebugGroup(request: DeepPartial<DebugGroup_Request>, metadata?: grpc.Metadata): Promise<DebugGroup_Reply> {
    return this.rpc.unary(ProtocolServiceDebugGroupDesc, DebugGroup_Request.fromPartial(request), metadata);
  }

  SystemInfo(request: DeepPartial<SystemInfo_Request>, metadata?: grpc.Metadata): Promise<SystemInfo_Reply> {
    return this.rpc.unary(ProtocolServiceSystemInfoDesc, SystemInfo_Request.fromPartial(request), metadata);
  }

  CredentialVerificationServiceInitFlow(
    request: DeepPartial<CredentialVerificationServiceInitFlow_Request>,
    metadata?: grpc.Metadata,
  ): Promise<CredentialVerificationServiceInitFlow_Reply> {
    return this.rpc.unary(
      ProtocolServiceCredentialVerificationServiceInitFlowDesc,
      CredentialVerificationServiceInitFlow_Request.fromPartial(request),
      metadata,
    );
  }

  CredentialVerificationServiceCompleteFlow(
    request: DeepPartial<CredentialVerificationServiceCompleteFlow_Request>,
    metadata?: grpc.Metadata,
  ): Promise<CredentialVerificationServiceCompleteFlow_Reply> {
    return this.rpc.unary(
      ProtocolServiceCredentialVerificationServiceCompleteFlowDesc,
      CredentialVerificationServiceCompleteFlow_Request.fromPartial(request),
      metadata,
    );
  }

  VerifiedCredentialsList(
    request: DeepPartial<VerifiedCredentialsList_Request>,
    metadata?: grpc.Metadata,
  ): Observable<VerifiedCredentialsList_Reply> {
    return this.rpc.invoke(
      ProtocolServiceVerifiedCredentialsListDesc,
      VerifiedCredentialsList_Request.fromPartial(request),
      metadata,
    );
  }

  ReplicationServiceRegisterGroup(
    request: DeepPartial<ReplicationServiceRegisterGroup_Request>,
    metadata?: grpc.Metadata,
  ): Promise<ReplicationServiceRegisterGroup_Reply> {
    return this.rpc.unary(
      ProtocolServiceReplicationServiceRegisterGroupDesc,
      ReplicationServiceRegisterGroup_Request.fromPartial(request),
      metadata,
    );
  }

  PeerList(request: DeepPartial<PeerList_Request>, metadata?: grpc.Metadata): Promise<PeerList_Reply> {
    return this.rpc.unary(ProtocolServicePeerListDesc, PeerList_Request.fromPartial(request), metadata);
  }

  OutOfStoreReceive(
    request: DeepPartial<OutOfStoreReceive_Request>,
    metadata?: grpc.Metadata,
  ): Promise<OutOfStoreReceive_Reply> {
    return this.rpc.unary(
      ProtocolServiceOutOfStoreReceiveDesc,
      OutOfStoreReceive_Request.fromPartial(request),
      metadata,
    );
  }

  OutOfStoreSeal(
    request: DeepPartial<OutOfStoreSeal_Request>,
    metadata?: grpc.Metadata,
  ): Promise<OutOfStoreSeal_Reply> {
    return this.rpc.unary(ProtocolServiceOutOfStoreSealDesc, OutOfStoreSeal_Request.fromPartial(request), metadata);
  }

  RefreshContactRequest(
    request: DeepPartial<RefreshContactRequest_Request>,
    metadata?: grpc.Metadata,
  ): Promise<RefreshContactRequest_Reply> {
    return this.rpc.unary(
      ProtocolServiceRefreshContactRequestDesc,
      RefreshContactRequest_Request.fromPartial(request),
      metadata,
    );
  }
}

export const ProtocolServiceDesc = { serviceName: "weshnet.protocol.v1.ProtocolService" };

export const ProtocolServiceServiceExportDataDesc: UnaryMethodDefinitionish = {
  methodName: "ServiceExportData",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return ServiceExportData_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ServiceExportData_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceServiceGetConfigurationDesc: UnaryMethodDefinitionish = {
  methodName: "ServiceGetConfiguration",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ServiceGetConfiguration_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ServiceGetConfiguration_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceContactRequestReferenceDesc: UnaryMethodDefinitionish = {
  methodName: "ContactRequestReference",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ContactRequestReference_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ContactRequestReference_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceContactRequestDisableDesc: UnaryMethodDefinitionish = {
  methodName: "ContactRequestDisable",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ContactRequestDisable_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ContactRequestDisable_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceContactRequestEnableDesc: UnaryMethodDefinitionish = {
  methodName: "ContactRequestEnable",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ContactRequestEnable_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ContactRequestEnable_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceContactRequestResetReferenceDesc: UnaryMethodDefinitionish = {
  methodName: "ContactRequestResetReference",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ContactRequestResetReference_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ContactRequestResetReference_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceContactRequestSendDesc: UnaryMethodDefinitionish = {
  methodName: "ContactRequestSend",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ContactRequestSend_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ContactRequestSend_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceContactRequestAcceptDesc: UnaryMethodDefinitionish = {
  methodName: "ContactRequestAccept",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ContactRequestAccept_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ContactRequestAccept_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceContactRequestDiscardDesc: UnaryMethodDefinitionish = {
  methodName: "ContactRequestDiscard",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ContactRequestDiscard_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ContactRequestDiscard_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceShareContactDesc: UnaryMethodDefinitionish = {
  methodName: "ShareContact",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ShareContact_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ShareContact_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceDecodeContactDesc: UnaryMethodDefinitionish = {
  methodName: "DecodeContact",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return DecodeContact_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = DecodeContact_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceContactBlockDesc: UnaryMethodDefinitionish = {
  methodName: "ContactBlock",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ContactBlock_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ContactBlock_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceContactUnblockDesc: UnaryMethodDefinitionish = {
  methodName: "ContactUnblock",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ContactUnblock_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ContactUnblock_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceContactAliasKeySendDesc: UnaryMethodDefinitionish = {
  methodName: "ContactAliasKeySend",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ContactAliasKeySend_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ContactAliasKeySend_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceMultiMemberGroupCreateDesc: UnaryMethodDefinitionish = {
  methodName: "MultiMemberGroupCreate",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return MultiMemberGroupCreate_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = MultiMemberGroupCreate_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceMultiMemberGroupJoinDesc: UnaryMethodDefinitionish = {
  methodName: "MultiMemberGroupJoin",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return MultiMemberGroupJoin_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = MultiMemberGroupJoin_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceMultiMemberGroupLeaveDesc: UnaryMethodDefinitionish = {
  methodName: "MultiMemberGroupLeave",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return MultiMemberGroupLeave_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = MultiMemberGroupLeave_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceMultiMemberGroupAliasResolverDiscloseDesc: UnaryMethodDefinitionish = {
  methodName: "MultiMemberGroupAliasResolverDisclose",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return MultiMemberGroupAliasResolverDisclose_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = MultiMemberGroupAliasResolverDisclose_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceMultiMemberGroupAdminRoleGrantDesc: UnaryMethodDefinitionish = {
  methodName: "MultiMemberGroupAdminRoleGrant",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return MultiMemberGroupAdminRoleGrant_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = MultiMemberGroupAdminRoleGrant_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceMultiMemberGroupInvitationCreateDesc: UnaryMethodDefinitionish = {
  methodName: "MultiMemberGroupInvitationCreate",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return MultiMemberGroupInvitationCreate_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = MultiMemberGroupInvitationCreate_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceAppMetadataSendDesc: UnaryMethodDefinitionish = {
  methodName: "AppMetadataSend",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return AppMetadataSend_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = AppMetadataSend_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceAppMessageSendDesc: UnaryMethodDefinitionish = {
  methodName: "AppMessageSend",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return AppMessageSend_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = AppMessageSend_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceGroupMetadataListDesc: UnaryMethodDefinitionish = {
  methodName: "GroupMetadataList",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return GroupMetadataList_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GroupMetadataEvent.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceGroupMessageListDesc: UnaryMethodDefinitionish = {
  methodName: "GroupMessageList",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return GroupMessageList_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GroupMessageEvent.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceGroupInfoDesc: UnaryMethodDefinitionish = {
  methodName: "GroupInfo",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GroupInfo_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GroupInfo_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceActivateGroupDesc: UnaryMethodDefinitionish = {
  methodName: "ActivateGroup",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ActivateGroup_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ActivateGroup_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceDeactivateGroupDesc: UnaryMethodDefinitionish = {
  methodName: "DeactivateGroup",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return DeactivateGroup_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = DeactivateGroup_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceGroupDeviceStatusDesc: UnaryMethodDefinitionish = {
  methodName: "GroupDeviceStatus",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return GroupDeviceStatus_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GroupDeviceStatus_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceDebugListGroupsDesc: UnaryMethodDefinitionish = {
  methodName: "DebugListGroups",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return DebugListGroups_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = DebugListGroups_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceDebugInspectGroupStoreDesc: UnaryMethodDefinitionish = {
  methodName: "DebugInspectGroupStore",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return DebugInspectGroupStore_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = DebugInspectGroupStore_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceDebugGroupDesc: UnaryMethodDefinitionish = {
  methodName: "DebugGroup",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return DebugGroup_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = DebugGroup_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceSystemInfoDesc: UnaryMethodDefinitionish = {
  methodName: "SystemInfo",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return SystemInfo_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = SystemInfo_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceCredentialVerificationServiceInitFlowDesc: UnaryMethodDefinitionish = {
  methodName: "CredentialVerificationServiceInitFlow",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return CredentialVerificationServiceInitFlow_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = CredentialVerificationServiceInitFlow_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceCredentialVerificationServiceCompleteFlowDesc: UnaryMethodDefinitionish = {
  methodName: "CredentialVerificationServiceCompleteFlow",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return CredentialVerificationServiceCompleteFlow_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = CredentialVerificationServiceCompleteFlow_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceVerifiedCredentialsListDesc: UnaryMethodDefinitionish = {
  methodName: "VerifiedCredentialsList",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return VerifiedCredentialsList_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = VerifiedCredentialsList_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceReplicationServiceRegisterGroupDesc: UnaryMethodDefinitionish = {
  methodName: "ReplicationServiceRegisterGroup",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ReplicationServiceRegisterGroup_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ReplicationServiceRegisterGroup_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServicePeerListDesc: UnaryMethodDefinitionish = {
  methodName: "PeerList",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return PeerList_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = PeerList_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceOutOfStoreReceiveDesc: UnaryMethodDefinitionish = {
  methodName: "OutOfStoreReceive",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return OutOfStoreReceive_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = OutOfStoreReceive_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceOutOfStoreSealDesc: UnaryMethodDefinitionish = {
  methodName: "OutOfStoreSeal",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return OutOfStoreSeal_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = OutOfStoreSeal_Reply.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const ProtocolServiceRefreshContactRequestDesc: UnaryMethodDefinitionish = {
  methodName: "RefreshContactRequest",
  service: ProtocolServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return RefreshContactRequest_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = RefreshContactRequest_Reply.decode(data);
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
  invoke<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined,
  ): Observable<any>;
}

export class GrpcWebImpl {
  private host: string;
  private options: {
    transport?: grpc.TransportFactory;
    streamingTransport?: grpc.TransportFactory;
    debug?: boolean;
    metadata?: grpc.Metadata;
    upStreamRetryCodes?: number[];
  };

  constructor(
    host: string,
    options: {
      transport?: grpc.TransportFactory;
      streamingTransport?: grpc.TransportFactory;
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

  invoke<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined,
  ): Observable<any> {
    const upStreamCodes = this.options.upStreamRetryCodes ?? [];
    const DEFAULT_TIMEOUT_TIME: number = 3_000;
    const request = { ..._request, ...methodDesc.requestType };
    const transport = this.options.streamingTransport ?? this.options.transport;
    const maybeCombinedMetadata = metadata && this.options.metadata
      ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
      : metadata ?? this.options.metadata;
    return new Observable((observer) => {
      const upStream = () => {
        const client = grpc.invoke(methodDesc, {
          host: this.host,
          request,
          ...(transport !== undefined ? { transport } : {}),
          metadata: maybeCombinedMetadata ?? {},
          debug: this.options.debug ?? false,
          onMessage: (next) => observer.next(next),
          onEnd: (code: grpc.Code, message: string, trailers: grpc.Metadata) => {
            if (code === 0) {
              observer.complete();
            } else if (upStreamCodes.includes(code)) {
              setTimeout(upStream, DEFAULT_TIMEOUT_TIME);
            } else {
              const err = new Error(message) as any;
              err.code = code;
              err.metadata = trailers;
              observer.error(err);
            }
          },
        });
        observer.add(() => {
          return client.close();
        });
      };
      upStream();
    }).pipe(share());
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

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export class GrpcWebError extends globalThis.Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
