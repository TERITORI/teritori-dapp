import React, { useState } from "react";
import { View, Image, FlatList } from "react-native";
import { useSelector } from "react-redux";

import { getChallenges } from "./data/getChallenges";
import pathwarBanner from "../../../assets/banners/pathwarBanner.png";
import { BrandText } from "../../components/BrandText";
import { ChallengeBox } from "../../components/Pathwar/ChallengeBox";
import { ConnectBar } from "../../components/Pathwar/ConnectBar";
import { NavBarPathwarOverview } from "../../components/Pathwar/NavbarOverview/NavBarPathwarOverview";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { SearchInput } from "../../components/sorts/SearchInput";
import { SpacerColumn } from "../../components/spacer";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { selectPathwarToken } from "../../store/slices/settings";
import { ScreenFC } from "../../utils/navigation";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";

export const PathwarScreen: ScreenFC<"Pathwar"> = () => {
  const [searchInput, setSearchInput] = useState("");
  const token = useSelector(selectPathwarToken);
  const isMobile = useIsMobile();
  const challenges = Object.values(getChallenges());
  const { height } = useMaxResolution({ isLarge: true });

  return (
    <ScreenContainer
      responsive
      isLarge
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>PathWar: learn to hack</BrandText>
      }
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          margin: "auto",
        }}
      >
        <Image
          source={pathwarBanner}
          style={{
            width: "100%",
            height: 400,
          }}
        />
      </View>
      {!token && (
        <View style={{ marginTop: layout.padding_x2_5 }}>
          <ConnectBar />
        </View>
      )}
      <NavBarPathwarOverview />

      <Separator
        style={{
          marginTop: layout.padding_x2_5,
          marginBottom: layout.padding_x3_5,
        }}
      />

      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          marginBottom: layout.padding_x4,
        }}
      >
        <BrandText style={fontSemibold28}>Challenges</BrandText>
        <View
          style={{
            marginTop: layout.padding_x3_5,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <SearchInput
            handleChangeText={setSearchInput}
            borderRadius={layout.borderRadius}
            style={{
              alignSelf: "center",
              width: isMobile ? "100%" : 432,
              marginTop: layout.padding_x3,
              marginBottom: layout.padding_x1,
              height: 40,
            }}
          />
        </View>
      </View>

      <FlatList
        data={challenges.filter((challenge) => {
          return challenge.title
            .toLowerCase()
            .includes(searchInput.toLowerCase());
        })}
        style={{
          width: "100%",
        }}
        contentContainerStyle={{
          maxWidth: screenContentMaxWidthLarge,
          maxHeight: height,
        }}
        showsHorizontalScrollIndicator={false}
        columnWrapperStyle={{
          flexWrap: "wrap",
          flex: 1,
          marginTop: 5,
          justifyContent: "center",
        }}
        numColumns={99} // needed to deal with wrap via css
        ItemSeparatorComponent={() => <SpacerColumn size={2} />}
        ListEmptyComponent={
          <BrandText style={[fontSemibold20, { textAlign: "center" }]}>
            No results found.
          </BrandText>
        }
        renderItem={({ item, index }) => {
          return <ChallengeBox key={index} data={item} />;
        }}
      />
    </ScreenContainer>
  );
};
