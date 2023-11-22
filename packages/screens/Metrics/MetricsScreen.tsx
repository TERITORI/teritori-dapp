import React from "react";
import { Linking, Pressable, View } from "react-native";

import statsLogo from "../../../assets/logos/stats.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
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
        <SVG
          source={statsLogo}
          width={800}
          height={800}
          style={{ margin: -200 }}
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
            ESTIMATED HALVING DATE:
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
