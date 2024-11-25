export const readFileAsBase64 = (file?: File): Promise<string> | string => {
  if (!file) {
    return "";
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader?.result === "string") {
        const base64String = reader?.result?.split?.(",")[1];
        resolve(base64String);
      }
      reject(new Error("readFileAsBase64 is not string"));
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export const blobToDataURI = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader?.result === "string") {
        resolve(reader.result);
      }
      reject(new Error("blobToDataURI is not string"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
