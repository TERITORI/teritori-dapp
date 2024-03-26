import { View, useWindowDimensions } from "react-native";

import { BrandText } from "@/components/BrandText";
import { EmbeddedWeb } from "@/components/EmbeddedWeb";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenFC } from "@/utils/navigation";
import { neutral00 } from "@/utils/style/colors";
import { fontMedium10 } from "@/utils/style/fonts";
import { MOBILE_HEADER_HEIGHT, layout } from "@/utils/style/layout";

function BrowserHeader({ url }: { url: string }) {
  return (
    <View
      style={{
        backgroundColor: neutral00,
        flexDirection: "row",
        justifyContent: "space-between",
        height: MOBILE_HEADER_HEIGHT,
        maxHeight: MOBILE_HEADER_HEIGHT,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: layout.spacing_x2,
        position: "absolute",
        top: 0,
        zIndex: 9999,
      }}
    >
      <BrandText style={fontMedium10}>{url}</BrandText>
    </View>
  );
}
export const BrowserDetail: ScreenFC<"BrowserDetail"> = ({ route }) => {
  const { width, height } = useWindowDimensions();
  const newUri = "https://app.teritori.com/" + route.params.path;
  return (
    <ScreenContainer
      headerMini={<BrowserHeader url={newUri} />}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      mobileTitle=""
    >
      <EmbeddedWeb uri={newUri} width={width} height={height} />
    </ScreenContainer>
  );
};
