import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Linking, Pressable, View, useWindowDimensions } from "react-native";

import statsLogo from "../../../assets/logos/stats.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { GradientText } from "../../components/gradientText";
import { SpacerColumn } from "../../components/spacer";
import { useIsMobile } from "../../hooks/useIsMobile";
import { getNonSigningStargateClient } from "../../networks";
import { teritoriNetwork } from "../../networks/teritori";
import { ScreenFC } from "../../utils/navigation";
import { errorColor, secondaryColor } from "../../utils/style/colors";
import { fontBold16, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

const targetBlock = 12614400;

export const MetricsScreen: ScreenFC<"Metrics"> = () => {
  const { data: currentHeight } = useCosmosHeight(teritoriNetwork.id);
  const { width: windowWidth } = useWindowDimensions();
  const mobileMode = useIsMobile();

  const blocksValues = [
    {
      label: "Target Block",
      blockNumber: `#${targetBlock}`,
    },
    {
      label: "Current Block",
      blockNumber: currentHeight ? `#${currentHeight}` : "?",
    },
    {
      label: "Remaining Blocks",
      blockNumber: currentHeight ? `${targetBlock - currentHeight}` : "?",
    },
  ];

  let imageSize = 800;
  if (mobileMode) {
    imageSize = windowWidth;
  }

  return (
    <ScreenContainer
      fullWidth
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
        {mobileMode && <SpacerColumn size={3} />}
        <SVG
          source={statsLogo}
          width={imageSize}
          height={imageSize}
          style={{ margin: -(imageSize / 4) }}
        />
        {mobileMode && <SpacerColumn size={3} />}
        <View
          style={{
            justifyContent: "space-evenly",
            alignItems: mobileMode ? "flex-start" : "center",
            paddingHorizontal: layout.spacing_x3,
          }}
        >
          <BrandText style={[fontSemibold28, { textTransform: "uppercase" }]}>
            Total Burned $Tori tokens:
          </BrandText>
          {mobileMode && <SpacerColumn size={2} />}
          <BrandText
            style={[
              fontSemibold28,
              { textTransform: "uppercase", color: errorColor },
            ]}
          >
            🔥 118.55K $TORI 🔥
          </BrandText>
          {mobileMode && <SpacerColumn size={2} />}
          <BrandText
            style={[
              fontSemibold28,
              { textTransform: "uppercase", color: secondaryColor },
            ]}
          >
            ESTIMATED HALVING DATE:
          </BrandText>
          {mobileMode && <SpacerColumn size={2} />}
          <BrandText style={fontSemibold28}>
            📅{"  "}
            <GradientText
              style={[
                fontSemibold28,
                { textTransform: "uppercase", color: secondaryColor },
              ]}
              gradientType="blueExtended"
            >
              Jan 26th, 2025, 17:30:00 UTC
            </GradientText>
          </BrandText>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {blocksValues.map((item, index) => {
            const blockNumberText = (
              <BrandText style={[fontBold16, { color: secondaryColor }]}>
                {item.blockNumber}
              </BrandText>
            );
            let blockNumber;
            if (item.blockNumber.startsWith("#")) {
              blockNumber = (
                <Pressable
                  onPress={() =>
                    Linking.openURL(
                      "https://www.mintscan.io/teritori/blocks/" +
                        item.blockNumber.substring(1),
                    )
                  }
                >
                  {blockNumberText}
                </Pressable>
              );
            } else {
              blockNumber = blockNumberText;
            }
            return (
              <View
                key={index}
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
                {blockNumber}
              </View>
            );
          })}
        </View>
      </View>
    </ScreenContainer>
  );
};

function useCosmosHeight(networkId: string) {
  return useQuery(
    ["cosmosStatus", networkId],
    async () => {
      const client = await getNonSigningStargateClient(networkId);
      return await client.getHeight();
    },
    { staleTime: Infinity, refetchInterval: 7000 },
  );
}
