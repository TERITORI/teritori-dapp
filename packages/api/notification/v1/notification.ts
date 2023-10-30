/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "notification.v1";

/** DismissNotification */
export interface DismissNotificationsRequest {
  userId: string;
  notificationId: number;
}

export interface DismissNotificationsResponse {
  ok: boolean;
}

/** Notifications */
export interface NotificationsRequest {
  userId: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

export interface Notification {
  userId: string;
  triggerBy: string;
  body: string;
  action: string;
  category: string;
  createdAt: number;
  dismissed: boolean;
  id: number;
}

function createBaseDismissNotificationsRequest(): DismissNotificationsRequest {
  return { userId: "", notificationId: 0 };
}

export const DismissNotificationsRequest = {
  encode(message: DismissNotificationsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.notificationId !== 0) {
      writer.uint32(16).int64(message.notificationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DismissNotificationsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDismissNotificationsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.notificationId = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DismissNotificationsRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      notificationId: isSet(object.notificationId) ? Number(object.notificationId) : 0,
    };
  },

  toJSON(message: DismissNotificationsRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.notificationId !== undefined && (obj.notificationId = Math.round(message.notificationId));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DismissNotificationsRequest>, I>>(object: I): DismissNotificationsRequest {
    const message = createBaseDismissNotificationsRequest();
    message.userId = object.userId ?? "";
    message.notificationId = object.notificationId ?? 0;
    return message;
  },
};

function createBaseDismissNotificationsResponse(): DismissNotificationsResponse {
  return { ok: false };
}

export const DismissNotificationsResponse = {
  encode(message: DismissNotificationsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ok === true) {
      writer.uint32(8).bool(message.ok);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DismissNotificationsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDismissNotificationsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ok = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DismissNotificationsResponse {
    return { ok: isSet(object.ok) ? Boolean(object.ok) : false };
  },

  toJSON(message: DismissNotificationsResponse): unknown {
    const obj: any = {};
    message.ok !== undefined && (obj.ok = message.ok);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DismissNotificationsResponse>, I>>(object: I): DismissNotificationsResponse {
    const message = createBaseDismissNotificationsResponse();
    message.ok = object.ok ?? false;
    return message;
  },
};

function createBaseNotificationsRequest(): NotificationsRequest {
  return { userId: "" };
}

export const NotificationsRequest = {
  encode(message: NotificationsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NotificationsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNotificationsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NotificationsRequest {
    return { userId: isSet(object.userId) ? String(object.userId) : "" };
  },

  toJSON(message: NotificationsRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NotificationsRequest>, I>>(object: I): NotificationsRequest {
    const message = createBaseNotificationsRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseNotificationsResponse(): NotificationsResponse {
  return { notifications: [] };
}

export const NotificationsResponse = {
  encode(message: NotificationsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.notifications) {
      Notification.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NotificationsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNotificationsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.notifications.push(Notification.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NotificationsResponse {
    return {
      notifications: Array.isArray(object?.notifications)
        ? object.notifications.map((e: any) => Notification.fromJSON(e))
        : [],
    };
  },

  toJSON(message: NotificationsResponse): unknown {
    const obj: any = {};
    if (message.notifications) {
      obj.notifications = message.notifications.map((e) => e ? Notification.toJSON(e) : undefined);
    } else {
      obj.notifications = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NotificationsResponse>, I>>(object: I): NotificationsResponse {
    const message = createBaseNotificationsResponse();
    message.notifications = object.notifications?.map((e) => Notification.fromPartial(e)) || [];
    return message;
  },
};

function createBaseNotification(): Notification {
  return { userId: "", triggerBy: "", body: "", action: "", category: "", createdAt: 0, dismissed: false, id: 0 };
}

export const Notification = {
  encode(message: Notification, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.triggerBy !== "") {
      writer.uint32(18).string(message.triggerBy);
    }
    if (message.body !== "") {
      writer.uint32(26).string(message.body);
    }
    if (message.action !== "") {
      writer.uint32(34).string(message.action);
    }
    if (message.category !== "") {
      writer.uint32(42).string(message.category);
    }
    if (message.createdAt !== 0) {
      writer.uint32(48).int64(message.createdAt);
    }
    if (message.dismissed === true) {
      writer.uint32(56).bool(message.dismissed);
    }
    if (message.id !== 0) {
      writer.uint32(64).int64(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Notification {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNotification();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.triggerBy = reader.string();
          break;
        case 3:
          message.body = reader.string();
          break;
        case 4:
          message.action = reader.string();
          break;
        case 5:
          message.category = reader.string();
          break;
        case 6:
          message.createdAt = longToNumber(reader.int64() as Long);
          break;
        case 7:
          message.dismissed = reader.bool();
          break;
        case 8:
          message.id = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Notification {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      triggerBy: isSet(object.triggerBy) ? String(object.triggerBy) : "",
      body: isSet(object.body) ? String(object.body) : "",
      action: isSet(object.action) ? String(object.action) : "",
      category: isSet(object.category) ? String(object.category) : "",
      createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
      dismissed: isSet(object.dismissed) ? Boolean(object.dismissed) : false,
      id: isSet(object.id) ? Number(object.id) : 0,
    };
  },

  toJSON(message: Notification): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.triggerBy !== undefined && (obj.triggerBy = message.triggerBy);
    message.body !== undefined && (obj.body = message.body);
    message.action !== undefined && (obj.action = message.action);
    message.category !== undefined && (obj.category = message.category);
    message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
    message.dismissed !== undefined && (obj.dismissed = message.dismissed);
    message.id !== undefined && (obj.id = Math.round(message.id));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Notification>, I>>(object: I): Notification {
    const message = createBaseNotification();
    message.userId = object.userId ?? "";
    message.triggerBy = object.triggerBy ?? "";
    message.body = object.body ?? "";
    message.action = object.action ?? "";
    message.category = object.category ?? "";
    message.createdAt = object.createdAt ?? 0;
    message.dismissed = object.dismissed ?? false;
    message.id = object.id ?? 0;
    return message;
  },
};

export interface NotificationService {
  Notifications(request: DeepPartial<NotificationsRequest>, metadata?: grpc.Metadata): Promise<NotificationsResponse>;
  DismissNotification(
    request: DeepPartial<DismissNotificationsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<DismissNotificationsResponse>;
  /** rpc UpdateNotifications(NotificationsRequest) returns (DismissNotificationsResponse); */
  DismissAllNotifications(
    request: DeepPartial<NotificationsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<DismissNotificationsResponse>;
}

export class NotificationServiceClientImpl implements NotificationService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Notifications = this.Notifications.bind(this);
    this.DismissNotification = this.DismissNotification.bind(this);
    this.DismissAllNotifications = this.DismissAllNotifications.bind(this);
  }

  Notifications(request: DeepPartial<NotificationsRequest>, metadata?: grpc.Metadata): Promise<NotificationsResponse> {
    return this.rpc.unary(NotificationServiceNotificationsDesc, NotificationsRequest.fromPartial(request), metadata);
  }

  DismissNotification(
    request: DeepPartial<DismissNotificationsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<DismissNotificationsResponse> {
    return this.rpc.unary(
      NotificationServiceDismissNotificationDesc,
      DismissNotificationsRequest.fromPartial(request),
      metadata,
    );
  }

  DismissAllNotifications(
    request: DeepPartial<NotificationsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<DismissNotificationsResponse> {
    return this.rpc.unary(
      NotificationServiceDismissAllNotificationsDesc,
      NotificationsRequest.fromPartial(request),
      metadata,
    );
  }
}

export const NotificationServiceDesc = { serviceName: "notification.v1.NotificationService" };

export const NotificationServiceNotificationsDesc: UnaryMethodDefinitionish = {
  methodName: "Notifications",
  service: NotificationServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return NotificationsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...NotificationsResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const NotificationServiceDismissNotificationDesc: UnaryMethodDefinitionish = {
  methodName: "DismissNotification",
  service: NotificationServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return DismissNotificationsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...DismissNotificationsResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const NotificationServiceDismissAllNotificationsDesc: UnaryMethodDefinitionish = {
  methodName: "DismissAllNotifications",
  service: NotificationServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return NotificationsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...DismissNotificationsResponse.decode(data),
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

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
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

export class GrpcWebError extends Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
