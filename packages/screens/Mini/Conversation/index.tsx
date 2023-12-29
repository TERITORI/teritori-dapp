import React from "react";
import { SafeAreaView, View } from "react-native";

import { Conversations } from "./Conversations";
import { Header } from "./Header";
import { BrandText } from "../../../components/BrandText";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { SpacerRow } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { fontSemibold22 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const Conversation: ScreenFC<"Conversation"> = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#000000",
      }}
    >
      <Header navigation={navigation} />
      <View>
        <View style={{ alignItems: "center", marginTop: layout.spacing_x2_5 }}>
          <OptimizedImage
            width={164}
            height={164}
            sourceURI="https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg"
            style={{
              width: 164,
              height: 164,
              borderRadius: 164 / 2,
            }}
          />
          <BrandText style={[fontSemibold22, { marginTop: layout.spacing_x1 }]}>
            Eleanor Pena
          </BrandText>
        </View>
      </View>
      <SpacerRow size={4} />
      <Conversations conversations={[]} />
    </SafeAreaView>
  );
};
