import React, { useState, createRef } from "react";
import { TouchableOpacity, Image } from "react-native";

import { uploadFileToIPFS, ipfsPinataUrl } from "../../utils/ipfs";

export const AvatarImage: React.FC<{
  source: any;
  style: any;
  onUpdate?: (url: string) => void;
}> = ({ source, style, onUpdate }) => {
  const [sourceData, setSourceData] = useState(source);
  const fileRef = createRef<HTMLInputElement>();

  const uploadFile = async (file: File) => {
    const ipfsHash = await uploadFileToIPFS(file);
    if (ipfsHash) {
      setSourceData(ipfsHash);
      onUpdate!(ipfsHash);
    }
  };

  const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <>
      {onUpdate && (
        <TouchableOpacity
          onPress={() => {
            fileRef.current?.click();
          }}
        >
          <input
            type="file"
            style={{ display: "none" }}
            accept="image/png,image/jpg,image/gif"
            onChange={onFileInputChange}
            ref={fileRef}
          />
          <Image source={{ uri: ipfsPinataUrl(sourceData) }} style={[style]} />
        </TouchableOpacity>
      )}
      {!onUpdate && (
        <Image source={{ uri: ipfsPinataUrl(sourceData) }} style={[style]} />
      )}
    </>
  );
};
