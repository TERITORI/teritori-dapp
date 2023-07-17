import React, { createRef } from "react";
import { TouchableOpacity, View, Image } from "react-native";

import penSVG from "../../../assets/icons/manage.svg";
import trashSVG from "../../../assets/icons/trash.svg";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { uploadFileToIPFS, ipfsPinataUrl } from "../../utils/ipfs";

export const PortfolioImage: React.FC<{
  width: number;
  height: number;
  source: any;
  onUpdate?: (url: string) => void;
  onRemove?: () => void;
  style?: any;
}> = ({ width, height, source, onUpdate, onRemove, style }) => {
  const fileRef = createRef<HTMLInputElement>();
  const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const ipfsHash = await uploadFileToIPFS(file);
    if (ipfsHash) {
      onUpdate!(ipfsHash);
    }
  };

  return (
    <TertiaryBox width={width} height={height} style={style}>
      <View
        style={{
          position: "absolute",
          top: 3,
          right: 3,
          flexDirection: "row",
          zIndex: 1,
        }}
      >
        {onUpdate && (
          <TouchableOpacity
            onPress={() => {
              fileRef.current?.click();
            }}
          >
            <SVG
              source={penSVG}
              width={24}
              height={24}
              style={{ marginTop: 2 }}
            />
          </TouchableOpacity>
        )}
        {onRemove && (
          <TouchableOpacity onPress={onRemove}>
            <SVG
              source={trashSVG}
              width={22}
              height={22}
              style={{ marginTop: 2 }}
            />
          </TouchableOpacity>
        )}
      </View>
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
          <Image
            // @ts-ignore
            source={ipfsPinataUrl(source)}
            style={{ width, height }}
          />
        </TouchableOpacity>
      )}
      {!onUpdate && (
        // @ts-ignore
        <Image source={ipfsPinataUrl(source)} style={{ width, height }} />
      )}
    </TertiaryBox>
  );
};
