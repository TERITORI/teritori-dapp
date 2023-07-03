import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";
import { useSelector } from "react-redux";

import pathwarBanner from "../../../assets/banners/pathwarBanner.png";
import { BrandText } from "../../components/BrandText";
import { ChallengeBox } from "../../components/Pathwar/ChallengeBox";
import { ConnectBar } from "../../components/Pathwar/ConnectBar";
import { NavBarPathwarOverview } from "../../components/Pathwar/NavbarOverview/NavBarPathwarOverview";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { SearchInput } from "../../components/sorts/SearchInput";
import { useIsMobile } from "../../hooks/useIsMobile";
import { selectPathwarToken } from "../../store/slices/settings";
import { ScreenFC } from "../../utils/navigation";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const PathwarScreen: ScreenFC<"Pathwar"> = () => {
  const [search, setSearch] = useState("");
  const token = useSelector(selectPathwarToken);
  const isMobile = useIsMobile();

  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    myHeaders.append("Authorization", "Bearer " + token);
    const fetchData = async () => {
      const res = await fetch(
        "https://poc-api-dev.s2.pmg.tools/season-challenges?season_id=1669708561111846912",
        requestOptions
      );
      const data = await res.json();
      setCards(data.items);
    };
    fetchData().catch(console.error);
  }, [token]);

  return (
    <ScreenContainer>
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
        <View style={{ marginTop: layout.padding_x3_5 }}>
          <SearchInput
            handleChangeText={setSearch}
            borderRadius={layout.borderRadius}
            style={{
              width: isMobile ? "100%" : 432,
              marginTop: layout.padding_x3,
              marginBottom: layout.padding_x1,
              height: 40,
            }}
          />
        </View>
      </View>

      <View
        style={{
          width: 1320,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        {cards &&
          cards.map((item, index) => {
            if (
              item.flavor.challenge.name
                .toLowerCase()
                .includes(search.toLowerCase())
            ) {
              return (
                <ChallengeBox
                  key={index}
                  title={item.flavor.challenge.name}
                  description={item.flavor.body}
                  tags={item.flavor.tags}
                  price={item.flavor.purchase_price}
                  reward={item.flavor.validation_reward}
                  indexPicture={index}
                />
              );
            }
          })}
      </View>
    </ScreenContainer>
  );
};
