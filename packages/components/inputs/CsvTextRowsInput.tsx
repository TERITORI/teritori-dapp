import { parse } from "papaparse";
import React, { FC, useCallback, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { FileUploaderSmall } from "./FileUploaderSmall";

import { BrandText } from "@/components/BrandText";
import { DeleteButton } from "@/components/FilePreview/DeleteButton";
import { TXT_CSV_MIME_TYPES } from "@/utils/mime";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { LocalFileData } from "@/utils/types/files";

// Allows to select a TXT and CSV file and display each rows
export const CsvTextRowsInput: FC<{
  onUpload: (file: LocalFileData, rows: string[]) => void;
  rows?: string[];
  file?: LocalFileData;
}> = ({ onUpload, rows, file }) => {
  const [localRows, setLocalRows] = useState<string[] | undefined>(rows);
  const [localFile, setLocalFile] = useState<LocalFileData | undefined>(file);

  const onUploadFiles = useCallback(
    (files: LocalFileData[]) => {
      if (!files[0]) return;
      setLocalFile(files[0]);

      parse<string[]>(files[0].file, {
        complete: (parseResults) => {
          setLocalRows(parseResults.data.map((rowData) => rowData[0]));
          onUpload(
            files[0],
            parseResults.data.map((rowData) => rowData[0]),
          );
        },
      });
    },
    [onUpload],
  );

  if (localRows?.length) {
    return (
      <View>
        <DeleteButton
          onPress={() => {
            setLocalFile(undefined);
            setLocalRows(undefined);
            onUploadFiles([]);
          }}
        />
        <ScrollView
          style={{
            width: "100%",
            borderRadius: 8,
            borderColor: neutral33,
            borderWidth: 1,
            padding: layout.spacing_x1_5,
            maxHeight: 200,
          }}
        >
          {localRows.map((row, index) => (
            <BrandText
              key={index}
              style={[
                fontSemibold14,
                index > 0 && { marginTop: layout.spacing_x1 },
              ]}
            >
              {row}
            </BrandText>
          ))}
        </ScrollView>
      </View>
    );
  }
  return (
    <FileUploaderSmall
      boxStyle={{ minHeight: 48 }}
      onUpload={onUploadFiles}
      mimeTypes={TXT_CSV_MIME_TYPES}
      filesCount={localFile ? 1 : 0}
    />
  );
};
