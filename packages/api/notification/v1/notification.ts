/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "notification.v1";

/** DismissNotification */
export interface DismissNotificationRequest {
  userId: string;
  notificationId: number;
}

export interface DismissNotificationResponse {
}

/** DismissAllNotification */
export interface DismissAllNotificationsRequest {
  userId: string;
}

export interface DismissAllNotificationsResponse {
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

export interface FollowingUsersRequest {
  userId: string;
}

export interface FollowingUsersResponse {
  notifications: Notification[];
}

function createBaseDismissNotificationRequest(): DismissNotificationRequest {
  return { userId: "", notificationId: 0 };
}

export const DismissNotificationRequest = {
  encode(message: DismissNotificationRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.notificationId !== 0) {
      writer.uint32(16).int64(message.notificationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DismissNotificationRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDismissNotificationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.notificationId = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DismissNotificationRequest {
    return {
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      notificationId: isSet(object.notificationId) ? globalThis.Number(object.notificationId) : 0,
    };
  },

  toJSON(message: DismissNotificationRequest): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.notificationId !== 0) {
      obj.notificationId = Math.round(message.notificationId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DismissNotificationRequest>, I>>(base?: I): DismissNotificationRequest {
    return DismissNotificationRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DismissNotificationRequest>, I>>(object: I): DismissNotificationRequest {
    const message = createBaseDismissNotificationRequest();
    message.userId = object.userId ?? "";
    message.notificationId = object.notificationId ?? 0;
    return message;
  },
};

function createBaseDismissNotificationResponse(): DismissNotificationResponse {
  return {};
}

export const DismissNotificationResponse = {
  encode(_: DismissNotificationResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DismissNotificationResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDismissNotificationResponse();
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

  fromJSON(_: any): DismissNotificationResponse {
    return {};
  },

  toJSON(_: DismissNotificationResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DismissNotificationResponse>, I>>(base?: I): DismissNotificationResponse {
    return DismissNotificationResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DismissNotificationResponse>, I>>(_: I): DismissNotificationResponse {
    const message = createBaseDismissNotificationResponse();
    return message;
  },
};

function createBaseDismissAllNotificationsRequest(): DismissAllNotificationsRequest {
  return { userId: "" };
}

export const DismissAllNotificationsRequest = {
  encode(message: DismissAllNotificationsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DismissAllNotificationsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDismissAllNotificationsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DismissAllNotificationsRequest {
    return { userId: isSet(object.userId) ? globalThis.String(object.userId) : "" };
  },

  toJSON(message: DismissAllNotificationsRequest): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DismissAllNotificationsRequest>, I>>(base?: I): DismissAllNotificationsRequest {
    return DismissAllNotificationsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DismissAllNotificationsRequest>, I>>(
    object: I,
  ): DismissAllNotificationsRequest {
    const message = createBaseDismissAllNotificationsRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseDismissAllNotificationsResponse(): DismissAllNotificationsResponse {
  return {};
}

export const DismissAllNotificationsResponse = {
  encode(_: DismissAllNotificationsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DismissAllNotificationsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDismissAllNotificationsResponse();
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

  fromJSON(_: any): DismissAllNotificationsResponse {
    return {};
  },

  toJSON(_: DismissAllNotificationsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DismissAllNotificationsResponse>, I>>(base?: I): DismissAllNotificationsResponse {
    return DismissAllNotificationsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DismissAllNotificationsResponse>, I>>(_: I): DismissAllNotificationsResponse {
    const message = createBaseDismissAllNotificationsResponse();
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNotificationsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): NotificationsRequest {
    return { userId: isSet(object.userId) ? globalThis.String(object.userId) : "" };
  },

  toJSON(message: NotificationsRequest): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<NotificationsRequest>, I>>(base?: I): NotificationsRequest {
    return NotificationsRequest.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNotificationsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.notifications.push(Notification.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): NotificationsResponse {
    return {
      notifications: globalThis.Array.isArray(object?.notifications)
        ? object.notifications.map((e: any) => Notification.fromJSON(e))
        : [],
    };
  },

  toJSON(message: NotificationsResponse): unknown {
    const obj: any = {};
    if (message.notifications?.length) {
      obj.notifications = message.notifications.map((e) => Notification.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<NotificationsResponse>, I>>(base?: I): NotificationsResponse {
    return NotificationsResponse.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNotification();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.triggerBy = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.body = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.action = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.category = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.createdAt = longToNumber(reader.int64() as Long);
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.dismissed = reader.bool();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.id = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Notification {
    return {
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      triggerBy: isSet(object.triggerBy) ? globalThis.String(object.triggerBy) : "",
      body: isSet(object.body) ? globalThis.String(object.body) : "",
      action: isSet(object.action) ? globalThis.String(object.action) : "",
      category: isSet(object.category) ? globalThis.String(object.category) : "",
      createdAt: isSet(object.createdAt) ? globalThis.Number(object.createdAt) : 0,
      dismissed: isSet(object.dismissed) ? globalThis.Boolean(object.dismissed) : false,
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
    };
  },

  toJSON(message: Notification): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.triggerBy !== "") {
      obj.triggerBy = message.triggerBy;
    }
    if (message.body !== "") {
      obj.body = message.body;
    }
    if (message.action !== "") {
      obj.action = message.action;
    }
    if (message.category !== "") {
      obj.category = message.category;
    }
    if (message.createdAt !== 0) {
      obj.createdAt = Math.round(message.createdAt);
    }
    if (message.dismissed === true) {
      obj.dismissed = message.dismissed;
    }
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Notification>, I>>(base?: I): Notification {
    return Notification.fromPartial(base ?? ({} as any));
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

function createBaseFollowingUsersRequest(): FollowingUsersRequest {
  return { userId: "" };
}

export const FollowingUsersRequest = {
  encode(message: FollowingUsersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FollowingUsersRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollowingUsersRequest();
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

  fromJSON(object: any): FollowingUsersRequest {
    return { userId: isSet(object.userId) ? String(object.userId) : "" };
  },

  toJSON(message: FollowingUsersRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FollowingUsersRequest>, I>>(object: I): FollowingUsersRequest {
    const message = createBaseFollowingUsersRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseFollowingUsersResponse(): FollowingUsersResponse {
  return { notifications: [] };
}

export const FollowingUsersResponse = {
  encode(message: FollowingUsersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.notifications) {
      Notification.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FollowingUsersResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollowingUsersResponse();
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

  fromJSON(object: any): FollowingUsersResponse {
    return {
      notifications: Array.isArray(object?.notifications)
        ? object.notifications.map((e: any) => Notification.fromJSON(e))
        : [],
    };
  },

  toJSON(message: FollowingUsersResponse): unknown {
    const obj: any = {};
    if (message.notifications) {
      obj.notifications = message.notifications.map((e) => e ? Notification.toJSON(e) : undefined);
    } else {
      obj.notifications = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FollowingUsersResponse>, I>>(object: I): FollowingUsersResponse {
    const message = createBaseFollowingUsersResponse();
    message.notifications = object.notifications?.map((e) => Notification.fromPartial(e)) || [];
    return message;
  },
};

export interface NotificationService {
  Notifications(request: DeepPartial<NotificationsRequest>, metadata?: grpc.Metadata): Promise<NotificationsResponse>;
  DismissNotification(
    request: DeepPartial<DismissNotificationRequest>,
    metadata?: grpc.Metadata,
  ): Promise<DismissNotificationResponse>;
  DismissAllNotifications(
    request: DeepPartial<DismissAllNotificationsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<DismissAllNotificationsResponse>;
  FollowingUsers(
    request: DeepPartial<FollowingUsersRequest>,
    metadata?: grpc.Metadata,
  ): Promise<FollowingUsersResponse>;
}

export class NotificationServiceClientImpl implements NotificationService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Notifications = this.Notifications.bind(this);
    this.DismissNotification = this.DismissNotification.bind(this);
    this.DismissAllNotifications = this.DismissAllNotifications.bind(this);
    this.FollowingUsers = this.FollowingUsers.bind(this);
  }

  Notifications(request: DeepPartial<NotificationsRequest>, metadata?: grpc.Metadata): Promise<NotificationsResponse> {
    return this.rpc.unary(NotificationServiceNotificationsDesc, NotificationsRequest.fromPartial(request), metadata);
  }

  DismissNotification(
    request: DeepPartial<DismissNotificationRequest>,
    metadata?: grpc.Metadata,
  ): Promise<DismissNotificationResponse> {
    return this.rpc.unary(
      NotificationServiceDismissNotificationDesc,
      DismissNotificationRequest.fromPartial(request),
      metadata,
    );
  }

  DismissAllNotifications(
    request: DeepPartial<DismissAllNotificationsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<DismissAllNotificationsResponse> {
    return this.rpc.unary(
      NotificationServiceDismissAllNotificationsDesc,
      DismissAllNotificationsRequest.fromPartial(request),
      metadata,
    );
  }

  FollowingUsers(
    request: DeepPartial<FollowingUsersRequest>,
    metadata?: grpc.Metadata,
  ): Promise<FollowingUsersResponse> {
    return this.rpc.unary(NotificationServiceFollowingUsersDesc, FollowingUsersRequest.fromPartial(request), metadata);
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
      const value = NotificationsResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
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
      return DismissNotificationRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = DismissNotificationResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
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
      return DismissAllNotificationsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = DismissAllNotificationsResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const NotificationServiceFollowingUsersDesc: UnaryMethodDefinitionish = {
  methodName: "FollowingUsers",
  service: NotificationServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return FollowingUsersRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...FollowingUsersResponse.decode(data),
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
