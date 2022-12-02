import React, { SyntheticEvent, useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import bucketSVG from "../../../assets/icons/bucket.svg";
import uploadSVG from "../../../assets/icons/upload.svg";
import { BrandText } from "../../components/BrandText";
import { GradientText } from "../../components/gradientText";
import { Label } from "../../components/inputs/TextInputCustom";
import { neutral17, neutral77, redDefault } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { SVG } from "../SVG";
import { PrimaryBox } from "../boxes/PrimaryBox";

const FILE_HEIGHT = 256;
interface FileUploaderProps {
  label?: string;
  style?: ViewStyle;
  onUpload: (file?: File) => void;
}
export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  style,
  onUpload,
}) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File>();

  const handleChange = (event: SyntheticEvent) => {
    const targetEvent = event.target as HTMLInputElement;
    if (targetEvent.files && targetEvent.files[0]) {
      setFile(targetEvent.files[0]);
      onUpload(targetEvent.files[0]);
    }
  };

  const handleClick = () => {
    hiddenFileInput?.current?.click?.();
  };

  const dropHandler = (ev: any) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          setFile(file);
          onUpload(file);
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      setFile(ev.dataTransfer.files[0]);
      onUpload(file);
    }
  };

  const dragOverHandler = (ev: SyntheticEvent) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  return (
    <View style={style}>
      {!!label && <Label style={{ marginBottom: 12 }}>{label}</Label>}
      <PrimaryBox
        fullWidth
        style={{
          height: file ? FILE_HEIGHT : 80,
          borderRadius: 10,
        }}
      >
        {file ? (
          <div
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
              onPress={() => setFile(undefined)}
            >
              <SVG source={bucketSVG} height={16} width={16} />
            </TouchableOpacity>
            <img
              src={URL.createObjectURL(file)}
              style={{
                overflow: "hidden",
                height: FILE_HEIGHT,
                width: "100%",
                backgroundSize: "cover",
              }}
            />
          </div>
        ) : (
          <TouchableOpacity
            onPress={handleClick}
            style={{
              paddingVertical: 20,
              paddingHorizontal: 20,
              width: "100%",
              height: "100%",
            }}
          >
            <div
              onDrop={dropHandler}
              onDragOver={dragOverHandler}
              style={{
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
              <input
                type="file"
                ref={hiddenFileInput}
                style={{ display: "none", position: "absolute" }}
                onChange={handleChange}
              />
            </div>
          </TouchableOpacity>
        )}
      </PrimaryBox>
    </View>
  );
};
