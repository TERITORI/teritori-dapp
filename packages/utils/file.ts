export const readFileAsBase64 = (file?: File) => {
  if (!file) {
    return;
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader?.result === "string") {
        const base64String = reader?.result?.split?.(",")[1];
        resolve(base64String);
      }
      reject(new Error("type error"));
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};
