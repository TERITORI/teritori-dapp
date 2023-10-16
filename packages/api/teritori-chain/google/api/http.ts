// @ts-nocheck
import * as _m0 from "protobufjs/minimal";
import { DeepPartial } from "../../helpers";
/**
 * Defines the HTTP configuration for a service. It contains a list of
 * [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
 * to one or more HTTP REST API methods.
 */
export interface Http {
  /**
   * A list of HTTP configuration rules that apply to individual API methods.
   * 
   * **NOTE:** All service configuration rules follow "last one wins" order.
   */
  rules: HttpRule[];
}
/**
 * Defines the HTTP configuration for a service. It contains a list of
 * [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
 * to one or more HTTP REST API methods.
 */
export interface HttpSDKType {
  rules: HttpRuleSDKType[];
}
/**
 * `HttpRule` defines the mapping of an RPC method to one or more HTTP
 * REST APIs.  The mapping determines what portions of the request
 * message are populated from the path, query parameters, or body of
 * the HTTP request.  The mapping is typically specified as an
 * `google.api.http` annotation, see "google/api/annotations.proto"
 * for details.
 * 
 * The mapping consists of a field specifying the path template and
 * method kind.  The path template can refer to fields in the request
 * message, as in the example below which describes a REST GET
 * operation on a resource collection of messages:
 * 
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http).get = "/v1/messages/{message_id}/{sub.subfield}";
 *       }
 *     }
 *     message GetMessageRequest {
 *       message SubMessage {
 *         string subfield = 1;
 *       }
 *       string message_id = 1; // mapped to the URL
 *       SubMessage sub = 2;    // `sub.subfield` is url-mapped
 *     }
 *     message Message {
 *       string text = 1; // content of the resource
 *     }
 * 
 * The same http annotation can alternatively be expressed inside the
 * `GRPC API Configuration` YAML file.
 * 
 *     http:
 *       rules:
 *         - selector: <proto_package_name>.Messaging.GetMessage
 *           get: /v1/messages/{message_id}/{sub.subfield}
 * 
 * This definition enables an automatic, bidrectional mapping of HTTP
 * JSON to RPC. Example:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456/foo`  | `GetMessage(message_id: "123456" sub: SubMessage(subfield: "foo"))`
 * 
 * In general, not only fields but also field paths can be referenced
 * from a path pattern. Fields mapped to the path pattern cannot be
 * repeated and must have a primitive (non-message) type.
 * 
 * Any fields in the request message which are not bound by the path
 * pattern automatically become (optional) HTTP query
 * parameters. Assume the following definition of the request message:
 * 
 * 
 *     message GetMessageRequest {
 *       message SubMessage {
 *         string subfield = 1;
 *       }
 *       string message_id = 1; // mapped to the URL
 *       int64 revision = 2;    // becomes a parameter
 *       SubMessage sub = 3;    // `sub.subfield` becomes a parameter
 *     }
 * 
 * 
 * This enables a HTTP JSON to RPC mapping as below:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456?revision=2&sub.subfield=foo` | `GetMessage(message_id: "123456" revision: 2 sub: SubMessage(subfield: "foo"))`
 * 
 * Note that fields which are mapped to HTTP parameters must have a
 * primitive type or a repeated primitive type. Message types are not
 * allowed. In the case of a repeated type, the parameter can be
 * repeated in the URL, as in `...?param=A&param=B`.
 * 
 * For HTTP method kinds which allow a request body, the `body` field
 * specifies the mapping. Consider a REST update method on the
 * message resource collection:
 * 
 * 
 *     service Messaging {
 *       rpc UpdateMessage(UpdateMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *           put: "/v1/messages/{message_id}"
 *           body: "message"
 *         };
 *       }
 *     }
 *     message UpdateMessageRequest {
 *       string message_id = 1; // mapped to the URL
 *       Message message = 2;   // mapped to the body
 *     }
 * 
 * 
 * The following HTTP JSON to RPC mapping is enabled, where the
 * representation of the JSON in the request body is determined by
 * protos JSON encoding:
 * 
 * HTTP | RPC
 * -----|-----
 * `PUT /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id: "123456" message { text: "Hi!" })`
 * 
 * The special name `*` can be used in the body mapping to define that
 * every field not bound by the path template should be mapped to the
 * request body.  This enables the following alternative definition of
 * the update method:
 * 
 *     service Messaging {
 *       rpc UpdateMessage(Message) returns (Message) {
 *         option (google.api.http) = {
 *           put: "/v1/messages/{message_id}"
 *           body: "*"
 *         };
 *       }
 *     }
 *     message Message {
 *       string message_id = 1;
 *       string text = 2;
 *     }
 * 
 * 
 * The following HTTP JSON to RPC mapping is enabled:
 * 
 * HTTP | RPC
 * -----|-----
 * `PUT /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id: "123456" text: "Hi!")`
 * 
 * Note that when using `*` in the body mapping, it is not possible to
 * have HTTP parameters, as all fields not bound by the path end in
 * the body. This makes this option more rarely used in practice of
 * defining REST APIs. The common usage of `*` is in custom methods
 * which don't use the URL at all for transferring data.
 * 
 * It is possible to define multiple HTTP methods for one RPC by using
 * the `additional_bindings` option. Example:
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *           get: "/v1/messages/{message_id}"
 *           additional_bindings {
 *             get: "/v1/users/{user_id}/messages/{message_id}"
 *           }
 *         };
 *       }
 *     }
 *     message GetMessageRequest {
 *       string message_id = 1;
 *       string user_id = 2;
 *     }
 * 
 * 
 * This enables the following two alternative HTTP JSON to RPC
 * mappings:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456` | `GetMessage(message_id: "123456")`
 * `GET /v1/users/me/messages/123456` | `GetMessage(user_id: "me" message_id: "123456")`
 * 
 * # Rules for HTTP mapping
 * 
 * The rules for mapping HTTP path, query parameters, and body fields
 * to the request message are as follows:
 * 
 * 1. The `body` field specifies either `*` or a field path, or is
 *    omitted. If omitted, it assumes there is no HTTP body.
 * 2. Leaf fields (recursive expansion of nested messages in the
 *    request) can be classified into three types:
 *     (a) Matched in the URL template.
 *     (b) Covered by body (if body is `*`, everything except (a) fields;
 *         else everything under the body field)
 *     (c) All other fields.
 * 3. URL query parameters found in the HTTP request are mapped to (c) fields.
 * 4. Any body sent with an HTTP request can contain only (b) fields.
 * 
 * The syntax of the path template is as follows:
 * 
 *     Template = "/" Segments [ Verb ] ;
 *     Segments = Segment { "/" Segment } ;
 *     Segment  = "*" | "**" | LITERAL | Variable ;
 *     Variable = "{" FieldPath [ "=" Segments ] "}" ;
 *     FieldPath = IDENT { "." IDENT } ;
 *     Verb     = ":" LITERAL ;
 * 
 * The syntax `*` matches a single path segment. It follows the semantics of
 * [RFC 6570](https://tools.ietf.org/html/rfc6570) Section 3.2.2 Simple String
 * Expansion.
 * 
 * The syntax `**` matches zero or more path segments. It follows the semantics
 * of [RFC 6570](https://tools.ietf.org/html/rfc6570) Section 3.2.3 Reserved
 * Expansion. NOTE: it must be the last segment in the path except the Verb.
 * 
 * The syntax `LITERAL` matches literal text in the URL path.
 * 
 * The syntax `Variable` matches the entire path as specified by its template;
 * this nested template must not contain further variables. If a variable
 * matches a single path segment, its template may be omitted, e.g. `{var}`
 * is equivalent to `{var=*}`.
 * 
 * NOTE: the field paths in variables and in the `body` must not refer to
 * repeated fields or map fields.
 * 
 * Use CustomHttpPattern to specify any HTTP method that is not included in the
 * `pattern` field, such as HEAD, or "*" to leave the HTTP method unspecified for
 * a given URL path rule. The wild-card rule is useful for services that provide
 * content to Web (HTML) clients.
 */
