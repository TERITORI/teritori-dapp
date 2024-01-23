import axios from "axios";

import { LocalFileData } from "../utils/types/files";

interface PinataFileProps {
  file: LocalFileData;
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
