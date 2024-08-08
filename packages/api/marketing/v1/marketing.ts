/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "marketing.v1";

export interface MarketingCollectionPreview {
  id: string;
  imageUri: string;
  collectionName: string;
  creatorName: string;
  twitterUrl: string;
  secondaryDuringMint: boolean;
}

export interface Action {
  label: string;
  url: string;
}

export interface News {
  title: string;
  subtitle: string;
  text: string;
  image: string;
  actions: Action[];
}

export interface Banner {
  image: string;
  url: string;
}

export interface NewsRequest {
  testnet: boolean;
}

export interface NewsResponse {
  news: News[];
}

export interface BannersRequest {
  testnet: boolean;
}

export interface BannersResponse {
  banners: Banner[];
}

export interface LiveCollectionsRequest {
  networkId: string;
}

export interface LiveCollectionsResponse {
  collections: MarketingCollectionPreview[];
}

export interface UpcomingCollectionsRequest {
  networkId: string;
}

export interface UpcomingCollectionsResponse {
  collections: MarketingCollectionPreview[];
}

function createBaseMarketingCollectionPreview(): MarketingCollectionPreview {
  return { id: "", imageUri: "", collectionName: "", creatorName: "", twitterUrl: "", secondaryDuringMint: false };
}

export const MarketingCollectionPreview = {
  encode(message: MarketingCollectionPreview, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.imageUri !== "") {
      writer.uint32(18).string(message.imageUri);
    }
    if (message.collectionName !== "") {
      writer.uint32(26).string(message.collectionName);
    }
    if (message.creatorName !== "") {
      writer.uint32(34).string(message.creatorName);
    }
    if (message.twitterUrl !== "") {
      writer.uint32(42).string(message.twitterUrl);
    }
    if (message.secondaryDuringMint === true) {
      writer.uint32(48).bool(message.secondaryDuringMint);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MarketingCollectionPreview {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMarketingCollectionPreview();
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

          message.imageUri = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.collectionName = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.creatorName = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.twitterUrl = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.secondaryDuringMint = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MarketingCollectionPreview {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      imageUri: isSet(object.imageUri) ? globalThis.String(object.imageUri) : "",
      collectionName: isSet(object.collectionName) ? globalThis.String(object.collectionName) : "",
      creatorName: isSet(object.creatorName) ? globalThis.String(object.creatorName) : "",
      twitterUrl: isSet(object.twitterUrl) ? globalThis.String(object.twitterUrl) : "",
      secondaryDuringMint: isSet(object.secondaryDuringMint) ? globalThis.Boolean(object.secondaryDuringMint) : false,
    };
  },

  toJSON(message: MarketingCollectionPreview): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.imageUri !== "") {
      obj.imageUri = message.imageUri;
    }
    if (message.collectionName !== "") {
      obj.collectionName = message.collectionName;
    }
    if (message.creatorName !== "") {
      obj.creatorName = message.creatorName;
    }
    if (message.twitterUrl !== "") {
      obj.twitterUrl = message.twitterUrl;
    }
    if (message.secondaryDuringMint === true) {
      obj.secondaryDuringMint = message.secondaryDuringMint;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MarketingCollectionPreview>, I>>(base?: I): MarketingCollectionPreview {
    return MarketingCollectionPreview.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MarketingCollectionPreview>, I>>(object: I): MarketingCollectionPreview {
    const message = createBaseMarketingCollectionPreview();
    message.id = object.id ?? "";
    message.imageUri = object.imageUri ?? "";
    message.collectionName = object.collectionName ?? "";
    message.creatorName = object.creatorName ?? "";
    message.twitterUrl = object.twitterUrl ?? "";
    message.secondaryDuringMint = object.secondaryDuringMint ?? false;
    return message;
  },
};

function createBaseAction(): Action {
  return { label: "", url: "" };
}

export const Action = {
  encode(message: Action, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.label !== "") {
      writer.uint32(10).string(message.label);
    }
    if (message.url !== "") {
      writer.uint32(18).string(message.url);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Action {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.label = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.url = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Action {
    return {
      label: isSet(object.label) ? globalThis.String(object.label) : "",
      url: isSet(object.url) ? globalThis.String(object.url) : "",
    };
  },

  toJSON(message: Action): unknown {
    const obj: any = {};
    if (message.label !== "") {
      obj.label = message.label;
    }
    if (message.url !== "") {
      obj.url = message.url;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Action>, I>>(base?: I): Action {
    return Action.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Action>, I>>(object: I): Action {
    const message = createBaseAction();
    message.label = object.label ?? "";
    message.url = object.url ?? "";
    return message;
  },
};

function createBaseNews(): News {
  return { title: "", subtitle: "", text: "", image: "", actions: [] };
}

export const News = {
  encode(message: News, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.subtitle !== "") {
      writer.uint32(18).string(message.subtitle);
    }
    if (message.text !== "") {
      writer.uint32(26).string(message.text);
    }
    if (message.image !== "") {
      writer.uint32(34).string(message.image);
    }
    for (const v of message.actions) {
      Action.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): News {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNews();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.title = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.subtitle = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.text = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.image = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.actions.push(Action.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): News {
    return {
      title: isSet(object.title) ? globalThis.String(object.title) : "",
      subtitle: isSet(object.subtitle) ? globalThis.String(object.subtitle) : "",
      text: isSet(object.text) ? globalThis.String(object.text) : "",
      image: isSet(object.image) ? globalThis.String(object.image) : "",
      actions: globalThis.Array.isArray(object?.actions) ? object.actions.map((e: any) => Action.fromJSON(e)) : [],
    };
  },

  toJSON(message: News): unknown {
    const obj: any = {};
    if (message.title !== "") {
      obj.title = message.title;
    }
    if (message.subtitle !== "") {
      obj.subtitle = message.subtitle;
    }
    if (message.text !== "") {
      obj.text = message.text;
    }
    if (message.image !== "") {
      obj.image = message.image;
    }
    if (message.actions?.length) {
      obj.actions = message.actions.map((e) => Action.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<News>, I>>(base?: I): News {
    return News.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<News>, I>>(object: I): News {
    const message = createBaseNews();
    message.title = object.title ?? "";
    message.subtitle = object.subtitle ?? "";
    message.text = object.text ?? "";
    message.image = object.image ?? "";
    message.actions = object.actions?.map((e) => Action.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBanner(): Banner {
  return { image: "", url: "" };
}

export const Banner = {
  encode(message: Banner, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.image !== "") {
      writer.uint32(10).string(message.image);
    }
    if (message.url !== "") {
      writer.uint32(18).string(message.url);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Banner {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBanner();
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

          message.url = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Banner {
    return {
      image: isSet(object.image) ? globalThis.String(object.image) : "",
      url: isSet(object.url) ? globalThis.String(object.url) : "",
    };
  },

  toJSON(message: Banner): unknown {
    const obj: any = {};
    if (message.image !== "") {
      obj.image = message.image;
    }
    if (message.url !== "") {
      obj.url = message.url;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Banner>, I>>(base?: I): Banner {
    return Banner.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Banner>, I>>(object: I): Banner {
    const message = createBaseBanner();
    message.image = object.image ?? "";
    message.url = object.url ?? "";
    return message;
  },
};

function createBaseNewsRequest(): NewsRequest {
  return { testnet: false };
}

export const NewsRequest = {
  encode(message: NewsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.testnet === true) {
      writer.uint32(8).bool(message.testnet);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NewsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNewsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.testnet = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): NewsRequest {
    return { testnet: isSet(object.testnet) ? globalThis.Boolean(object.testnet) : false };
  },

  toJSON(message: NewsRequest): unknown {
    const obj: any = {};
    if (message.testnet === true) {
      obj.testnet = message.testnet;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<NewsRequest>, I>>(base?: I): NewsRequest {
    return NewsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<NewsRequest>, I>>(object: I): NewsRequest {
    const message = createBaseNewsRequest();
    message.testnet = object.testnet ?? false;
    return message;
  },
};

function createBaseNewsResponse(): NewsResponse {
  return { news: [] };
}

export const NewsResponse = {
  encode(message: NewsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.news) {
      News.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NewsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNewsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.news.push(News.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): NewsResponse {
    return { news: globalThis.Array.isArray(object?.news) ? object.news.map((e: any) => News.fromJSON(e)) : [] };
  },

  toJSON(message: NewsResponse): unknown {
    const obj: any = {};
    if (message.news?.length) {
      obj.news = message.news.map((e) => News.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<NewsResponse>, I>>(base?: I): NewsResponse {
    return NewsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<NewsResponse>, I>>(object: I): NewsResponse {
    const message = createBaseNewsResponse();
    message.news = object.news?.map((e) => News.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBannersRequest(): BannersRequest {
  return { testnet: false };
}

export const BannersRequest = {
  encode(message: BannersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.testnet === true) {
      writer.uint32(8).bool(message.testnet);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BannersRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBannersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.testnet = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BannersRequest {
    return { testnet: isSet(object.testnet) ? globalThis.Boolean(object.testnet) : false };
  },

  toJSON(message: BannersRequest): unknown {
    const obj: any = {};
    if (message.testnet === true) {
      obj.testnet = message.testnet;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BannersRequest>, I>>(base?: I): BannersRequest {
    return BannersRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BannersRequest>, I>>(object: I): BannersRequest {
    const message = createBaseBannersRequest();
    message.testnet = object.testnet ?? false;
    return message;
  },
};

function createBaseBannersResponse(): BannersResponse {
  return { banners: [] };
}

export const BannersResponse = {
  encode(message: BannersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.banners) {
      Banner.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BannersResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBannersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.banners.push(Banner.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BannersResponse {
    return {
      banners: globalThis.Array.isArray(object?.banners) ? object.banners.map((e: any) => Banner.fromJSON(e)) : [],
    };
  },

  toJSON(message: BannersResponse): unknown {
    const obj: any = {};
    if (message.banners?.length) {
      obj.banners = message.banners.map((e) => Banner.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BannersResponse>, I>>(base?: I): BannersResponse {
    return BannersResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BannersResponse>, I>>(object: I): BannersResponse {
    const message = createBaseBannersResponse();
    message.banners = object.banners?.map((e) => Banner.fromPartial(e)) || [];
    return message;
  },
};

function createBaseLiveCollectionsRequest(): LiveCollectionsRequest {
  return { networkId: "" };
}

export const LiveCollectionsRequest = {
  encode(message: LiveCollectionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.networkId !== "") {
      writer.uint32(10).string(message.networkId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LiveCollectionsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLiveCollectionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.networkId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LiveCollectionsRequest {
    return { networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "" };
  },

  toJSON(message: LiveCollectionsRequest): unknown {
    const obj: any = {};
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LiveCollectionsRequest>, I>>(base?: I): LiveCollectionsRequest {
    return LiveCollectionsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LiveCollectionsRequest>, I>>(object: I): LiveCollectionsRequest {
    const message = createBaseLiveCollectionsRequest();
    message.networkId = object.networkId ?? "";
    return message;
  },
};

function createBaseLiveCollectionsResponse(): LiveCollectionsResponse {
  return { collections: [] };
}

export const LiveCollectionsResponse = {
  encode(message: LiveCollectionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.collections) {
      MarketingCollectionPreview.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LiveCollectionsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLiveCollectionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.collections.push(MarketingCollectionPreview.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LiveCollectionsResponse {
    return {
      collections: globalThis.Array.isArray(object?.collections)
        ? object.collections.map((e: any) => MarketingCollectionPreview.fromJSON(e))
        : [],
    };
  },

  toJSON(message: LiveCollectionsResponse): unknown {
    const obj: any = {};
    if (message.collections?.length) {
      obj.collections = message.collections.map((e) => MarketingCollectionPreview.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LiveCollectionsResponse>, I>>(base?: I): LiveCollectionsResponse {
    return LiveCollectionsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LiveCollectionsResponse>, I>>(object: I): LiveCollectionsResponse {
    const message = createBaseLiveCollectionsResponse();
    message.collections = object.collections?.map((e) => MarketingCollectionPreview.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUpcomingCollectionsRequest(): UpcomingCollectionsRequest {
  return { networkId: "" };
}

export const UpcomingCollectionsRequest = {
  encode(message: UpcomingCollectionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.networkId !== "") {
      writer.uint32(10).string(message.networkId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpcomingCollectionsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpcomingCollectionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.networkId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpcomingCollectionsRequest {
    return { networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "" };
  },

  toJSON(message: UpcomingCollectionsRequest): unknown {
    const obj: any = {};
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpcomingCollectionsRequest>, I>>(base?: I): UpcomingCollectionsRequest {
    return UpcomingCollectionsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpcomingCollectionsRequest>, I>>(object: I): UpcomingCollectionsRequest {
    const message = createBaseUpcomingCollectionsRequest();
    message.networkId = object.networkId ?? "";
    return message;
  },
};

function createBaseUpcomingCollectionsResponse(): UpcomingCollectionsResponse {
  return { collections: [] };
}

export const UpcomingCollectionsResponse = {
  encode(message: UpcomingCollectionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.collections) {
      MarketingCollectionPreview.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpcomingCollectionsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpcomingCollectionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.collections.push(MarketingCollectionPreview.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpcomingCollectionsResponse {
    return {
      collections: globalThis.Array.isArray(object?.collections)
        ? object.collections.map((e: any) => MarketingCollectionPreview.fromJSON(e))
        : [],
    };
  },

  toJSON(message: UpcomingCollectionsResponse): unknown {
    const obj: any = {};
    if (message.collections?.length) {
      obj.collections = message.collections.map((e) => MarketingCollectionPreview.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpcomingCollectionsResponse>, I>>(base?: I): UpcomingCollectionsResponse {
    return UpcomingCollectionsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpcomingCollectionsResponse>, I>>(object: I): UpcomingCollectionsResponse {
    const message = createBaseUpcomingCollectionsResponse();
    message.collections = object.collections?.map((e) => MarketingCollectionPreview.fromPartial(e)) || [];
    return message;
  },
};

export interface MarketingService {
  News(request: DeepPartial<NewsRequest>, metadata?: grpc.Metadata): Promise<NewsResponse>;
  LiveCollections(
    request: DeepPartial<LiveCollectionsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<LiveCollectionsResponse>;
  UpcomingCollections(
    request: DeepPartial<UpcomingCollectionsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UpcomingCollectionsResponse>;
}

export class MarketingServiceClientImpl implements MarketingService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.News = this.News.bind(this);
    this.LiveCollections = this.LiveCollections.bind(this);
    this.UpcomingCollections = this.UpcomingCollections.bind(this);
  }

  News(request: DeepPartial<NewsRequest>, metadata?: grpc.Metadata): Promise<NewsResponse> {
    return this.rpc.unary(MarketingServiceNewsDesc, NewsRequest.fromPartial(request), metadata);
  }

  LiveCollections(
    request: DeepPartial<LiveCollectionsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<LiveCollectionsResponse> {
    return this.rpc.unary(MarketingServiceLiveCollectionsDesc, LiveCollectionsRequest.fromPartial(request), metadata);
  }

  UpcomingCollections(
    request: DeepPartial<UpcomingCollectionsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UpcomingCollectionsResponse> {
    return this.rpc.unary(
      MarketingServiceUpcomingCollectionsDesc,
      UpcomingCollectionsRequest.fromPartial(request),
      metadata,
    );
  }
}

export const MarketingServiceDesc = { serviceName: "marketing.v1.MarketingService" };

export const MarketingServiceNewsDesc: UnaryMethodDefinitionish = {
  methodName: "News",
  service: MarketingServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return NewsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = NewsResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MarketingServiceLiveCollectionsDesc: UnaryMethodDefinitionish = {
  methodName: "LiveCollections",
  service: MarketingServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return LiveCollectionsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = LiveCollectionsResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MarketingServiceUpcomingCollectionsDesc: UnaryMethodDefinitionish = {
  methodName: "UpcomingCollections",
  service: MarketingServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return UpcomingCollectionsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = UpcomingCollectionsResponse.decode(data);
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export class GrpcWebError extends globalThis.Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
