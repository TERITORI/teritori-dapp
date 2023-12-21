import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";

import { FileUploaderProps } from "./FileUploader.type";
import uploadSVG from "../../../assets/icons/upload.svg";
import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
  neutral17,
  neutral77,
  withAlpha,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { DeleteButton } from "../FilePreview/DeleteButton";
import { SVG } from "../SVG";
import { LegacyPrimaryBox } from "../boxes/LegacyPrimaryBox";
import { GradientText } from "../gradientText";
import { Label } from "../inputs/TextInputCustom";

//FIXME: Doesn't work for now =>  Only the .web version is used

export const FileUploader: React.FC<FileUploaderProps> = ({ label, style }) => {
  const [files, setFiles] = useState<File[] | FileList>([]);

  return (
    <View style={style}>
      {!!label && <Label style={{ marginBottom: 12 }}>{label}</Label>}
      <TouchableOpacity>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            // height: files?.length ? fileHeight : 80,
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
            <LegacyPrimaryBox
              noBrokenCorners
              fullWidth
              colors={[
                withAlpha(gradientColorDarkerBlue, 0.5),
                withAlpha(gradientColorBlue, 0.5),
                withAlpha(gradientColorTurquoise, 0.5),
              ]}
              style={{ flex: 1 }}
              mainContainerStyle={{
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
            </LegacyPrimaryBox>
          )}
        </div>
      </TouchableOpacity>
    </View>
  );
};