export interface HttpRule {
  /**
   * Selects methods to which this rule applies.
   * 
   * Refer to [selector][google.api.DocumentationRule.selector] for syntax details.
   */
  selector: string;
  /** Used for listing and getting information about resources. */
  get?: string;
  /** Used for updating a resource. */
  put?: string;
  /** Used for creating a resource. */
  post?: string;
  /** Used for deleting a resource. */
  delete?: string;
  /** Used for updating a resource. */
  patch?: string;
  /** Custom pattern is used for defining custom verbs. */
  custom?: CustomHttpPattern;
  /**
   * The name of the request field whose value is mapped to the HTTP body, or
   * `*` for mapping all fields not captured by the path pattern to the HTTP
   * body. NOTE: the referred field must not be a repeated field and must be
   * present at the top-level of request message type.
   */
  body: string;
  /**
   * Additional HTTP bindings for the selector. Nested bindings must
   * not contain an `additional_bindings` field themselves (that is,
   * the nesting may only be one level deep).
   */
  additionalBindings: HttpRule[];
}
/**
 * `HttpRule` defines the mapping of an RPC method to one or more HTTP
 * REST APIs.  The mapping determines what portions of the request
 * message are populated from the path, query parameters, or body of
 * the HTTP request.  The mapping is typically specified as an
 * `google.api.http` annotation, see "google/api/annotations.proto"
 * for details.
 * 
 * The mapping consists of a field specifying the path template and
 * method kind.  The path template can refer to fields in the request
 * message, as in the example below which describes a REST GET
 * operation on a resource collection of messages:
 * 
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http).get = "/v1/messages/{message_id}/{sub.subfield}";
 *       }
 *     }
 *     message GetMessageRequest {
 *       message SubMessage {
 *         string subfield = 1;
 *       }
 *       string message_id = 1; // mapped to the URL
 *       SubMessage sub = 2;    // `sub.subfield` is url-mapped
 *     }
 *     message Message {
 *       string text = 1; // content of the resource
 *     }
 * 
 * The same http annotation can alternatively be expressed inside the
 * `GRPC API Configuration` YAML file.
 * 
 *     http:
 *       rules:
 *         - selector: <proto_package_name>.Messaging.GetMessage
 *           get: /v1/messages/{message_id}/{sub.subfield}
 * 
 * This definition enables an automatic, bidrectional mapping of HTTP
 * JSON to RPC. Example:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456/foo`  | `GetMessage(message_id: "123456" sub: SubMessage(subfield: "foo"))`
 * 
 * In general, not only fields but also field paths can be referenced
 * from a path pattern. Fields mapped to the path pattern cannot be
 * repeated and must have a primitive (non-message) type.
 * 
 * Any fields in the request message which are not bound by the path
 * pattern automatically become (optional) HTTP query
 * parameters. Assume the following definition of the request message:
 * 
 * 
 *     message GetMessageRequest {
 *       message SubMessage {
 *         string subfield = 1;
 *       }
 *       string message_id = 1; // mapped to the URL
 *       int64 revision = 2;    // becomes a parameter
 *       SubMessage sub = 3;    // `sub.subfield` becomes a parameter
 *     }
 * 
 * 
 * This enables a HTTP JSON to RPC mapping as below:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456?revision=2&sub.subfield=foo` | `GetMessage(message_id: "123456" revision: 2 sub: SubMessage(subfield: "foo"))`
 * 
 * Note that fields which are mapped to HTTP parameters must have a
 * primitive type or a repeated primitive type. Message types are not
 * allowed. In the case of a repeated type, the parameter can be
 * repeated in the URL, as in `...?param=A&param=B`.
 * 
 * For HTTP method kinds which allow a request body, the `body` field
 * specifies the mapping. Consider a REST update method on the
 * message resource collection:
 * 
 * 
 *     service Messaging {
 *       rpc UpdateMessage(UpdateMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *           put: "/v1/messages/{message_id}"
 *           body: "message"
 *         };
 *       }
 *     }
 *     message UpdateMessageRequest {
 *       string message_id = 1; // mapped to the URL
 *       Message message = 2;   // mapped to the body
 *     }
 * 
 * 
 * The following HTTP JSON to RPC mapping is enabled, where the
 * representation of the JSON in the request body is determined by
 * protos JSON encoding:
 * 
 * HTTP | RPC
 * -----|-----
 * `PUT /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id: "123456" message { text: "Hi!" })`
 * 
 * The special name `*` can be used in the body mapping to define that
 * every field not bound by the path template should be mapped to the
 * request body.  This enables the following alternative definition of
 * the update method:
 * 
 *     service Messaging {
 *       rpc UpdateMessage(Message) returns (Message) {
 *         option (google.api.http) = {
 *           put: "/v1/messages/{message_id}"
 *           body: "*"
 *         };
 *       }
 *     }
 *     message Message {
 *       string message_id = 1;
 *       string text = 2;
 *     }
 * 
 * 
 * The following HTTP JSON to RPC mapping is enabled:
 * 
 * HTTP | RPC
 * -----|-----
 * `PUT /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id: "123456" text: "Hi!")`
 * 
 * Note that when using `*` in the body mapping, it is not possible to
 * have HTTP parameters, as all fields not bound by the path end in
 * the body. This makes this option more rarely used in practice of
 * defining REST APIs. The common usage of `*` is in custom methods
 * which don't use the URL at all for transferring data.
 * 
 * It is possible to define multiple HTTP methods for one RPC by using
 * the `additional_bindings` option. Example:
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *           get: "/v1/messages/{message_id}"
 *           additional_bindings {
 *             get: "/v1/users/{user_id}/messages/{message_id}"
 *           }
 *         };
 *       }
 *     }
 *     message GetMessageRequest {
 *       string message_id = 1;
 *       string user_id = 2;
 *     }
 * 
 * 
 * This enables the following two alternative HTTP JSON to RPC
 * mappings:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456` | `GetMessage(message_id: "123456")`
 * `GET /v1/users/me/messages/123456` | `GetMessage(user_id: "me" message_id: "123456")`
 * 
 * # Rules for HTTP mapping
 * 
 * The rules for mapping HTTP path, query parameters, and body fields
 * to the request message are as follows:
 * 
 * 1. The `body` field specifies either `*` or a field path, or is
 *    omitted. If omitted, it assumes there is no HTTP body.
 * 2. Leaf fields (recursive expansion of nested messages in the
 *    request) can be classified into three types:
 *     (a) Matched in the URL template.
 *     (b) Covered by body (if body is `*`, everything except (a) fields;
 *         else everything under the body field)
 *     (c) All other fields.
 * 3. URL query parameters found in the HTTP request are mapped to (c) fields.
 * 4. Any body sent with an HTTP request can contain only (b) fields.
 * 
 * The syntax of the path template is as follows:
 * 
 *     Template = "/" Segments [ Verb ] ;
 *     Segments = Segment { "/" Segment } ;
 *     Segment  = "*" | "**" | LITERAL | Variable ;
 *     Variable = "{" FieldPath [ "=" Segments ] "}" ;
 *     FieldPath = IDENT { "." IDENT } ;
 *     Verb     = ":" LITERAL ;
 * 
 * The syntax `*` matches a single path segment. It follows the semantics of
 * [RFC 6570](https://tools.ietf.org/html/rfc6570) Section 3.2.2 Simple String
 * Expansion.
 * 
 * The syntax `**` matches zero or more path segments. It follows the semantics
 * of [RFC 6570](https://tools.ietf.org/html/rfc6570) Section 3.2.3 Reserved
 * Expansion. NOTE: it must be the last segment in the path except the Verb.
 * 
 * The syntax `LITERAL` matches literal text in the URL path.
 * 
 * The syntax `Variable` matches the entire path as specified by its template;
 * this nested template must not contain further variables. If a variable
 * matches a single path segment, its template may be omitted, e.g. `{var}`
 * is equivalent to `{var=*}`.
 * 
 * NOTE: the field paths in variables and in the `body` must not refer to
 * repeated fields or map fields.
 * 
 * Use CustomHttpPattern to specify any HTTP method that is not included in the
 * `pattern` field, such as HEAD, or "*" to leave the HTTP method unspecified for
 * a given URL path rule. The wild-card rule is useful for services that provide
 * content to Web (HTML) clients.
 */
