import axios from "axios";

export const ipfsURLToHTTPURL = (ipfsURL: string | undefined) => {
  if (!ipfsURL) {
    return "";
  }
  if (ipfsURL.startsWith("https://") || ipfsURL.startsWith("blob:")) {
    return ipfsURL;
  }
  if (ipfsURL.startsWith("ipfs://")) {
    return ipfsURL.replace("ipfs://", "https://nftstorage.link/ipfs/");
  }
  return "https://nftstorage.link/ipfs/" + ipfsURL;
};

export const ipfsPinataUrl = (ipfsHash: string): string => {
  return `${process.env.PINATA_GATEWAY}/${ipfsHash}`;
};

export const uploadFileToIPFS = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      }
    );
    return res.data.IpfsHash;
  } catch (exception) {
    console.log(exception);
    return "";
  }
};

export const uploadJSONToIPFS = async (data: object): Promise<string> => {
  try {
    const res = await axios({
      method: "POST",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
      data,
    });
    return res.data.IpfsHash;
  } catch (exception) {
    console.log(exception);
    return "";
  }
};
