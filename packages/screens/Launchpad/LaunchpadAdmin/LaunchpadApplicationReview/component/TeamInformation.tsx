import React from "react";
import { useWindowDimensions, View } from "react-native";

import { LinkCard } from "./LinkCard";

import { BrandText } from "@/components/BrandText";
import { fontSemibold20 } from "@/utils/style/fonts";
import {CollectionDataResult} from "@/utils/types/launchpad";
import {ApplicationCard} from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/component/ApplicationCard";
import {layout} from "@/utils/style/layout";

const MD_BREAKPOINT = 800;

export const TeamInformation: React.FC<{
  collection: CollectionDataResult;
}> = ({collection}) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        paddingTop: layout.spacing_x4,
      }}
    >
      <BrandText style={fontSemibold20}>Team information</BrandText>
      <View
        style={{
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          marginTop: layout.spacing_x2,
          gap: layout.spacing_x1_5,
        }}
      >
        <ApplicationCard
          title="Team Description"
          value="For decades, the destruction of ecosystems and social relations has
            turned people into soulless robots. At the same time, inequality
            explodes every year and misery becomes the norm for the silent
            majority. A minority of powerful & wealthy leaders, called the “The
            Legion'', have set up a technological & political system allowing
            them to continue to develop their wealth and safety."
        />
        <ApplicationCard
          title="Partners Description"
          value="For decades, the destruction of ecosystems and social relations has
          turned people into soulless robots. At the same time, inequality
          explodes every year and misery becomes the norm for the silent
          majority. A minority of powerful & wealthy leaders, called the “The
          Legion'', have set up a technological & political system allowing
          them to continue to develop their wealth and safety."
        />
        <LinkCard
          title="Team Links"
          linksData={[
            { title: "Instagram", link: "https://instagram.com/loremipsum" },
            { title: "Telegram", link: "@nickname" },
            { title: "Signal", link: "@nickname" },
          ]}
        />
      </View>
    </View>
  );
};
