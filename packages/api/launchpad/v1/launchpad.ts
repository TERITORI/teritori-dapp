/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "launchpad.v1";

export interface CalculateMerkleRootRequest {
  user: string;
  projectId: number;
  networkId: string;
  metadatas: Metadata[];
}

export interface CalculateMerkleRootResponse {
  merkleRoot: string;
}

export interface UploadMetadataRequest {
  user: string;
  projectId: number;
  networkId: string;
  metadatas: Metadata[];
}

export interface UploadMetadataResponse {
  merkleRoot: string;
}

export interface Metadata {
  image: string;
  imageData: string;
  externalUrl: string;
  description: string;
  name: string;
  attributes: Trait[];
  backgroundColor: string;
  animationUrl: string;
  youtubeUrl: string;
  royaltyPercentage: number;
  royaltyPaymentAddress: string;
}

export interface Trait {
  traitType: string;
  value: string;
}

export interface Collection {
  /** Collection info ---------------------------- */
  name: string;
  desc: string;
  symbol: string;
  coverImgUri: string;
  targetNetwork: string;
  externalLink: string;
  /** Collection details ---------------------------- */
  websiteLink: string;
  twitterProfile: string;
  twitterFollowersCount: number;
  contactDiscordName: string;
  contactEmail: string;
  isProjectDerivative: boolean;
  projectType: string;
  projectDesc: string;
  isAppliedPreviously: boolean;
  /** Team info -------------------------------------- */
  teamDesc: string;
  teamLink: string;
  partners: string;
  investedAmount: number;
  investmentLink: string;
  whitepaperLink: string;
  roadmapLink: string;
  /** Additional info ---------------------------- */
  artworkDesc: string;
  isReadyForMint: boolean;
  expectedSupply: number;
  expectedPublicMintPrice: number;
  expectedMintDate: number;
  escrowMintProceedsPeriod: number;
  doxState: string;
  daoWhitelistCount: number;
  /** Minting details ---------------------------- */
  tokensCount: number;
  unitPrice: number;
  limitPerAddress: number;
  startTime: number;
  /** Whitelist minting -------------------------- */
  whitelistAddresses: string[];
  whitelistUnitPrice: number;
  whitelistLimitPerAddress: string;
  whitelistMemberLimit: number;
  whitelistStartTime: number;
  whitelistEndTime: number;
  /** Royalty -------------------------- */
  royaltyAddress: string;
  royaltyPercentage: number;
  /** Extend info -------------------------- */
  baseTokenUri: string;
  merkleRoot: string;
  deployedAddress: string;
}

function createBaseCalculateMerkleRootRequest(): CalculateMerkleRootRequest {
  return { user: "", projectId: 0, networkId: "", metadatas: [] };
}

