import { parse } from "papaparse";
import React, { FC, useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

import { BrandText } from "@/components/BrandText";
import { SelectFileUploader } from "@/components/inputs/selectFileUploader";
import { TXT_CSV_MIME_TYPES } from "@/utils/mime";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { LocalFileData } from "@/utils/types/files";

// Allows to select a TXT and CSV file and display each rows
export const CsvTextFileUploader: FC<{
  onUpload: (file: LocalFileData, rows: string[]) => void;
  file?: LocalFileData;
}> = ({ onUpload, file }) => {
  const [rows, setRows] = useState<string[]>([]);

  const onUploadFiles = useCallback(
    (files: LocalFileData[]) => {
      const file = files[0].file;
      parse<string[]>(file, {
        complete: (results) => {
          setRows(results.data.map((rowData) => rowData[0]));
        },
      });
      onUpload(files[0], rows);
    },
    [onUpload, rows],
  );

  // Retrieve file from parent
  useEffect(() => {
    if (file) onUploadFiles([file]);
  }, [file, onUploadFiles]);

  return (
    <SelectFileUploader
      label={!rows.length ? "Select file" : undefined}
      containerHeight={48}
      onUpload={onUploadFiles}
      mimeTypes={TXT_CSV_MIME_TYPES}
      files={!rows.length ? [] : undefined}
      resultChildren={({ onPress }) => (
        <TouchableOpacity
          onPress={onPress}
          style={{
            width: "100%",
            borderRadius: 8,
            borderColor: neutral33,
            borderWidth: 1,
            padding: layout.spacing_x1_5,
          }}
        >
          {rows.map((row, index) => (
            <BrandText
              style={[
                fontSemibold14,
                index > 0 && { marginTop: layout.spacing_x1 },
              ]}
            >
              {row}
            </BrandText>
          ))}
        </TouchableOpacity>
      )}
    />
  );
};
