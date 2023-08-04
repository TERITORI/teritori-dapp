export const toRawURLBase64String = (buffer: Buffer) => {
  return buffer
    .toString("base64")
    .replaceAll(/=/g, "")
    .replaceAll(/\+/g, "-")
    .replaceAll(/\//g, "_");
};
