import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";

import pathwarBanner from "../../../assets/banners/pathwarBanner.png";
import searchIcon from "../../../assets/icons/Pathwar/searchIcon.svg";
import { BrandText } from "../../components/BrandText";
import { ChallengeBox } from "../../components/Pathwar/ChallengeBox";
import { ConnectBar } from "../../components/Pathwar/ConnectBar";
import { NavBarPathwarOverview } from "../../components/Pathwar/NavbarOverview/NavBarPathwarOverview";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { ScreenFC } from "../../utils/navigation";
import { neutral00 } from "../../utils/style/colors";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { useSelector } from "react-redux";
import { selectPathwarToken } from "../../store/slices/settings";

export const PathwarScreen: ScreenFC<"Pathwar"> = () => {
  const [search, setSearch] = useState("");
  const token = useSelector(selectPathwarToken);

  const [cards, setCards] = useState<any[]>([]);
  const myHeaders = new Headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  useEffect(() => {
    myHeaders.append("Authorization", "Bearer " + token);
    const fetchData = async () => {
      const res = await fetch(
        "https://api-unsafe.pathwar.land/season-challenges?season_id=1491161252464955392",
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
      <View style={{ marginTop: layout.padding_x2_5 }}>
        <ConnectBar />
      </View>
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
          <TextInputCustom<{ Search: string }>
            label=""
            name="Search"
            width={400}
            placeHolder="Search..."
            squaresBackgroundColor={neutral00}
            onChangeText={setSearch}
          >
            <View style={{ marginRight: layout.padding_x0_5 }}>
              <SVG source={searchIcon} />
            </View>
          </TextInputCustom>
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
        {cards && cards.map((item, index) => {
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
