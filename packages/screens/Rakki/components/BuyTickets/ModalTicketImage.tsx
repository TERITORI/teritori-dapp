import { TextStyle, View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { TicketImage } from "@/screens/Rakki/components/TicketImage";
import { neutral67, neutralA3 } from "@/utils/style/colors";
import { fontSemibold30 } from "@/utils/style/fonts";

export const ModalTicketImage = () => {
  return (
    <View>
      <TicketImage />
      <View
        style={{
          position: "absolute",
          left: 190,
          top: 76,
          justifyContent: "center",
          transform: "rotate(-6deg)",
        }}
      >
        <View>
          <BrandText
            style={[
              japaneseTextCStyle,
              {
                color: neutral67,
              },
            ]}
          >
            ラ
            <BrandText style={[japaneseTextCStyle, { color: neutralA3 }]}>
              ッ
            </BrandText>
            キー
          </BrandText>
        </View>
      </View>
    </View>
  );
};

const japaneseTextCStyle: TextStyle = {
  ...fontSemibold30,
  textAlign: "center",
  letterSpacing: 6,
};
