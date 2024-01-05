import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";

import { SelectFileUploaderProps } from "./SelectFileUploader.type";
import plusSVG from "../../../../assets/icons/plus.svg";
import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
  neutral17,
  primaryColor,
  withAlpha,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { DeleteButton } from "../FilePreview/DeleteButton";
import { SVG } from "../SVG";
import { Box } from "../boxes/Box";
import { Label } from "../inputs/TextInputCustom";

//FIXME: Doesn't work for now =>  Only the .web version is used

export const SelectFileUploader: React.FC<SelectFileUploaderProps> = ({
  label,
  style,
  isImageCover,
  fileHeight = 256,
  containerHeight = 80,
}) => {
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
            height: files?.length ? fileHeight : containerHeight,
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
                    height: fileHeight,
                  },
                  isImageCover && { width: "100%" },
                ]}
              />
            </>
          ) : (
            <Box
              borderGradient={{
                start: { x: 0, y: 0 },
                end: { x: 1, y: 1 },
                locations: [0.7, 0.8],
                colors: [
                  withAlpha(gradientColorDarkerBlue, 0.5),
                  withAlpha(gradientColorBlue, 0.5),
                  withAlpha(gradientColorTurquoise, 0.5),
                ],
              }}
              style={{
                flex: 1,
                width: "100%",
                height: files?.length ? fileHeight : containerHeight,
                alignItems: "center",
                padding: layout.spacing_x2_5,
                borderRadius: 12,
                borderWidth: 1,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    height: 32,
                    width: 32,
                    borderRadius: 24,
                    backgroundColor: neutral17,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 20,
                  }}
                >
                  <SVG source={plusSVG} color={primaryColor} />
                </View>
                <View>
                  <BrandText style={[fontSemibold14, { color: primaryColor }]}>
                    Select files
                  </BrandText>
                </View>
              </View>
            </Box>
          )}
        </div>
      </TouchableOpacity>
    </View>
  );
};
