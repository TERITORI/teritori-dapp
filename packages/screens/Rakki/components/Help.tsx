import { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { GridList } from "@/components/layout/GridList";
import { gameBoxLabelCStyle } from "@/screens/Rakki/styles";
import { neutral33, neutral77 } from "@/utils/style/colors";
import {
  fontMedium10,
  fontSemibold12,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

interface HelpBoxDefinition {
  title: string;
  description: string;
}

export const Help: FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  const helpBoxes: HelpBoxDefinition[] = [
    {
      title: "Buy Tickets",
      description:
        "Prices are $10 USDC per ticket.\nGamblers can buy multiple tickets.",
    },
    {
      title: "Wait for the Draw",
      description:
        "Players just have to wait until the cash prize pool is reached.",
    },
    {
      title: "Check for Prizes",
      description:
        "Once the cashprize pool is reached, the winner receive the $10,000 transaction directly!",
    },
  ];
  return (
    <View style={[{ alignItems: "center", gap: layout.spacing_x3 }, style]}>
      <BrandText style={fontSemibold28}>How to Play RAKKi</BrandText>
      <BrandText style={[{ maxWidth: 302 }, gameBoxLabelCStyle]}>
        {`When the community lottery pool reaches the 10k USDC amount, only one will be the winner!\nSimple!`}
      </BrandText>
      <View style={{ width: "100%" }}>
        <GridList<HelpBoxDefinition>
          minElemWidth={212}
          gap={layout.spacing_x1_75}
          keyExtractor={(item) => item.title}
          noFixedHeight
          data={helpBoxes}
          renderItem={({ item, index }, width) => {
            return (
              <TertiaryBox style={{ width, minHeight: 116 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: layout.spacing_x1_5,
                    borderBottomWidth: 1,
                    borderBottomColor: neutral33,
                  }}
                >
                  <BrandText style={fontSemibold12}>{item.title}</BrandText>
                  <BrandText style={[fontMedium10, { color: neutral77 }]}>
                    Step {index + 1}
                  </BrandText>
                </View>
                <BrandText
                  style={[
                    gameBoxLabelCStyle,
                    {
                      letterSpacing: -(12 * 0.01),
                      textAlign: "left",
                      padding: layout.spacing_x1_5,
                      height: 56,
                    },
                  ]}
                >
                  {item.description}
                </BrandText>
              </TertiaryBox>
            );
          }}
        />
        <BrandText
          style={[
            {
              marginTop: layout.spacing_x1_5,
              color: neutral77,
              alignSelf: "center",
            },
            fontSemibold12,
          ]}
        >
          *On the total amount, 10% are sent to a multisig wallet to buyback and
          burn $TORI token.
        </BrandText>
      </View>
    </View>
  );
};
