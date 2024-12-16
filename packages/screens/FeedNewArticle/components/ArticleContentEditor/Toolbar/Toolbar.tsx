import { Dispatch, FC, SetStateAction } from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerRow } from "@/components/spacer";
import { ContentMode } from "@/utils/feed/markdown";
import { neutral1A } from "@/utils/style/colors";
import { fontSemibold12 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

interface Props {
  setMode: Dispatch<SetStateAction<ContentMode>>;
}

export const Toolbar: FC<Props> = ({ setMode }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
        <CustomPressable
          onPress={() => setMode("EDITION")}
          style={{
            backgroundColor: neutral1A,
            padding: layout.spacing_x1,
            borderRadius: 8,
          }}
        >
          <BrandText style={fontSemibold12}>Edition</BrandText>
        </CustomPressable>
        <SpacerRow size={1} />
        <CustomPressable
          onPress={() => setMode("BOTH")}
          style={{
            backgroundColor: neutral1A,
            padding: layout.spacing_x1,
            borderRadius: 8,
          }}
        >
          <BrandText style={fontSemibold12}>Edition | Preview</BrandText>
        </CustomPressable>
        <SpacerRow size={1} />
        <CustomPressable
          onPress={() => setMode("PREVIEW")}
          style={{
            backgroundColor: neutral1A,
            padding: layout.spacing_x1,
            borderRadius: 8,
          }}
        >
          <BrandText style={fontSemibold12}>Preview</BrandText>
        </CustomPressable>
      </View>
    </View>
  );
};
