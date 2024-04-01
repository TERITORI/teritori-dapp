import { parse } from "papaparse";
import React, { Dispatch, FC, SetStateAction } from "react";
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
  rows: string[];
  setRows: Dispatch<SetStateAction<string[]>>;
}> = ({ rows, setRows }) => {
  const onUploadWhitelistFile = (files: LocalFileData[]) => {
    const file = files[0].file;
    parse<string[]>(file, {
      complete: (results) => {
        setRows(results.data.map((rowData) => rowData[0]));
      },
    });
  };
  return (
    <SelectFileUploader
      label={!rows.length ? "Select file" : undefined}
      containerHeight={48}
      onUpload={onUploadWhitelistFile}
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
