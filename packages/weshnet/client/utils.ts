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
  const bin: string[] = [];
  arr.forEach((byte) => {
    bin.push(String.fromCharCode(byte));
  });
  return btoa(bin.join(""));
};

export const encode = (str: string) => {
  return new TextEncoder().encode(encodeURIComponent(str));
};

export const decode = (arr: Uint8Array) => {
  return decodeURIComponent(
    new TextDecoder().decode(arr).replace(/(\r\n|\n|\r)/gm, "")
  );
};

export const decodeJSON = (arr: Uint8Array) => {
  return JSON.parse(decode(arr));
};

export const encodeJSON = (obj: object) => {
  return encode(JSON.stringify(obj));
};
