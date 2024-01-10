import * as DocumentPicker from "expo-document-picker";

import { TertiaryBadge } from "../../../components/badges/TertiaryBadge";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { blueDefault } from "../../../utils/style/colors";

interface FileUploadProps {
  label: string;
  onUpload?: (file: DocumentPicker.DocumentPickerAsset | undefined) => void;
  onCancelled?: (error: string) => void;
}
//TODO: To capture uploaded file and handle cancel
export default function FileUpload({
  label,
  onUpload,
  onCancelled,
}: FileUploadProps) {
  async function pickDocument() {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });
      if (document.canceled) {
        if (!onCancelled) {
          return;
        }

        onCancelled("Cancelled");
      }

      if (!onUpload) {
        return;
      }

      onUpload(document?.assets?.[0]);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <CustomPressable onPress={pickDocument}>
      <TertiaryBadge
        label={label}
        style={{
          backgroundColor: blueDefault,
          width: 113,
          height: 36,
          justifyContent: "center",
        }}
      />
    </CustomPressable>
  );
}
