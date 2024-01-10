import * as DocumentPicker from "expo-document-picker";

import { TertiaryBadge } from "../../../components/badges/TertiaryBadge";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { blueDefault } from "../../../utils/style/colors";

//TODO: To capture uploaded file and handle cancel
export default function FileUpload({ label }: { label: string }) {
  async function pickDocument() {
    try {
      const document = await DocumentPicker.getDocumentAsync({});
      console.log(document);
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
