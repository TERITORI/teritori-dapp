import React, { useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";

import bucketSVG from "../../../assets/icons/bucket.svg";
import uploadSVG from "../../../assets/icons/upload.svg";
import { BrandText } from "../../components/BrandText";
import { GradientText } from "../../components/gradientText";
import { Label } from "../../components/inputs/TextInputCustom";
import { neutral17, neutral77, redDefault } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { SVG } from "../SVG";
import { PrimaryBox } from "../boxes/PrimaryBox";
import { FileUploaderProps } from "./FileUploader.type";

const FILE_HEIGHT = 256;

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  style,
  onUpload,
}) => {
  const [files, setFiles] = useState<File[] | FileList>([]);

  const handleClick = () => {};

  return (
    <View style={style}>
      {!!label && <Label style={{ marginBottom: 12 }}>{label}</Label>}
      <PrimaryBox
        fullWidth
        style={{
          height: files.length ? FILE_HEIGHT : 80,
          borderRadius: 10,
        }}
      >
        {files?.[0] ? (
          <View
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                height: 32,
                width: 32,
                borderRadius: 24,
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: redDefault,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setFiles([])}
            >
              <SVG source={bucketSVG} height={16} width={16} />
            </TouchableOpacity>
            <Image
              source={{ uri: files?.[0]?.path }}
              style={{
                height: FILE_HEIGHT,
                width: "100%",
              }}
            />
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleClick}
            style={{
              paddingVertical: 20,
              paddingHorizontal: 20,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 24,
                backgroundColor: neutral17,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 20,
              }}
            >
              <SVG source={uploadSVG} height={20} />
            </View>
            <View>
              <GradientText gradientType="blueExtended">
                Browse file
              </GradientText>
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                Or drag & drop here
              </BrandText>
            </View>
          </TouchableOpacity>
        )}
      </PrimaryBox>
    </View>
  );
};
