import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";

import { FileUploaderProps } from "./FileUploader.type";

import uploadSVG from "@/assets/icons/upload.svg";
import { BrandText } from "@/components/BrandText";
import { DeleteButton } from "@/components/FilePreview/DeleteButton";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { GradientText } from "@/components/gradientText";
import { Label } from "@/components/inputs/TextInputCustom";
import { neutral17, neutral77 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

//FIXME: Doesn't work for now =>  Consider only the .web version
export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  style,
  required,
}) => {
  const [files, setFiles] = useState<File[] | FileList>([]);

  return (
    <View style={style}>
      {!!label && (
        <Label isRequired={required} style={{ marginBottom: 12 }}>
          {label}
        </Label>
      )}
      <TouchableOpacity>
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
          }}
        >
          {files?.length ? (
            <>
              <DeleteButton
                onPress={() => {
                  setFiles([]);
                  // TODO: Delete file here
                }}
                style={{ top: 12, right: 12 }}
              />
              <Image
                source={{ uri: files?.[0]?.path }}
                style={[
                  {
                    height: 256,
                  },
                ]}
              />
            </>
          ) : (
            <PrimaryBox
              style={{
                flex: 1,
                height: 80,
                alignItems: "center",
                padding: layout.spacing_x2_5,
                borderRadius: 12,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
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
              </View>
            </PrimaryBox>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