export const CalculateMerkleRootRequest = {
  encode(message: CalculateMerkleRootRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.user !== "") {
      writer.uint32(10).string(message.user);
    }
    if (message.projectId !== 0) {
      writer.uint32(16).uint32(message.projectId);
    }
    if (message.networkId !== "") {
      writer.uint32(26).string(message.networkId);
    }
    for (const v of message.metadatas) {
      Metadata.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CalculateMerkleRootRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCalculateMerkleRootRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.user = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.projectId = reader.uint32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.networkId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.metadatas.push(Metadata.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CalculateMerkleRootRequest {
    return {
      user: isSet(object.user) ? globalThis.String(object.user) : "",
      projectId: isSet(object.projectId) ? globalThis.Number(object.projectId) : 0,
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      metadatas: globalThis.Array.isArray(object?.metadatas)
        ? object.metadatas.map((e: any) => Metadata.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CalculateMerkleRootRequest): unknown {
    const obj: any = {};
    if (message.user !== "") {
      obj.user = message.user;
    }
    if (message.projectId !== 0) {
      obj.projectId = Math.round(message.projectId);
    }
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.metadatas?.length) {
      obj.metadatas = message.metadatas.map((e) => Metadata.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CalculateMerkleRootRequest>, I>>(base?: I): CalculateMerkleRootRequest {
    return CalculateMerkleRootRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CalculateMerkleRootRequest>, I>>(object: I): CalculateMerkleRootRequest {
    const message = createBaseCalculateMerkleRootRequest();
    message.user = object.user ?? "";
    message.projectId = object.projectId ?? 0;
    message.networkId = object.networkId ?? "";
    message.metadatas = object.metadatas?.map((e) => Metadata.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCalculateMerkleRootResponse(): CalculateMerkleRootResponse {
  return { merkleRoot: "" };
}

export const CalculateMerkleRootResponse = {
  encode(message: CalculateMerkleRootResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merkleRoot !== "") {
      writer.uint32(10).string(message.merkleRoot);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CalculateMerkleRootResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCalculateMerkleRootResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.merkleRoot = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CalculateMerkleRootResponse {
    return { merkleRoot: isSet(object.merkleRoot) ? globalThis.String(object.merkleRoot) : "" };
  },

  toJSON(message: CalculateMerkleRootResponse): unknown {
    const obj: any = {};
    if (message.merkleRoot !== "") {
      obj.merkleRoot = message.merkleRoot;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CalculateMerkleRootResponse>, I>>(base?: I): CalculateMerkleRootResponse {
    return CalculateMerkleRootResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CalculateMerkleRootResponse>, I>>(object: I): CalculateMerkleRootResponse {
    const message = createBaseCalculateMerkleRootResponse();
    message.merkleRoot = object.merkleRoot ?? "";
    return message;
  },
};

function createBaseUploadMetadataRequest(): UploadMetadataRequest {
  return { user: "", projectId: 0, networkId: "", metadatas: [] };
}

export const UploadMetadataRequest = {
  encode(message: UploadMetadataRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.user !== "") {
      writer.uint32(10).string(message.user);
    }
    if (message.projectId !== 0) {
      writer.uint32(16).uint32(message.projectId);
    }
    if (message.networkId !== "") {
      writer.uint32(26).string(message.networkId);
    }
    for (const v of message.metadatas) {
      Metadata.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadMetadataRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadMetadataRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.user = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.projectId = reader.uint32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.networkId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.metadatas.push(Metadata.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UploadMetadataRequest {
    return {
      user: isSet(object.user) ? globalThis.String(object.user) : "",
      projectId: isSet(object.projectId) ? globalThis.Number(object.projectId) : 0,
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      metadatas: globalThis.Array.isArray(object?.metadatas)
        ? object.metadatas.map((e: any) => Metadata.fromJSON(e))
        : [],
    };
  },

  toJSON(message: UploadMetadataRequest): unknown {
    const obj: any = {};
    if (message.user !== "") {
      obj.user = message.user;
    }
    if (message.projectId !== 0) {
      obj.projectId = Math.round(message.projectId);
    }
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.metadatas?.length) {
      obj.metadatas = message.metadatas.map((e) => Metadata.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UploadMetadataRequest>, I>>(base?: I): UploadMetadataRequest {
    return UploadMetadataRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UploadMetadataRequest>, I>>(object: I): UploadMetadataRequest {
    const message = createBaseUploadMetadataRequest();
    message.user = object.user ?? "";
    message.projectId = object.projectId ?? 0;
    message.networkId = object.networkId ?? "";
    message.metadatas = object.metadatas?.map((e) => Metadata.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUploadMetadataResponse(): UploadMetadataResponse {
  return { merkleRoot: "" };
}

export const UploadMetadataResponse = {
  encode(message: UploadMetadataResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merkleRoot !== "") {
      writer.uint32(10).string(message.merkleRoot);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadMetadataResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadMetadataResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.merkleRoot = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UploadMetadataResponse {
    return { merkleRoot: isSet(object.merkleRoot) ? globalThis.String(object.merkleRoot) : "" };
  },

  toJSON(message: UploadMetadataResponse): unknown {
    const obj: any = {};
    if (message.merkleRoot !== "") {
      obj.merkleRoot = message.merkleRoot;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UploadMetadataResponse>, I>>(base?: I): UploadMetadataResponse {
    return UploadMetadataResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UploadMetadataResponse>, I>>(object: I): UploadMetadataResponse {
    const message = createBaseUploadMetadataResponse();
    message.merkleRoot = object.merkleRoot ?? "";
    return message;
  },
};

function createBaseMetadata(): Metadata {
  return {
    image: "",
    imageData: "",
    externalUrl: "",
    description: "",
    name: "",
    attributes: [],
    backgroundColor: "",
    animationUrl: "",
    youtubeUrl: "",
    royaltyPercentage: 0,
    royaltyPaymentAddress: "",
  };
}

export const Metadata = {
  encode(message: Metadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.image !== "") {
      writer.uint32(10).string(message.image);
    }
    if (message.imageData !== "") {
      writer.uint32(18).string(message.imageData);
    }
    if (message.externalUrl !== "") {
      writer.uint32(26).string(message.externalUrl);
    }
    if (message.description !== "") {
      writer.uint32(34).string(message.description);
    }
    if (message.name !== "") {
      writer.uint32(42).string(message.name);
    }
    for (const v of message.attributes) {
      Trait.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.backgroundColor !== "") {
      writer.uint32(58).string(message.backgroundColor);
    }
    if (message.animationUrl !== "") {
      writer.uint32(66).string(message.animationUrl);
    }
    if (message.youtubeUrl !== "") {
      writer.uint32(74).string(message.youtubeUrl);
    }
    if (message.royaltyPercentage !== 0) {
      writer.uint32(80).uint64(message.royaltyPercentage);
    }
    if (message.royaltyPaymentAddress !== "") {
      writer.uint32(90).string(message.royaltyPaymentAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Metadata {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.image = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.imageData = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.externalUrl = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.description = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.name = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.attributes.push(Trait.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.backgroundColor = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.animationUrl = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.youtubeUrl = reader.string();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.royaltyPercentage = longToNumber(reader.uint64() as Long);
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.royaltyPaymentAddress = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Metadata {
    return {
      image: isSet(object.image) ? globalThis.String(object.image) : "",
      imageData: isSet(object.imageData) ? globalThis.String(object.imageData) : "",
      externalUrl: isSet(object.externalUrl) ? globalThis.String(object.externalUrl) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      attributes: globalThis.Array.isArray(object?.attributes)
        ? object.attributes.map((e: any) => Trait.fromJSON(e))
        : [],
      backgroundColor: isSet(object.backgroundColor) ? globalThis.String(object.backgroundColor) : "",
      animationUrl: isSet(object.animationUrl) ? globalThis.String(object.animationUrl) : "",
      youtubeUrl: isSet(object.youtubeUrl) ? globalThis.String(object.youtubeUrl) : "",
      royaltyPercentage: isSet(object.royaltyPercentage) ? globalThis.Number(object.royaltyPercentage) : 0,
      royaltyPaymentAddress: isSet(object.royaltyPaymentAddress) ? globalThis.String(object.royaltyPaymentAddress) : "",
    };
  },

  toJSON(message: Metadata): unknown {
    const obj: any = {};
    if (message.image !== "") {
      obj.image = message.image;
    }
    if (message.imageData !== "") {
      obj.imageData = message.imageData;
    }
    if (message.externalUrl !== "") {
      obj.externalUrl = message.externalUrl;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.attributes?.length) {
      obj.attributes = message.attributes.map((e) => Trait.toJSON(e));
    }
    if (message.backgroundColor !== "") {
      obj.backgroundColor = message.backgroundColor;
    }
    if (message.animationUrl !== "") {
      obj.animationUrl = message.animationUrl;
    }
    if (message.youtubeUrl !== "") {
      obj.youtubeUrl = message.youtubeUrl;
    }
    if (message.royaltyPercentage !== 0) {
      obj.royaltyPercentage = Math.round(message.royaltyPercentage);
    }
    if (message.royaltyPaymentAddress !== "") {
      obj.royaltyPaymentAddress = message.royaltyPaymentAddress;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Metadata>, I>>(base?: I): Metadata {
    return Metadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Metadata>, I>>(object: I): Metadata {
    const message = createBaseMetadata();
    message.image = object.image ?? "";
    message.imageData = object.imageData ?? "";
    message.externalUrl = object.externalUrl ?? "";
    message.description = object.description ?? "";
    message.name = object.name ?? "";
    message.attributes = object.attributes?.map((e) => Trait.fromPartial(e)) || [];
    message.backgroundColor = object.backgroundColor ?? "";
    message.animationUrl = object.animationUrl ?? "";
    message.youtubeUrl = object.youtubeUrl ?? "";
    message.royaltyPercentage = object.royaltyPercentage ?? 0;
    message.royaltyPaymentAddress = object.royaltyPaymentAddress ?? "";
    return message;
  },
};

function createBaseTrait(): Trait {
  return { traitType: "", value: "" };
}

export const Trait = {
  encode(message: Trait, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.traitType !== "") {
      writer.uint32(10).string(message.traitType);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Trait {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrait();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.traitType = reader.string();
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

  fromJSON(object: any): Trait {
    return {
      traitType: isSet(object.traitType) ? globalThis.String(object.traitType) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: Trait): unknown {
    const obj: any = {};
    if (message.traitType !== "") {
      obj.traitType = message.traitType;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Trait>, I>>(base?: I): Trait {
    return Trait.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Trait>, I>>(object: I): Trait {
    const message = createBaseTrait();
    message.traitType = object.traitType ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseCollection(): Collection {
  return {
    name: "",
    desc: "",
    symbol: "",
    coverImgUri: "",
    targetNetwork: "",
    externalLink: "",
    websiteLink: "",
    twitterProfile: "",
    twitterFollowersCount: 0,
    contactDiscordName: "",
    contactEmail: "",
    isProjectDerivative: false,
    projectType: "",
    projectDesc: "",
    isAppliedPreviously: false,
    teamDesc: "",
    teamLink: "",
    partners: "",
    investedAmount: 0,
    investmentLink: "",
    whitepaperLink: "",
    roadmapLink: "",
    artworkDesc: "",
    isReadyForMint: false,
    expectedSupply: 0,
    expectedPublicMintPrice: 0,
    expectedMintDate: 0,
    escrowMintProceedsPeriod: 0,
    doxState: "",
    daoWhitelistCount: 0,
    tokensCount: 0,
    unitPrice: 0,
    limitPerAddress: 0,
    startTime: 0,
    whitelistAddresses: [],
    whitelistUnitPrice: 0,
    whitelistLimitPerAddress: "",
    whitelistMemberLimit: 0,
    whitelistStartTime: 0,
    whitelistEndTime: 0,
    royaltyAddress: "",
    royaltyPercentage: 0,
    baseTokenUri: "",
    merkleRoot: "",
    deployedAddress: "",
  };
}

export const Collection = {
  encode(message: Collection, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.desc !== "") {
      writer.uint32(18).string(message.desc);
    }
    if (message.symbol !== "") {
      writer.uint32(26).string(message.symbol);
    }
    if (message.coverImgUri !== "") {
      writer.uint32(34).string(message.coverImgUri);
    }
    if (message.targetNetwork !== "") {
      writer.uint32(42).string(message.targetNetwork);
    }
    if (message.externalLink !== "") {
      writer.uint32(50).string(message.externalLink);
    }
    if (message.websiteLink !== "") {
      writer.uint32(58).string(message.websiteLink);
    }
    if (message.twitterProfile !== "") {
      writer.uint32(66).string(message.twitterProfile);
    }
    if (message.twitterFollowersCount !== 0) {
      writer.uint32(72).uint64(message.twitterFollowersCount);
    }
    if (message.contactDiscordName !== "") {
      writer.uint32(82).string(message.contactDiscordName);
    }
    if (message.contactEmail !== "") {
      writer.uint32(90).string(message.contactEmail);
    }
    if (message.isProjectDerivative === true) {
      writer.uint32(96).bool(message.isProjectDerivative);
    }
    if (message.projectType !== "") {
      writer.uint32(106).string(message.projectType);
    }
    if (message.projectDesc !== "") {
      writer.uint32(114).string(message.projectDesc);
    }
    if (message.isAppliedPreviously === true) {
      writer.uint32(120).bool(message.isAppliedPreviously);
    }
    if (message.teamDesc !== "") {
      writer.uint32(130).string(message.teamDesc);
    }
    if (message.teamLink !== "") {
      writer.uint32(138).string(message.teamLink);
    }
    if (message.partners !== "") {
      writer.uint32(146).string(message.partners);
    }
    if (message.investedAmount !== 0) {
      writer.uint32(152).uint64(message.investedAmount);
    }
    if (message.investmentLink !== "") {
      writer.uint32(162).string(message.investmentLink);
    }
    if (message.whitepaperLink !== "") {
      writer.uint32(170).string(message.whitepaperLink);
    }
    if (message.roadmapLink !== "") {
      writer.uint32(178).string(message.roadmapLink);
    }
    if (message.artworkDesc !== "") {
      writer.uint32(186).string(message.artworkDesc);
    }
    if (message.isReadyForMint === true) {
      writer.uint32(192).bool(message.isReadyForMint);
    }
    if (message.expectedSupply !== 0) {
      writer.uint32(200).uint32(message.expectedSupply);
    }
    if (message.expectedPublicMintPrice !== 0) {
      writer.uint32(208).uint64(message.expectedPublicMintPrice);
    }
    if (message.expectedMintDate !== 0) {
      writer.uint32(216).uint64(message.expectedMintDate);
    }
    if (message.escrowMintProceedsPeriod !== 0) {
      writer.uint32(224).uint64(message.escrowMintProceedsPeriod);
    }
    if (message.doxState !== "") {
      writer.uint32(234).string(message.doxState);
    }
    if (message.daoWhitelistCount !== 0) {
      writer.uint32(240).uint32(message.daoWhitelistCount);
    }
    if (message.tokensCount !== 0) {
      writer.uint32(248).uint32(message.tokensCount);
    }
    if (message.unitPrice !== 0) {
      writer.uint32(256).uint64(message.unitPrice);
    }
    if (message.limitPerAddress !== 0) {
      writer.uint32(264).uint32(message.limitPerAddress);
    }
    if (message.startTime !== 0) {
      writer.uint32(272).uint64(message.startTime);
    }
    for (const v of message.whitelistAddresses) {
      writer.uint32(282).string(v!);
    }
    if (message.whitelistUnitPrice !== 0) {
      writer.uint32(288).uint64(message.whitelistUnitPrice);
    }
    if (message.whitelistLimitPerAddress !== "") {
      writer.uint32(298).string(message.whitelistLimitPerAddress);
    }
    if (message.whitelistMemberLimit !== 0) {
      writer.uint32(304).uint32(message.whitelistMemberLimit);
    }
    if (message.whitelistStartTime !== 0) {
      writer.uint32(312).uint64(message.whitelistStartTime);
    }
    if (message.whitelistEndTime !== 0) {
      writer.uint32(320).uint64(message.whitelistEndTime);
    }
    if (message.royaltyAddress !== "") {
      writer.uint32(330).string(message.royaltyAddress);
    }
    if (message.royaltyPercentage !== 0) {
      writer.uint32(336).uint32(message.royaltyPercentage);
    }
    if (message.baseTokenUri !== "") {
      writer.uint32(346).string(message.baseTokenUri);
    }
    if (message.merkleRoot !== "") {
      writer.uint32(354).string(message.merkleRoot);
    }
    if (message.deployedAddress !== "") {
      writer.uint32(362).string(message.deployedAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Collection {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollection();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.desc = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.symbol = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.coverImgUri = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.targetNetwork = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.externalLink = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.websiteLink = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.twitterProfile = reader.string();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.twitterFollowersCount = longToNumber(reader.uint64() as Long);
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.contactDiscordName = reader.string();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.contactEmail = reader.string();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.isProjectDerivative = reader.bool();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.projectType = reader.string();
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.projectDesc = reader.string();
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }

          message.isAppliedPreviously = reader.bool();
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.teamDesc = reader.string();
          continue;
        case 17:
          if (tag !== 138) {
            break;
          }

          message.teamLink = reader.string();
          continue;
        case 18:
          if (tag !== 146) {
            break;
          }

          message.partners = reader.string();
          continue;
        case 19:
          if (tag !== 152) {
            break;
          }

          message.investedAmount = longToNumber(reader.uint64() as Long);
          continue;
        case 20:
          if (tag !== 162) {
            break;
          }

          message.investmentLink = reader.string();
          continue;
        case 21:
          if (tag !== 170) {
            break;
          }

          message.whitepaperLink = reader.string();
          continue;
        case 22:
          if (tag !== 178) {
            break;
          }

          message.roadmapLink = reader.string();
          continue;
        case 23:
          if (tag !== 186) {
            break;
          }

          message.artworkDesc = reader.string();
          continue;
        case 24:
          if (tag !== 192) {
            break;
          }

          message.isReadyForMint = reader.bool();
          continue;
        case 25:
          if (tag !== 200) {
            break;
          }

          message.expectedSupply = reader.uint32();
          continue;
        case 26:
          if (tag !== 208) {
            break;
          }

          message.expectedPublicMintPrice = longToNumber(reader.uint64() as Long);
          continue;
        case 27:
          if (tag !== 216) {
            break;
          }

          message.expectedMintDate = longToNumber(reader.uint64() as Long);
          continue;
        case 28:
          if (tag !== 224) {
            break;
          }

          message.escrowMintProceedsPeriod = longToNumber(reader.uint64() as Long);
          continue;
        case 29:
          if (tag !== 234) {
            break;
          }

          message.doxState = reader.string();
          continue;
        case 30:
          if (tag !== 240) {
            break;
          }

          message.daoWhitelistCount = reader.uint32();
          continue;
        case 31:
          if (tag !== 248) {
            break;
          }

          message.tokensCount = reader.uint32();
          continue;
        case 32:
          if (tag !== 256) {
            break;
          }

          message.unitPrice = longToNumber(reader.uint64() as Long);
          continue;
        case 33:
          if (tag !== 264) {
            break;
          }

          message.limitPerAddress = reader.uint32();
          continue;
        case 34:
          if (tag !== 272) {
            break;
          }

          message.startTime = longToNumber(reader.uint64() as Long);
          continue;
        case 35:
          if (tag !== 282) {
            break;
          }

          message.whitelistAddresses.push(reader.string());
          continue;
        case 36:
          if (tag !== 288) {
            break;
          }

          message.whitelistUnitPrice = longToNumber(reader.uint64() as Long);
          continue;
        case 37:
          if (tag !== 298) {
            break;
          }

          message.whitelistLimitPerAddress = reader.string();
          continue;
        case 38:
          if (tag !== 304) {
            break;
          }

          message.whitelistMemberLimit = reader.uint32();
          continue;
        case 39:
          if (tag !== 312) {
            break;
          }

          message.whitelistStartTime = longToNumber(reader.uint64() as Long);
          continue;
        case 40:
          if (tag !== 320) {
            break;
          }

          message.whitelistEndTime = longToNumber(reader.uint64() as Long);
          continue;
        case 41:
          if (tag !== 330) {
            break;
          }

          message.royaltyAddress = reader.string();
          continue;
        case 42:
          if (tag !== 336) {
            break;
          }

          message.royaltyPercentage = reader.uint32();
          continue;
        case 43:
          if (tag !== 346) {
            break;
          }

          message.baseTokenUri = reader.string();
          continue;
        case 44:
          if (tag !== 354) {
            break;
          }

          message.merkleRoot = reader.string();
          continue;
        case 45:
          if (tag !== 362) {
            break;
          }

          message.deployedAddress = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Collection {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      desc: isSet(object.desc) ? globalThis.String(object.desc) : "",
      symbol: isSet(object.symbol) ? globalThis.String(object.symbol) : "",
      coverImgUri: isSet(object.coverImgUri) ? globalThis.String(object.coverImgUri) : "",
      targetNetwork: isSet(object.targetNetwork) ? globalThis.String(object.targetNetwork) : "",
      externalLink: isSet(object.externalLink) ? globalThis.String(object.externalLink) : "",
      websiteLink: isSet(object.websiteLink) ? globalThis.String(object.websiteLink) : "",
      twitterProfile: isSet(object.twitterProfile) ? globalThis.String(object.twitterProfile) : "",
      twitterFollowersCount: isSet(object.twitterFollowersCount) ? globalThis.Number(object.twitterFollowersCount) : 0,
      contactDiscordName: isSet(object.contactDiscordName) ? globalThis.String(object.contactDiscordName) : "",
      contactEmail: isSet(object.contactEmail) ? globalThis.String(object.contactEmail) : "",
      isProjectDerivative: isSet(object.isProjectDerivative) ? globalThis.Boolean(object.isProjectDerivative) : false,
      projectType: isSet(object.projectType) ? globalThis.String(object.projectType) : "",
      projectDesc: isSet(object.projectDesc) ? globalThis.String(object.projectDesc) : "",
      isAppliedPreviously: isSet(object.isAppliedPreviously) ? globalThis.Boolean(object.isAppliedPreviously) : false,
      teamDesc: isSet(object.teamDesc) ? globalThis.String(object.teamDesc) : "",
      teamLink: isSet(object.teamLink) ? globalThis.String(object.teamLink) : "",
      partners: isSet(object.partners) ? globalThis.String(object.partners) : "",
      investedAmount: isSet(object.investedAmount) ? globalThis.Number(object.investedAmount) : 0,
      investmentLink: isSet(object.investmentLink) ? globalThis.String(object.investmentLink) : "",
      whitepaperLink: isSet(object.whitepaperLink) ? globalThis.String(object.whitepaperLink) : "",
      roadmapLink: isSet(object.roadmapLink) ? globalThis.String(object.roadmapLink) : "",
      artworkDesc: isSet(object.artworkDesc) ? globalThis.String(object.artworkDesc) : "",
      isReadyForMint: isSet(object.isReadyForMint) ? globalThis.Boolean(object.isReadyForMint) : false,
      expectedSupply: isSet(object.expectedSupply) ? globalThis.Number(object.expectedSupply) : 0,
      expectedPublicMintPrice: isSet(object.expectedPublicMintPrice)
        ? globalThis.Number(object.expectedPublicMintPrice)
        : 0,
      expectedMintDate: isSet(object.expectedMintDate) ? globalThis.Number(object.expectedMintDate) : 0,
      escrowMintProceedsPeriod: isSet(object.escrowMintProceedsPeriod)
        ? globalThis.Number(object.escrowMintProceedsPeriod)
        : 0,
      doxState: isSet(object.doxState) ? globalThis.String(object.doxState) : "",
      daoWhitelistCount: isSet(object.daoWhitelistCount) ? globalThis.Number(object.daoWhitelistCount) : 0,
      tokensCount: isSet(object.tokensCount) ? globalThis.Number(object.tokensCount) : 0,
      unitPrice: isSet(object.unitPrice) ? globalThis.Number(object.unitPrice) : 0,
      limitPerAddress: isSet(object.limitPerAddress) ? globalThis.Number(object.limitPerAddress) : 0,
      startTime: isSet(object.startTime) ? globalThis.Number(object.startTime) : 0,
      whitelistAddresses: globalThis.Array.isArray(object?.whitelistAddresses)
        ? object.whitelistAddresses.map((e: any) => globalThis.String(e))
        : [],
      whitelistUnitPrice: isSet(object.whitelistUnitPrice) ? globalThis.Number(object.whitelistUnitPrice) : 0,
      whitelistLimitPerAddress: isSet(object.whitelistLimitPerAddress)
        ? globalThis.String(object.whitelistLimitPerAddress)
        : "",
      whitelistMemberLimit: isSet(object.whitelistMemberLimit) ? globalThis.Number(object.whitelistMemberLimit) : 0,
      whitelistStartTime: isSet(object.whitelistStartTime) ? globalThis.Number(object.whitelistStartTime) : 0,
      whitelistEndTime: isSet(object.whitelistEndTime) ? globalThis.Number(object.whitelistEndTime) : 0,
      royaltyAddress: isSet(object.royaltyAddress) ? globalThis.String(object.royaltyAddress) : "",
      royaltyPercentage: isSet(object.royaltyPercentage) ? globalThis.Number(object.royaltyPercentage) : 0,
      baseTokenUri: isSet(object.baseTokenUri) ? globalThis.String(object.baseTokenUri) : "",
      merkleRoot: isSet(object.merkleRoot) ? globalThis.String(object.merkleRoot) : "",
      deployedAddress: isSet(object.deployedAddress) ? globalThis.String(object.deployedAddress) : "",
    };
  },

  toJSON(message: Collection): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.desc !== "") {
      obj.desc = message.desc;
    }
    if (message.symbol !== "") {
      obj.symbol = message.symbol;
    }
    if (message.coverImgUri !== "") {
      obj.coverImgUri = message.coverImgUri;
    }
    if (message.targetNetwork !== "") {
      obj.targetNetwork = message.targetNetwork;
    }
    if (message.externalLink !== "") {
      obj.externalLink = message.externalLink;
    }
    if (message.websiteLink !== "") {
      obj.websiteLink = message.websiteLink;
    }
    if (message.twitterProfile !== "") {
      obj.twitterProfile = message.twitterProfile;
    }
    if (message.twitterFollowersCount !== 0) {
      obj.twitterFollowersCount = Math.round(message.twitterFollowersCount);
    }
    if (message.contactDiscordName !== "") {
      obj.contactDiscordName = message.contactDiscordName;
    }
    if (message.contactEmail !== "") {
      obj.contactEmail = message.contactEmail;
    }
    if (message.isProjectDerivative === true) {
      obj.isProjectDerivative = message.isProjectDerivative;
    }
    if (message.projectType !== "") {
      obj.projectType = message.projectType;
    }
    if (message.projectDesc !== "") {
      obj.projectDesc = message.projectDesc;
    }
    if (message.isAppliedPreviously === true) {
      obj.isAppliedPreviously = message.isAppliedPreviously;
    }
    if (message.teamDesc !== "") {
      obj.teamDesc = message.teamDesc;
    }
    if (message.teamLink !== "") {
      obj.teamLink = message.teamLink;
    }
    if (message.partners !== "") {
      obj.partners = message.partners;
    }
    if (message.investedAmount !== 0) {
      obj.investedAmount = Math.round(message.investedAmount);
    }
    if (message.investmentLink !== "") {
      obj.investmentLink = message.investmentLink;
    }
    if (message.whitepaperLink !== "") {
      obj.whitepaperLink = message.whitepaperLink;
    }
    if (message.roadmapLink !== "") {
      obj.roadmapLink = message.roadmapLink;
    }
    if (message.artworkDesc !== "") {
      obj.artworkDesc = message.artworkDesc;
    }
    if (message.isReadyForMint === true) {
      obj.isReadyForMint = message.isReadyForMint;
    }
    if (message.expectedSupply !== 0) {
      obj.expectedSupply = Math.round(message.expectedSupply);
    }
    if (message.expectedPublicMintPrice !== 0) {
      obj.expectedPublicMintPrice = Math.round(message.expectedPublicMintPrice);
    }
    if (message.expectedMintDate !== 0) {
      obj.expectedMintDate = Math.round(message.expectedMintDate);
    }
    if (message.escrowMintProceedsPeriod !== 0) {
      obj.escrowMintProceedsPeriod = Math.round(message.escrowMintProceedsPeriod);
    }
    if (message.doxState !== "") {
      obj.doxState = message.doxState;
    }
    if (message.daoWhitelistCount !== 0) {
      obj.daoWhitelistCount = Math.round(message.daoWhitelistCount);
    }
    if (message.tokensCount !== 0) {
      obj.tokensCount = Math.round(message.tokensCount);
    }
    if (message.unitPrice !== 0) {
      obj.unitPrice = Math.round(message.unitPrice);
    }
    if (message.limitPerAddress !== 0) {
      obj.limitPerAddress = Math.round(message.limitPerAddress);
    }
    if (message.startTime !== 0) {
      obj.startTime = Math.round(message.startTime);
    }
    if (message.whitelistAddresses?.length) {
      obj.whitelistAddresses = message.whitelistAddresses;
    }
    if (message.whitelistUnitPrice !== 0) {
      obj.whitelistUnitPrice = Math.round(message.whitelistUnitPrice);
    }
    if (message.whitelistLimitPerAddress !== "") {
      obj.whitelistLimitPerAddress = message.whitelistLimitPerAddress;
    }
    if (message.whitelistMemberLimit !== 0) {
      obj.whitelistMemberLimit = Math.round(message.whitelistMemberLimit);
    }
    if (message.whitelistStartTime !== 0) {
      obj.whitelistStartTime = Math.round(message.whitelistStartTime);
    }
    if (message.whitelistEndTime !== 0) {
      obj.whitelistEndTime = Math.round(message.whitelistEndTime);
    }
    if (message.royaltyAddress !== "") {
      obj.royaltyAddress = message.royaltyAddress;
    }
    if (message.royaltyPercentage !== 0) {
      obj.royaltyPercentage = Math.round(message.royaltyPercentage);
    }
    if (message.baseTokenUri !== "") {
      obj.baseTokenUri = message.baseTokenUri;
    }
    if (message.merkleRoot !== "") {
      obj.merkleRoot = message.merkleRoot;
    }
    if (message.deployedAddress !== "") {
      obj.deployedAddress = message.deployedAddress;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Collection>, I>>(base?: I): Collection {
    return Collection.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Collection>, I>>(object: I): Collection {
    const message = createBaseCollection();
    message.name = object.name ?? "";
    message.desc = object.desc ?? "";
    message.symbol = object.symbol ?? "";
    message.coverImgUri = object.coverImgUri ?? "";
    message.targetNetwork = object.targetNetwork ?? "";
    message.externalLink = object.externalLink ?? "";
    message.websiteLink = object.websiteLink ?? "";
    message.twitterProfile = object.twitterProfile ?? "";
    message.twitterFollowersCount = object.twitterFollowersCount ?? 0;
    message.contactDiscordName = object.contactDiscordName ?? "";
    message.contactEmail = object.contactEmail ?? "";
    message.isProjectDerivative = object.isProjectDerivative ?? false;
    message.projectType = object.projectType ?? "";
    message.projectDesc = object.projectDesc ?? "";
    message.isAppliedPreviously = object.isAppliedPreviously ?? false;
    message.teamDesc = object.teamDesc ?? "";
    message.teamLink = object.teamLink ?? "";
    message.partners = object.partners ?? "";
    message.investedAmount = object.investedAmount ?? 0;
    message.investmentLink = object.investmentLink ?? "";
    message.whitepaperLink = object.whitepaperLink ?? "";
    message.roadmapLink = object.roadmapLink ?? "";
    message.artworkDesc = object.artworkDesc ?? "";
    message.isReadyForMint = object.isReadyForMint ?? false;
    message.expectedSupply = object.expectedSupply ?? 0;
    message.expectedPublicMintPrice = object.expectedPublicMintPrice ?? 0;
    message.expectedMintDate = object.expectedMintDate ?? 0;
    message.escrowMintProceedsPeriod = object.escrowMintProceedsPeriod ?? 0;
    message.doxState = object.doxState ?? "";
    message.daoWhitelistCount = object.daoWhitelistCount ?? 0;
    message.tokensCount = object.tokensCount ?? 0;
    message.unitPrice = object.unitPrice ?? 0;
    message.limitPerAddress = object.limitPerAddress ?? 0;
    message.startTime = object.startTime ?? 0;
    message.whitelistAddresses = object.whitelistAddresses?.map((e) => e) || [];
    message.whitelistUnitPrice = object.whitelistUnitPrice ?? 0;
    message.whitelistLimitPerAddress = object.whitelistLimitPerAddress ?? "";
    message.whitelistMemberLimit = object.whitelistMemberLimit ?? 0;
    message.whitelistStartTime = object.whitelistStartTime ?? 0;
    message.whitelistEndTime = object.whitelistEndTime ?? 0;
    message.royaltyAddress = object.royaltyAddress ?? "";
    message.royaltyPercentage = object.royaltyPercentage ?? 0;
    message.baseTokenUri = object.baseTokenUri ?? "";
    message.merkleRoot = object.merkleRoot ?? "";
    message.deployedAddress = object.deployedAddress ?? "";
    return message;
  },
};

export interface LaunchpadService {
  UploadMetadata(
    request: DeepPartial<UploadMetadataRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UploadMetadataResponse>;
  CalculateMerkleRoot(
    request: DeepPartial<CalculateMerkleRootRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CalculateMerkleRootResponse>;
}

export class LaunchpadServiceClientImpl implements LaunchpadService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.UploadMetadata = this.UploadMetadata.bind(this);
    this.CalculateMerkleRoot = this.CalculateMerkleRoot.bind(this);
  }

  UploadMetadata(
    request: DeepPartial<UploadMetadataRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UploadMetadataResponse> {
    return this.rpc.unary(LaunchpadServiceUploadMetadataDesc, UploadMetadataRequest.fromPartial(request), metadata);
  }

  CalculateMerkleRoot(
    request: DeepPartial<CalculateMerkleRootRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CalculateMerkleRootResponse> {
    return this.rpc.unary(
      LaunchpadServiceCalculateMerkleRootDesc,
      CalculateMerkleRootRequest.fromPartial(request),
      metadata,
    );
  }
}

export const LaunchpadServiceDesc = { serviceName: "launchpad.v1.LaunchpadService" };

export const LaunchpadServiceUploadMetadataDesc: UnaryMethodDefinitionish = {
  methodName: "UploadMetadata",
  service: LaunchpadServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return UploadMetadataRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = UploadMetadataResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const LaunchpadServiceCalculateMerkleRootDesc: UnaryMethodDefinitionish = {
  methodName: "CalculateMerkleRoot",
  service: LaunchpadServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return CalculateMerkleRootRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = CalculateMerkleRootResponse.decode(data);
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export class GrpcWebError extends globalThis.Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
