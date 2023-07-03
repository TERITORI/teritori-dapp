import React, { useState } from "react";
import { View, ImageBackground, FlatList } from "react-native";

import { TournamentBox } from "./TournamentCard";
import tounamentBanner from "../../../../assets/banners/tournamentBanner.png";
import { Tournament } from "../../../api/pathwar/v1/pathwar";
import { BrandText } from "../../../components/BrandText";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { SearchInput } from "../../../components/sorts/SearchInput";
import { SpacerColumn } from "../../../components/spacer";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral00 } from "../../../utils/style/colors";
import { fontSemibold20 } from "../../../utils/style/fonts";
import {
  layout,
  screenContentMaxWidthLarge,
} from "../../../utils/style/layout";

export const TournamentScreen: React.FC = () => {
  const { height } = useMaxResolution({ isLarge: true });
  const navigation = useAppNavigation();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState<string>("");
  const data = [
    {
      id: 1,
      price: {
        denom: "utori",
        amount: "100000000",
      },
      thumbnail: "",
      title: "Wild Top 50",
      description: "description of the tournament",
      tagline: "reserved for the best",
      difficulty: "Hard+",
      status: "Open",
      duration: "3 days",
      numUsersJoined: 30,
      rewards: [
        {
          denom: "utori",
          amount: "10000000000",
        },
      ],
      bought: true,
    },
  ] as Tournament[];
  return (
    <ScreenContainer
      responsive
      isLarge
      footerChildren={<></>}
      headerChildren={<BrandText style={fontSemibold20}>Resources</BrandText>}
      onBackPress={() => navigation.navigate("Pathwar")}
    >
      <View>
        <ImageBackground
          source={tounamentBanner}
          style={{
            height: 400,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          marginTop: layout.padding_x1_5,
          zIndex: 2,
        }}
      >
        <View style={{ alignItems: "flex-start" }}>
          <SearchInput
            handleChangeText={setSearch}
            borderRadius={layout.borderRadius}
            height={45}
            style={{
              width: isMobile ? "100%" : 270,
              backgroundColor: neutral00,
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignSelf: "center",
          marginTop: layout.padding_x2_5,
        }}
      >
        <FlatList
          data={data.filter((tournament) =>
            tournament.title.toLowerCase().includes(search.toLowerCase())
          )}
          style={{
            width: "100%",
          }}
          contentContainerStyle={{
            maxWidth: screenContentMaxWidthLarge,
            maxHeight: height,
          }}
          showsHorizontalScrollIndicator={false}
          columnWrapperStyle={{ flexWrap: "wrap", flex: 1, marginTop: 5 }}
          numColumns={99} // needed to deal with wrap via css
          ItemSeparatorComponent={() => <SpacerColumn size={2} />}
          ListEmptyComponent={
            <BrandText style={fontSemibold20}>No results found.</BrandText>
          }
          renderItem={({ item, index }) => {
            return <TournamentBox data={item} key={index} />;
          }}
        />
      </View>
    </ScreenContainer>
  );
};
