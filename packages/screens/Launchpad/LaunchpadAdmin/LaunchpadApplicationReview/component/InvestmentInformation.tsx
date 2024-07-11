import React from "react";
import { View, useWindowDimensions } from "react-native";

import { LinkCard } from "./LinkCard";

import { BrandText } from "@/components/BrandText";
import { fontSemibold20 } from "@/utils/style/fonts";
import {CollectionDataResult} from "@/utils/types/launchpad";
import {ApplicationCard} from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/component/ApplicationCard";
import {layout} from "@/utils/style/layout";

const breakpointM = 800;

export const InvestmentInformation: React.FC<{
  collection: CollectionDataResult;
}> = ({collection}) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        paddingVertical: layout.spacing_x4,
      }}
    >
      <BrandText style={fontSemibold20}>Investment information</BrandText>
      <View
        style={{
          flexDirection: width >= breakpointM ? "row" : "column",
          marginTop: layout.spacing_x2,
          gap: layout.spacing_x1_5,
          flexWrap: "wrap",
        }}
      >
        <ApplicationCard
          title="Investment Description"
          value="For decades, the destruction of ecosystems and social relations has
            turned people into soulless robots. At the same time, inequality
            explodes every year and misery becomes the norm for the silent
            majority. A minority of powerful & wealthy leaders, called the “The
            Legion'', have set up a technological & political system allowing
            them to continue to develop their wealth and safety."
        />
        <LinkCard
          title="Investment Links Attachments"
          linksData={[
            { title: "Instagram", link: "https://instagram.com/loremipsum" },
            { title: "Telegram", link: "@nickname" },
            { title: "Signal", link: "@nickname" },
          ]}
        />
        <LinkCard
          title="Whitepaper Roadmap"
          linksData={[
            { title: "Roadmap", link: "Link" },
            { title: "Whitepaper", link: "Link" },
            { title: "Pitch Deck", link: "Link" },
          ]}
        />
      </View>
    </View>
  );
};
