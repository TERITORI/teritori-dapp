import React, { FC, SyntheticEvent, useRef, useState } from "react";
import { View } from "react-native";

import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { secondaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVGorImageIcon } from "../../SVG/SVGorImageIcon";
import { PrimaryBox } from "../../boxes/PrimaryBox";
import { Label } from "../TextInputCustom";

import addSVG from "@/assets/icons/add-circle.svg";
import filesSVG from "@/assets/icons/files.svg";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { formatFile } from "@/components/inputs/fileUploader/formatFile";
import { FileUploaderSmallProps } from "@/components/inputs/fileUploaderSmall/FileUploaderSmall.type";
import { SpacerRow } from "@/components/spacer";
import { pluralOrNot } from "@/utils/text";

export const FileUploaderSmall: FC<FileUploaderSmallProps> = ({
  label,
  style,
  onUpload,
  nbAddedFiles,
  multiple,
  mimeTypes,
  maxUpload,
  setIsLoading,
  required = true,
  boxStyle,
}) => {
  const { setToast } = useFeedbacks();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleFiles = async (files: File[]) => {
    const _files = multiple ? files : [files[0]];
    let supportedFiles = [...files].filter((file) =>
      mimeTypes?.includes(file.type),
    );
    if (maxUpload && supportedFiles.length) {
      supportedFiles = supportedFiles.slice(0, maxUpload);
    }

    if (
      supportedFiles.length === 0 ||
      (multiple && supportedFiles.length !== _files.length)
    ) {
      setToast({
        title: "Unsupported file type",
        duration: 5000,
        mode: "normal",
        type: "error",
      });
      return;
    }
    const formattedFiles = await Promise.all(
      supportedFiles.map(async (file) => await formatFile(file)),
    );
    onUpload(formattedFiles);
  };

  const handleChange = async (event: SyntheticEvent) => {
    setIsLoading?.(true);
    const targetEvent = event.target as HTMLInputElement;

    if (targetEvent.files && targetEvent.files[0]) {
      await handleFiles(targetEvent?.files as unknown as File[]);
    }
    setIsLoading?.(false);
  };
  const handleClick = () => {
    hiddenFileInput?.current?.click?.();
  };

  const InputComponent = (
    <input
      type="file"
      ref={hiddenFileInput}
      style={{ display: "none", position: "absolute" }}
      onChange={handleChange}
      multiple={multiple}
      accept={mimeTypes?.join(",")}
    />
  );

  return (
    <CustomPressable
      style={style}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={handleClick}
    >
      {!!label && (
        <Label
          style={{ marginBottom: layout.spacing_x1 }}
          isRequired={required}
          hovered={hovered}
        >
          {label}
        </Label>
      )}
      <PrimaryBox
        style={[
          {
            width: "100%",
            height: 80,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            borderRadius: 12,
            borderWidth: 1,
          },
          hovered && { borderColor: secondaryColor },
          boxStyle,
        ]}
      >
        <SVGorImageIcon
          icon={nbAddedFiles > 0 ? filesSVG : addSVG}
          iconSize={32}
        />
        <SpacerRow size={1} />
        <View>
          <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
            {nbAddedFiles
              ? nbAddedFiles + pluralOrNot(" file", nbAddedFiles) + " added"
              : "Select" + (multiple ? " files" : " file")}
          </BrandText>
        </View>
      </PrimaryBox>
      {InputComponent}
    </CustomPressable>
  );
};