export interface HttpRuleSDKType {
  selector: string;
  get?: string;
  put?: string;
  post?: string;
  delete?: string;
  patch?: string;
  custom?: CustomHttpPatternSDKType;
  body: string;
  additional_bindings: HttpRuleSDKType[];
}
/** A custom pattern is used for defining custom HTTP verb. */
export interface CustomHttpPattern {
  /** The name of this custom HTTP verb. */
  kind: string;
  /** The path matched by this custom verb. */
  path: string;
}
/** A custom pattern is used for defining custom HTTP verb. */
export interface CustomHttpPatternSDKType {
  kind: string;
  path: string;
}
function createBaseHttp(): Http {
  return {
    rules: []
  };
}
export const Http = {
  encode(message: Http, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.rules) {
      HttpRule.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Http {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHttp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rules.push(HttpRule.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<Http>): Http {
    const message = createBaseHttp();
    message.rules = object.rules?.map(e => HttpRule.fromPartial(e)) || [];
    return message;
  }
};
function createBaseHttpRule(): HttpRule {
  return {
    selector: "",
    get: undefined,
    put: undefined,
    post: undefined,
    delete: undefined,
    patch: undefined,
    custom: undefined,
    body: "",
    additionalBindings: []
  };
}
export const HttpRule = {
  encode(message: HttpRule, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.selector !== "") {
      writer.uint32(10).string(message.selector);
    }
    if (message.get !== undefined) {
      writer.uint32(18).string(message.get);
    }
    if (message.put !== undefined) {
      writer.uint32(26).string(message.put);
    }
    if (message.post !== undefined) {
      writer.uint32(34).string(message.post);
    }
    if (message.delete !== undefined) {
      writer.uint32(42).string(message.delete);
    }
    if (message.patch !== undefined) {
      writer.uint32(50).string(message.patch);
    }
    if (message.custom !== undefined) {
      CustomHttpPattern.encode(message.custom, writer.uint32(66).fork()).ldelim();
    }
    if (message.body !== "") {
      writer.uint32(58).string(message.body);
    }
    for (const v of message.additionalBindings) {
      HttpRule.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): HttpRule {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHttpRule();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.selector = reader.string();
          break;
        case 2:
          message.get = reader.string();
          break;
        case 3:
          message.put = reader.string();
          break;
        case 4:
          message.post = reader.string();
          break;
        case 5:
          message.delete = reader.string();
          break;
        case 6:
          message.patch = reader.string();
          break;
        case 8:
          message.custom = CustomHttpPattern.decode(reader, reader.uint32());
          break;
        case 7:
          message.body = reader.string();
          break;
        case 11:
          message.additionalBindings.push(HttpRule.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<HttpRule>): HttpRule {
    const message = createBaseHttpRule();
    message.selector = object.selector ?? "";
    message.get = object.get ?? undefined;
    message.put = object.put ?? undefined;
    message.post = object.post ?? undefined;
    message.delete = object.delete ?? undefined;
    message.patch = object.patch ?? undefined;
    message.custom = object.custom !== undefined && object.custom !== null ? CustomHttpPattern.fromPartial(object.custom) : undefined;
    message.body = object.body ?? "";
    message.additionalBindings = object.additionalBindings?.map(e => HttpRule.fromPartial(e)) || [];
    return message;
  }
};
function createBaseCustomHttpPattern(): CustomHttpPattern {
  return {
    kind: "",
    path: ""
  };
}
export const CustomHttpPattern = {
  encode(message: CustomHttpPattern, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.kind !== "") {
      writer.uint32(10).string(message.kind);
    }
    if (message.path !== "") {
      writer.uint32(18).string(message.path);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): CustomHttpPattern {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCustomHttpPattern();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.kind = reader.string();
          break;
        case 2:
          message.path = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<CustomHttpPattern>): CustomHttpPattern {
    const message = createBaseCustomHttpPattern();
    message.kind = object.kind ?? "";
    message.path = object.path ?? "";
    return message;
  }
};
