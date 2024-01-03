import React from "react";
import { View, useWindowDimensions } from "react-native";

import { LinkCard } from "./LinkCard";
import { BrandText } from "../../../components/BrandText";
import { Box } from "../../../components/boxes/Box";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";

const MD_BREAKPOINT = 800;

export const ProjectInformation: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        paddingTop: 32,
      }}
    >
      <BrandText style={fontSemibold20}>Project information</BrandText>
      <View
        style={{
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          marginTop: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Box
          notched
          style={{
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 6,
            padding: 12,
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Creator Name
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            For decades, the destruction of ecosystems and social relations has
            turned people into soulless robots. At the same time, inequality
            explodes every year and misery becomes the norm for the silent
            majority. A minority of powerful & wealthy leaders, called the “The
            Legion''.
          </BrandText>
        </Box>
        <LinkCard
          title="Other Links"
          linksData={[
            { title: "Instagram", link: "https://instagram.com/loremipsum" },
            { title: "Telegram", link: "@nickname" },
            { title: "Signal", link: "@nickname" },
          ]}
        />
        <View style={{ flex: 1, gap: 12 }}>
          <Box
            notched
            style={{
              borderWidth: 1,
              borderColor: neutral33,
              borderRadius: 6,
              padding: 12,
              flex: 1,
            }}
          >
            <BrandText style={[fontSemibold12, { color: neutral77 }]}>
              Previous Apply
            </BrandText>
            <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
              Apply Name
            </BrandText>
          </Box>
          <Box
            notched
            style={{
              borderWidth: 1,
              borderColor: neutral33,
              borderRadius: 6,
              padding: 12,
              flex: 1,
            }}
          >
            <BrandText style={[fontSemibold12, { color: neutral77 }]}>
              Project Type
            </BrandText>
            <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
              Type
            </BrandText>
          </Box>
        </View>
      </View>
    </View>
  );
};
