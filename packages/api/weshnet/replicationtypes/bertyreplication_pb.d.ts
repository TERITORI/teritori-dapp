import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../gogoproto/gogo_pb'; // proto import: "gogoproto/gogo.proto"
import * as protocoltypes_pb from '../protocoltypes_pb'; // proto import: "protocoltypes.proto"


export class ReplicatedGroup extends jspb.Message {
  getPublicKey(): string;
  setPublicKey(value: string): ReplicatedGroup;

  getSignPub(): string;
  setSignPub(value: string): ReplicatedGroup;

  getLinkKey(): string;
  setLinkKey(value: string): ReplicatedGroup;

  getCreatedAt(): number;
  setCreatedAt(value: number): ReplicatedGroup;

  getUpdatedAt(): number;
  setUpdatedAt(value: number): ReplicatedGroup;

  getMetadataEntriesCount(): number;
  setMetadataEntriesCount(value: number): ReplicatedGroup;

  getMetadataLatestHead(): string;
  setMetadataLatestHead(value: string): ReplicatedGroup;

  getMessageEntriesCount(): number;
  setMessageEntriesCount(value: number): ReplicatedGroup;

  getMessageLatestHead(): string;
  setMessageLatestHead(value: string): ReplicatedGroup;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReplicatedGroup.AsObject;
  static toObject(includeInstance: boolean, msg: ReplicatedGroup): ReplicatedGroup.AsObject;
  static serializeBinaryToWriter(message: ReplicatedGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReplicatedGroup;
  static deserializeBinaryFromReader(message: ReplicatedGroup, reader: jspb.BinaryReader): ReplicatedGroup;
}

export namespace ReplicatedGroup {
  export type AsObject = {
    publicKey: string,
    signPub: string,
    linkKey: string,
    createdAt: number,
    updatedAt: number,
    metadataEntriesCount: number,
    metadataLatestHead: string,
    messageEntriesCount: number,
    messageLatestHead: string,
  }
}

export class ReplicatedGroupToken extends jspb.Message {
  getReplicatedGroupPublicKey(): string;
  setReplicatedGroupPublicKey(value: string): ReplicatedGroupToken;

  getReplicatedGroup(): ReplicatedGroup | undefined;
  setReplicatedGroup(value?: ReplicatedGroup): ReplicatedGroupToken;
  hasReplicatedGroup(): boolean;
  clearReplicatedGroup(): ReplicatedGroupToken;

  getTokenIssuer(): string;
  setTokenIssuer(value: string): ReplicatedGroupToken;

  getTokenId(): string;
  setTokenId(value: string): ReplicatedGroupToken;

  getCreatedAt(): number;
  setCreatedAt(value: number): ReplicatedGroupToken;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReplicatedGroupToken.AsObject;
  static toObject(includeInstance: boolean, msg: ReplicatedGroupToken): ReplicatedGroupToken.AsObject;
  static serializeBinaryToWriter(message: ReplicatedGroupToken, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReplicatedGroupToken;
  static deserializeBinaryFromReader(message: ReplicatedGroupToken, reader: jspb.BinaryReader): ReplicatedGroupToken;
}

export namespace ReplicatedGroupToken {
  export type AsObject = {
    replicatedGroupPublicKey: string,
    replicatedGroup?: ReplicatedGroup.AsObject,
    tokenIssuer: string,
    tokenId: string,
    createdAt: number,
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
    getGroup(): protocoltypes_pb.Group | undefined;
    setGroup(value?: protocoltypes_pb.Group): Request;
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
      group?: protocoltypes_pb.Group.AsObject,
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

export class ReplicateGlobalStats extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReplicateGlobalStats.AsObject;
  static toObject(includeInstance: boolean, msg: ReplicateGlobalStats): ReplicateGlobalStats.AsObject;
  static serializeBinaryToWriter(message: ReplicateGlobalStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReplicateGlobalStats;
  static deserializeBinaryFromReader(message: ReplicateGlobalStats, reader: jspb.BinaryReader): ReplicateGlobalStats;
}

export namespace ReplicateGlobalStats {
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
    getStartedAt(): number;
    setStartedAt(value: number): Reply;

    getReplicatedGroups(): number;
    setReplicatedGroups(value: number): Reply;

    getTotalMetadataEntries(): number;
    setTotalMetadataEntries(value: number): Reply;

    getTotalMessageEntries(): number;
    setTotalMessageEntries(value: number): Reply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Reply.AsObject;
    static toObject(includeInstance: boolean, msg: Reply): Reply.AsObject;
    static serializeBinaryToWriter(message: Reply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Reply;
    static deserializeBinaryFromReader(message: Reply, reader: jspb.BinaryReader): Reply;
  }

  export namespace Reply {
    export type AsObject = {
      startedAt: number,
      replicatedGroups: number,
      totalMetadataEntries: number,
      totalMessageEntries: number,
    }
  }

}

export class ReplicateGroupStats extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReplicateGroupStats.AsObject;
  static toObject(includeInstance: boolean, msg: ReplicateGroupStats): ReplicateGroupStats.AsObject;
  static serializeBinaryToWriter(message: ReplicateGroupStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReplicateGroupStats;
  static deserializeBinaryFromReader(message: ReplicateGroupStats, reader: jspb.BinaryReader): ReplicateGroupStats;
}

export namespace ReplicateGroupStats {
  export type AsObject = {
  }

  export class Request extends jspb.Message {
    getGroupPublicKey(): string;
    setGroupPublicKey(value: string): Request;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
  }

  export namespace Request {
    export type AsObject = {
      groupPublicKey: string,
    }
  }


  export class Reply extends jspb.Message {
    getGroup(): ReplicatedGroup | undefined;
    setGroup(value?: ReplicatedGroup): Reply;
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
      group?: ReplicatedGroup.AsObject,
    }
  }

}

