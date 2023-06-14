import protobuf from "protobufjs";
import _m0 from "protobufjs/minimal";

export const bytesFromString = (str: string = ""): Uint8Array => {
  const bin = atob(decodeURIComponent(str));
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
};

export const stringFromBytes = (
  arr: Uint8Array = new Uint8Array([])
): string => {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString();
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return btoa(bin.join(""));
  }
};

export const encode = (str: string) => {
  return new TextEncoder().encode(encodeURIComponent(str));
};

// export const decode = (arr: Uint8Array) => {
//   return decodeURIComponent(
//     new TextDecoder().decode(arr).replace(/(\r\n|\n|\r)/gm, "")
//   );
// };

function createBaseAccountCryptoChallenge() {
  return { challenge: "" };
}

export function decode(input: Uint8Array, length?: number) {
  const reader = new _m0.Reader(input);
  const end = length === undefined ? reader.len : reader.pos + length;
  const message = createBaseAccountCryptoChallenge();
  while (reader.pos < end) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1:
        message.challenge = reader.string();
        break;
      default:
        reader.skipType(tag & 7);
        break;
    }
  }
  return message;
}

export const decodeJSON = (arr: Uint8Array) => {
  const match = new TextDecoder().decode(arr).match(/%7B%22.+%22%7D/gm);

  if (!match?.[0]) {
    return new TextDecoder().decode(arr);
  } else {
    return decodeURIComponent(match[0]);
  }
};

export const b64EncodeUnicode = (str: string) => {
  return btoa(encodeURIComponent(str));
};

export const unicodeDecodeB64 = (str: string) => {
  return decodeURI(atob(str));
};
export const decodeBuffer = (
  base64: string,
  decoder: (reader: any) => string
) => {
  const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  const reader = protobuf.Reader.create(buffer);
  reader.pos += 2;
  return decoder(reader);
};

export const decodeUTF8 = (arr: Uint8Array) => {
  return protobuf.util.utf8.read(arr, 4, arr.length);
};
