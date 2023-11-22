import { Video } from "expo-av";
import React from "react";
import { Linking, Pressable, View } from "react-native";

import video from "../../../assets/videos/teritori-os-anim-burnhalving-sm.mp4";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { GradientText } from "../../components/gradientText";
import { TopLogo } from "../../components/navigation/components/TopLogo";
import { ScreenFC } from "../../utils/navigation";
import { errorColor, secondaryColor } from "../../utils/style/colors";
import { fontBold16, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const MetricsScreen: ScreenFC<"Metrics"> = () => {
  // const selectedNetwork = getCosmosNetwork("teritori");
  // const { data: burned } = useQuery([selectedNetwork?.id], async () => {
  //   if (
  //     !currencyIn ||
  //     !currencyOut ||
  //     !selectedNetwork ||
  //     ((!multihopPools[0] || !multihopPools[1]) && !directPool)
  //   )
  //     return "0";
  //
  //   setLoading(true);
  //
  //   const { createRPCQueryClient } = teritori.ClientFactory;
  //   const clientRPC = await createRPCQueryClient({
  //     rpcEndpoint: selectedNetwork.rpcEndpoint,
  //   });
  //   clientRPC.teritori.tx.v1beta1.getTx({});
  // });

  const blocksValues = [
    {
      label: "Target Block",
      blockNumber: "#6307200",
    },
    {
      label: "Current Block",
      blockNumber: "Click here",
    },
    {
      label: "Remaining Blocks",
      blockNumber: "Click here",
    },
  ];

  return (
    <ScreenContainer
      fullWidth
      hideSidebar
      headerChildren={<TopLogo />}
      footerChildren={<div />}
      forceNetworkId="teritori"
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          height: "100%",
        }}
      >
        <Video
          source={{ uri: video }}
          shouldPlay
          isLooping
          style={{
            height: 400,
            width: 400,
            marginTop: layout.spacing_x2,
            marginBottom: layout.spacing_x2,
            borderRadius: 150,
          }}
        />
        <View
          style={{
            justifyContent: "space-evenly",
            alignItems: "center",
            flexWrap: "wrap",
            height: 150,
          }}
        >
          <BrandText style={[fontSemibold28, { textTransform: "uppercase" }]}>
            Total Burned $Tori tokens:
          </BrandText>
          <BrandText
            style={[
              fontSemibold28,
              { textTransform: "uppercase", color: errorColor },
            ]}
          >
            🔥 118.55K $TORI 🔥
          </BrandText>
          <BrandText
            style={[
              fontSemibold28,
              { textTransform: "uppercase", color: secondaryColor },
            ]}
          >
            ESTI️MATED HALVING DATE:
          </BrandText>
          <GradientText
            style={[
              fontSemibold28,
              { textTransform: "uppercase", color: secondaryColor },
            ]}
            gradientType="blueExtended"
          >
            Nov 30th, 2023, 10:38:26 UTC
          </GradientText>
        </View>
        <Pressable
          style={{
            flexDirection: "row",
            flexWrap: "nowrap",
          }}
          onPress={() =>
            Linking.openURL("https://www.mintscan.io/teritori/blocks/6307200")
          }
        >
          {blocksValues.map((item) => (
            <View
              style={{
                padding: layout.spacing_x3,
                alignContent: "center",
                justifyContent: "space-between",
                height: 110,
              }}
            >
              <BrandText style={[fontBold16, { color: secondaryColor }]}>
                {item.label}
              </BrandText>
              <BrandText style={[fontBold16, { color: secondaryColor }]}>
                {item.blockNumber}
              </BrandText>
            </View>
          ))}
        </Pressable>
      </View>
    </ScreenContainer>
  );
};
