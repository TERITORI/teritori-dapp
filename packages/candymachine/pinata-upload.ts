import axios from "axios";

import { LocalFileData } from "../utils/types/files";

interface PinataFileProps {
  file: LocalFileData;
  pinataJWTKey: string;
}

interface PinataJSONProps {
  json: object;
  pinataJWTKey: string;
}

export const pinataPinFileToIPFS = async ({
  file,
  pinataJWTKey,
}: PinataFileProps) => {
  try {
    const formData = new FormData();
    formData.append("file", file.file);
    const responseFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        Authorization: "Bearer " + pinataJWTKey,
        "Content-Type": "multipart/form-data",
      },
    });
    return responseFile.data;
  } catch (err) {
    console.error("Error pinning " + file.fileName + " to IPFS", err);
  }
};

export const pinataPinJSONToIPFS = async ({
  json,
  pinataJWTKey,
}: PinataJSONProps) => {
  try {
    const str = JSON.stringify(json);
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], {
      type: "application/json;charset=utf-8",
    });
    const formData = new FormData();
    formData.append("json", blob);
    const responseFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: formData,
      headers: {
        Authorization: "Bearer " + pinataJWTKey,
        "Content-Type": "multipart/form-data",
      },
    });
    return responseFile.data;
  } catch (err) {
    console.error("Error pinning JSON to IPFS", err);
  }
};
